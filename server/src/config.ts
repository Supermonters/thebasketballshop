import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export type AppConfig = {
  PORT: number;
  ORIGIN: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  MAILUSER: string;
  MAILPASSWORD: string;
  NEWSDATA_API_KEY: string;
  FIREBASE_WEB_API_KEY: string;
  GOOGLE_TRANSLATE_API_KEY: string;
};

function readJsonIfExists(filePath: string): Record<string, unknown> {
  if (!existsSync(filePath)) {
    return {};
  }

  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

function toNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadConfig(): AppConfig {
  const rootPath = path.resolve(process.cwd(), "..");
  const base = readJsonIfExists(path.join(rootPath, "config.json"));
  const local = readJsonIfExists(path.join(rootPath, "config.local.json"));
  const merged = { ...base, ...local };

  return {
    PORT: toNumber(process.env.PORT ?? merged.PORT, 8080),
    ORIGIN: String(process.env.ORIGIN ?? merged.ORIGIN ?? ""),
    SMTP_HOST: String(
      process.env.SMTP_HOST ?? merged.SMTP_HOST ?? "smtp.elasticemail.com"
    ),
    SMTP_PORT: toNumber(process.env.SMTP_PORT ?? merged.SMTP_PORT, 2525),
    MAILUSER: String(process.env.MAILUSER ?? merged.MAILUSER ?? ""),
    MAILPASSWORD: String(process.env.MAILPASSWORD ?? merged.MAILPASSWORD ?? ""),
    NEWSDATA_API_KEY: String(
      process.env.NEWSDATA_API_KEY ?? merged.NEWSDATA_API_KEY ?? ""
    ),
    FIREBASE_WEB_API_KEY: String(
      process.env.FIREBASE_WEB_API_KEY ?? merged.FIREBASE_WEB_API_KEY ?? ""
    ),
    GOOGLE_TRANSLATE_API_KEY: String(
      process.env.GOOGLE_TRANSLATE_API_KEY ?? merged.GOOGLE_TRANSLATE_API_KEY ?? ""
    ),
  };
}
