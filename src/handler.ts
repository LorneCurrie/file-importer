

export const bucketFileTrigger = (event, context, callback) => {
  console.log(event);
  callback(null, { body: 'done', status: 200 })
}
