import DynamoDbClient from '../../src/dynamo-db';
import {DynamoDB} from 'aws-sdk';

describe('RadiusDao', () => {
  describe('constructor', () => {
    afterEach(() => {
      delete process.env.RADIUS_SUBSCRIBER_TABLE_NAME;
      delete process.env.DYNAMO_DB_REGION;
    });

    it('should instantiate wit a region and table name', () => {
      const store = new DynamoDbClient('table', 'region');
      expect(store).toBeTruthy();
    });

    it('should through a error if not table name is provided via function args or ENV var', () => {
      try {
        const store = new DynamoDbClient('', 'region');
        fail('Should throw a error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should use ENV variables if table name and region are not passed in with the constructor', () => {
      try {
        process.env.RADIUS_SUBSCRIBER_TABLE_NAME = 'table';
        process.env.DYNAMO_DB_REGION = 'region';
        const store = new DynamoDbClient();
        expect(store).toBeTruthy();
      } catch (error) {
        fail('Should not throw a error');
      }
    });
  });
});
