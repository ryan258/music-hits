const form = document.getElementById('hitsForm');
const output = document.getElementById('output');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  output.innerHTML = '<p>🔍 Fetching music hits...</p>';
  const year = document.getElementById('year').value;
  const genre = document.getElementById('genre').value;

  try {
    const res = await fetch('http://localhost:3001/api/hits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, genre })
    });
    const data = await res.json();
    if (data.error) {
      output.innerHTML = `<p style="color:red;">❌ ${data.error}</p>`;
    } else {
      output.innerHTML = renderMarkdown(year, genre, data);
    }
  } catch (err) {
    output.innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
  }
});

function renderMarkdown(year, genre, data) {
  let md = `<h2>🎵 ${genre.charAt(0).toUpperCase() + genre.slice(1)} Hits from ${year}</h2>`;
  for (const [artist, info] of Object.entries(data)) {
    if (!info || !Array.isArray(info.songs)) continue;
    md += `<h3>🎤 ${artist}</h3>`;
    md += `<em>${info.career_phase || ''}</em><ul>`;
    info.songs.forEach(song => {
      md += `<li>🎵 ${song}</li>`;
    });
    md += `</ul>`;
  }
  return md;
}
