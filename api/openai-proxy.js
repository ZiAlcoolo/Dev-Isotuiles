export default async function handler(req, res) {
  // Autorise seulement ton domaine GitHub Pages
  // res.setHeader("Access-Control-Allow-Origin", "https://zialcoolo.github.io");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key on server" });
    }

    const response = await fetch("dev-isotuiles-p38jfxcbh-zialcoolos-projects.vercel.app/api/openai-proxy", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]
  })
});


    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error("Erreur proxy:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
