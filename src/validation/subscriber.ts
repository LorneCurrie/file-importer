export const subscriberProperties = {
  additionalProperties: false,
  type: 'object',
  required: [ 'port_auth_token', 'username', 'password', 'ip_address_type', 'ipv6_enabled', 'status' ],
  properties: {
    port_auth_token: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
    ip_address_type: {
      type: 'string',
      enum: [ 'dynamic', 'static' ]
    },
    ipv6_enabled: {
      type: 'string',
      enum: [ 'true', 'false' ],
    },
    static_ipv4_address: {
      type: 'string',
    },
    static_ipv6_address: { type: 'string' },
    status: {
      type: 'string',
      enum: [ 'active', 'suspended', 'relinquished' ],
    },
  }
};
