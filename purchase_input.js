var AWS = require('aws-sdk')
var s3 = new AWS.S3()

exports.handler = async (event, context, callback) => {
    try {
        if (!event.purchaseInfo) {
            callback(null, { success: false, message: "Purchase data is missing." })
        }

        const bucketName = process.env.BucketName
        const purchaseInfo = event.purchaseInfo
        const response = await uploadPurchaseData(bucketName, purchaseInfo)
        if (response) {
            callback(null,
                {
                    success: true,
                    data: response,
                    message: "Customer purchase data stored in S3.",
                    error: {}
                })
        }

    } catch (err) {
        console.log(err)
        callback(null, { success: false, error: err })
    }
}

function uploadPurchaseData(bucketName, purchaseInfo) {
    return new Promise((resolve) => {

        const date = parseInt(Date.now() / 1000)
        const purchaseId = date + Math.floor(Math.random() * 999 + 1).toString()

        let purchaseInputData = {
            customerName: purchaseInfo.Name,
            customerAddress: purchaseInfo.Address,
            customerMobile: purchaseInfo.Mobile,
            item: purchaseInfo.Item,
            quantity: purchaseInfo.quantity,
            rate: purchaseInfo.rate,
            purchaseId: purchaseId,
            date: date
        }

        var params = {
            Bucket: bucketName,
            Key: purchaseId + "_" + purchaseInfo.Name + ".json",
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