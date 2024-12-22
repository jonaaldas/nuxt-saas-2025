export default defineEventHandler(async (event) => {
  return {
    message: "Protected route working!",
  };
});
