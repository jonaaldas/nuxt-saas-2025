import { db } from "..";
import { passwordResetTokens, type NewPasswordResetToken } from "../schema";
import { nanoid } from "nanoid";

export const insertPasswordResetToken = async (userId: number, expiresInHours = 1) => {
  try {
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const newToken: NewPasswordResetToken = {
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(passwordResetTokens).values(newToken);
    return token;
  } catch (error) {
    console.error("Error in insertPasswordResetToken:", error);
    throw error;
  }
};
