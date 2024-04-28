export const internalError = (body?: BodyInit) =>
  new Response(body ?? "Internal server errorUI", {
    status: 500,
  });
