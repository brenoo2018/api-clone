export type Bindings = {
  DB: D1Database;
  API_QUEUE: Queue<any>;

  DISCORD_WEBHOOK_API_AVIVAH: string;
  DISCORD_DLQ: string;
  DELAY_MILLISECONDS: number;
  ENVIRONMENT: string;
  API_KEYS: string[];
  JWT_SECRET: string;
  API_IA_BASE_URL: string;
  API_KEY_IA_NSFW: string;
  API_KEY_IA_CHRISTIAN_TAG: string;
  API_CLOUDFLARE_DATABASE_BASE_URL: string;
  X_AUTH_EMAIL_CLOUDFLARE: string;
  X_AUTH_KEY_CLOUDFLARE: string;
  ID_DATABASE_DEV: string;
  ID_DATABASE_PRD: string;
};
