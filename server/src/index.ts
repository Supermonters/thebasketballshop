import cors from "cors";
import express from "express";
import nodemailer from "nodemailer";
import path from "node:path";
import { existsSync } from "node:fs";
import { loadConfig } from "./config.js";
import { createDb } from "./db.js";
import { buildApiRouter } from "./routes.js";

const configs = loadConfig();
const app = express();
const db = await createDb();

const transporter = nodemailer.createTransport({
  host: configs.SMTP_HOST,
  port: configs.SMTP_PORT,
  secure: false,
  auth: {
    user: configs.MAILUSER,
    pass: configs.MAILPASSWORD,
  },
});

app.use(
  cors({
    origin: configs.ORIGIN || true,
  })
);
app.use(express.json());
app.use("/api", buildApiRouter(db, transporter, configs));
app.use("/legacy", express.static(path.resolve(process.cwd(), "..", "static")));
app.use("/legacy-admin", express.static(path.resolve(process.cwd(), "..", "admin")));
app.use("/dummy", express.static(path.resolve(process.cwd(), "..", "static", "dummy")));
app.use("/images", express.static(path.resolve(process.cwd(), "..", "static", "images")));

const clientDist = path.resolve(process.cwd(), "..", "client", "dist");
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(configs.PORT, () => {
  console.log(`server started on port ${configs.PORT}`);
});
