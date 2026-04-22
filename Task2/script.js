// ── Wait for GSAP to load then init ──
window.addEventListener('load', function() {

  // Register plugins (available as globals from CDN scripts)
  if (window.gsap && window.Draggable) {
    gsap.registerPlugin(Draggable);
    if (window.MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);
  }

  const BULB_BTN   = document.getElementById('bulb-btn');
  const FORM       = document.getElementById('bulb-form');
  const HIT        = document.getElementById('grab-handle');
  const DUMMY      = document.querySelector('.toggle-scene__dummy-cord');
  const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');
  const CORDS      = document.querySelectorAll('.toggle-scene__cord');
  const futureBody = document.getElementById('future-body');
  const vibeTag    = document.getElementById('vibe-tag');

  const ENDX = DUMMY_CORD.getAttribute('x2');
  const ENDY = DUMMY_CORD.getAttribute('y2');

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  const DARK_FUTURES = [
    '<b>dark &amp; thriving</b><br><br>eyes safe ✓<br>battery saved ✓<br>aesthetic secured ✓<br><br>ur literally built different. dark mode is the main character era fr fr',
    '<b>cozy void era</b><br><br>ur future is dark, mysterious, kinda iconic ngl.<br><br>ur system thanks u. ur eyes thank u. slay.',
    '<b>unbothered. moisturized.</b><br><br>only the elite choose dark mode. ur future? secure. ur vibe? immaculate. period bestie.',
    '<b>battery icon smiling</b><br><br>ur phone: "finally someone who gets it."<br><br>dark mode = free therapy. ur thriving fr. same as ur future btw 🖤',
  ];
  const LIGHT_FUTURES = [
    '<b>bestie. no. 💀</b><br><br>ur future is... bright. TOO bright. ur eyes filed a formal complaint.<br><br>drag the cord. go back. we miss u.',
    '<b>light mode detected</b><br><br>ur eyes rn: 😭<br>ur battery rn: 📉<br>ur future rn: 🔦<br><br>this is not it bestie. not at all.',
    '<b>the audacity 😭</b><br><br>u looked at the dark side and said "nah." bold. unhinged. ur future is literally a flashlight to the face fr.',
    '<b>intervention time</b><br><br>nobody who\'s thriving chooses light mode. this is concerning. drag that cord back RIGHT NOW bestie',
  ];

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (theme === 'light') {
      futureBody.innerHTML = pick(LIGHT_FUTURES);
      vibeTag.textContent  = '⚠️ light mode era (pls reconsider)';
      BULB_BTN.setAttribute('aria-pressed', 'true');
    } else {
      futureBody.innerHTML = pick(DARK_FUTURES);
      vibeTag.textContent  = '✦ calculator era ✦';
      BULB_BTN.setAttribute('aria-pressed', 'false');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    if (document.startViewTransition) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  }

  // ── Click the bulb button directly ──
  BULB_BTN.addEventListener('click', function(e) {
    // only toggle if NOT dragging (drag sets a flag)
    if (!window._wasDragging) toggleTheme();
    window._wasDragging = false;
  });

  // ── GSAP Draggable + MorphSVG ──
  if (!window.gsap || !window.Draggable) {
    console.warn('GSAP not loaded, cord drag unavailable');
    return;
  }

  const CORD_DURATION = 0.1;
  let startX, startY;
  const PROXY = document.createElement('div');

  function RESET() { gsap.set(PROXY, { x: parseFloat(ENDX), y: parseFloat(ENDY) }); }
  RESET();

  // Build morph timeline (only if MorphSVGPlugin loaded)
  let CORD_TL = null;
  if (window.MorphSVGPlugin) {
    CORD_TL = gsap.timeline({
      paused: true,
      onStart: () => {
        toggleTheme();
        gsap.set(DUMMY, { display: 'none' });
        gsap.set(HIT,   { display: 'none' });
        gsap.set(CORDS[0], { display: 'block' });
      },
      onComplete: () => {
        gsap.set(DUMMY, { display: 'block' });
        gsap.set(HIT,   { display: 'block' });
        gsap.set(CORDS[0], { display: 'none' });
        RESET();
      },
    });
    for (let i = 1; i < CORDS.length; i++) {
      CORD_TL.add(gsap.to(CORDS[0], {
        morphSVG: CORDS[i],
        duration: CORD_DURATION,
        repeat: 1,
        yoyo: true,
      }));
    }
  }

  Draggable.create(PROXY, {
    trigger: HIT,
    type: 'x,y',
    onPress: function(e) {
      startX = e.clientX;
      startY = e.clientY;
      window._wasDragging = false;
    },
    onDragStart: function() {
      document.body.style.cursor = 'grabbing';
      window._wasDragging = true;
    },
    onDrag: function() {
      const ratio = 1 / ((FORM.offsetWidth * 0.65) / 134);
      gsap.set(DUMMY_CORD, {
        attr: {
          x2: parseFloat(ENDX) + (this.x - parseFloat(ENDX)) * ratio,
          y2: parseFloat(ENDY) + (this.y - parseFloat(ENDY)) * ratio,
        }
      });
    },
    onRelease: function(e) {
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      const dist = Math.sqrt(dx * dx + dy * dy);
      document.body.style.cursor = '';

      gsap.to(DUMMY_CORD, {
        attr: { x2: ENDX, y2: ENDY },
        duration: CORD_DURATION,
        onComplete: () => {
          if (dist > 50) {
            if (CORD_TL) {
              CORD_TL.restart();
            } else {
              toggleTheme();
            }
          } else {
            RESET();
          }
          setTimeout(() => { window._wasDragging = false; }, 100);
        }
      });
    },
  });

}); // end window.load


