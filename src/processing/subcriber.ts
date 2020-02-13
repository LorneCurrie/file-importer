import * as Ajv from 'ajv';
import * as csvToJson from 'csvtojson';
import * as R from 'ramda';
import { getCsvFileBuffer } from '../csv-json';
import DynamoDbClient from '../dynamo-db';
import { Logger } from '../logger';
import { RadiusDao } from '../radius-dao';
import { S3Client } from '../s3';
import { ISubscriberErrors } from '../types/subscriber';
import { subscriberProperties } from '../validation/subscriber';

const logger = Logger.getInstance();

const onError = err => {
  logger.error('Error converting CSV to JSON', err)
  throw new Error(err);
};

const onComplete = () => {
  logger.info('Conversion complete');
};

export const processSubscriberFiles = async (Records: any[]): Promise<boolean> => {
  const radiusDoa = new RadiusDao(new DynamoDbClient());
  const ajv = new Ajv();
  for (const record of Records) {
    const errorData: ISubscriberErrors[] = [];

    const s3Client = new S3Client(record.s3.bucket.name);
    const dataStream = await s3Client.getFileStream(record.s3.object.key);

    await csvToJson().fromStream(dataStream).subscribe(async data => {
      logger.debug('row', { data });
      try {
        const valid = await ajv.validate(subscriberProperties, data);
        if (valid) {
          await radiusDoa.putSubscriber(data);
        } else {
          logger.error('validation failed', { validationErrors: ajv.errors });
          errorData.push(R.merge(data, { error: JSON.stringify(ajv.errors) }));
        }
      } catch (error) {
        logger.error('Error occurred inserting record into the BD ', { error: error.message, data });
        errorData.push(R.merge(data, { error: error.message }));
      }
    }, onError, onComplete);

    const keyName = R.last(R.split('/', record.s3.object.key));

    try {
      // Cleanup the file.
      logger.debug('keys', { keyName, key: record.s3.object.key });
      await s3Client.moveObject(record.s3.object.key, `processed/${keyName}`);
      const errorCsvBuffer = await getCsvFileBuffer(errorData);
      await s3Client.putObject(`errors/${keyName}`, errorCsvBuffer);
    } catch (error) {
      logger.error('Error occurred during object cleanup', error);
      throw error
    }
  }
  return true;
};
