# 🎵 Music Hits CLI

## 📌 Overview
Music Hits CLI is a command-line tool that fetches and formats information about the top music artists and their hit songs from a given year and genre. The data is retrieved using OpenAI's GPT API and formatted into a markdown file.

## 🚀 Features
- Fetches top 10 artists from a specified year and genre.
- Provides a list of popular songs and career phase details.
- Outputs results in a markdown format.
- Saves the data to a markdown file.

## 🛠️ Installation
### Prerequisites
- Node.js (v16+ recommended)
- An OpenAI API key (set in `.env` as `OPENAI_API_KEY`)
- Optional: `OPENAI_MODEL`, `API_URL`, `MODEL_NAME` for custom model endpoints
- A `.gitignore` is included to exclude `node_modules/` and `.env`

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/music-hits-cli.git
   cd music-hits-cli
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```sh
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   ```

## 📌 Usage
Run the command with options:
```sh
node music-hits-cli.js --year <year> --genre <genre>
```
Example:
```sh
node music-hits-cli.js --year 1990 --genre "rock"
```

### Options:
- `-y, --year <number>` : The year to fetch music hits for (default: current year).
- `-g, --genre <string>` : The music genre (default: classic rock).

## 💾 Output
The tool generates a markdown file named as:
```
<genre>_hits_<year>.md
```
Example:
```
rock_hits_1990.md
```

### Example Generated File
```md
# 🎵 Rock Hits from 1990

## 🎤 Eric Clapton
*In 1990, Clapton experienced a significant resurgence in his career with…*
- 🎵 Tears in Heaven
- 🎵 Wonderful Tonight

## 🎤 Nirvana
*Though 'Nevermind' was released in late 1991, the grunge movement began…*
- 🎵 Smells Like Teen Spirit
- 🎵 Come as You Are
```

## 🐞 Troubleshooting
- If you see `OPENAI_API_KEY is not set`, ensure your `.env` file exists and is formatted correctly.
- JSON parse errors typically indicate the model returned non-JSON. Check `OPENAI_MODEL`, `API_URL`, and network connectivity.
- For other issues, please open an issue on GitHub or contact the maintainer.

## 🛠️ Development
To contribute or modify the project:
1. Install dependencies: `npm install`
2. Modify `music-hits-cli.js`
3. Run the script and test changes

## 📜 License
This project is licensed under the MIT License.

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📧 Contact
For any inquiries, contact [ryanleejwebdev@gmail.com](mailto:ryanleejwebdev@gmail.com).
