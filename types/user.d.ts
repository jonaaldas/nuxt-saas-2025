export default interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}
