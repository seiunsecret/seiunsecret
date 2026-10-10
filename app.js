const desktopItems = document.getElementById("desktopItems");
const windowsLayer = document.getElementById("windows");
const toast = document.getElementById("toast");
const clock = document.getElementById("clock");

let zIndex = 300;
let windowOffset = 0;

const files = {
  "about.txt": {
    type: "text",
    content: `SEIUNSECRET
-------------

Seiunsecret is an Hrmnx Entertainment-affiliated archive
and promotional space for unreleased works, demonstrations,
development material and other material authorized for
promotional use.

The material contained within this archive is not necessarily
intended to represent officially released works.

Some files may be incomplete, experimental, unfinished,
obsolete or subject to change.

SEIUNSECRET`
  },

  "permissions.txt": {
    type: "text",
    content: `SEIUNSECRET - PERMISSIONS
--------------------------

The materials distributed through SEIUN SECRET are made
available by staff and authorized members associated with
Hrmnx Entertainment.

Hrmnx Entertainment permits selected unreleased materials
to be used as promotional teasers and promotional material
within the scope defined by the company.

Music demonstrations may be distributed as teasers.

Other materials, including development material, website
material, project material and selected internal artifacts,
may be presented as promotional material when authorized.

Unauthorized redistribution, modification or commercial use
is not permitted unless separately authorized.

For questions regarding permissions:
Hrmnx Entertainment`
  },

  "music.txt": {
    type: "text",
    content: `SEIUN SECRET - MUSIC
--------------------

Music demonstrations distributed through SEIUN SECRET may
use the Nemawashi demonstration standards.

.PRODEM
-------

.prodem files represent Nemawashi project demonstrations.

.LYRDEM
-------

.lyrdem files contain demonstration lyric material.

These formats distinguish promotional/demo material from
finalized commercial releases.

A demonstration is not necessarily a final version of the
corresponding work.

Files may subsequently be modified, replaced, archived,
or removed by authorized staff.`
  },

  "nemawashi-notice.txt": {
    type: "text",
    content: `NOTICE FOR NEMAWASHI
--------------------

The bottom bar has a few app icons with logos on it,
do NOT open the square-in-a-square logo, since it
directly opens Nemawashi. You can't open it because
Nemawashi is a beta app, accounts have only been configured
for verified employees, not for guests.

Please do not make an account there, as we will take your
permissions immediately.`
  },

  "discord.link": {
    type: "link",
    url: "https://discord.gg/XT4uaaZrC",
    label: "Seiunsecret Discord"
  }
};

const folders = {
  archive: {
    title: "archive",
    entries: [
      { name: "members", type: "folder", id: "members" },
      { name: "news", type: "folder", id: "news" },
      { name: "nemawashi", type: "folder", id: "nemawashi" },
      { name: "music", type: "folder", id: "music" },
      { name: "website", type: "folder", id: "website" }
    ]
  },
  members: { title: "members", entries: [] },
  news: { title: "news", entries: [] },
  nemawashi: { title: "nemawashi", entries: [] },
  music: { title: "music", entries: [
    { name: "music.txt", type: "file", id: "music.txt" }
  ]},
  website: { title: "website", entries: [] }
};

const musicCatalogue = [
  {
    id: "mirage-demo",
    title: "Mirage",
    artist: "SEIUN",
    album: "WINK: 프로모션 보너스 버전",
    status: "Released",
    bpm: 125,
    key: "D Minor",
    genre: "Lo-Fi House",
    credits: "Production: Cinnasugar",
    reasonUnreleased:
      "Development demo retained for authorized promotional use.",
    description:
      "An early demonstration version. Arrangement and production changed a bit.",
    cover: "",
    versions: [
      {
        id: "demo-v1",
        name: "Demo Version 1",
        type: "Full demo",
        format: "MP3",
        file: "audio/music/mirage-demo-v1.mp3"
      },
      {
        id: "snippet",
        name: "Promotional Snippet",
        type: "Short preview",
        format: "MP3",
        file: "audio/music/mirage-snippet.mp3"
      },
      {
        id: "instrumental",
        name: "Instrumental Demo",
        type: "Instrumental",
        format: "MP3",
        file: "audio/music/mirage-instrumental.mp3"
      }
    ]
  }
];

