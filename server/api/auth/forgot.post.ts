import { eq } from "drizzle-orm";
import { users } from "../../db/schema";
import { db } from "../../db/index";
import auth from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid email format",
        }),
        { status: 400 }
      );
    }

    const foundUser = (
      await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          auth_provider: users.authType,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
    )?.[0];

    if (!foundUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "If you have an account, you will receive an email with a link to reset your password.",
        }),
        { status: 200 }
      );
    }

    if (foundUser.auth_provider === "google") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Google accounts cannot be reset.",
        }),
        { status: 403 }
      );
    }

    const token = auth.createPasswordResetToken(foundUser);

    try {
      await sendPasswordResetEmail(foundUser, token.token);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to send reset email. Please try again later.",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password reset email sent",
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error.code === "SQLITE_ERROR" || error.code === "PG_ERROR") {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Database error occurred. Please try again later.",
        }),
        { status: 503 }
      );
    }

    if (error.message?.includes("token")) {
      console.error("Token generation error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error generating reset token. Please try again later.",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500 }
    );
  }
});

interface EmailResult {
  id?: string;
  error?: {
    message: string;
    code: string;
  };
}

interface User {
  email: string;
  name?: string;
}

const sendPasswordResetEmail = async (user: User, token: string) => {
  const { emails } = useResend();

  try {
    if (!user?.email) {
      throw new Error("Invalid user email");
    }

    const resetLink = `${process.env.NUXT_APP_URL}/reset-password?token=${token}`;
    const result = await emails.send({
      from: "Support <support@birdseyesoftware.com>",
      to: [user.email],
      subject: "Password Reset Request - BirdsEye Software",
      html: `
        <div>
          <p>Hello ${user.name || "there"},</p>
          <p>You recently requested to reset your password. Click the link below to reset it:</p>
          ${resetLink}
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
          <p>If the link doesn't work, copy and paste it into your browser.</p>
          <p>Best regards,<br>BirdsEye Software Team</p>
        </div>
      `,
    });

    console.log("Password reset email sent successfully to:", user.email);

    if ((result as EmailResult).error) {
      throw new Error((result as EmailResult).error?.message || "Failed to send email");
    }

    return {
      success: true,
      email: user.email,
    };
  } catch (error: any) {
    console.error("Error sending password reset email:", {
      error: error.message,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    if (error.code === "rate_limit_exceeded") {
      throw new Error("Too many reset attempts. Please try again later.");
    }

    if (error.code === "invalid_recipient") {
      throw new Error("Invalid email address provided.");
    }

    if (error.statusCode === 429) {
      throw new Error("Service temporarily unavailable. Please try again later.");
    }

    throw new Error("Failed to send password reset email. Please try again later.");
  }
};
