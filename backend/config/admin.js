module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'nFlvGQ8RaNb0YbNuZVQo8g=='),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'YPzfoSM2ApCOiyjOZu1fkA=='),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'keHfOSyvGNGfq2PxD+F3Fw=='),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
