import { db } from "..";
import { users, type NewUser } from "../schema";
import { nanoid } from "nanoid";

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  authType?: "google" | "local";
}

export const insertUser = async ({ email, password, name, authType = "local" }: CreateUserInput) => {
  try {
    const newUser: NewUser = {
      id: nanoid(),
      email: email.toLowerCase(),
      password,
      name,
      authType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  } catch (error) {
    console.error("Error in insertUser:", error);
    throw error;
  }
};
