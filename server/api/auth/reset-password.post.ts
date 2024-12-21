import auth from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { token, password } = await readBody(event);

  try {
    const res = await auth.verifyPasswordResetToken(token);

    if (!res.success) {
      return {
        success: false,
        message: res.message,
      };
    }

    await auth.resetPassword(res.decoded, password);

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to reset password",
    };
  }
});