function createIcon(name, type, x, y, onOpen) {
  const button = document.createElement("button");
  button.className = "desktop-icon";
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
  button.dataset.name = name;

  const art = document.createElement("span");
  art.className = `icon-art ${type === "folder" ? "folder-art" : "file-art"} ${type === "link" ? "link-art" : ""}`;

  const label = document.createElement("span");
  label.className = "icon-label";
  label.textContent = name;

  button.append(art, label);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelectorAll(".desktop-icon.selected").forEach(el => el.classList.remove("selected"));
    button.classList.add("selected");
  });

  button.addEventListener("dblclick", (event) => {
    event.stopPropagation();
    playClick();
    onOpen();
  });

  return button;
}

function buildDesktop() {
  desktopItems.innerHTML = "";

  const desktopFiles = [
    ["about.txt", "file", 30, 35],
    ["permissions.txt", "file", 145, 35],
    ["discord.link", "link", 260, 35],
    ["archive", "folder", 30, 155],
    ["music.txt", "file", 145, 155],
    ["nemawashi-notice.txt", "file", 260, 155]
  ];

  desktopFiles.forEach(([name, type, x, y]) => {
    desktopItems.appendChild(
      createIcon(name, type, x, y, () => openItem(name, type))
    );
  });
}

function openItem(name, type) {
  if (type === "folder") {
    openFolder(name);
    return;
  }

  const data = files[name];
  if (!data) return;

  if (data.type === "text") openTextWindow(name, data.content);
  if (data.type === "link") openLinkWindow(name, data);
}

function createWindow(title, body) {
  const win = document.createElement("section");
  win.className = "window";
  win.style.zIndex = ++zIndex;

  const bar = document.createElement("div");
  bar.className = "window-bar";

  const controls = document.createElement("div");
  controls.className = "window-controls";

  const close = document.createElement("button");
  close.className = "window-control";
  close.title = "Close";
  close.setAttribute("aria-label", "Close window");
  close.addEventListener("click", () => closeWindow(win));

  controls.appendChild(close);

  const titleEl = document.createElement("div");
  titleEl.className = "window-title";
  titleEl.textContent = title;

  bar.append(controls, titleEl);

  const bodyEl = document.createElement("div");
  bodyEl.className = "window-body";
  bodyEl.appendChild(body);

  win.append(bar, bodyEl);
  windowsLayer.appendChild(win);

  const width = Math.min(680, window.innerWidth - 34);
  const left = Math.max(16, (window.innerWidth - width) / 2 + windowOffset);
  const top = Math.max(50, (window.innerHeight - 430) / 2 + windowOffset * .45);

  win.style.left = `${Math.min(left, window.innerWidth - width - 16)}px`;
  win.style.top = `${Math.min(top, window.innerHeight - 180)}px`;

  windowOffset = (windowOffset + 32) % 130;

  win.addEventListener("pointerdown", () => {
    win.style.zIndex = ++zIndex;
  });

  makeDraggable(win, bar);
  return win;
}

function openTextWindow(name, content) {
  const documentBody = document.createElement("article");
  documentBody.className = "text-document";
  documentBody.textContent = content;
  createWindow(name, documentBody);
}

function openLinkWindow(name, data) {
  const body = document.createElement("div");
  body.className = "link-document";

  const box = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = data.label;

  const text = document.createElement("p");
  text.textContent = "Open the Seiun Secret Discord community.";

  const button = document.createElement("button");
  button.textContent = "Enter Discord";
  button.addEventListener("click", () => {
    // Replace this placeholder with the real invite.
    window.open(data.url, "_blank", "noopener,noreferrer");
  });

  box.append(title, text, button);
  body.appendChild(box);
  createWindow(name, body);
}


function createMusicIcon(kind) {
  const icon = document.createElement("span");
  icon.className = `icon-art ${kind === "folder" ? "folder-art" : "file-art"}`;

  if (kind === "music") {
    icon.classList.add("music-file-art");
    icon.setAttribute("aria-label", "Music file");
  }

  return icon;
}

