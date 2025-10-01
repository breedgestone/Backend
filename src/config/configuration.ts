export default () => ({
  database: {
    type: 'mysql' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'breedgestone_db',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },

  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    globalPrefix: 'api/v1',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },

  oauth: {
    google: {
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET || 'dummy-secret',
      callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/oauth/google/callback',
    },
    facebook: {
      clientID: process.env.OAUTH_FACEBOOK_APP_ID || 'dummy-client-id',
      clientSecret: process.env.OAUTH_FACEBOOK_APP_SECRET || 'dummy-secret',
      callbackURL: process.env.OAUTH_FACEBOOK_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/oauth/facebook/callback',
    },
  },

  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@breedgestone.com',
  },

  otp: {
    expiresIn: parseInt(process.env.OTP_EXPIRES_IN || '600', 10), // 10 minutes in seconds
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
  },

  firebase: {
    serviceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '',
  },

  push: {
    enabled: process.env.PUSH_NOTIFICATIONS_ENABLED === 'true',
  },
});
