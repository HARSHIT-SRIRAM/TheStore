const config = {
  apiUrl:
    "https://the-store-seven.vercel.app" ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000",
  env: process.env.REACT_APP_ENV || "development",
};

export default config;
