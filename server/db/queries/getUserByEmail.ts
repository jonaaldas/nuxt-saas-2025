import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    return user[0] || null;
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    throw error;
  }
};
