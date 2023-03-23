import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
import path from "path";

const serviceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH ?? "";

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(path.resolve(serviceAccountKeyPath)),
  });
}

const adminDB = admin.firestore();

export { adminDB };
