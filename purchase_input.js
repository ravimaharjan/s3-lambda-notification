var AWS = require('aws-sdk')
var s3 = new AWS.S3()

exports.handler = async (event, context) => {
    try {
        const eventBody = JSON.parse(event.body)
        if (!eventBody.purchaseInfo) {
            return { 
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Purchase data is missing.' })
            }
        }

        const requestId = context.awsRequestId
        const bucketName = process.env.BucketName
        const purchaseInfo = eventBody.purchaseInfo
        const response = await uploadPurchaseData(bucketName, requestId, purchaseInfo)
        if (response) {
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'Customer purchase recorded.', 'data': {} })
            }
        }

    } catch (err) {
        console.error('Error occurred ', err)
        return { 
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({'error': 'Failed to record customer purchase.'})
        }
    }
}

function uploadPurchaseData(bucketName, requestId, purchaseInfo) {
    return new Promise((resolve) => {
        const dateUtx = parseInt(Date.now() / 1000)
        const purchaseId = dateUtx + Math.floor(Math.random() * 999 + 1).toString()

        const purchaseInputData = {
            Name: purchaseInfo.Name,
            Email: purchaseInfo.Email,
            Address: purchaseInfo.Address,
            Mobile: purchaseInfo.Mobile,
            Item: purchaseInfo.Item,
            quantity: purchaseInfo.quantity,
            rate: purchaseInfo.rate,
            purchaseId: purchaseId,
            date: dateUtx
        }

        const params = {
            Bucket: bucketName,
            Key: requestId + '-' + purchaseInfo.Name + '.json',
            Body: JSON.stringify(purchaseInputData)
        }

        s3.putObject(params, function (err, data) {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}