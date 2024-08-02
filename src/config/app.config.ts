import { AppConfig } from './interfaces';

export default (): AppConfig => ({
  port: parseInt(process.env.PORT) || 5000,

  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresInSeconds:
        parseInt(process.env.JWT_EXPIRATION_TIME_SECONDS) || 900,
    },
    github: {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL,
    },
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
    },
    vocalRemover: {
      vocalApiToken: process.env.VOCAL_REMOVER_API_TOKEN,
    },
    dolby: {
      apiKey: process.env.DOLBY_API_KEY,
      appSecret: process.env.DOLBY_APP_SECRET,
    },
  },
});
