import { getUserByEmail } from "~/server/db/queries/getUserByEmail";
import bcrypt from "bcrypt";
import { z } from "zod";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export default defineEventHandler(async (event) => {
  try {
    // Validate request body
    const body = await readBody(event);
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // Get user by email
    const user = await getUserByEmail(email.toLowerCase());
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    console.log(user);
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password || "");
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password",
      });
    }
    console.log("isValidPassword", isValidPassword);

    let avatarUrl = user.avatarUrl || "";
    // Create session
    await auth.login(event, {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl,
      authType: user.authType,
      isPaid: user.isPaid,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
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
