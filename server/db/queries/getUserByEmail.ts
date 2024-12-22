import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { users, stripeCustomers } from "../schema";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        authType: users.authType,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        isPaid: sql<boolean>`
      CASE 
        WHEN ${stripeCustomers.userId} IS NOT NULL 
        AND ${stripeCustomers.planType} = 'paid' 
        THEN true 
        ELSE false 
      END
    `,
      })
      .from(users)
      .leftJoin(stripeCustomers, eq(users.id, stripeCustomers.userId))
      .where(eq(users.email, email))
      .limit(1);

    return user[0] || null;
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    throw error;
  }
};
