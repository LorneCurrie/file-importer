import * as csvtojson from 'csvtojson';
import * as R from 'ramda';
import DynamoDbClient from './dynamo-db';
import { Logger } from './logger';
import { S3Client } from './s3'
import { RadiusDao } from './radius-dao'
import { ISubscriberErrors, ISubscriberInput } from './types/subscriber';
import { getCsvFileBuffer } from './csv-json';

const logger = Logger.getInstance();
const onError = err => {
  logger.error('Error converting CSV to JSON', err)
  throw new Error(err);
}

const onComplete = () => {
  logger.info('Conversion complete');
}

export const bucketFileTrigger = async (event, context, callback) => {
  if (event && event.Records && Array.isArray(event.Records)) {
    const radiusDoa = new RadiusDao(new DynamoDbClient());
    for (const record of event.Records) {
      const errorData: ISubscriberErrors[] = [];

      const s3Client = new S3Client(record.s3.bucket.name);
      const dataStream = await s3Client.getFileStream(record.s3.object.key);

      await csvtojson().fromStream(dataStream).subscribe(async data => {
        logger.debug('row', { data });
        try {
          await radiusDoa.putSubscriber(data);
        } catch (error) {
          logger.error('Error occurred inserting record into the BD ', { error, data });
          errorData.push(R.merge(data, { error: error.message }));
        }
      }, onError, onComplete)

      const objectName = R.last(R.split('/', record.s3.object.key));

      try {
        // Cleanup the file.
        logger.debug('keys', { objectName, key: record.s3.object.key });
        await s3Client.moveObject(record.s3.object.key, `processed/${objectName}`);
        await s3Client.putObject(`errors/${objectName}`, getCsvFileBuffer(errorData));
      } catch (error) {
        logger.error('Error occurred during object cleanup', error);
      }
    }
  }

  callback(null, { body: 'done', status: 200 })
};
