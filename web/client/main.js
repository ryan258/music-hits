const form = document.getElementById('hitsForm');
const output = document.getElementById('output');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  output.innerHTML = '<p class="text-gray-500">🔍 Fetching music hits...</p>';
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
      output.innerHTML = `<p class='text-red-600'>❌ ${data.error}</p>`;
    } else {
      output.innerHTML = renderGrid(data);
    }
  } catch (err) {
    output.innerHTML = `<p class='text-red-600'>❌ ${err.message}</p>`;
  }
});

function renderGrid(data) {
  let cards = '';
  for (const [artist, info] of Object.entries(data)) {
    if (!info || !Array.isArray(info.songs)) continue;
    cards += `
      <div class="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
        <h3 class="text-lg font-bold text-blue-700 flex items-center gap-1">🎤 ${artist}</h3>
        <em class="text-gray-500 text-sm mb-2">${info.career_phase || ''}</em>
        <ul class="list-disc pl-5">
          ${info.songs.map(song => `<li class="flex items-center gap-1">🎵 <span>${song}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }
  return cards || '<p>No results found.</p>';
}
