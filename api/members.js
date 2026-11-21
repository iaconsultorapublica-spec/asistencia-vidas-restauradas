export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwoCN-QUak4GpP8Ip5NKSytpqCbs6zylTAOAg_hsLEJdsRImOF1TDbu0x7Ry2hGpf0/exec";

  try {
    const gRes = await fetch(GOOGLE_SCRIPT_URL + "?t=" + Date.now());
    const data = await gRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message, success: false });
  }
}