// ── CALCULATOR LOGIC ──
const display = document.getElementById('display');
const expr    = document.getElementById('expr');
const vibe    = document.getElementById('vibe');
let cur = '0', prev = '', op = null, justEvaled = false;

// sound
const fahSound = document.getElementById('fahSound');

const shadeComments = [
  "bestie... a calculator. for THAT. 💀",
  "ur math teacher is somewhere crying rn",
  "the audacity to open an app for this fr",
  "even my 7yo cousin knows this one",
  "calculator for THAT? we are not the same",
  "this is giving 'failed 2nd grade' energy no offense",
  "bro. bro. BRO. 😭",
  "i literally cannot rn bestie",
  "not the calculator having a moment for THIS math",
];
const darkVibes = {
  big:  ["big number dark era","ur in ur villain arc slay","numerically unstoppable fr"],
  zero: ["void. nothing. dark energy.","zero is the darkest number bestie","null vibes only ✓"],
  neg:  ["negative era but make it aesthetic","in ur flop arc but cozy tho","below zero. iconic."],
  eq:   ["understood the assignment","dark mode mathematician era","giving galaxy-brain fr"],
  dec:  ["decimal era. precise. mysterious.","fraction bestie in the void","not a whole vibe and that's ok"],
  def:  ["calculate in darkness fr","ur doing amazing sweetie","the void approves"],
};
const lightVibes = {
  big:  ["big number blinding era 💀","even ur numbers are too bright rn","this many digits in light mode? unwell"],
  zero: ["zero dark mode points bestie","nothing. like ur taste in themes rn","void but make it painful"],
  neg:  ["negative like ur battery rn","down bad era but make it bright","in the red. switch themes."],
  eq:   ["correct answer, wrong theme bestie","math understood. theme? not so much.","solved it. now solve the light mode problem."],
  dec:  ["decimal? in light mode? the nerve","precise but also blinding fr","fraction era but at what cost"],
  def:  ["this would hit harder in dark mode","ur eyes rn 😭","calculate faster so u can go back"],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function isDark()  { return document.documentElement.dataset.theme !== 'light'; }
function vset()    { return isDark() ? darkVibes : lightVibes; }

function isSimple(a, b) {
  return Math.abs(parseFloat(a)) <= 99 && Math.abs(parseFloat(b)) <= 99
    && Number.isInteger(parseFloat(a)) && Number.isInteger(parseFloat(b));
}
function setVibeAfterEval(a, b, result) {
  if (isSimple(a, b)) {
    vibe.textContent = pick(shadeComments);
    vibe.className = 'vibe-msg shade';
  } else {
    const n = parseFloat(result), v = vset();
    const msg = result.includes('.') ? pick(v.dec)
      : isNaN(n)          ? pick(v.def)
      : n === 0            ? pick(v.zero)
      : n < 0              ? pick(v.neg)
      : Math.abs(n)>999999 ? pick(v.big) : pick(v.eq);
    vibe.textContent = msg;
    vibe.className = 'vibe-msg lit';
  }
  setTimeout(() => { vibe.className = 'vibe-msg'; }, 3000);
}
function setVibeMsg(val) {
  const n = parseFloat(val), v = vset();
  const msg = val.includes('.') ? pick(v.dec)
    : isNaN(n)          ? pick(v.def)
    : n === 0            ? pick(v.zero)
    : n < 0              ? pick(v.neg)
    : Math.abs(n)>999999 ? pick(v.big) : pick(v.def);
  vibe.textContent = msg;
  vibe.className = 'vibe-msg lit';
  setTimeout(() => vibe.className = 'vibe-msg', 1200);
}
function updateDisplay(val) {
  display.textContent = val;
  const len = val.length;
  display.className = 'display-main' + (len > 10 ? ' xsmall' : len > 7 ? ' small' : '');
  rotateBadges();
}
const darkBadges  = ['no cap','math era','fr fr','bussin','void mode','understood','dark side','it is what it is','thriving','cozy'];
const lightBadges = ['bestie no','light mode??','my eyes 😭','unwell','go back','why tho','too bright','pls stop','concerning','intervention'];
function rotateBadges() {
  const tags = isDark() ? darkBadges : lightBadges;
  ['b1','b2','b3'].forEach(id => {
    document.getElementById(id).textContent = pick(tags);
    document.getElementById(id).className = 'badge';
  });
  document.getElementById('b' + (Math.floor(Math.random() * 3) + 1)).className = 'badge active';
}
function compute(a, b, o) {
  a = parseFloat(a); b = parseFloat(b);
  if (o === '+') return a + b;
  if (o === '−') return a - b;
  if (o === '×') return a * b;
  if (o === '÷') return b !== 0 ? a / b : NaN;
  return b;
}
function fmt(n) {
  if (isNaN(n))      return 'lol no';
  if (!isFinite(n))  return n > 0 ? 'way too big' : 'way too small';
  let s = String(parseFloat(n.toPrecision(10)));
  if (s.length > 12) s = parseFloat(n).toExponential(4);
  return s;
}
function handleKey(val) {
  if (val === 'AC') {
    cur = '0'; prev = ''; op = null; justEvaled = false;
    expr.textContent = ''; updateDisplay('0');
    vibe.textContent = isDark() ? 'cleared. void restored.' : 'cleared. now clear ur theme choice bestie.';
    vibe.className = 'vibe-msg lit';
    setTimeout(() => vibe.className = 'vibe-msg', 1500);
    return;
  }
  if (val === '+/-') { cur = fmt(parseFloat(cur) * -1); updateDisplay(cur); setVibeMsg(cur); return; }
  if (val === '%')   { cur = fmt(parseFloat(cur) / 100); updateDisplay(cur); setVibeMsg(cur); return; }
  if (['+','−','×','÷'].includes(val)) {
    if (op && !justEvaled) {
      const res = fmt(compute(prev, cur, op));
      prev = res; cur = '0'; expr.textContent = prev + ' ' + val; updateDisplay(prev);
    } else { prev = cur; cur = '0'; expr.textContent = prev + ' ' + val; }
    op = val; justEvaled = false; return;
  }
  if (val === '=') {
  if (!op) return;

 // 🔊 PLAY SOUND (correct)
fahSound.currentTime = 0;
fahSound.volume = 1;
fahSound.play().catch(() => {});
    
  const sp = prev, sc = cur;
  const res = fmt(compute(prev, cur, op));
  expr.textContent = prev + ' ' + op + ' ' + cur + ' =';
  cur = res; prev = ''; op = null; justEvaled = true;
  updateDisplay(cur);
  setVibeAfterEval(sp, sc, cur);
  return;
}
  if (val === '.') {
    if (justEvaled) { cur = '0'; justEvaled = false; }
    if (!cur.includes('.')) cur += '.';
    updateDisplay(cur); return;
  }
  if (justEvaled) { cur = ''; justEvaled = false; }
  if (cur === '0') cur = val; else cur += val;
  if (cur.length > 12) return;
  updateDisplay(cur);
}

document.querySelectorAll('.key').forEach(k => {
  k.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = this.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left - 30) + 'px';
    r.style.top  = (e.clientY - rect.top  - 30) + 'px';
    this.appendChild(r);
    setTimeout(() => r.remove(), 400);
    handleKey(this.dataset.val);
  });
});
document.addEventListener('keydown', e => {
  const map = {'0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
    '+':'+','-':'−','*':'×','/':'÷','Enter':'=','=':'=','.':'.','Backspace':'AC','Escape':'AC','%':'%'};
  if (map[e.key]) handleKey(map[e.key]);
});
