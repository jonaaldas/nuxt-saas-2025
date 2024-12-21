import type { H3Event } from "h3";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import bcrypt from "bcrypt";
import { users } from "../db/schema";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { User } from "../../types/user.types";
import type { JwtPayload } from "jsonwebtoken";

async function login(event: H3Event<Request>, user: User) {
  await replaceUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
    },
    loggedInAt: new Date(),
  });
}

async function getCurrentUser(event: H3Event<Request>) {
  const session = await getUserSession(event);

  if (!session.user) {
    return null;
  }

  const result = (await db.select().from(users).where(eq(users.id, session.user.id)).limit(1))?.[0];
  if (result) {
    delete (result as { password?: string }).password;
  }
  return result;
}

async function attempt(event: H3Event<Request>, email: string, password: string) {
  const foundUser = (
    await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
  )?.[0];

  if (!foundUser || !foundUser.password || !bcrypt.compareSync(password, foundUser.password)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    });
  }

  await login(event, foundUser);
  return true;
}

const JWT_SECRET = process.env.NUXT_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const TOKEN_EXPIRATION = "1h";
const createPasswordResetToken = (user: any) => {
  try {
    const resetSecret = crypto.randomBytes(32).toString("hex");

    const payload = {
      userId: user.id,
      email: user.email,
      type: "password-reset",
      resetSecret: resetSecret,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });

    const expirationTimestamp = Date.now() + 3600000;

    return {
      token,
      resetSecret,
      expirationTimestamp,
    };
  } catch (error: any) {
    throw new Error("Error generating password reset token: " + error.message);
  }
};

const verifyPasswordResetToken = async (token: any) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== "string" &&
      (decoded as JwtPayload).exp &&
      (decoded as JwtPayload).exp! * 1000 < Date.now()
    ) {
      return {
        success: false,
        message: "Token has expired",
      };
    }

    return {
      success: true,
      decoded,
    };
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw error;
  }
};

const resetPassword = async (user: any, password: any) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.userId));
  } catch (error: any) {
    throw new Error("Error resetting password: " + error.message);
  }
};

export default {
  login,
  user: getCurrentUser,
  attempt,
  createPasswordResetToken,
  verifyPasswordResetToken,
  resetPassword,
};
