import { DynamoDbClient } from './dynamoDb/index';
import { Logger } from './logger';
import { S3Client } from './s3'
import { isArray } from 'util';
import * as csvtojson from 'csvtojson';
import { RadiusDao } from './radiusDao'

const logger = Logger.getInstance()
const onError = err => {
  logger.error('Error converting CSV to JSON', err)
  throw new Error(err);
}

const onComplete = () => {
  logger.info('Conversion complete');
}

export const bucketFileTrigger = async (event, context, callback) => {
  if (event && event.Records && isArray(event.Records)) {
    const radiusDoa = new RadiusDao(new DynamoDbClient());
    for (const r of event.Records) {
      const s3Client = new S3Client(r.s3.bucket.name);
      const dataStream = await s3Client.getFileStream(r.s3.object.key);
      logger.debug('file details', { dataStream });
      const dataJson = await csvtojson().fromStream(dataStream).subscribe(async data => {
        logger.debug('row', { data });
        await radiusDoa.putSubscriber(data);
        return data
      }, onError, onComplete)
      logger.debug('jsonData', { dataJson })
      // write to Dynamo DB here
    }
  }

  callback(null, { body: 'done', status: 200 })
}
