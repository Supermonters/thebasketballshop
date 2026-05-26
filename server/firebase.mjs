import admin from "firebase-admin";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
if (!raw) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 is not set. Generate a service account JSON from the Firebase console (Project Settings → Service accounts → Generate new private key), base64-encode it, and add it to .env.");
}
if (!process.env.FIREBASE_DATABASE_URL) {
  throw new Error("FIREBASE_DATABASE_URL is not set.");
}

const creds = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));

admin.initializeApp({
  credential: admin.credential.cert(creds),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const rtdb = admin.database();
export const shopRef = (path = "") => rtdb.ref("shop" + (path ? "/" + path : ""));
