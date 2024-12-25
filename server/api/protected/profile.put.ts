import { z } from "zod";
import { updateUser } from "~/server/db/queries/updateUser";

// Validation schema
const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .optional(),
    avatarUrl: z.string().url("Invalid avatar URL").nullable().optional(),
  })
  .refine((data) => data.name !== undefined || data.avatarUrl !== undefined, {
    message: "At least one field (name or avatarUrl) must be provided",
  });

export default defineEventHandler(async (event) => {
  try {
    // Get current user from event context
    const { user } = await getUserSession(event);

    // Validate request body
    const body = await readBody(event);
    const validatedData = updateProfileSchema.parse(body);

    // Update user
    const updatedUser = await updateUser(Number(user?.id), {
      ...(validatedData.name && { name: validatedData.name }),
      ...(validatedData.avatarUrl !== undefined && { avatarUrl: validatedData.avatarUrl }),
    });

    return {
      success: true,
      user: updatedUser,
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
