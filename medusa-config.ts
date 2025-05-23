import { loadEnv, defineConfig } from "@medusajs/framework/utils";
import {
  ADMIN_CORS,
  ADMIN_URL,
  AUTH_CORS,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  NODE_ENV,
  REDIS_URL,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_FILE_URL,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
  STORE_CORS,
} from "./src/lib/constants";

loadEnv(NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: DATABASE_URL!,
    redisUrl: REDIS_URL!,
    databaseLogging: true,
    databaseDriverOptions: {
      connection: { ssl: { rejectUnauthorized: false } },
      pool: {
        min: 0,
        max: 20,
        acquireTimeoutMillis: 60000,
      },
      idle_in_transaction_session_timeout: 60000,
    },
    http: {
      storeCors: STORE_CORS!,
      adminCors: ADMIN_CORS!,
      authCors: AUTH_CORS!,
      jwtSecret: JWT_SECRET || "supersecret",
      jwtExpiresIn: JWT_EXPIRES_IN,
      cookieSecret: COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: S3_FILE_URL,
              access_key_id: S3_ACCESS_KEY_ID,
              secret_access_key: S3_SECRET_ACCESS_KEY,
              region: S3_REGION,
              bucket: S3_BUCKET,
              endpoint: S3_ENDPOINT,
            },
          },
        ],
      },
    },
  ],
});