function createMusicEntry(song) {
  const button = document.createElement("button");
  button.className = "folder-entry music-folder-entry";
  button.title = `Open ${song.title}`;

  const icons = document.createElement("span");
  icons.className = "music-entry-icons";
  icons.append(
    createMusicIcon("folder"),
    createMusicIcon("music")
  );

  const label = document.createElement("span");
  label.className = "icon-label";
  label.textContent = song.title;

  const subtitle = document.createElement("span");
  subtitle.className = "music-entry-subtitle";
  subtitle.textContent = `${song.artist} · ${song.versions.length} versions`;

  button.append(icons, label, subtitle);

  button.addEventListener("click", () => {
    document.querySelectorAll(".music-folder-entry.selected")
      .forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
  });

  button.addEventListener("dblclick", () => {
    playClick();
    openSongDetails(song);
  });

  return button;
}

function addMusicMetadata(container, labelText, valueText) {
  const row = document.createElement("div");
  row.className = "music-metadata-row";

  const label = document.createElement("span");
  label.className = "music-metadata-label";
  label.textContent = labelText;

  const value = document.createElement("span");
  value.className = "music-metadata-value";
  value.textContent = valueText || "Not specified";

  row.append(label, value);
  container.appendChild(row);
}

function openSongDetails(song) {
  const body = document.createElement("div");
  body.className = "music-detail-layout";

  const cover = document.createElement("img");
  cover.className = "music-cover music-detail-cover";
  cover.src = song.cover;
  cover.alt = `${song.title} artwork`;
  cover.addEventListener("error", () => {
    cover.classList.add("cover-unavailable");
    cover.alt = "Album artwork not added yet";
  });

  const content = document.createElement("div");
  content.className = "music-detail-content";

  const eyebrow = document.createElement("div");
  eyebrow.className = "music-eyebrow";
  eyebrow.textContent = song.status;

  const title = document.createElement("h2");
  title.className = "music-heading";
  title.textContent = song.title;

  const artist = document.createElement("p");
  artist.className = "music-artist";
  artist.textContent = song.artist;

  const description = document.createElement("p");
  description.className = "music-description";
  description.textContent = song.description;

  const metadata = document.createElement("div");
  metadata.className = "music-metadata";

  addMusicMetadata(metadata, "Album", song.album);
  addMusicMetadata(metadata, "Genre", song.genre);
  addMusicMetadata(metadata, "BPM", String(song.bpm));
  addMusicMetadata(metadata, "Key", song.key);
  addMusicMetadata(metadata, "Credits", song.credits);
  addMusicMetadata(metadata, "Why unreleased", song.reasonUnreleased);

  const versionsButton = document.createElement("button");
  versionsButton.className = "music-primary-button";
  versionsButton.textContent = `View ${song.versions.length} versions`;
  versionsButton.addEventListener("click", () => {
    playClick();
    openVersionPicker(song);
  });

  content.append(
    eyebrow, title, artist, description, metadata, versionsButton
  );
  body.append(cover, content);

  createWindow(`${song.title} — Song Information`, body);
}

function openVersionPicker(song) {
  const body = document.createElement("div");
  body.className = "version-picker";

  const intro = document.createElement("p");
  intro.className = "music-description";
  intro.textContent =
    `Choose a version of ${song.title}. Double-click a version to open the player.`;

  const list = document.createElement("div");
  list.className = "version-list";

  song.versions.forEach(version => {
    const item = document.createElement("button");
    item.className = "version-item";

    const icon = document.createElement("span");
    icon.className = "version-note";
    icon.textContent = "♫";

    const details = document.createElement("span");
    details.className = "version-item-details";

    const name = document.createElement("strong");
    name.textContent = version.name;

    const type = document.createElement("span");
    type.textContent = `${version.type} · ${version.format}`;

    details.append(name, type);
    item.append(icon, details);

    item.addEventListener("click", () => {
      list.querySelectorAll(".version-item")
        .forEach(entry => entry.classList.remove("selected"));
      item.classList.add("selected");
    });

    item.addEventListener("dblclick", () => {
      playClick();
      openMusicPlayer(song, version);
    });

    list.appendChild(item);
  });

  body.append(intro, list);
  createWindow(`${song.title} — Versions`, body);
}

