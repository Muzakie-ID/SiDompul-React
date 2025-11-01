// api/server.js
import axios from "axios";

/**
 * Basic Auth Token untuk upstream API
 * Format: Base64 encoded "username:password"
 * Contoh: "admin:gugun09" -> "YWRtaW46Z3VndW4wOQ=="
 * 
 * Set di environment variable UPSTREAM_AUTH_TOKEN
 * atau langsung di sini untuk development
 */
const UPSTREAM_AUTH_TOKEN = process.env.UPSTREAM_AUTH_TOKEN || "YWRtaW46Z3VndW4wOQ==";

/**
 * Helper baca body request (fallback jika req.body tidak tersedia)
 */
async function readBody(req) {
  if (req.body) return req.body;
  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Vercel serverless handler (ESM export default)
 */
export default async function handler(req, res) {
  // Simple CORS handling for browser requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // Only allow POST for this endpoint
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ statusCode: 405, message: "Method not allowed" }));
  }

  try {
    const body = await readBody(req);
    const phone_number = body?.phone_number;

    if (!phone_number) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ statusCode: 400, message: "phone_number harus dikirim" }));
    }

    // Proxy request to the real API dengan Basic Auth
    const upstreamUrl = "https://sidompul.botdigital.web.id/api/check-kuota";

    const upstreamRes = await axios.post(
      upstreamUrl,
      { phone_number },
      { 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Basic ${UPSTREAM_AUTH_TOKEN}`
        }, 
        timeout: 15000 
      }
    );

    // Forward success response (status and body)
    res.statusCode = upstreamRes.status || 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(upstreamRes.data));
  } catch (err) {
    // Try to extract helpful error info from axios
    const axiosData = err?.response?.data;
    const axiosStatus = err?.response?.status;

    const payload = {
      statusCode: axiosStatus || 500,
      message: "Gagal menghubungkan ke server upstream",
      error: axiosData?.message || err.message || "Unknown error",
    };

    res.statusCode = axiosStatus || 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(payload));
  }
}