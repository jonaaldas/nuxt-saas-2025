import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

interface UpdateUserData {
  name?: string;
  avatarUrl?: string | null;
}

export const updateUser = async (userId: number, data: UpdateUserData) => {
  try {
    const updatedUser = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      });

    return updatedUser[0];
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};
