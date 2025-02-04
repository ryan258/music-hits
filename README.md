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
- An OpenAI API key

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

