import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export const getUser = async (id: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user[0] || null;
  } catch (error) {
    console.error("Error in getUser:", error);
    throw error;
  }
};
