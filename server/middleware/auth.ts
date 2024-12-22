import requireUserLoggedIn from "../utils/requireUserLoggedIn";

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  if (path.startsWith("/api/protected/")) {
    try {
      await requireUserLoggedIn(event);
    } catch (error) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized: Please login to access this resource",
      });
    }
  }
});
