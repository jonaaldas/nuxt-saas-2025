import requireUserLoggedIn from "~/server/utils/requireUserLoggedIn";
import auth from "~/server/utils/auth";
export default defineEventHandler(async (event) => {
  await requireUserLoggedIn(event);

  const user = await auth.user(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
});
