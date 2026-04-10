export default async function handler(req, res) {
  // Akceptujemy tylko zapytania typu POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metoda niedozwolona' });
  }

  const { prompt, system } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Brak polecenia (promptu)' });
  }

  try {
    // Łączymy się z silnikiem Pollinations AI (obsługuje duże ilości tekstu)
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        model: "openai", 
        temperature: 0.3, // Obniżamy temperaturę do 0.3, aby wymusić perfekcyjną gramatykę i zablokować "halucynacje" słowne
        seed: Math.floor(Math.random() * 10000)
      })
    });

    if (!response.ok) {
      throw new Error(`Błąd AI: ${response.statusText}`);
    }

    const text = await response.text();
    
    // Odsyłamy czysty tekst z AI do naszej aplikacji React
    res.status(200).json({ text });

  } catch (error) {
    console.error("Błąd podczas generowania scenariusza:", error);
    res.status(500).json({ message: 'Wystąpił błąd serwera AI podczas pisania scenariusza.' });
  }
}
