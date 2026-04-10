export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Metoda niedozwolona' });

  const { prompt, system } = req.body;

  try {
    // Używamy darmowego, ale potężnego modelu tekstowego Llama-3 przez Pollinations
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        model: "openai", // Korzysta z zaawansowanych modeli GPT-4o-mini
        seed: Math.floor(Math.random() * 1000)
      })
    });

    const text = await response.text();
    res.status(200).json({ text });

  } catch (error) {
    console.error("Błąd AI:", error);
    res.status(500).json({ message: 'Błąd podczas generowania tekstu.' });
  }
}
