import { ISubscriberInput, IStaticIpAddress } from './../types/subscriber';
import * as bcrypt from 'bcryptjs'
import { IStore } from 'types/store';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError, DynamoDB } from 'aws-sdk';

export class RadiusDao {

  private store: IStore;

  constructor(store: IStore) {
    this.store = store;
  }

  public putSubscriber = (object: ISubscriberInput): Promise<PromiseResult<DynamoDB.PutItemOutput, AWSError>> => {
    const passwordHash = bcrypt.hashSync(object.password, 9);
    const groupName = this.getGroupName(object);
    const items = {
      Item: {
        PortAuthToken: { S: object.port_auth_token },
        Username: { S: object.username },
        Password: { S: passwordHash },
        GroupName: { S: groupName },
        ...(object.ip_address_type === 'static' && { Reply: { M: this.getStaticIpAddresses(object) } })
      }
    };
    return this.store.put(items)
  };

  private getGroupName = (object: ISubscriberInput): string => {
    const { ip_address_type, ipv6_enabled, status } = object;
    if (status === 'suspended') {
      return 'suspendedGroup';
    }
    if (ip_address_type) {
      if (ip_address_type === 'static') {
        return 'staticGroup';
      } else if (ip_address_type === 'dynamic' && ipv6_enabled === 'false') {
        return 'dynamicIPv4';
      }
    }
    return 'dynamicGroup';
  };

  private getStaticIpAddresses = (object: ISubscriberInput): IStaticIpAddress => {
    const { static_ipv4_address, static_ipv6_address, ipv6_enabled } = object;
    if(!static_ipv4_address) {
      throw new Error('Must have a IPv4 address for static IP')
    }
    if(ipv6_enabled === 'true' && !static_ipv6_address) {
      throw new Error('Should have a ipv6 if IPv6 is enabled')
    }
    return {
      ...(static_ipv4_address && { ipv4: { S: static_ipv4_address } }),
      ...(static_ipv6_address && { ipv6: { S: static_ipv6_address } }),
    }

  }
}
