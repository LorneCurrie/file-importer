export type ipAddressType = string | 'dynamic' | 'static';
export type statusType = string | 'active' | 'suspended' | 'relinquished';

export interface ISubscriberInput {
  port_auth_token: string;
  username: string;
  password: string;
  ip_address_type: ipAddressType;
  ipv6_enabled: string;
  static_ipv4_address: string | null;
  static_ipv6_address: string | null;
  status: string;
}

export interface ISubscriberErrors extends ISubscriberInput {
  error:string
}

export interface IStaticIpAddress {
  ipv4?: { S: string };
  ipv6?: { S: string };
}
