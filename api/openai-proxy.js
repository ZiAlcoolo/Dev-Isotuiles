export default async function handler(req, res) {
  // --- GESTION DU CORS ---
  const allowedOrigins = [
    "https://zialcoolo.github.io",   // ton site GitHub Pages
    "http://127.0.0.1:5501",         // ton environnement local (VSCode Live Server)
    "http://localhost:5501"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Réponse immédiate aux requêtes preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // --- SÉCURITÉ : uniquement POST ---
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  try {
    // --- RELAIS DE LA REQUÊTE VERS OPENAI ---
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // --- RETOUR AU CLIENT ---
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.status(response.status).json(data);

  } catch (error) {
    console.error("Erreur proxy OpenAI :", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}
