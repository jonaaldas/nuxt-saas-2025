export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  authType: "google" | "local";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  password?: string;
}
