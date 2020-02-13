import { RadiusDao } from '../../src/radius-dao'
import DynamoDbClient from '../../src/dynamo-db'
import { ISubscriberInput } from '../../src/types/subscriber';
import { IStore } from '../../src/types/store';
import * as R from 'ramda'

class MockStore implements IStore {
  public put = data => Promise.resolve(data);
}

const testDataDynamic: ISubscriberInput = {
  port_auth_token: 'abc123',
  username: 'Bob',
  password: 'password123',
  ip_address_type: 'dynamic',
  ipv6_enabled: 'true',
  static_ipv4_address: null,
  static_ipv6_address: null,
  status: 'active',
};

const testDataDynamicIPv4Only: ISubscriberInput = {
  port_auth_token: 'abc123',
  username: 'Bob',
  password: 'password123',
  ip_address_type: 'dynamic',
  ipv6_enabled: 'false',
  static_ipv4_address: null,
  static_ipv6_address: null,
  status: 'active',
};

const testStaticUser: ISubscriberInput = {
  port_auth_token: 'abc123',
  username: 'Bob',
  password: 'password123',
  ip_address_type: 'static',
  ipv6_enabled: 'true',
  static_ipv4_address: '10.0.0.0',
  static_ipv6_address: '2001:db8:0:100::/56',
  status: 'active',
};

const testDataSuspended: ISubscriberInput = {
  port_auth_token: 'abc123',
  username: 'Bob',
  password: 'password123',
  ip_address_type: 'dynamic',
  ipv6_enabled: 'true',
  static_ipv4_address: null,
  static_ipv6_address: null,
  status: 'suspended',
};

describe('RadiusDao', () => {
  describe('putSubscriber', () => {
    it('should setup a create a RadiusDOA object', () => {

      try {
        const radiusDoa = new RadiusDao(new DynamoDbClient('test', 'test_region'));
        expect(radiusDoa).toBeTruthy();
      } catch (err) {
        // should not fail
        fail(err);
      }
    });

    it('should create a dynamic subscriber', async () => {
      try {
        const radiusDoa = new RadiusDao(new MockStore());
        const result = await radiusDoa.putSubscriber(testDataDynamic) as any;
        expect(result).toBeTruthy();
        expect(result).toHaveProperty('Item');
        const { Item } = result;
        expect(Item.GroupName.S).toEqual('dynamicGroup');
        expect(Item.Password.S).not.toEqual(testDataDynamic.password);
      } catch (err) {
        // should not fail
        fail(err);
      }
    });

    it('should setup a dynamic subscriber with IPv6 disabled', async () => {
      try {
        const radiusDoa = new RadiusDao(new MockStore());
        const result = await radiusDoa.putSubscriber(testDataDynamicIPv4Only) as any;
        const { Item } = result;
        expect(Item.GroupName.S).toEqual('dynamicIPv4');
      } catch (err) {
        // should not fail
        fail(err);
      }
    });

    it('should setup a static subscriber', async () => {
      try {
        const radiusDoa = new RadiusDao(new MockStore());
        const result = await radiusDoa.putSubscriber(testStaticUser) as any;
        const { Item } = result;
        expect(Item.Reply).toBeInstanceOf(Object);
        const { Reply } = Item;
        expect(Reply.M).toHaveProperty('ipv4');
        expect(Reply.M).toHaveProperty('ipv6');
      } catch (err) {
        // should not fail
        fail(err);
      }
    });

    it('should throw a error if static Subscriber is missing IP v4', async () => {
      try {
        const radiusDoa = new RadiusDao(new MockStore());
        await radiusDoa.putSubscriber(R.merge(testStaticUser, { static_ipv4_address: null }));
        fail('Should throw a Error saying that IPv4 is missing')
      } catch (err) {
        // should not fail
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual('Must have a IPv4 address for static IP')
      }
    });

    it('should throw a error if static Subscriber is missing IP v6 and v6 is enabled', async () => {
      try {
        const radiusDoa = new RadiusDao(new MockStore());
        await radiusDoa.putSubscriber(R.merge(testStaticUser, { static_ipv6_address: null }));
        fail('Should throw a Error saying that IPv6 is missing')
      } catch (err) {
        // should not fail
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual('Should have a ipv6 if IPv6 is enabled')
      }
    });

    it('should setup a suspended subscriber', async () => {
      try {
        const radiusDoa = new RadiusDao(new MockStore());
        const result = await radiusDoa.putSubscriber(testDataSuspended) as any;
        const { Item } = result;
        expect(Item.GroupName.S).toEqual('suspendedGroup');
      } catch (err) {
        // should not fail
        fail(err);
      }
    });
  })
});
