// Define private routes that require authentication
const privateRoutes = ["/dashboard"];

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  const isPrivateRoute = privateRoutes.some((route) => to.path.startsWith(route));

  // If it's a private route and user is not logged in
  if (isPrivateRoute && !loggedIn.value) {
    // Redirect to login with callback URL
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }

  // If user is logged in and trying to access auth pages (login/register)
  if (loggedIn.value && (to.path === "/login" || to.path === "/register")) {
    // Redirect to dashboard
    return navigateTo("/dashboard");
  }
});
