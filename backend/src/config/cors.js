const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const getAllowedOrigins = () => {
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    process.env.CORS_ORIGIN,
  ]
    .flatMap((value) => (value || "").split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set(["https://pedo-derma.vercel.app", ...configuredOrigins])];
};

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return localOriginPattern.test(origin) || getAllowedOrigins().includes(origin);
};

module.exports = {
  getAllowedOrigins,
  isAllowedOrigin,
};
