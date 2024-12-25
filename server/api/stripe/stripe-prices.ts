interface StripePrice {
  id: string;
  name: string;
  credits: number;
}

export const prices: StripePrice[] = [
  {
    id: "price_1QXjUjATpO8jfWn5LQv6W0Qv",
    name: "Free",
    credits: 5,
  },
  {
    id: "price_1QXWADATpO8jfWn5WXf2sq3V",
    name: "Hobbyist",
    credits: 50,
  },
  {
    id: "price_1QXWAUATpO8jfWn5Xk3JH4ZZ",
    name: "Content Creator",
    credits: 100,
  },
  {
    id: "price_1QXWBDATpO8jfWn5vc4fIdPD",
    name: "Yearly",
    credits: 1200,
  },
];
