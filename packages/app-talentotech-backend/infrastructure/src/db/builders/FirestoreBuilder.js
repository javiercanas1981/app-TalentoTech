import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export class FirestoreBuilder {
  static build() {
    const projectId = process.env.PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;

    if (!projectId) {
      throw new Error(
        "Missing Firebase configuration: projectId. Set PROJECT_ID or FIREBASE_PROJECT_ID in .env.",
      );
    }

    const existingApp = getApps().find((app) => app.name === "[DEFAULT]");
    const app =
      existingApp ??
      initializeApp({
        credential: applicationDefault(),
        projectId,
      });

    return getFirestore(app);
  }
}