function openMusicPlayer(song, version) {
  const body = document.createElement("div");
  body.className = "music-player-layout";

  const cover = document.createElement("img");
  cover.className = "music-cover music-player-cover";
  cover.src = song.cover;
  cover.alt = `${song.title} artwork`;
  cover.addEventListener("error", () => {
    cover.classList.add("cover-unavailable");
    cover.alt = "Album artwork not added yet";
  });

  const info = document.createElement("div");
  info.className = "music-player-info";

  const eyebrow = document.createElement("div");
  eyebrow.className = "music-eyebrow";
  eyebrow.textContent = version.type;

  const title = document.createElement("h2");
  title.className = "music-heading";
  title.textContent = song.title;

  const versionName = document.createElement("p");
  versionName.className = "music-artist";
  versionName.textContent = version.name;

  const artist = document.createElement("p");
  artist.className = "music-description";
  artist.textContent = `${song.artist} · ${song.album}`;

  const audio = document.createElement("audio");
  audio.className = "music-audio";
  audio.controls = true;
  audio.preload = "metadata";
  audio.src = version.file;

  const error = document.createElement("p");
  error.className = "music-player-message";
  error.textContent = "If playback fails, check that the audio file exists at the listed path.";
  error.hidden = true;

  audio.addEventListener("error", () => {
    error.hidden = false;
  });

  const time = document.createElement("p");
  time.className = "music-player-message";
  time.textContent = `BPM ${song.bpm} · ${song.key} · ${version.format}`;

  info.append(eyebrow, title, versionName, artist, audio, time, error);
  body.append(cover, info);

  createWindow(`${song.title} — ${version.name}`, body);
}

function openFolder(id) {
  const folder = folders[id];
  if (!folder) return;

  const view = document.createElement("div");
  view.className = "folder-view";

  if (!folder.entries.length) {
    const empty = document.createElement("div");
    empty.className = "text-document";
    empty.textContent = "This folder is currently empty.";
    view.appendChild(empty);
  }

  folder.entries.forEach(entry => {
    const button = document.createElement("button");
    button.className = "folder-entry";

    const art = document.createElement("span");
    art.className = `icon-art ${entry.type === "folder" ? "folder-art" : "file-art"}`;

    const label = document.createElement("span");
    label.className = "icon-label";
    label.textContent = entry.name;

    button.append(art, label);
    button.addEventListener("dblclick", () => {
      playClick();
      if (entry.type === "folder") openFolder(entry.id);
      else openItem(entry.id, "file");
    });

    view.appendChild(button);
  });

  if (id === "music") {
    musicCatalogue.forEach(song => {
      view.appendChild(createMusicEntry(song));
    });
  }

  createWindow(folder.title, view);
}

function closeWindow(win) {
  playClose();
  win.classList.add("closing");
  setTimeout(() => win.remove(), 190);
}

function makeDraggable(win, bar) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  bar.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".window-control")) return;

    dragging = true;
    bar.setPointerCapture(event.pointerId);

    startX = event.clientX;
    startY = event.clientY;
    originX = win.offsetLeft;
    originY = win.offsetTop;
  });

  bar.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const nextX = originX + event.clientX - startX;
    const nextY = originY + event.clientY - startY;

    win.style.left = `${Math.max(5, Math.min(nextX, window.innerWidth - win.offsetWidth - 5))}px`;
    win.style.top = `${Math.max(32, Math.min(nextY, window.innerHeight - 90))}px`;
  });

  bar.addEventListener("pointerup", () => {
    dragging = false;
  });
}

/* Tiny UI sounds using Web Audio instead of requiring copyrighted system sounds. */
let audioContext;

function beep(frequency, duration, volume, type = "sine") {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (_) {}
}

function playClick() {
  beep(780, .055, .035, "triangle");
}

