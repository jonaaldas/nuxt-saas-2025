import type { H3Event } from "h3";

export default async (event: H3Event<Request>) => {
  await requireUserSession(event);
};
