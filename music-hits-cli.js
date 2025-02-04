import fs from 'fs';
import { program } from 'commander';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error("\u274C OPENAI_API_KEY is not set in environment variables.");
    process.exit(1);
}

// Initialize OpenAI client
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

// Query AI model
async function queryAIModel(prompt) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful music historian specializing in classic rock. Always respond with valid JSON." },
                { role: "user", content: prompt }
            ]
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error(`\u274C Error querying AI model: ${error.message}`);
        throw error;
    }
}

// Parse AI response
function parseAIResponse(response) {
    try {
        if (response.startsWith('```') && response.endsWith('```')) {
            response = response.replace(/```json|```/g, '').trim();
        }
        const parsed = JSON.parse(response);
        return parsed.artists || parsed;
    } catch (error) {
        console.error(`\u274C Failed to parse AI response: ${response}`);
        return null;
    }
}

async function getMusicHits(year, genre) {
    console.log(`\uD83D\uDD0D Getting ${genre} hits for year ${year}`);
    const prompt = `Provide information about the top 10 ${genre} artists who were active or particularly influential in ${year},
    along with their most popular or significant songs released in ${year} and a brief description of their career phase during that year.
    Format the response as a JSON object with the structure:
    {"artists": {"Artist Name": {"songs": ["Song 1", "Song 2", ...], "career_phase": "Brief description"}}}
    Ensure that the response is valid JSON and matches this exact structure. Do not include any markdown formatting or code block indicators.`;
    
    try {
        const rawResponse = await queryAIModel(prompt);
        const parsedResponse = parseAIResponse(rawResponse);
        if (parsedResponse) return parsedResponse;
        else throw new Error(`Failed to parse AI response: ${rawResponse}`);
    } catch (error) {
        console.error(`\u274C Error getting ${genre} hits: ${error.message}`);
        return { error: error.message };
    }
}

function formatAsMarkdown(year, genre, data) {
    console.log(`\uD83D\uDCCA Formatting ${genre} data as markdown`);
    let markdown = `# \uD83C\uDFB5 ${genre.charAt(0).toUpperCase() + genre.slice(1)} Hits from ${year}\n\n`;
    for (const [artist, info] of Object.entries(data)) {
        markdown += `## \uD83C\uDFA4 ${artist}\n`;
        markdown += `*${info.career_phase}*\n\n`;
        info.songs.forEach(song => {
            markdown += `- \uD83C\uDFB5 ${song}\n`;
        });
        markdown += `\n`;
    }
    return markdown;
}

function saveToFile(content, year, genre) {
    const filename = `${genre.toLowerCase().replace(/\s+/g, '_')}_hits_${year}.md`;
    fs.writeFileSync(filename, content, 'utf8');
    console.log(`\uD83D\uDCBE Data saved to ${filename}`);
}

// CLI setup
program
    .option('-y, --year <number>', 'Year of music hits', new Date().getFullYear())
    .option('-g, --genre <string>', 'Music genre', 'classic rock')
    .action(async (options) => {
        const { year, genre } = options;
        console.log(`\uD83D\uDD0D Fetching ${genre} hits for ${year}...`);

        try {
            const hitsData = await getMusicHits(year, genre);
            if (hitsData.error) {
                console.error(`\u274C An error occurred: ${hitsData.error}`);
            } else {
                const formattedData = formatAsMarkdown(year, genre, hitsData);
                console.log(formattedData);
                saveToFile(formattedData, year, genre);
                console.log(`\uD83C\uDF89 Successfully saved ${genre} hits for ${year}!`);
            }
        } catch (error) {
            console.error(`\u274C An unexpected error occurred: ${error.message}`);
        }
    });

program.parse(process.argv);
