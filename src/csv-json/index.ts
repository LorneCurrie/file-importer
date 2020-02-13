import * as jsonExport from 'jsonexport';
import { Logger } from '../logger';

const logger = Logger.getInstance();

export const getCsvFileBuffer = (body): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    if (!body) {
      logger.error('JSON body is missing');
      return reject(new Error('Error converting json to CSV, no object to convert'));
    }
    jsonExport(body, (err, data) => {
      if (err) {
        logger.error('Error occurred while converting JSON to CSV', err);
        reject('Error occurred while converting JSON to CSV:' + err.message);
      }
      logger.debug('csv converted data', { data });
      return resolve(Buffer.from(data, 'utf-8'));
    })
  })
}
