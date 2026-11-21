export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwoCN-QUak4GpP8Ip5NKSytpqCbs6zylTAOAg_hsLEJdsRImOF1TDbu0x7Ry2hGpf0/exec";

  try {
    const payload = req.body || {};
    const gRes = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: typeof payload === "string" ? payload : JSON.stringify(payload)
    });

    const data = await gRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message, success: false });
  }
}

