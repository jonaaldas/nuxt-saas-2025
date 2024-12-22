import { eq, sql } from "drizzle-orm";
import { db } from "~/server/db";
import { users, stripeCustomers } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    if (!session.user?.id) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const user = (
      await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
          authType: users.authType,
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
        .where(eq(users.id, session.user.id))
        .limit(1)
    )?.[0];

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Update session with fresh data
    await replaceUserSession(event, {
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        authType: user.authType as "google" | "local",
        isPaid: user.isPaid,
      },
      loggedInAt: new Date(),
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        authType: user.authType,
        isPaid: user.isPaid,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to refresh session",
    });
  }
});
