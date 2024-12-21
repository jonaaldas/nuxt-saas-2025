import { getUser } from "~/server/db/queries/getUser";
import { getUserByEmail } from "~/server/db/queries/getUserByEmail";
import { insertUser } from "~/server/db/queries/insertUser";
import bcrypt from "bcrypt";
import { z } from "zod";

// Validation schema
const registerSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)"),
});

export default defineEventHandler(async (event) => {
  try {
    // Get and validate request body
    const body = await readBody(event);
    const validatedData = registerSchema.parse(body);

    const { first_name, last_name, email, password } = validatedData;
    const formattedEmail = email.toLowerCase();
    const name = `${first_name} ${last_name}`;

    // Check if user already exists
    const existingUser = await getUserByEmail(formattedEmail);
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email already in use",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await insertUser({
      email: formattedEmail,
      password: passwordHash,
      name,
      authType: "local",
    });
    let avatarUrl = "";

    // Create session
    await auth.login(event, {
      id: Number(user.id),
      email: user.email,
      name: user.name,
      avatarUrl: avatarUrl,
      authType: user.authType,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: error.errors[0].message,
      });
    }

    throw error;
  }
});
