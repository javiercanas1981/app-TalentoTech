import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export class FirestoreBuilder {
  static build() {
    const firebaseConfig = {
      apiKey: process.env.API_KEY ?? process.env.FIREBASE_API_KEY,
      authDomain: process.env.AUTH_DOMAIN ?? process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID,
      storageBucket:
        process.env.STORAGE_BUCKET ?? process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId:
        process.env.MESSAGING_SENDER_ID ??
        process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.APP_ID ?? process.env.FIREBASE_APP_ID,
    };

    const missingRequiredValues = ["apiKey", "projectId", "appId"].filter(
      (key) => !firebaseConfig[key],
    );
    if (missingRequiredValues.length) {
      throw new Error(
        `Missing Firebase configuration: ${missingRequiredValues.join(", ")}. Set API_KEY, PROJECT_ID and APP_ID in .env.`,
      );
    }

    const existingApp = getApps().find((app) => app.name === "[DEFAULT]");
    const app = existingApp ?? initializeApp(firebaseConfig);

    return getFirestore(app);
  }
}
