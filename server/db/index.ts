import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.NUXT_DATABASE_URL as string,
  authToken: process.env.NUXT_DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Export types
export type DrizzleSchema = typeof schema;
export type DbClient = typeof db;
