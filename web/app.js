const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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

// Utility to log responses as Markdown in /logs
function logResponseMarkdown(content, year, genre, filenamePrefix = 'response') {
  const logsDir = path.resolve(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  let filename;
  if (year && genre) {
    filename = `${genre.toLowerCase().replace(/\s+/g, '_')}_hits_${year}.md`;
  } else {
    filename = `${filenamePrefix}.md`;
  }
  const filePath = path.join(logsDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
}

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
    const errorMsg = 'Missing year or genre.';
    logResponseMarkdown(`# Error\n${errorMsg}\nRequest: ${JSON.stringify(req.body, null, 2)}`);
    return res.status(400).json({ error: errorMsg });
  }
  const hits = await getMusicHits(year, genre);
  // Log the response as Markdown
  let markdownContent = `# Music Hits\n**Year:** ${year}\n**Genre:** ${genre}\n\n`;
  if (hits.error) {
    markdownContent += `**Error:** ${hits.error}`;
  } else {
    for (const artist in hits) {
      markdownContent += `## ${artist}\n- **Songs:** ${(hits[artist].songs || []).join(', ')}\n- **Career Phase:** ${hits[artist].career_phase || ''}\n`;
    }
  }
  logResponseMarkdown(markdownContent, year, genre, 'hits');
  res.json(hits);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Music Hits API listening on port ${PORT}`);
});
