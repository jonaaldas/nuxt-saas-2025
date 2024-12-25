import { type H3Event } from "h3";
import { useServerStripe } from "#stripe/server";
import type Stripe from "stripe";
import { db } from "../../db/index";
export default defineEventHandler(async (event: H3Event) => {
  const stripe = await useServerStripe(event);
  const bodyRaw = await readRawBody(event);
  const headers = getRequestHeaders(event);
  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      bodyRaw!,
      headers["stripe-signature"]!,
      process.env.STRIPE_WEBHOOK_SECRET! || ""
    );

    const data = stripeEvent.data.object as Stripe.Event.Data.Object;
    const eventType = stripeEvent.type;

    switch (eventType) {
      case "checkout.session.completed": {
        const sessionData = data as { object: { id: string } };
        if ("id" in sessionData.object) {
          const session = await stripe.checkout.sessions.retrieve(sessionData.object.id, {
            expand: ["line_items"],
          });

          const customerId = session.customer as string;
          const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
          const priceId = session.line_items?.data[0]?.price?.id;

          if (!customer.email) {
            throw new Error("No email found in customer data");
          }

          let credits: number;
          let planType: "free" | "hobbyist" | "content_creator" | "yearly";

          switch (priceId) {
            case "price_1QXjUjATpO8jfWn5LQv6W0Qv":
              credits = 5;
              planType = "free";
              break;
            case "price_1QXWADATpO8jfWn5WXf2sq3V":
              credits = 50;
              planType = "hobbyist";
              break;
            case "price_1QXWAUATpO8jfWn5Xk3JH4ZZ":
              credits = 100;
              planType = "content_creator";
              break;
            case "price_1QXWBDATpO8jfWn5vc4fIdPD":
              credits = 1200;
              planType = "yearly";
              break;
            default:
              throw new Error("Invalid price ID");
          }

          // TODO: Implement credit assignment logic here

          break;
        } else {
          console.error("Invalid data object:", (data as { object: unknown }).object);
          // Handle the error or return an appropriate response
        }
      }
      case "customer.subscription.deleted": {
        break;
      }
      default: {
        console.warn(`Unhandled event type: ${eventType}`);
        return { success: true };
      }
    }

    return { success: true };
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : "Internal server error"
    }`;
    console.log(errorMessage);
    return createError({
      statusCode: 400,
      message: errorMessage,
    });
  }
});
