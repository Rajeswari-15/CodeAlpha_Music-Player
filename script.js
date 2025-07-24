const audio = document.getElementById('audio');
const playlistContainer = document.getElementById('playlist');
const searchInput = document.getElementById('search');
const volumeControl = document.getElementById('volume');
const themeToggle = document.getElementById('toggleTheme');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');

let playlist = [];
let currentIndex = 0;

// Load playlist from JSON
fetch('songs.json')
  .then(res => res.json())
  .then(data => {
    playlist = data;
    renderPlaylist(playlist);
    loadSong(0);
  })
  .catch(err => console.error('Failed to load songs.json', err));

function renderPlaylist(list) {
  playlistContainer.innerHTML = '';
  list.forEach((song, idx) => {
    const div = document.createElement('div');
    div.className = 'song';
    div.onclick = () => {
      currentIndex = idx;
      loadSong(idx);
      audio.play();
    };

    div.innerHTML = `
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist} · ${song.language}</div>
      </div>
    `;
    playlistContainer.appendChild(div);
  });
}

function loadSong(idx) {
  const song = playlist[idx];
  if (!song) return;
  audio.src = song.url;
  audio.play();
}

playBtn.onclick = () => audio.paused ? audio.play() : audio.pause();
nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
};
prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
};

volumeControl.oninput = e => audio.volume = e.target.value;

themeToggle.onclick = () => document.body.classList.toggle('dark-mode');

searchInput.oninput = e => {
  const q = e.target.value.toLowerCase();
  const filtered = playlist.filter(song =>
    song.title.toLowerCase().includes(q) ||
    song.artist.toLowerCase().includes(q) ||
    song.language.toLowerCase().includes(q)
  );
  renderPlaylist(filtered);
  currentIndex = 0;
  if (filtered.length) loadSong(0);
};
