const photosPanel = `
  <h2>Kenangan Kita 📸</h2>
  <div class="photo-grid">
    <img class="photo-tile" src="assets/foto-1.jpg" alt="">
    <img class="photo-tile" src="assets/foto-2.jpg" alt="">
    <img class="photo-tile" src="assets/foto-3.jpg" alt="">
    <img class="photo-tile" src="assets/foto-4.jpg" alt="">
  </div>
  <p class="photo-note">setiap foto ini nyimpen momen yang bikin aku senyum tiap inget 🤍</p>
`;

const linkPanel = `
  <h2>Kejutan Spesial 🎁</h2>
  <div class="link-box">
    <p>ada satu hal yang udah disiapin khusus buat kamu.<br>klik tombol di bawah buat liat, ya.</p>
    <a class="tinker-btn" href="https://www.tinkercad.com/things/hpVUzY3jvCV-ultah-velin?sharecode=ZKUyRZEZfMMNoLy0NiVGOyleC-CdmA7yTLG0XpJhOWs" target="_blank" rel="noopener">Buka Kejutannya →</a>
  </div>
`;

const letterPanel = `
  <h2>Untuk Velin 💌</h2>
  <div class="letter">Halo Velinnn, maaf ya suratnya telat, aku lagi sibuk banget.

Tapi aku mau ucapin selamat ulang tahun ya, sayang. Semoga di umur yang baru ini kamu memperoleh lebih banyak kesempatan dan keberuntungan. Semoga semua masalah yang menimpa kamu segera selesai, dan semoga hal-hal yang kamu rencanakan bisa berjalan dengan baik ya.

Aku bangga bisa punya pasangan sebaik kamu. Terima kasih ya, sayang.

Sekali lagi, selamat ulang tahun, Velin. Aku sayang kamu.</div>
  <div class="sign">— Fadhiil</div>
`;

function showDetail(kind){
  const map = {photos: photosPanel, link: linkPanel, letter: letterPanel};
  document.getElementById('detailContent').innerHTML = map[kind];
  document.getElementById('stageMain').classList.add('hidden');
  document.getElementById('stageDetail').classList.remove('hidden');
}
function showMain(){
  document.getElementById('stageDetail').classList.add('hidden');
  document.getElementById('stageMain').classList.remove('hidden');
}

/* ---- Envelope open + reveal ---- */
function openEnvelope(){
  const wrap = document.getElementById('envWrap');
  if(wrap.classList.contains('open')) return;
  wrap.classList.add('open');
  startSound();
  spawnHearts();
  setTimeout(()=>{
    document.getElementById('stageEnvelope').classList.add('hidden');
    document.getElementById('stageMain').classList.remove('hidden');
  }, 750);
}

function spawnHearts(){
  const emojis = ['💛','💗','✨'];
  for(let i=0;i<14;i++){
    const h = document.createElement('div');
    h.className='heart';
    h.textContent = emojis[i % emojis.length];
    h.style.left = Math.random()*100+'vw';
    h.style.animationDuration = (3+Math.random()*2)+'s';
    h.style.fontSize = (14+Math.random()*14)+'px';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(), 6000);
  }
}

/* ---- Happy Birthday tune (synth, public-domain melody) ---- */
let audioCtx = null;
let soundOn = true;

const BEAT = 0.38;
const notes = [
  [392.00,0.75],[392.00,0.25],[440.00,1],[392.00,1],[523.25,1],[493.88,2],
  [392.00,0.75],[392.00,0.25],[440.00,1],[392.00,1],[587.33,1],[523.25,2],
  [392.00,0.75],[392.00,0.25],[783.99,1],[659.25,1],[523.25,1],[493.88,1],[440.00,2],
  [698.46,0.75],[698.46,0.25],[659.25,1],[523.25,1],[587.33,1],[523.25,2]
];

function playMelody(){
  if(!soundOn || !audioCtx) return;
  let t = audioCtx.currentTime + 0.15;
  notes.forEach(([freq,dur])=>{
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const d = dur*BEAT;
    gain.gain.setValueAtTime(0,t);
    gain.gain.linearRampToValueAtTime(0.22,t+0.03);
    gain.gain.linearRampToValueAtTime(0,t+d-0.04);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t+d);
    t += d;
  });
  const total = notes.reduce((s,[,d])=>s+d,0)*BEAT*1000;
  setTimeout(()=>{ if(soundOn) playMelody(); }, total + 900);
}

function startSound(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    playMelody();
  }catch(e){ /* audio unsupported, fail silently */ }
}

function toggleSound(){
  soundOn = !soundOn;
  const btn = document.getElementById('soundBtn');
  btn.textContent = soundOn ? '🔊 Musik menyala' : '🔈 Musik mati';
  if(soundOn && audioCtx){ if(audioCtx.state==='suspended') audioCtx.resume(); playMelody(); }
}
