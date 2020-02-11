import { DynamoDB } from 'aws-sdk';
import * as _ from 'lodash';
import * as R from 'ramda';
import { IStore } from 'types/store';
import { Logger } from '../logger';

const logger = Logger.getInstance();

export class DynamoDbClient implements IStore {

  private client: DynamoDB;

  constructor(private tableName: string = '', private region: string = '') {
    if (_.isEmpty(tableName)) {
      if (!process.env.RADIUS_SUBSCRIBER_TABLE_NAME) {
        logger.error('RADIUS_SUBSCRIBER_TABLE_NAME has not been set');
        throw new Error('RADIUS_SUBSCRIBER_TABLE_NAME has not been set')
      }
      this.tableName = process.env.RADIUS_SUBSCRIBER_TABLE_NAME;
    }
    if (_.isEmpty(region)) {
      if (!process.env.DYNAMO_DB_REGION) {
        logger.error('DYNAMO_DB_REGION has not been set');
        throw new Error('DYNAMO_DB_REGION has not been set')
      }
      this.region = process.env.DYNAMO_DB_REGION;
    }
    this.client = new DynamoDB({
      region: this.region,
    })
  }

  public put = (items: { [key: string]: any }) => {
    const params = R.merge({
      TableName: this.tableName,
      ReturnConsumedCapacity: 'TOTAL',
    }, items);
    return this.client.putItem(params).promise()
  }
}

