/* ============================================================
   Hugos Block-Abenteuer — App-Logik (Version 5.0)
   Vier Schwierigkeitsstufen (bis 100, Einmaleins, Halbieren),
   interaktive Baustelle mit Block-Vorrat, Kreativ-Modus,
   Boss-Fights, Biome, Progression, Fehler-Wiederholung.
   ============================================================ */

(function () {
  'use strict';

  // ---------- Assets ----------
  var A = 'assets/minecraft/';
  var ASSETS = {
    blocks: {
      grass: A + 'blocks/grass.png',
      dirt: A + 'blocks/dirt.png',
      stone: A + 'blocks/stone.png',
      cobblestone: A + 'blocks/cobblestone.png',
      sand: A + 'blocks/sand.png',
      snowGrass: A + 'blocks/snow_grass.png',
      netherrack: A + 'blocks/netherrack.png',
      obsidian: A + 'blocks/obsidian.png',
      glowstone: A + 'blocks/glowstone.png',
      brick: A + 'blocks/brick.png',
      planks: A + 'blocks/planks_oak.png',
      logOak: A + 'blocks/log_oak.png',
      leavesOak: A + 'blocks/leaves_oak.png',
      diamondOre: A + 'blocks/diamond_ore.png',
      ironOre: A + 'blocks/iron_ore.png',
      goldOre: A + 'blocks/gold_ore.png',
      emeraldOre: A + 'blocks/emerald_ore.png'
    },
    items: {
      diamond: A + 'items/diamond.png',
      emerald: A + 'items/emerald.png',
      gold_ingot: A + 'items/gold_ingot.png',
      iron_ingot: A + 'items/iron_ingot.png',
      apple: A + 'items/apple.png',
      apple_golden: A + 'items/apple_golden.png',
      xp_bottle: A + 'items/experience_bottle.png',
      book: A + 'items/book.png'
    },
    mobs: {
      steve: A + 'mobs/steve_face.png',
      creeper: A + 'mobs/creeper_face.png',
      zombie: A + 'mobs/zombie_face.png',
      skeleton: A + 'mobs/skeleton_face.png'
    },
    ui: {
      heart: A + 'ui/heart.png',
      heartHalf: A + 'ui/heart_half.png',
      heartBg: A + 'ui/heart_background.png',
      xpEmpty: A + 'ui/xp_bar_empty.png',
      xpFull: A + 'ui/xp_bar_full.png'
    }
  };

  var ITEM_NAMES = {
    diamond: ['Diamant', 'Diamanten'],
    emerald: ['Smaragd', 'Smaragde'],
    gold_ingot: ['Goldbarren', 'Goldbarren'],
    iron_ingot: ['Eisenbarren', 'Eisenbarren'],
    apple: ['Apfel', '\u00c4pfel'],
    apple_golden: ['Goldener Apfel', 'Goldene \u00c4pfel']
  };

  var BLOCK_NAMES = {
    grass: 'Grasblock', dirt: 'Erde', stone: 'Stein', cobblestone: 'Bruchstein',
    sand: 'Sand', snowGrass: 'Schneeblock', netherrack: 'Netherrack',
    obsidian: 'Obsidian', glowstone: 'Leuchtstein', brick: 'Ziegel',
    planks: 'Holzbretter', logOak: 'Holzstamm', leavesOak: 'Eichenlaub',
    diamondOre: 'Diamanterz', ironOre: 'Eisenerz', goldOre: 'Golderz',
    emeraldOre: 'Smaragderz'
  };

  var COUNT_ITEMS = ['diamond', 'emerald', 'apple', 'gold_ingot'];

  var SESSION_LENGTH = 8;
  var XP_PER_LEVEL = 100;

  var PICKAXES = [
    { src: A + 'items/wood_pickaxe.png', name: 'Holz-Spitzhacke' },
    { src: A + 'items/stone_pickaxe.png', name: 'Stein-Spitzhacke' },
    { src: A + 'items/iron_pickaxe.png', name: 'Eisen-Spitzhacke' },
    { src: A + 'items/gold_pickaxe.png', name: 'Gold-Spitzhacke' },
    { src: A + 'items/diamond_pickaxe.png', name: 'Diamant-Spitzhacke' }
  ];
  function pickaxeForLevel(level) { return PICKAXES[Math.min(level - 1, PICKAXES.length - 1)]; }

  var BOSSES = [
    { id: 'creeper', name: 'Creeper' },
    { id: 'zombie', name: 'Zombie' },
    { id: 'skeleton', name: 'Skelett' }
  ];
  var BOSS_HP = 3;
  var BOSS_XP = 25;
  var STREAK_BONUS_EVERY = 5;
  var STREAK_BONUS_XP = 5;

  var BIOMES = [
    { id: 'forest', name: 'Wald', blockKey: 'grass', minLevel: 1 },
    { id: 'cave', name: 'H\u00f6hle', blockKey: 'stone', minLevel: 2 },
    { id: 'desert', name: 'W\u00fcste', blockKey: 'sand', minLevel: 3 },
    { id: 'snow', name: 'Schnee', blockKey: 'snowGrass', minLevel: 4 },
    { id: 'nether', name: 'Nether', blockKey: 'netherrack', minLevel: 5 }
  ];
  function biomeById(id) {
    for (var i = 0; i < BIOMES.length; i++) if (BIOMES[i].id === id) return BIOMES[i];
    return BIOMES[0];
  }

  // ---------- Build projects (bottom-up placement) ----------
  var BUILD_PROJECTS = [
    {
      id: 'treehouse', name: 'Baumhaus',
      map: { L: 'leavesOak', P: 'planks', T: 'logOak', G: 'glowstone' },
      rows: [
        '.LLLLL.',
        'LLLLLLL',
        'LLPPPLL',
        '.PPGPP.',
        '..PPP..',
        '...T...',
        '...T...',
        '...T...'
      ]
    },
    {
      id: 'cavemine', name: 'Mine',
      map: { S: 'stone', C: 'cobblestone', D: 'diamondOre', I: 'ironOre', O: 'goldOre', G: 'glowstone' },
      rows: [
        'SSSSSSSS',
        'SD....IS',
        'S..GG..S',
        'S......S',
        'SI....DS',
        'S..OO..S',
        'CCCCCCCC'
      ]
    },
    {
      id: 'desertpalace', name: 'W\u00fcsten-Palast',
      map: { B: 'brick', S: 'sand', G: 'glowstone' },
      rows: [
        'B.B.B.B.B',
        'BBBBBBBBB',
        '.S..G..S.',
        '.S.....S.',
        '.SSSSSSS.',
        '.S..G..S.',
        '.SS...SS.'
      ]
    },
    {
      id: 'snowigloo', name: 'Schnee-Iglu',
      map: { W: 'snowGrass', G: 'glowstone' },
      rows: [
        '..WWWW..',
        '.WWWWWW.',
        'WWWGGWWW',
        'WW....WW',
        'WW....WW',
        'WWWW.WWW'
      ]
    },
    {
      id: 'netherfort', name: 'Nether-Festung',
      map: { N: 'netherrack', O: 'obsidian', G: 'glowstone' },
      rows: [
        'O.O...O.O',
        'OOOOOOOOO',
        'ONG...GNO',
        'ON.....NO',
        'ON.....NO',
        'NNNNNNNNN',
        'O.......O'
      ]
    }
  ];

  BUILD_PROJECTS.forEach(function (p) {
    p.order = [];
    for (var r = p.rows.length - 1; r >= 0; r--) {
      for (var c = 0; c < p.rows[r].length; c++) {
        var ch = p.rows[r][c];
        if (ch !== '.') p.order.push({ r: r, c: c, key: p.map[ch] });
      }
    }
    p.total = p.order.length;
  });

  // ---------- Creative mode ----------
  var CREATIVE_COLS = 12;
  var CREATIVE_ROWS = 8;
  var CREATIVE_PALETTE = ['grass', 'dirt', 'stone', 'planks', 'logOak', 'leavesOak', 'sand', 'brick', 'glowstone', 'obsidian'];

  // ---------- State ----------
  var STORAGE_KEY = 'hugos-block-abenteuer-v1';

  function defaultState() {
    return {
      xp: 0,
      biome: 'forest',
      difficulty: 'leicht',
      inventory: {},
      build: { projectIndex: 0, placed: 0, vorrat: 0, free: 0, seen: 0, completed: [], freeGranted: false },
      creative: { grid: [], sel: 'grass' },
      stats: { answered: 0, correct: 0, byType: {}, sessions: 0, bestStreak: 0 },
      mistakes: []
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var s = Object.assign(defaultState(), JSON.parse(raw));
      var d = defaultState();
      s.stats = Object.assign(d.stats, s.stats || {});
      s.build = Object.assign(d.build, s.build || {});
      s.creative = Object.assign(d.creative, s.creative || {});
      if (!s.biome) s.biome = 'forest';
      if (!s.difficulty) s.difficulty = 'leicht';
      // One-time grant: retroactive creative blocks for everything already solved
      if (!s.build.freeGranted) {
        s.build.free = (s.build.free || 0) + Math.min(s.stats.correct || 0, 40);
        s.build.freeGranted = true;
      }
      if (!s.creative.grid || s.creative.grid.length !== CREATIVE_COLS * CREATIVE_ROWS) {
        s.creative.grid = new Array(CREATIVE_COLS * CREATIVE_ROWS).fill(null);
      }
      return s;
    } catch (e) { return defaultState(); }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = loadState();
  if (!state.creative.grid.length) state.creative.grid = new Array(CREATIVE_COLS * CREATIVE_ROWS).fill(null);

  function currentProject() {
    return BUILD_PROJECTS[state.build.projectIndex % BUILD_PROJECTS.length];
  }

  function levelOf(xp) { return Math.floor(xp / XP_PER_LEVEL) + 1; }
  function xpInLevel(xp) { return xp % XP_PER_LEVEL; }

  // ---------- Helpers ----------
  function $(id) { return document.getElementById(id); }
  function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[rnd(0, arr.length - 1)]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = rnd(0, i);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function img(src, cls) {
    var e = document.createElement('img');
    e.src = src; e.alt = '';
    if (cls) e.className = cls;
    return e;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // Options around the correct answer; offsets define plausible distractors
  function makeOptions(correct, min, max, offsets) {
    var opts = [correct];
    var cands = shuffle(offsets.map(function (o) { return correct + o; }));
    for (var i = 0; i < cands.length && opts.length < 3; i++) {
      var c = cands[i];
      if (c >= min && c <= max && opts.indexOf(c) === -1) opts.push(c);
    }
    var f = Math.max(min, correct - 3);
    while (opts.length < 3 && f <= max) {
      if (opts.indexOf(f) === -1) opts.push(f);
      f++;
    }
    return shuffle(opts);
  }

  // ---------- Task generator ----------
  function genCount() {
    var n = rnd(2, 9);
    var item = pick(COUNT_ITEMS);
    return {
      type: 'count', item: item, n: n,
      question: 'Wie viele ' + ITEM_NAMES[item][1] + ' siehst du?',
      speak: 'Wie viele ' + ITEM_NAMES[item][1] + ' siehst du?',
      correct: n, options: makeOptions(n, 1, 10, [-2, -1, 1, 2]), kind: 'number'
    };
  }

  function genAdd(diff) {
    var a, b;
    if (diff === 'leicht') { a = rnd(1, 9); b = rnd(1, Math.min(9, 10 - a)); }
    else if (diff === 'mittel') { a = rnd(2, 15); b = rnd(2, Math.min(18, 20 - a)); }
    else if (diff === 'schwer') {
      // Up to 100, biased towards friendly tens
      if (Math.random() < 0.5) { a = rnd(1, 9) * 10; b = rnd(2, Math.min(60, 100 - a)); }
      else { a = rnd(11, 79); b = rnd(2, Math.min(20, 100 - a)); }
    } else { a = rnd(13, 87); b = rnd(6, Math.min(86, 100 - a)); }
    var item = pick(COUNT_ITEMS);
    var big = (a + b) > 20;
    return {
      type: 'add', a: a, b: b, item: item,
      question: 'Rechne aus:',
      speak: 'Was ist ' + a + ' plus ' + b + '?',
      equation: a + ' + ' + b + ' = ?',
      correct: a + b,
      options: makeOptions(a + b, 0, 200, big ? [-10, -1, 1, 10, 2] : [-2, -1, 1, 2, 3]),
      kind: 'number'
    };
  }

  function genSub(diff) {
    var a, b;
    if (diff === 'leicht') { a = rnd(3, 10); b = rnd(1, a - 1); }
    else if (diff === 'mittel') { a = rnd(5, 20); b = rnd(2, a - 1); }
    else if (diff === 'schwer') {
      if (Math.random() < 0.5) { a = rnd(3, 10) * 10; b = rnd(2, Math.min(40, a - 1)); }
      else { a = rnd(25, 99); b = rnd(2, 20); }
    } else { a = rnd(30, 100); b = rnd(7, a - 1); }
    var item = pick(COUNT_ITEMS);
    var big = a > 20;
    return {
      type: 'sub', a: a, b: b, item: item,
      question: 'Rechne aus:',
      speak: 'Was ist ' + a + ' minus ' + b + '?',
      equation: a + ' \u2212 ' + b + ' = ?',
      correct: a - b,
      options: makeOptions(a - b, 0, 100, big ? [-10, -1, 1, 10, 2] : [-2, -1, 1, 2, 3]),
      kind: 'number'
    };
  }

  function genCompare() {
    var item = pick(COUNT_ITEMS);
    var left = rnd(1, 9);
    var right;
    if (Math.random() < 0.2) right = left;
    else {
      right = rnd(1, 9);
      if (right === left) right = (left < 9) ? left + 1 : left - 1;
    }
    var correct = left > right ? 'links' : (right > left ? 'rechts' : 'gleich');
    return {
      type: 'compare', item: item, left: left, right: right,
      question: 'Wo sind mehr ' + ITEM_NAMES[item][1] + '?',
      speak: 'Wo sind mehr ' + ITEM_NAMES[item][1] + '? Links, rechts, oder sind es gleich viele?',
      correct: correct, options: ['links', 'rechts', 'gleich'],
      labels: { links: 'Links', rechts: 'Rechts', gleich: 'Gleich viele' },
      kind: 'word'
    };
  }

  function genDouble(diff) {
    var n = (diff === 'schwer' || diff === 'profi') ? rnd(6, 50) : rnd(2, 10);
    var item = pick(COUNT_ITEMS);
    return {
      type: 'double', a: n, b: n, item: item,
      question: 'Verdopple!',
      speak: 'Was ist das Doppelte von ' + n + '?',
      equation: n + ' + ' + n + ' = ?',
      correct: 2 * n,
      options: makeOptions(2 * n, 2, 200, n > 10 ? [-10, -2, 2, 10, 1] : [-2, -1, 1, 2]),
      kind: 'number'
    };
  }

  function genHalf() {
    var n = rnd(3, 50) * 2; // even, 6..100
    return {
      type: 'half', n: n,
      question: 'Halbiere!',
      speak: 'Was ist die H\u00e4lfte von ' + n + '?',
      equation: n + ' : 2 = ?',
      correct: n / 2,
      options: makeOptions(n / 2, 1, 100, [-10, -2, -1, 1, 2, 10]),
      kind: 'number'
    };
  }

  function genMissing(diff) {
    var c = (diff === 'profi') ? rnd(20, 100) : rnd(6, 20);
    var a = rnd(1, c - 1);
    return {
      type: 'missing', a: a, c: c,
      question: 'Welche Zahl fehlt?',
      speak: a + ' plus wie viel ist ' + c + '?',
      equation: a + ' + ? = ' + c,
      correct: c - a,
      options: makeOptions(c - a, 0, 100, c > 20 ? [-10, -1, 1, 10, 2] : [-2, -1, 1, 2]),
      kind: 'number'
    };
  }

  function genMul(diff) {
    var f, n;
    if (diff === 'profi') { f = rnd(2, 10); n = rnd(2, 10); }
    else { f = pick([2, 3, 4, 5, 10]); n = rnd(1, 10); }
    return {
      type: 'mul', f: f, n: n,
      question: 'Rechne aus:',
      speak: 'Was ist ' + f + ' mal ' + n + '?',
      equation: f + ' \u00b7 ' + n + ' = ?',
      correct: f * n,
      options: makeOptions(f * n, 0, 110, [-f, f, -n, n, f + n]),
      kind: 'number'
    };
  }

  var SESSION_PLANS = {
    leicht: ['count', 'count', 'add', 'add', 'add', 'sub', 'sub', 'compare'],
    mittel: ['count', 'add', 'add', 'sub', 'sub', 'double', 'add', 'compare'],
    schwer: ['add', 'add', 'sub', 'sub', 'double', 'missing', 'mul', 'mul'],
    profi: ['add', 'add', 'sub', 'sub', 'missing', 'mul', 'mul', 'half']
  };

  function genByType(t, diff) {
    if (t === 'count') return genCount();
    if (t === 'add') return genAdd(diff);
    if (t === 'sub') return genSub(diff);
    if (t === 'compare') return genCompare();
    if (t === 'double') return genDouble(diff);
    if (t === 'missing') return genMissing(diff);
    if (t === 'half') return genHalf();
    return genMul(diff);
  }

  function taskFromSignature(sig) {
    var m;
    if ((m = sig.match(/^(\d+)\+(\d+)$/))) {
      var a = +m[1], b = +m[2], item = pick(COUNT_ITEMS);
      var big = (a + b) > 20;
      return {
        type: 'add', a: a, b: b, item: item, review: true,
        question: 'Rechne aus:', speak: 'Was ist ' + a + ' plus ' + b + '?',
        equation: a + ' + ' + b + ' = ?', correct: a + b,
        options: makeOptions(a + b, 0, 200, big ? [-10, -1, 1, 10, 2] : [-2, -1, 1, 2]),
        kind: 'number'
      };
    }
    if ((m = sig.match(/^(\d+)-(\d+)$/))) {
      var a2 = +m[1], b2 = +m[2], item2 = pick(COUNT_ITEMS);
      var big2 = a2 > 20;
      return {
        type: 'sub', a: a2, b: b2, item: item2, review: true,
        question: 'Rechne aus:', speak: 'Was ist ' + a2 + ' minus ' + b2 + '?',
        equation: a2 + ' \u2212 ' + b2 + ' = ?', correct: a2 - b2,
        options: makeOptions(a2 - b2, 0, 100, big2 ? [-10, -1, 1, 10, 2] : [-2, -1, 1, 2]),
        kind: 'number'
      };
    }
    if ((m = sig.match(/^(\d+)x(\d+)$/))) {
      var f = +m[1], n = +m[2];
      return {
        type: 'mul', f: f, n: n, review: true,
        question: 'Rechne aus:', speak: 'Was ist ' + f + ' mal ' + n + '?',
        equation: f + ' \u00b7 ' + n + ' = ?', correct: f * n,
        options: makeOptions(f * n, 0, 110, [-f, f, -n, n]),
        kind: 'number'
      };
    }
    return null;
  }

  function genSession(diff, mistakes) {
    diff = diff || 'leicht';
    var plan = shuffle(SESSION_PLANS[diff] || SESSION_PLANS.leicht);
    var tasks = plan.map(function (t) { return genByType(t, diff); });
    if (mistakes && mistakes.length) {
      var sigs = [];
      for (var i = mistakes.length - 1; i >= 0 && sigs.length < 2; i--) {
        var sig = mistakes[i].task;
        if (sigs.indexOf(sig) === -1) {
          var rt = taskFromSignature(sig);
          if (rt) { sigs.push(sig); tasks[rnd(0, tasks.length - 1)] = rt; }
        }
      }
    }
    return tasks;
  }

  function taskSignature(t) {
    if (t.type === 'count') return 'count:' + t.n;
    if (t.type === 'add' || t.type === 'double') return t.a + '+' + t.b;
    if (t.type === 'sub') return t.a + '-' + t.b;
    if (t.type === 'missing') return t.a + '+' + (t.c - t.a);
    if (t.type === 'mul') return t.f + 'x' + t.n;
    if (t.type === 'half') return t.n + '-' + (t.n / 2);
    return 'compare:' + t.left + ':' + t.right;
  }

  // Expose for automated testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      genSession: genSession, genAdd: genAdd, genSub: genSub, genDouble: genDouble,
      genHalf: genHalf, genMissing: genMissing, genMul: genMul, genCount: genCount,
      genCompare: genCompare, taskFromSignature: taskFromSignature,
      BUILD_PROJECTS: BUILD_PROJECTS, SESSION_PLANS: SESSION_PLANS
    };
    return;
  }

  // ---------- Screen management ----------
  var screens = ['screen-start', 'screen-practice', 'screen-inventory', 'screen-parent', 'screen-worldmap', 'screen-build', 'screen-creative'];
  function show(id) {
    screens.forEach(function (s) { $(s).classList.toggle('active', s === id); });
    var block = (id === 'screen-practice')
      ? ASSETS.blocks[biomeById(state.biome).blockKey]
      : ASSETS.blocks.dirt;
    document.documentElement.style.backgroundImage = "url('" + block + "')";
    window.scrollTo(0, 0);
  }
  function showOverlay(id, on) { $(id).classList.toggle('active', on); }

  // ---------- Speech ----------
  function speak(text) {
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ---------- Session ----------
  var session = null;

  function startSession() {
    session = {
      tasks: genSession(state.difficulty, state.mistakes),
      index: 0,
      phase: 'tasks',
      boss: BOSSES[state.stats.sessions % BOSSES.length],
      bossHp: BOSS_HP,
      bossDefeated: false,
      halfHearts: 10,
      earnedBlocks: {},
      earnedItems: {},
      earnedVorrat: 0,
      earnedFree: 0,
      xpGained: 0,
      streak: 0,
      pendingLevelUp: null,
      firstTry: true,
      locked: false
    };
    show('screen-practice');
    renderHUD();
    renderTask();
  }

  function genBossTasks(n) {
    var arr = [], diff = state.difficulty;
    for (var i = 0; i < n; i++) arr.push(Math.random() < 0.5 ? genAdd(diff) : genSub(diff));
    return arr;
  }

  function startBoss() {
    session.phase = 'boss';
    session.tasks = genBossTasks(BOSS_HP);
    session.index = 0;
    session.bossHp = BOSS_HP;
    renderTask();
  }

  function currentTask() { return session.tasks[session.index]; }

  // ---------- Block economy ----------
  // Every correct answer: +1 Vorrat block (capped at remaining blueprint) and +1 free block.
  function earnBlocks() {
    var p = currentProject();
    var remaining = p.total - (state.build.placed + state.build.vorrat);
    var earnedKey = null;
    if (remaining > 0) {
      var idx = state.build.placed + state.build.vorrat;
      earnedKey = p.order[idx].key;
      state.build.vorrat++;
      session.earnedVorrat++;
      session.earnedBlocks[earnedKey] = (session.earnedBlocks[earnedKey] || 0) + 1;
    }
    state.build.free++;
    session.earnedFree++;
    return earnedKey;
  }

  // ---------- HUD ----------
  function renderHUD() {
    var hearts = $('hud-hearts');
    clear(hearts);
    for (var i = 0; i < 5; i++) {
      var slot = el('div', 'heart-slot');
      slot.appendChild(img(ASSETS.ui.heartBg));
      var hh = session.halfHearts - i * 2;
      if (hh >= 2) slot.appendChild(img(ASSETS.ui.heart));
      else if (hh === 1) slot.appendChild(img(ASSETS.ui.heartHalf));
      hearts.appendChild(slot);
    }
    $('hud-progress').textContent = (session.phase === 'boss')
      ? 'Boss-Kampf!'
      : 'Aufgabe ' + (session.index + 1) + ' / ' + session.tasks.length;
    $('hud-streak').textContent = session.streak >= 2 ? 'Serie: ' + session.streak : '';
    renderBuildCounter();
    renderXpBar();
  }

  function renderBuildCounter() {
    var p = currentProject();
    var txt = p.name + ': ' + state.build.placed + ' / ' + p.total;
    if (state.build.vorrat > 0) txt += '  \u00b7  Vorrat: ' + state.build.vorrat;
    $('hud-build').textContent = txt;
  }

  function renderXpBar() {
    $('hud-level-label').textContent = 'Level ' + levelOf(state.xp);
    var pct = xpInLevel(state.xp) / XP_PER_LEVEL;
    $('xp-fill-clip').style.width = Math.round(240 * pct) + 'px';
  }

  // ---------- Task rendering ----------
  function renderItemRow(container, item, n, fadedFrom) {
    for (var i = 0; i < n; i++) {
      var im = img(ASSETS.items[item]);
      if (fadedFrom !== undefined && i >= fadedFrom) im.classList.add('faded');
      container.appendChild(im);
    }
  }

  function renderTask() {
    var t = currentTask();
    session.firstTry = true;
    session.locked = false;

    var bossArea = $('boss-area');
    if (session.phase === 'boss') {
      bossArea.style.display = 'flex';
      $('boss-img').src = ASSETS.mobs[session.boss.id];
      $('boss-name').textContent = session.boss.name;
      renderBossHearts();
    } else {
      bossArea.style.display = 'none';
    }

    $('task-question').textContent = (t.review ? 'Nochmal \u00fcben: ' : '') + t.question;
    var vis = $('task-visual');
    var eq = $('task-equation');
    clear(vis);
    eq.textContent = '';

    if (t.type === 'count') {
      renderItemRow(vis, t.item, t.n);
    } else if (t.type === 'add' || t.type === 'double') {
      if (t.a <= 10 && t.b <= 10) {
        var gA = el('div', 'group'); renderItemRow(gA, t.item, t.a);
        var gB = el('div', 'group'); renderItemRow(gB, t.item, t.b);
        vis.appendChild(gA);
        vis.appendChild(el('div', 'op', '+'));
        vis.appendChild(gB);
      }
      eq.textContent = t.equation;
    } else if (t.type === 'sub') {
      if (t.a <= 12) {
        var g = el('div', 'group');
        renderItemRow(g, t.item, t.a, t.a - t.b);
        vis.appendChild(g);
      }
      eq.textContent = t.equation;
    } else if (t.type === 'missing' || t.type === 'mul' || t.type === 'half') {
      eq.textContent = t.equation;
    } else if (t.type === 'compare') {
      [['Links', t.left], ['Rechts', t.right]].forEach(function (s) {
        var side = el('div', 'compare-side');
        side.appendChild(el('div', 'side-name', s[0]));
        var gg = el('div', 'group');
        renderItemRow(gg, t.item, s[1]);
        side.appendChild(gg);
        vis.appendChild(side);
      });
    }

    var answers = $('answers');
    clear(answers);
    t.options.forEach(function (opt) {
      var btn = el('button', 'mc-btn answer' + (t.kind === 'word' ? ' word' : ''));
      var span = el('span', null, t.kind === 'word' ? t.labels[opt] : String(opt));
      btn.appendChild(span);
      btn.addEventListener('click', function () { onAnswer(btn, opt); });
      answers.appendChild(btn);
    });

    renderHUD();
  }

  // ---------- Answer handling ----------
  function onAnswer(btn, opt) {
    if (session.locked) return;
    var t = currentTask();
    var correct = (opt === t.correct);

    state.stats.answered++;
    if (!state.stats.byType[t.type]) state.stats.byType[t.type] = { answered: 0, correct: 0 };
    state.stats.byType[t.type].answered++;

    if (correct) {
      session.locked = true;
      btn.classList.add('correct');
      state.stats.correct++;
      state.stats.byType[t.type].correct++;

      if (session.firstTry) {
        session.streak++;
        if (session.streak > state.stats.bestStreak) state.stats.bestStreak = session.streak;
      }

      var levelBefore = levelOf(state.xp);
      var xp = session.firstTry ? 10 : 5;
      var bonusDiamond = false;
      var bonus = 0;
      if (session.firstTry && session.streak > 0 && session.streak % STREAK_BONUS_EVERY === 0) {
        bonus = STREAK_BONUS_XP;
        bonusDiamond = true;
        state.inventory.diamond = (state.inventory.diamond || 0) + 1;
        session.earnedItems.diamond = (session.earnedItems.diamond || 0) + 1;
      }
      state.xp += xp + bonus;
      session.xpGained += xp + bonus;
      if (levelOf(state.xp) > levelBefore) session.pendingLevelUp = levelOf(state.xp);

      var earnedKey = earnBlocks();
      saveState();
      flyBlock(btn, earnedKey ? ASSETS.blocks[earnedKey] : ASSETS.blocks.planks);
      renderBuildCounter();

      if (session.phase === 'boss') {
        session.bossHp--;
        renderBossHearts();
        bossHitAnimation();
        renderHUD();
        setTimeout(function () {
          if (session.bossHp <= 0) {
            session.bossDefeated = true;
            state.xp += BOSS_XP;
            session.xpGained += BOSS_XP;
            state.inventory.apple_golden = (state.inventory.apple_golden || 0) + 1;
            session.earnedItems.apple_golden = (session.earnedItems.apple_golden || 0) + 1;
            if (levelOf(state.xp) > levelOf(state.xp - BOSS_XP)) session.pendingLevelUp = levelOf(state.xp);
            saveState();
            showBossWin();
          } else {
            nextTask();
          }
        }, 900);
      } else {
        setTimeout(function () { showReward(earnedKey, xp + bonus, bonusDiamond); }, 550);
      }
    } else {
      btn.classList.add('wrong');
      btn.disabled = true;
      session.firstTry = false;
      session.streak = 0;
      if (session.halfHearts > 0) session.halfHearts--;
      state.mistakes.push({ type: t.type, task: taskSignature(t), ts: Date.now() });
      if (state.mistakes.length > 200) state.mistakes = state.mistakes.slice(-200);
      saveState();
      renderHUD();
      setTimeout(function () { showExplanation(t); }, 600);
    }
  }

  // ---------- Flying block ----------
  function flyBlock(fromEl, src) {
    try {
      var from = fromEl.getBoundingClientRect();
      var to = $('hud-build').getBoundingClientRect();
      var fly = img(src, 'fly-block');
      fly.style.left = (from.left + from.width / 2 - 20) + 'px';
      fly.style.top = (from.top + from.height / 2 - 20) + 'px';
      document.body.appendChild(fly);
      var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      var dy = (to.top + to.height / 2) - (from.top + from.height / 2);
      requestAnimationFrame(function () {
        fly.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.4)';
        fly.style.opacity = '0.2';
      });
      setTimeout(function () { if (fly.parentNode) fly.parentNode.removeChild(fly); }, 750);
    } catch (e) {}
  }

  // ---------- Boss helpers ----------
  function renderBossHearts() {
    var c = $('boss-hearts');
    clear(c);
    for (var i = 0; i < BOSS_HP; i++) {
      c.appendChild(img(i < session.bossHp ? ASSETS.ui.heart : ASSETS.ui.heartBg));
    }
  }

  function bossHitAnimation() {
    var b = $('boss-img');
    b.classList.remove('hit');
    void b.offsetWidth;
    b.classList.add('hit');
  }

  function showBossWin() {
    $('bosswin-title').textContent = session.boss.name + ' besiegt!';
    var item = $('bosswin-item');
    item.classList.remove('pop');
    void item.offsetWidth;
    item.classList.add('pop');
    $('bosswin-text').textContent = '+1 Goldener Apfel  \u00b7  +' + BOSS_XP + ' XP';
    renderXpBar();
    showOverlay('overlay-bosswin', true);
  }

  $('btn-bosswin-next').addEventListener('click', function () {
    showOverlay('overlay-bosswin', false);
    maybeLevelUp(showSummary);
  });

  // ---------- Level-Up chain ----------
  var levelUpNext = null;
  function maybeLevelUp(next) {
    if (session.pendingLevelUp) {
      var lvl = session.pendingLevelUp;
      session.pendingLevelUp = null;
      var p = pickaxeForLevel(lvl);
      $('levelup-title').textContent = 'Level ' + lvl + '!';
      var item = $('levelup-item');
      item.src = p.src;
      item.classList.remove('pop');
      void item.offsetWidth;
      item.classList.add('pop');
      var msg = 'Du hast jetzt die ' + p.name + '!';
      for (var bi = 0; bi < BIOMES.length; bi++) {
        if (BIOMES[bi].minLevel === lvl) msg += ' Neues Biom freigeschaltet: ' + BIOMES[bi].name + '!';
      }
      $('levelup-text').textContent = msg;
      levelUpNext = next;
      showOverlay('overlay-levelup', true);
    } else {
      next();
    }
  }
  $('btn-levelup-next').addEventListener('click', function () {
    showOverlay('overlay-levelup', false);
    if (levelUpNext) { var n = levelUpNext; levelUpNext = null; n(); }
  });

  // ---------- Reward overlay ----------
  function showReward(blockKey, xp, withDiamond) {
    var item = $('reward-item');
    item.classList.remove('pop');
    if (blockKey) {
      item.src = ASSETS.blocks[blockKey];
      $('reward-text').textContent = '+1 ' + BLOCK_NAMES[blockKey] + ' f\u00fcr die Baustelle!';
    } else {
      item.src = ASSETS.blocks.planks;
      $('reward-text').textContent = '+1 freier Block!';
    }
    void item.offsetWidth;
    item.classList.add('pop');
    $('reward-xp').textContent = '+' + xp + ' XP  \u00b7  Freie Bl\u00f6cke: ' + state.build.free +
      (withDiamond ? '  \u00b7  Serien-Bonus: +1 Diamant!' : '');
    renderXpBar();
    showOverlay('overlay-reward', true);
  }

  $('btn-reward-next').addEventListener('click', function () {
    showOverlay('overlay-reward', false);
    maybeLevelUp(nextTask);
  });

  function nextTask() {
    session.index++;
    if (session.index >= session.tasks.length) {
      if (session.phase === 'tasks') startBoss();
      else showSummary();
    } else {
      renderTask();
    }
  }

  // ---------- Explanation ----------
  function showExplanation(t) {
    var vis = $('explain-visual');
    var txt = $('explain-text');
    clear(vis);

    if (t.type === 'count') {
      var grid = el('div', 'count-grid');
      for (var i = 0; i < t.n; i++) {
        var cell = el('div', 'count-cell');
        cell.appendChild(img(ASSETS.items[t.item]));
        cell.appendChild(el('div', null, String(i + 1)));
        grid.appendChild(cell);
      }
      vis.appendChild(grid);
      txt.textContent = 'Z\u00e4hle langsam mit: Es sind ' + t.n + ' ' + ITEM_NAMES[t.item][t.n === 1 ? 0 : 1] + '.';
    } else if (t.type === 'add' || t.type === 'double') {
      if (t.a <= 10 && t.b <= 10) {
        var gA = el('div', 'group'); renderItemRow(gA, t.item, t.a);
        gA.appendChild(el('div', 'num-label', String(t.a)));
        var gB = el('div', 'group'); renderItemRow(gB, t.item, t.b);
        gB.appendChild(el('div', 'num-label', String(t.b)));
        vis.appendChild(gA);
        vis.appendChild(el('div', 'op', '+'));
        vis.appendChild(gB);
        txt.textContent = t.a + ' und noch ' + t.b + ' dazu — zusammen sind das ' + (t.a + t.b) + '.';
      } else {
        var tens = Math.floor(t.b / 10) * 10;
        var ones = t.b - tens;
        txt.textContent = (tens > 0 && ones > 0)
          ? 'Rechne in Schritten: ' + t.a + ' + ' + tens + ' = ' + (t.a + tens) + ', dann + ' + ones + ' = ' + (t.a + t.b) + '.'
          : t.a + ' + ' + t.b + ' = ' + (t.a + t.b) + '.';
      }
    } else if (t.type === 'sub') {
      if (t.a <= 12) {
        var g = el('div', 'group');
        renderItemRow(g, t.item, t.a, t.a - t.b);
        g.appendChild(el('div', 'num-label', t.a + ' \u2212 ' + t.b + ' = ' + (t.a - t.b)));
        vis.appendChild(g);
        txt.textContent = 'Von ' + t.a + ' nimmst du ' + t.b + ' weg — es bleiben ' + (t.a - t.b) + '.';
      } else {
        var tens2 = Math.floor(t.b / 10) * 10;
        var ones2 = t.b - tens2;
        txt.textContent = (tens2 > 0 && ones2 > 0)
          ? 'Rechne in Schritten: ' + t.a + ' \u2212 ' + tens2 + ' = ' + (t.a - tens2) + ', dann \u2212 ' + ones2 + ' = ' + (t.a - t.b) + '.'
          : t.a + ' \u2212 ' + t.b + ' = ' + (t.a - t.b) + '.';
      }
    } else if (t.type === 'missing') {
      txt.textContent = 'Von ' + t.a + ' bis ' + t.c + ' fehlen ' + (t.c - t.a) + '. Also: ' + t.a + ' + ' + (t.c - t.a) + ' = ' + t.c + '.';
    } else if (t.type === 'mul') {
      txt.textContent = t.f + ' \u00b7 ' + t.n + ' bedeutet ' + t.n + ' mal die ' + t.f + ': das ergibt ' + (t.f * t.n) + '.';
    } else if (t.type === 'half') {
      txt.textContent = t.n + ' in zwei gleiche Teile: ' + (t.n / 2) + ' und ' + (t.n / 2) + '. Die H\u00e4lfte ist ' + (t.n / 2) + '.';
    } else if (t.type === 'compare') {
      [['Links', t.left], ['Rechts', t.right]].forEach(function (s) {
        var side = el('div', 'compare-side');
        side.appendChild(el('div', 'side-name', s[0]));
        var gg = el('div', 'group');
        renderItemRow(gg, t.item, s[1]);
        side.appendChild(gg);
        side.appendChild(el('div', 'num-label', String(s[1])));
        vis.appendChild(side);
      });
      txt.textContent = (t.correct === 'gleich')
        ? 'Beide Seiten haben ' + t.left + ' — gleich viele!'
        : ((t.correct === 'links' ? 'Links' : 'Rechts') + ' sind ' + Math.max(t.left, t.right) + ', das ist mehr als ' + Math.min(t.left, t.right) + '.');
    }

    showOverlay('overlay-explain', true);
  }

  $('btn-explain-retry').addEventListener('click', function () {
    showOverlay('overlay-explain', false);
    var btns = $('answers').querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      if (!btns[i].classList.contains('wrong')) btns[i].disabled = false;
    }
  });

  // ---------- Summary ----------
  function showSummary() {
    state.stats.sessions++;
    saveState();

    var items = $('summary-items');
    clear(items);
    var any = false;
    Object.keys(session.earnedBlocks).forEach(function (k) {
      any = true;
      var s = el('div', 'summary-item');
      s.appendChild(img(ASSETS.blocks[k]));
      s.appendChild(el('div', null, '\u00d7 ' + session.earnedBlocks[k]));
      items.appendChild(s);
    });
    Object.keys(session.earnedItems).forEach(function (k) {
      any = true;
      var s = el('div', 'summary-item');
      s.appendChild(img(ASSETS.items[k]));
      s.appendChild(el('div', null, '\u00d7 ' + session.earnedItems[k]));
      items.appendChild(s);
    });
    if (!any) items.appendChild(el('div', null, 'Diesmal nichts gesammelt — gleich nochmal!'));

    $('summary-title').textContent = session.bossDefeated ? session.boss.name + ' besiegt!' : 'Geschafft!';
    $('summary-stats').textContent = '+' + session.xpGained + ' XP  \u00b7  Level ' + levelOf(state.xp) +
      '  \u00b7  +' + session.earnedFree + ' freie Bl\u00f6cke';
    showOverlay('overlay-summary', true);
  }

  $('btn-summary-again').addEventListener('click', function () {
    showOverlay('overlay-summary', false);
    startSession();
  });
  $('btn-summary-home').addEventListener('click', function () {
    showOverlay('overlay-summary', false);
    renderStart();
    show('screen-start');
  });
  $('btn-summary-build').addEventListener('click', function () {
    showOverlay('overlay-summary', false);
    renderBuildScreen();
    show('screen-build');
  });

  // ---------- Vorlesen ----------
  $('btn-speak').addEventListener('click', function () { speak(currentTask().speak); });

  // ---------- Baustelle ----------
  function renderBlueprint(container, project, placed, popFrom, cellSize) {
    clear(container);
    container.style.gridTemplateColumns = 'repeat(' + project.rows[0].length + ', ' + cellSize + 'px)';
    var placedSet = {};
    for (var i = 0; i < placed && i < project.order.length; i++) {
      var o = project.order[i];
      placedSet[o.r + ':' + o.c] = { key: o.key, idx: i };
    }
    for (var r = 0; r < project.rows.length; r++) {
      for (var c = 0; c < project.rows[r].length; c++) {
        var ch = project.rows[r][c];
        var cell = el('div', 'build-cell');
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        if (ch === '.') {
          cell.classList.add('air');
        } else {
          var info = placedSet[r + ':' + c];
          if (info) {
            var im = img(ASSETS.blocks[info.key]);
            if (info.idx >= popFrom) im.classList.add('placed-pop');
            cell.appendChild(im);
          } else {
            cell.classList.add('empty');
          }
        }
        container.appendChild(cell);
      }
    }
  }

  function renderBuildScreen() {
    var p = currentProject();
    $('build-title').textContent = p.name;
    $('build-progress').textContent = state.build.placed + ' / ' + p.total + ' Bl\u00f6cke  \u00b7  Vorrat: ' + state.build.vorrat + '  \u00b7  Freie Bl\u00f6cke: ' + state.build.free;
    renderBlueprint($('build-grid'), p, state.build.placed, state.build.seen, 44);
    state.build.seen = state.build.placed;
    saveState();

    var placeBtn = $('btn-build-place');
    placeBtn.disabled = (state.build.vorrat <= 0 || state.build.placed >= p.total);
    $('build-hint').textContent = (state.build.vorrat <= 0 && state.build.placed < p.total)
      ? 'L\u00f6se Aufgaben, um Bl\u00f6cke f\u00fcr den Vorrat zu sammeln!'
      : '';

    var done = $('builds-done');
    clear(done);
    if (state.build.completed.length) {
      done.appendChild(el('div', 'builds-done-title', 'Fertige Bauwerke:'));
      var row = el('div', 'builds-done-row');
      state.build.completed.forEach(function (id) {
        for (var i = 0; i < BUILD_PROJECTS.length; i++) {
          if (BUILD_PROJECTS[i].id === id) {
            var b = el('div', 'builds-done-item');
            b.appendChild(img(ASSETS.blocks[BUILD_PROJECTS[i].order[0].key]));
            b.appendChild(el('div', null, BUILD_PROJECTS[i].name));
            row.appendChild(b);
          }
        }
      });
      done.appendChild(row);
    }
  }

  $('btn-build-place').addEventListener('click', function () {
    var p = currentProject();
    if (state.build.vorrat <= 0 || state.build.placed >= p.total) return;
    state.build.vorrat--;
    state.build.placed++;
    saveState();

    if (state.build.placed >= p.total) {
      // Celebration, then advance to the next project
      renderBlueprint($('build-grid'), p, p.total, p.total - 1, 44);
      $('build-progress').textContent = p.total + ' / ' + p.total + ' Bl\u00f6cke';
      $('builddone-title').textContent = p.name + ' fertig!';
      renderBlueprint($('builddone-grid'), p, p.total, p.total, 26);
      state.build.completed.push(p.id);
      state.build.projectIndex++;
      state.build.placed = 0;
      state.build.seen = 0;
      saveState();
      $('builddone-text').textContent = 'Gro\u00dfartig gebaut! N\u00e4chstes Projekt: ' + currentProject().name;
      setTimeout(function () { showOverlay('overlay-builddone', true); }, 600);
    } else {
      renderBlueprint($('build-grid'), p, state.build.placed, state.build.placed - 1, 44);
      state.build.seen = state.build.placed;
      $('build-progress').textContent = state.build.placed + ' / ' + p.total + ' Bl\u00f6cke  \u00b7  Vorrat: ' + state.build.vorrat + '  \u00b7  Freie Bl\u00f6cke: ' + state.build.free;
      $('btn-build-place').disabled = (state.build.vorrat <= 0);
      $('build-hint').textContent = (state.build.vorrat <= 0) ? 'L\u00f6se Aufgaben, um Bl\u00f6cke f\u00fcr den Vorrat zu sammeln!' : '';
    }
  });

  $('btn-builddone-next').addEventListener('click', function () {
    showOverlay('overlay-builddone', false);
    renderBuildScreen();
  });

  $('btn-build-creative').addEventListener('click', function () {
    renderCreative();
    show('screen-creative');
  });

  $('btn-build-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Kreativ-Modus ----------
  function renderCreative() {
    $('creative-free').textContent = 'Freie Bl\u00f6cke: ' + state.build.free;

    var pal = $('creative-palette');
    clear(pal);
    CREATIVE_PALETTE.forEach(function (key) {
      var tile = el('button', 'palette-tile' + (state.creative.sel === key ? ' selected' : ''));
      tile.appendChild(img(ASSETS.blocks[key]));
      tile.title = BLOCK_NAMES[key];
      tile.addEventListener('click', function () {
        state.creative.sel = key;
        saveState();
        renderCreative();
      });
      pal.appendChild(tile);
    });

    var grid = $('creative-grid');
    clear(grid);
    grid.style.gridTemplateColumns = 'repeat(' + CREATIVE_COLS + ', 40px)';
    state.creative.grid.forEach(function (key, idx) {
      var cell = el('div', 'creative-cell');
      if (key) cell.appendChild(img(ASSETS.blocks[key]));
      cell.addEventListener('click', function () { onCreativeCell(idx); });
      grid.appendChild(cell);
    });
  }

  function onCreativeCell(idx) {
    var cur = state.creative.grid[idx];
    if (cur) {
      state.creative.grid[idx] = null;
      state.build.free++;
    } else {
      if (state.build.free <= 0) {
        $('creative-free').textContent = 'Keine freien Bl\u00f6cke — l\u00f6se Aufgaben!';
        return;
      }
      state.creative.grid[idx] = state.creative.sel;
      state.build.free--;
    }
    saveState();
    renderCreative();
  }

  $('btn-creative-back').addEventListener('click', function () { renderBuildScreen(); show('screen-build'); });

  // ---------- Start screen ----------
  function renderStart() {
    var lvl = levelOf(state.xp);
    $('start-level').textContent = 'Level ' + lvl + '  \u00b7  ' + state.xp + ' XP';
    $('start-pickaxe').src = pickaxeForLevel(lvl).src;
    renderGroundStrip();
    renderHotbar();
  }

  function renderGroundStrip() {
    var strip = $('ground-strip');
    clear(strip);
    var n = Math.ceil(window.innerWidth / 64) + 1;
    for (var i = 0; i < n; i++) strip.appendChild(img(ASSETS.blocks.grass));
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderGroundStrip, 150);
  });

  var INV_ORDER = ['diamond', 'emerald', 'gold_ingot', 'iron_ingot', 'apple', 'apple_golden'];

  function renderHotbar() {
    var bar = $('hotbar');
    clear(bar);
    var shown = 0;
    INV_ORDER.forEach(function (id) {
      if (shown >= 9) return;
      var count = state.inventory[id] || 0;
      if (count > 0) {
        var slot = el('div', 'inv-slot');
        slot.appendChild(img(ASSETS.items[id]));
        slot.appendChild(el('div', 'count', String(count)));
        bar.appendChild(slot);
        shown++;
      }
    });
  }

  $('btn-start-game').addEventListener('click', startSession);
  $('btn-start-build').addEventListener('click', function () { renderBuildScreen(); show('screen-build'); });
  $('btn-start-world').addEventListener('click', function () { renderWorldMap(); show('screen-worldmap'); });
  $('btn-start-inventory').addEventListener('click', function () { renderInventory(); show('screen-inventory'); });
  $('btn-start-parent').addEventListener('click', function () { resetGate(); show('screen-parent'); });

  // ---------- World map ----------
  function renderWorldMap() {
    var grid = $('biome-grid');
    clear(grid);
    var lvl = levelOf(state.xp);
    BIOMES.forEach(function (b) {
      var unlocked = lvl >= b.minLevel;
      var tile = el('button', 'biome-tile');
      tile.style.backgroundImage = "url('" + ASSETS.blocks[b.blockKey] + "')";
      tile.appendChild(el('span', 'biome-name', b.name));
      if (!unlocked) {
        tile.classList.add('locked');
        tile.appendChild(el('span', 'biome-status', 'Ab Level ' + b.minLevel));
      } else if (state.biome === b.id) {
        tile.classList.add('selected');
        tile.appendChild(el('span', 'biome-status', 'Ausgew\u00e4hlt'));
      } else {
        tile.appendChild(el('span', 'biome-status', 'Antippen'));
      }
      tile.addEventListener('click', function () {
        if (!unlocked) return;
        state.biome = b.id;
        saveState();
        renderWorldMap();
      });
      grid.appendChild(tile);
    });
  }

  $('btn-world-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Inventory ----------
  function renderInventory() {
    var grid = $('inv-grid');
    clear(grid);
    var any = false;
    INV_ORDER.forEach(function (id) {
      var slot = el('div', 'inv-slot');
      var count = state.inventory[id] || 0;
      if (count > 0) {
        any = true;
        slot.appendChild(img(ASSETS.items[id]));
        slot.appendChild(el('div', 'count', String(count)));
      }
      grid.appendChild(slot);
    });
    $('inv-hint').style.display = any ? 'none' : 'block';
  }

  $('btn-inv-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Parent area ----------
  var gateTimer = null;
  var gateStart = 0;

  function resetGate() {
    $('parent-gate-panel').style.display = 'flex';
    $('parent-stats-panel').style.display = 'none';
    $('gate-progress').textContent = '';
  }

  function gateDown() {
    gateStart = Date.now();
    $('gate-progress').textContent = 'Halten\u2026';
    gateTimer = setInterval(function () {
      var sec = (Date.now() - gateStart) / 1000;
      $('gate-progress').textContent = 'Halten\u2026 ' + Math.min(3, sec).toFixed(1) + ' / 3,0 s';
      if (sec >= 3) {
        clearInterval(gateTimer);
        gateTimer = null;
        openParent();
      }
    }, 100);
  }

  function gateUp() {
    if (gateTimer) {
      clearInterval(gateTimer);
      gateTimer = null;
      $('gate-progress').textContent = '';
    }
  }

  var gateBtn = $('btn-gate');
  gateBtn.addEventListener('pointerdown', gateDown);
  gateBtn.addEventListener('pointerup', gateUp);
  gateBtn.addEventListener('pointerleave', gateUp);
  gateBtn.addEventListener('pointercancel', gateUp);

  var TYPE_NAMES = {
    count: 'Z\u00e4hlen', add: 'Plus', sub: 'Minus', compare: 'Vergleichen',
    double: 'Verdoppeln', missing: 'L\u00fcckenaufgaben', mul: 'Einmaleins', half: 'Halbieren'
  };

  function openParent() {
    var s = state.stats;
    var acc = s.answered > 0 ? Math.round((s.correct / s.answered) * 100) : 0;
    var lines = [
      'Beantwortete Aufgaben: ' + s.answered,
      'Richtig: ' + s.correct + ' (' + acc + ' %)',
      'Gespielte Runden: ' + s.sessions,
      'Beste Serie: ' + s.bestStreak,
      'XP gesamt: ' + state.xp + '  \u00b7  Level ' + levelOf(state.xp)
    ];
    var weakest = null, weakestAcc = 101;
    Object.keys(s.byType).forEach(function (t) {
      var bt = s.byType[t];
      var a = bt.answered > 0 ? Math.round((bt.correct / bt.answered) * 100) : 0;
      lines.push(TYPE_NAMES[t] + ': ' + bt.correct + ' / ' + bt.answered + ' (' + a + ' %)');
      if (bt.answered >= 4 && a < weakestAcc) { weakest = t; weakestAcc = a; }
    });
    var list = $('parent-stats');
    clear(list);
    lines.forEach(function (l) { list.appendChild(el('div', null, l)); });

    $('parent-reco').textContent = (weakest && weakestAcc < 80)
      ? 'Empfehlung: ' + TYPE_NAMES[weakest] + ' gezielt \u00fcben (' + weakestAcc + ' % Trefferquote).'
      : '';

    renderDiffButtons();
    $('parent-gate-panel').style.display = 'none';
    $('parent-stats-panel').style.display = 'flex';
  }

  var DIFFS = ['leicht', 'mittel', 'schwer', 'profi'];

  function renderDiffButtons() {
    DIFFS.forEach(function (d) {
      $('diff-' + d).classList.toggle('selected', state.difficulty === d);
    });
  }

  DIFFS.forEach(function (d) {
    $('diff-' + d).addEventListener('click', function () {
      state.difficulty = d;
      saveState();
      renderDiffButtons();
    });
  });

  $('btn-parent-reset').addEventListener('click', function () {
    if (window.confirm('Wirklich den gesamten Fortschritt l\u00f6schen?')) {
      state = defaultState();
      state.creative.grid = new Array(CREATIVE_COLS * CREATIVE_ROWS).fill(null);
      saveState();
      openParent();
    }
  });

  $('btn-parent-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Init ----------
  renderStart();
  show('screen-start');
})();
