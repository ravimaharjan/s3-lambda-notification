const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.region });

exports.handler = async (event) => {
    try {
        const records = event['Records']
        if (records === undefined || records === null)
        {
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Data is Empty.' })
            }
        }

        const { s3: { bucket: { name: bucketName }, object: { key: fileName } } } = records[0]
        const purchaseData = await getPurchaseData(bucketName, fileName)
        await sendPurchaseEmail(purchaseData)
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Purchase complete.' })
        }

    } catch (err) {
        console.error(err)
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Error occurred.'})
        }
    }
}

const getPurchaseData = (bucketName, fileName) => {
    return new Promise(function (resolve, reject) {
        const params = { Bucket: bucketName, Key: fileName }
        new AWS.S3().getObject(params, function (err, data) {
            if (err) {
                reject(err)
            } else {
                try {
                    resolve(JSON.parse(data.Body.toString('utf-8')))
                } catch (error) {
                    console.error(error);
                    throw new Error('Invalid Data.')
                }
            }
        })
    })
}

const sendPurchaseEmail = (purchaseData) => {
    return new Promise((resolve, reject) => {
        const params = getEmailParams(purchaseData)
        new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params, function (err, data) {
            if (err) {
                console.error('Error sending purchase email', err)
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const getEmailParams = (purchaseData) => {
    const params = {
        Destination: {
            ToAddresses: [
                purchaseData.Email,
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html>
                    <head></head>
                    <body>
                      <h1>Customer purchase Information</h1>
                      <p>This is the email for the customer purchase. Details of your purchase : </p>
                      <div>
                        PurchaseId : ${purchaseData.purchaseId} <br/>
                        CustomerName: ${purchaseData.Name} <br/>
                        Address     : ${purchaseData.Address} <br/>
                        Mobile     : ${purchaseData.Mobile} <br/>
                        Item     : ${purchaseData.Item} <br/>
                        Quantity     : ${purchaseData.quantity} <br/>
                        Rate     : ${purchaseData.rate} <br/>
                      </div>
                    </body>
                    </html>`
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: 'Purchase Information'
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Purchase Information'
            }
        },
        Source: process.env.SenderEmail
    }
    return params
}