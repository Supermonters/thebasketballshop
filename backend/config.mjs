import { existsSync, readFileSync } from "node:fs";

function readJsonIfExists(path) {
  if (!existsSync(path)) {
    return {};
  }

  try {
    const fileContent = readFileSync(path, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`Invalid JSON in ${path}: ${error.message}`);
  }
}

function asNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadConfig() {
  const baseConfig = readJsonIfExists("config.json");
  const localConfig = readJsonIfExists("config.local.json");
  const merged = {
    ...baseConfig,
    ...localConfig,
  };

  return {
    PORT: asNumber(process.env.PORT ?? merged.PORT, 8080),
    ORIGIN: process.env.ORIGIN ?? merged.ORIGIN ?? "",
    SMTP_HOST:
      process.env.SMTP_HOST ?? merged.SMTP_HOST ?? "smtp.elasticemail.com",
    SMTP_PORT: asNumber(process.env.SMTP_PORT ?? merged.SMTP_PORT, 2525),
    MAILUSER: process.env.MAILUSER ?? merged.MAILUSER ?? "",
    MAILPASSWORD: process.env.MAILPASSWORD ?? merged.MAILPASSWORD ?? "",
    NEWSDATA_API_KEY:
      process.env.NEWSDATA_API_KEY ?? merged.NEWSDATA_API_KEY ?? "",
    FIREBASE_WEB_API_KEY:
      process.env.FIREBASE_WEB_API_KEY ?? merged.FIREBASE_WEB_API_KEY ?? "",
  };
}
