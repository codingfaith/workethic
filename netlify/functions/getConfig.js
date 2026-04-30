// netlify/functions/getConfig.js
exports.handler = async () => {
  const config = {
    apiKey: process.env.FBB_API_KEY,
    authDomain: process.env.FBB_AUTH_DOMAIN,
    projectId: process.env.FBB_PROJECT_ID,
    storageBucket: process.env.FBB_STRG_BKT,
    messagingSenderId: process.env.FBB_MSG_SENDER_ID,
    appId: process.env.FBB_APP_ID,
  };

  const missing = Object.entries(config).filter(([key, value]) => !value);
  if (missing.length > 0) {
    console.error("Missing Firebase environment variables:", missing.map(([k]) => k));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Firebase config values", missing: missing.map(([k]) => k) })
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ firebaseConfig: config })
  };
};
