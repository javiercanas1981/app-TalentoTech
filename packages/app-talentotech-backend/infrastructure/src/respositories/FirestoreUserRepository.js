import { Inject } from "@nestjs/common";
import { FieldValue } from "firebase-admin/firestore";
import { USER_REPOSITORY } from "../../../domain/src/repositories/UserRepository.js";
import { FIRESTORE } from "../di/tokens.js";
import { UserRepository } from "../../../domain/src/repositories/UserRepository.js";

export const normalizeUserProfile = (uid, profile) => ({
  uid,
  ...profile,
  role: profile.role ?? profile.rol ?? "user",
});

export class FirestoreUserRepository extends UserRepository {
  constructor(firestore) {
    super();
    this.firestore = firestore;
  }

  async create(uid, profile) {
    await this.firestore.collection("users").doc(uid).set({
      ...profile,
      createdAt: FieldValue.serverTimestamp(),
    });
    return { uid, ...profile };
  }

  async getById(uid) {
    const profileSnapshot = await this.firestore
      .collection("users")
      .doc(uid)
      .get();
    if (!profileSnapshot.exists) {
      return null;
    }

    const profile = profileSnapshot.data();
    return normalizeUserProfile(uid, profile);
  }
}

Inject(FIRESTORE)(FirestoreUserRepository, undefined, 0);