function playClose() {
  beep(460, .07, .028, "sine");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

document.addEventListener("click", () => {
  document.querySelectorAll(".desktop-icon.selected").forEach(el => el.classList.remove("selected"));
});

document.querySelectorAll(".dock-item").forEach(button => {
  button.addEventListener("click", () => {
    playClick();
    const url = button.dataset.url;
    if (url) { window.open(url, "_blank", "noopener,noreferrer"); return; }
    const action = button.dataset.action;
    const open = button.dataset.open;
    if (action === "home") { showToast("SEIUN SECRET"); return; }
    if (open === "archive") openFolder("archive");
    if (open === "music") openFolder("music");
    if (open === "nemawashi") openFolder("nemawashi");
    if (open === "about.txt") openItem("about.txt", "file");
  });
});

document.getElementById("brandButton").addEventListener("click", () => {
  playClick();
  showToast("SEIUN SECRET");
});

/* Background music */
const backgroundMusic=document.getElementById("backgroundMusic");
const soundMenuButton=document.getElementById("soundMenuButton");
const soundMenu=document.getElementById("soundMenu");
let musicEnabled=false,musicFadeTimer=null;
backgroundMusic.volume=0;
function fadeMusic(target,duration){clearInterval(musicFadeTimer);const start=backgroundMusic.volume,began=performance.now();musicFadeTimer=setInterval(()=>{const p=Math.min(1,(performance.now()-began)/duration),e=p*p*(3-2*p);backgroundMusic.volume=Math.max(0,Math.min(1,start+(target-start)*e));if(p>=1){clearInterval(musicFadeTimer);musicFadeTimer=null;}},30);}
async function enableMusic(){musicEnabled=true;try{await backgroundMusic.play();fadeMusic(.22,2200);showToast("Background sound enabled");}catch(e){musicEnabled=false;showToast("Click Enable again to allow sound");}}
function disableMusic(){musicEnabled=false;fadeMusic(0,1200);setTimeout(()=>{if(!musicEnabled)backgroundMusic.pause();},1250);showToast("Background sound disabled");}
soundMenuButton.addEventListener("click",e=>{e.stopPropagation();const open=soundMenu.classList.toggle("open");soundMenuButton.setAttribute("aria-expanded",String(open));});
soundMenu.addEventListener("click",e=>{e.stopPropagation();const action=e.target.closest("[data-sound-action]")?.dataset.soundAction;if(action==="enable")enableMusic();if(action==="disable")disableMusic();soundMenu.classList.remove("open");soundMenuButton.setAttribute("aria-expanded","false");});
document.addEventListener("click",()=>{soundMenu.classList.remove("open");soundMenuButton.setAttribute("aria-expanded","false");});

/* Pixel bunnies: low-FPS frames, stepped movement, 7-second pause at edge. */
const bunnyCanvas=document.getElementById("bunnyCanvas"),bunnyCtx=bunnyCanvas.getContext("2d");
const PIXEL=4,BUNNY_COLOR="#555b63",FRAME_MS=1000/7;
const bunnyFrames=[["      XX ","     XXXX","     XXXX","  X  XXXX"," XXX XXXXX","XXXXXXXXXX"," XXXXXXXXX","   XXXXXX ","   XX XX  "],["      XX ","     XXXX","     XXXX","  X  XXXX"," XXX XXXXX","XXXXXXXXXX"," XXXXXXXXX","   XXXXXX ","    X  X  "],["      XX ","     XXXX","     XXXX","  X  XXXX"," XXX XXXXX","XXXXXXXXXX"," XXXXXXXXX","  XXXXXX  "," XX    XX "]];
let bunnyX=-52,bunnyFrame=0,bunnyLastFrame=0,bunnyPauseUntil=0;
function resizeBunnyCanvas(){const dpr=Math.min(devicePixelRatio||1,2),r=bunnyCanvas.getBoundingClientRect();bunnyCanvas.width=Math.max(1,Math.floor(r.width*dpr));bunnyCanvas.height=Math.max(1,Math.floor(r.height*dpr));bunnyCtx.setTransform(dpr,0,0,dpr,0,0);}
function drawBunny(pattern,x,y){bunnyCtx.fillStyle=BUNNY_COLOR;pattern.forEach((row,ry)=>[...row].forEach((p,c)=>{if(p==="X")bunnyCtx.fillRect(Math.round(x+c*PIXEL),Math.round(y+ry*PIXEL),PIXEL,PIXEL);}));}
function bunnyLoop(now){const r=bunnyCanvas.getBoundingClientRect();bunnyCtx.clearRect(0,0,r.width,r.height);if(!bunnyPauseUntil||now>=bunnyPauseUntil){bunnyPauseUntil=0;if(now-bunnyLastFrame>=FRAME_MS){bunnyFrame=(bunnyFrame+1)%bunnyFrames.length;bunnyLastFrame=now;}bunnyX+=1.35;if(bunnyX>=r.width+8){bunnyX=-52;bunnyPauseUntil=now+7000;}}const h=bunnyFrames[0].length*PIXEL;drawBunny(bunnyFrames[bunnyFrame],bunnyX,Math.max(2,r.height-h-4));requestAnimationFrame(bunnyLoop);}
window.addEventListener("resize",resizeBunnyCanvas);resizeBunnyCanvas();requestAnimationFrame(bunnyLoop);

buildDesktop();
updateClock();
setInterval(updateClock, 1000);
