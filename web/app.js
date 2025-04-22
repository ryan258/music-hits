const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static frontend files
app.use('/client', express.static(path.join(__dirname, 'client')));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set.');
  process.exit(1);
}

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

async function getMusicHits(year, genre) {
  const prompt = `Provide information about the top 10 ${genre} artists who were active or particularly influential in ${year},\nalong with their most popular or significant songs released in ${year} and a brief description of their career phase during that year.\nFormat the response as a JSON object with the structure:\n{"artists": {"Artist Name": {"songs": ["Song 1", "Song 2", ...], "career_phase": "Brief description"}}}\nEnsure that the response is valid JSON and matches this exact structure. Do not include any markdown formatting or code block indicators.`;
  try {
    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful music historian specializing in classic rock. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ]
    });
    let result = response.choices[0].message.content;
    if (result.startsWith('```') && result.endsWith('```')) {
      result = result.replace(/```json|```/g, '').trim();
    }
    const parsed = JSON.parse(result);
    return parsed.artists || parsed;
  } catch (error) {
    return { error: error.message };
  }
}

app.post('/api/hits', async (req, res) => {
  const { year, genre } = req.body;
  if (!year || !genre) {
    return res.status(400).json({ error: 'Missing year or genre.' });
  }
  const hits = await getMusicHits(year, genre);
  res.json(hits);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Music Hits API listening on port ${PORT}`);
});
