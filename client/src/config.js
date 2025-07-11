const config = {
  development: {
    BACKEND_URL: "http://localhost:8080",
  },
  production: {
    BACKEND_URL: "https://api.enhbookings.com",
  },
};

export const BACKEND_URL =
  config[process.env.NODE_ENV]?.BACKEND_URL || config.development.BACKEND_URL;
