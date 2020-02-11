import { ISubscriberInput, ipAddressType } from './../types/subscriber';
import * as bcrypt from 'bcryptjs'
import { IStore } from 'types/store';

export class RadiusDao {

  private store

  constructor(store: IStore) {
    this.store = store;
  }

  public putSubscriber = (object: ISubscriberInput): Promise<any> => {
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
  }

  private getGroupName = (object: ISubscriberInput) => {
    const { ip_address_type, ipv6_enabled, status } = object;
    if (status === 'suspended') {
      return 'suspendedGroup';
    }
    if (ip_address_type) {
      if (ip_address_type === 'static') {
        return 'staticGroup';
      } else if (ip_address_type === 'dynamic' && ipv6_enabled === 'false') {
        return 'dynamicNoIPv6Group';
      }
    }
    return 'dynamicGroup';
  }

  private getStaticIpAddresses = (object: ISubscriberInput) => {
    const { static_ipv4_address, static_ipv6_address } = object;
    return {
      ...(static_ipv4_address && { ipv4: { S: static_ipv4_address } }),
      ...(static_ipv6_address && { ipv6: { S: static_ipv6_address } }),
    }

  }


}