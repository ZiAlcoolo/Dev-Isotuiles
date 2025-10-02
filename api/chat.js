// api/chat.js
export default async function handler(req, res) {
  // Allow CORS (Shopify va faire des requêtes cross-origin)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Missing 'message' in body." });

    // Appel à l'API OpenAI (Chat Completions)
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ou "gpt-4.1" selon ton abonnement
        messages: [
          { role: "system", content: "Tu es un assistant du site e-commerce. Réponds brièvement et poliment." },
          { role: "user", content: message }
        ],
        max_tokens: 500
      })
    });

    const data = await openaiResp.json();
    const reply = data?.choices?.[0]?.message?.content ?? "Désolé, je n'ai pas de réponse.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Erreur server:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
