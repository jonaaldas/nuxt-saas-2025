// Auth store
export const useAuthStore = () => {
  return useState("auth", () => ({
    isAuth: true,
    isPaid: true,
    user: {
      id: "1",
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
    },
  }));
};

// Helper computed states
export const useIsAuthenticated = () => {
  const auth = useAuthStore();
  return computed(() => auth.value.isAuth);
};

export const useIsPaid = () => {
  const auth = useAuthStore();
  return computed(() => auth.value.isPaid);
};

export const useUser = () => {
  const auth = useAuthStore();
  return computed(() => auth.value.user);
};
