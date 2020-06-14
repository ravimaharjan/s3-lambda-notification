exports.handler = (event, context, callback) => {
    try {
        var records = event['Records']
        if (records === undefined || records === null)
            callback(null, { success: false, message: "Data is empty." })

        var { eventSource, eventName, eventSource, s3: { bucket: { name: name }, object: { key: key } } } = records[0]
        console.log({
            bucketName: name,
            fileName: key,
            EventSource: eventSource,
            EventName: eventName
        })

        return { success: true }
    } catch (err) {
        console.error(err)
        callback(null, { success: false, message: "Error occurred." })
    }
}