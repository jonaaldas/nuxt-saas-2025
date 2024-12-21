import { navigateTo } from "nuxt/app";
import auth from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const res = await auth.attempt(event, body.email.toLowerCase(), body.password);

  if (!res) {
    return {
      success: false,
      flash: "Invalid email or password",
    };
  }

  return {
    success: true,
  };
});
