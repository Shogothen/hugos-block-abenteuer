/* ============================================================
   Hugos Block-Abenteuer — App-Logik (Version 7.0)
   Neu: 8-Bit-Sound-Engine, Auto-Vorlesen für Nicht-Leser,
   Begleiter-Tiere mit echten Boni, Trophäen-Wand,
   6 Bosse mit progressiver Freischaltung.
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
      ironBlock: A + 'blocks/iron_block.png',
      goldBlock: A + 'blocks/gold_block.png',
      diamondBlock: A + 'blocks/diamond_block.png'
    },
    items: {
      diamond: A + 'items/diamond.png',
      gold_ingot: A + 'items/gold_ingot.png',
      iron_ingot: A + 'items/iron_ingot.png',
      apple: A + 'items/apple.png',
      apple_golden: A + 'items/apple_golden.png',
      diamond_sword: A + 'items/diamond_sword.png',
      iron_chestplate: A + 'items/iron_chestplate.png',
      iron_sword: A + 'items/iron_sword.png',
      compass: A + 'items/compass_item.png',
      book: A + 'items/book_normal.png'
    },
    mobs: {
      steve: A + 'mobs/steve_face.png',
      creeper: A + 'mobs/creeper_face.png',
      zombie: A + 'mobs/zombie_face.png',
      skeleton: A + 'mobs/skeleton_face.png',
      witch: A + 'mobs/witch_face.png',
      piglin: A + 'mobs/piglin_face.png',
      ghast: A + 'mobs/ghast_face.png',
      pig: A + 'mobs/pig_face.png',
      chicken: A + 'mobs/chicken_face.png',
      cat: A + 'mobs/cat_face.png',
      wolf: A + 'mobs/wolf_face.png',
      fox: A + 'mobs/fox_face.png',
      axolotl: A + 'mobs/axolotl_face.png'
    },
    ui: {
      heart: A + 'ui/heart.png',
      heartHalf: A + 'ui/heart_half.png',
      heartBg: A + 'ui/heart_background.png',
      xpEmpty: A + 'ui/xp_bar_empty.png',
      xpFull: A + 'ui/xp_bar_full.png',
      slot: A + 'ui/slot.png'
    }
  };

  var COUNT_ITEM_SRC = {
    diamant: A + 'items/diamond.png',
    smaragd: A + 'items/emerald.png',
    apfel: A + 'items/apple.png',
    goldbarren: A + 'items/gold_ingot.png'
  };
  var COUNT_ITEM_NAMES = {
    diamant: ['Diamant', 'Diamanten'],
    smaragd: ['Smaragd', 'Smaragde'],
    apfel: ['Apfel', '\u00c4pfel'],
    goldbarren: ['Goldbarren', 'Goldbarren']
  };
  var COUNT_ITEMS = ['diamant', 'smaragd', 'apfel', 'goldbarren'];

  // ---------- Resources ----------
  var RES = {
    holz: { name: 'Holz', src: A + 'blocks/log_oak.png' },
    stein: { name: 'Stein', src: A + 'blocks/cobblestone.png' },
    eisen: { name: 'Eisen', src: A + 'items/iron_ingot.png' },
    gold: { name: 'Gold', src: A + 'items/gold_ingot.png' },
    diamant: { name: 'Diamant', src: A + 'items/diamond.png' }
  };
  var RES_KEYS = ['holz', 'stein', 'eisen', 'gold', 'diamant'];

  var DROP_WEIGHTS = {
    leicht: { holz: 45, stein: 35, eisen: 15, gold: 4, diamant: 1 },
    mittel: { holz: 35, stein: 33, eisen: 20, gold: 9, diamant: 3 },
    schwer: { holz: 24, stein: 28, eisen: 26, gold: 15, diamant: 7 },
    profi:  { holz: 18, stein: 22, eisen: 27, gold: 20, diamant: 13 }
  };

  // ---------- Equipment ----------
  var SWORD_TIERS = [
    { id: 'holz', name: 'Holz-Schwert', src: A + 'items/wood_sword.png', cost: { holz: 2 } },
    { id: 'stein', name: 'Stein-Schwert', src: A + 'items/stone_sword.png', cost: { stein: 3, holz: 1 } },
    { id: 'eisen', name: 'Eisen-Schwert', src: A + 'items/iron_sword.png', cost: { eisen: 3, holz: 1 } },
    { id: 'gold', name: 'Gold-Schwert', src: A + 'items/gold_sword.png', cost: { gold: 3, holz: 1 } },
    { id: 'diamant', name: 'Diamant-Schwert', src: A + 'items/diamond_sword.png', cost: { diamant: 2, holz: 1 } }
  ];

  var ARMOR_SLOTS = [
    { id: 'helm', name: 'Helm', tex: 'helmet' },
    { id: 'brust', name: 'Brustpanzer', tex: 'chestplate' },
    { id: 'hose', name: 'Hose', tex: 'leggings' },
    { id: 'stiefel', name: 'Stiefel', tex: 'boots' }
  ];
  var ARMOR_TIERS = [
    { id: 'ketten', name: 'Ketten', prefix: 'chainmail', res: 'eisen', costs: { helm: 2, brust: 3, hose: 2, stiefel: 1 } },
    { id: 'eisen', name: 'Eisen', prefix: 'iron', res: 'eisen', costs: { helm: 3, brust: 5, hose: 4, stiefel: 2 } },
    { id: 'gold', name: 'Gold', prefix: 'gold', res: 'gold', costs: { helm: 3, brust: 4, hose: 3, stiefel: 2 } },
    { id: 'diamant', name: 'Diamant', prefix: 'diamond', res: 'diamant', costs: { helm: 2, brust: 3, hose: 2, stiefel: 1 } }
  ];
  function armorSrc(tierIdx, slot) {
    return A + 'items/' + ARMOR_TIERS[tierIdx].prefix + '_' + slot.tex + '.png';
  }

  // ---------- House stages ----------
  var HOUSE_STAGES = [
    {
      name: 'Lagerplatz', cost: null, effect: '',
      map: { T: 'logOak' },
      rows: ['..T..', '.TTT.']
    },
    {
      name: 'Holzh\u00fctte', cost: { holz: 10, stein: 4 }, effect: '',
      map: { P: 'planks', G: 'glowstone' },
      rows: ['..P..', '.PPP.', 'PG.GP', 'P...P', 'PP.PP']
    },
    {
      name: 'Steinhaus', cost: { stein: 12, holz: 4, eisen: 2 }, effect: '+1 Herz',
      map: { P: 'planks', S: 'stone', G: 'glowstone', C: 'cobblestone' },
      rows: ['..PPP..', '.PPPPP.', 'SSG.GSS', 'S.....S', 'SSS.SSS', 'CCC.CCC']
    },
    {
      name: 'Backstein-Haus', cost: { stein: 10, eisen: 6, gold: 2 }, effect: '+1 Herz',
      map: { P: 'planks', B: 'brick', G: 'glowstone', L: 'leavesOak' },
      rows: ['..PPP..', '.PPPPP.', 'BBG.GBB', 'B.....B', 'BBB.BBB', 'L.....L']
    },
    {
      name: 'Gro\u00dfes Steinhaus', cost: { stein: 12, eisen: 8, gold: 4, diamant: 1 }, effect: '+2 Herzen',
      map: { P: 'planks', S: 'stone', G: 'glowstone', I: 'ironBlock' },
      rows: ['...PPP...', '..PPPPP..', '.PPPPPPP.', 'SSG...GSS', 'S.......S', 'S.G...G.S', 'SSSS.SSSS', 'I.......I']
    },
    {
      name: 'Festung', cost: { stein: 14, eisen: 10, gold: 6, diamant: 3 }, effect: '+2 Herzen \u00b7 Doppelte Boss-Beute',
      map: { O: 'obsidian', G: 'glowstone', D: 'diamondBlock', I: 'ironBlock', N: 'goldBlock' },
      rows: ['O.O.O.O.O', 'OOOOOOOOO', 'OGO...OGO', 'O.......O', 'O..D.D..O', 'O.......O', 'OOOO.OOOO', 'N.......N']
    }
  ];

  HOUSE_STAGES.forEach(function (st) {
    st.order = [];
    for (var r = st.rows.length - 1; r >= 0; r--) {
      for (var c = 0; c < st.rows[r].length; c++) {
        var ch = st.rows[r][c];
        if (ch !== '.') st.order.push({ r: r, c: c, key: st.map[ch] });
      }
    }
    st.total = st.order.length;
  });

  function houseHeartBonus(stage) {
    var b = 0;
    if (stage >= 3) b += 1;
    if (stage >= 4) b += 1;
    if (stage >= 5) b += 2;
    if (stage >= 6) b += 2;
    return Math.min(b, 4);
  }

  // ---------- Pets ----------
  var PETS = [
    { id: 'huhn', name: 'Huhn', src: ASSETS.mobs.chicken,
      bonus: '+1 Herz', speakBonus: 'Das Huhn schenkt dir ein extra Herz.' },
    { id: 'schwein', name: 'Schwein', src: ASSETS.mobs.pig,
      bonus: '+2 Holz und +2 Stein nach jeder Runde', speakBonus: 'Das Schwein sammelt nach jeder Runde Holz und Steine f\u00fcr dich.' },
    { id: 'katze', name: 'Katze', src: ASSETS.mobs.cat,
      bonus: 'Findet \u00f6fter Sch\u00e4tze', speakBonus: 'Die Katze hat Gl\u00fcck und findet \u00f6fter seltene Sch\u00e4tze.' },
    { id: 'wolf', name: 'Wolf', src: ASSETS.mobs.wolf,
      bonus: '+1 Schwert-Schaden', speakBonus: 'Der Wolf k\u00e4mpft mit dir. Dein Schwert macht mehr Schaden.' },
    { id: 'fuchs', name: 'Fuchs', src: ASSETS.mobs.fox,
      bonus: '+1 Diamant bei jedem Boss-Sieg', speakBonus: 'Der Fuchs stibitzt nach jedem Boss-Sieg einen extra Diamanten.' },
    { id: 'axolotl', name: 'Axolotl', src: ASSETS.mobs.axolotl,
      bonus: 'Sch\u00fctzt einmal pro Runde ein Herz', speakBonus: 'Der Axolotl besch\u00fctzt dich. Einmal pro Runde verlierst du kein Herz.' }
  ];
  function petById(id) {
    for (var i = 0; i < PETS.length; i++) if (PETS[i].id === id) return PETS[i];
    return null;
  }
  function petActive(id) { return state.activePet === id && !!state.pets[id]; }

  // ---------- Bosses ----------
  var BOSSES = [
    { id: 'creeper', name: 'Creeper', src: ASSETS.mobs.creeper, hpBonus: 0, unlockAt: 0,
      introLine: 'Pssssst!', defeatLine: 'Bumm!' },
    { id: 'zombie', name: 'Zombie', src: ASSETS.mobs.zombie, hpBonus: 0, unlockAt: 0,
      introLine: 'Uaaargh!', defeatLine: '\u00d6h \u00f6h\u2026' },
    { id: 'skeleton', name: 'Skelett', src: ASSETS.mobs.skeleton, hpBonus: 1, unlockAt: 0,
      introLine: 'Klacker, klacker!', defeatLine: 'Klacker\u2026' },
    { id: 'witch', name: 'Hexe', src: ASSETS.mobs.witch, hpBonus: 2, unlockAt: 5,
      introLine: 'Hihihihi!', defeatLine: 'Meine Tr\u00e4nke!' },
    { id: 'piglin', name: 'Piglin', src: ASSETS.mobs.piglin, hpBonus: 3, unlockAt: 12,
      introLine: 'Grunz, grunz! Her mit dem Gold!', defeatLine: 'Mein Gold!' },
    { id: 'ghast', name: 'Ghast', src: ASSETS.mobs.ghast, hpBonus: 4, unlockAt: 20,
      introLine: 'Uuuuuuh!', defeatLine: 'Huhuuu\u2026' }
  ];
  function unlockedBosses() {
    return BOSSES.filter(function (b) { return b.unlockAt <= state.stats.bossesDefeated; });
  }

  // ---------- Trophies ----------
  var TROPHIES = [
    { id: 'runde1', name: 'Erste Runde geschafft', icon: ASSETS.blocks.grass,
      prog: function (s) { return { cur: Math.min(s.stats.sessions, 1), max: 1 }; },
      cond: function (s) { return s.stats.sessions >= 1; } },
    { id: 'richtig30', name: '30 Aufgaben richtig', icon: ASSETS.items.apple, pet: 'huhn',
      prog: function (s) { return { cur: Math.min(s.stats.correct, 30), max: 30 }; },
      cond: function (s) { return s.stats.correct >= 30; } },
    { id: 'richtig100', name: '100 Aufgaben richtig', icon: ASSETS.items.iron_ingot,
      prog: function (s) { return { cur: Math.min(s.stats.correct, 100), max: 100 }; },
      cond: function (s) { return s.stats.correct >= 100; } },
    { id: 'richtig300', name: '300 Aufgaben richtig', icon: ASSETS.items.gold_ingot,
      prog: function (s) { return { cur: Math.min(s.stats.correct, 300), max: 300 }; },
      cond: function (s) { return s.stats.correct >= 300; } },
    { id: 'richtig1000', name: '1000 Aufgaben richtig', icon: ASSETS.items.diamond,
      prog: function (s) { return { cur: Math.min(s.stats.correct, 1000), max: 1000 }; },
      cond: function (s) { return s.stats.correct >= 1000; } },
    { id: 'boss1', name: 'Erster Boss besiegt', icon: ASSETS.mobs.creeper,
      prog: function (s) { return { cur: Math.min(s.stats.bossesDefeated, 1), max: 1 }; },
      cond: function (s) { return s.stats.bossesDefeated >= 1; } },
    { id: 'boss5', name: '5 Bosse besiegt', icon: ASSETS.mobs.zombie, pet: 'katze',
      prog: function (s) { return { cur: Math.min(s.stats.bossesDefeated, 5), max: 5 }; },
      cond: function (s) { return s.stats.bossesDefeated >= 5; } },
    { id: 'boss15', name: '15 Bosse besiegt', icon: ASSETS.mobs.skeleton, pet: 'wolf',
      prog: function (s) { return { cur: Math.min(s.stats.bossesDefeated, 15), max: 15 }; },
      cond: function (s) { return s.stats.bossesDefeated >= 15; } },
    { id: 'boss30', name: '30 Bosse besiegt', icon: ASSETS.mobs.ghast,
      prog: function (s) { return { cur: Math.min(s.stats.bossesDefeated, 30), max: 30 }; },
      cond: function (s) { return s.stats.bossesDefeated >= 30; } },
    { id: 'serie7', name: 'Serie von 7', icon: ASSETS.items.apple_golden, pet: 'fuchs',
      prog: function (s) { return { cur: Math.min(s.stats.bestStreak, 7), max: 7 }; },
      cond: function (s) { return s.stats.bestStreak >= 7; } },
    { id: 'haus2', name: 'Holzh\u00fctte gebaut', icon: ASSETS.blocks.planks, pet: 'schwein',
      prog: function (s) { return { cur: Math.min(s.house, 2), max: 2 }; },
      cond: function (s) { return s.house >= 2; } },
    { id: 'haus5', name: 'Gro\u00dfes Steinhaus gebaut', icon: ASSETS.blocks.ironBlock, pet: 'axolotl',
      prog: function (s) { return { cur: Math.min(s.house, 5), max: 5 }; },
      cond: function (s) { return s.house >= 5; } },
    { id: 'haus6', name: 'Festung gebaut', icon: ASSETS.blocks.obsidian,
      prog: function (s) { return { cur: Math.min(s.house, 6), max: 6 }; },
      cond: function (s) { return s.house >= 6; } },
    { id: 'schwert5', name: 'Diamant-Schwert geschmiedet', icon: ASSETS.items.diamond_sword,
      prog: function (s) { return { cur: s.equip.schwert + 1, max: 5 }; },
      cond: function (s) { return s.equip.schwert === SWORD_TIERS.length - 1; } },
    { id: 'ruestung4', name: 'Volle R\u00fcstung', icon: ASSETS.items.iron_chestplate,
      prog: function (s) { return { cur: ARMOR_SLOTS.filter(function (sl) { return s.equip[sl.id] >= 0; }).length, max: 4 }; },
      cond: function (s) {
        return ARMOR_SLOTS.every(function (sl) { return s.equip[sl.id] >= 0; });
      } },
    { id: 'biome5', name: 'Alle Biome entdeckt', icon: ASSETS.blocks.netherrack,
      prog: function (s) { return { cur: Math.min(Math.floor(s.xp / 100) + 1, 5), max: 5 }; },
      cond: function (s) { return Math.floor(s.xp / 100) + 1 >= 5; } }
  ];

  // ---------- Core constants ----------
  var XP_PER_LEVEL = 100;
  var STREAK_BONUS_EVERY = 5;
  var STREAK_BONUS_XP = 5;

  var PICKAXES = [
    { src: A + 'items/wood_pickaxe.png', name: 'Holz-Spitzhacke' },
    { src: A + 'items/stone_pickaxe.png', name: 'Stein-Spitzhacke' },
    { src: A + 'items/iron_pickaxe.png', name: 'Eisen-Spitzhacke' },
    { src: A + 'items/gold_pickaxe.png', name: 'Gold-Spitzhacke' },
    { src: A + 'items/diamond_pickaxe.png', name: 'Diamant-Spitzhacke' }
  ];
  function pickaxeForLevel(level) { return PICKAXES[Math.min(level - 1, PICKAXES.length - 1)]; }

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

  // ---------- State ----------
  var STORAGE_KEY = 'hugos-block-abenteuer-v1';

  function defaultState() {
    return {
      v: 7,
      xp: 0,
      biome: 'forest',
      difficulty: 'leicht',
      res: { holz: 0, stein: 0, eisen: 0, gold: 0, diamant: 0 },
      equip: { schwert: -1, helm: -1, brust: -1, hose: -1, stiefel: -1 },
      house: 1,
      building: null,
      pets: {},
      activePet: null,
      trophies: {},
      seenBosses: {},
      settings: { sound: true, autoSpeak: true },
      playerName: 'Hugo',
      stats: { answered: 0, correct: 0, byType: {}, sessions: 0, bestStreak: 0, bossesDefeated: 0 },
      mistakes: []
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var old = JSON.parse(raw);
      var d = defaultState();
      var s = Object.assign(d, old);
      s.stats = Object.assign(defaultState().stats, old.stats || {});
      s.res = Object.assign(defaultState().res, old.res || {});
      s.equip = Object.assign(defaultState().equip, old.equip || {});
      s.settings = Object.assign(defaultState().settings, old.settings || {});
      s.pets = old.pets || {};
      s.trophies = old.trophies || {};
      s.seenBosses = old.seenBosses || {};
      if (!s.biome) s.biome = 'forest';
      if (!s.difficulty) s.difficulty = 'leicht';
      if (!s.house || s.house < 1) s.house = 1;
      if (!s.playerName) s.playerName = 'Hugo';
      if (old.building && old.building.stage > s.house && old.building.stage <= HOUSE_STAGES.length) s.building = old.building;
      else if (!old.building) s.building = null;

      if (!old.v || old.v < 6) {
        var c = s.stats.correct || 0;
        var inv = old.inventory || {};
        var build = old.build || {};
        s.res.holz += Math.min(30, Math.round(c * 0.5)) + Math.min(20, build.free || 0);
        s.res.stein += Math.min(30, Math.round(c * 0.4)) + Math.min(15, build.placed || 0);
        s.res.eisen += Math.min(15, Math.round(c * 0.2));
        s.res.gold += Math.min(8, Math.round(c * 0.1)) + (inv.apple_golden || 0);
        s.res.diamant += (inv.diamond || 0) + Math.min(5, Math.round(c * 0.05));
      }
      s.v = 7;
      return s;
    } catch (e) { return defaultState(); }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = loadState();

  function levelOf(xp) { return Math.floor(xp / XP_PER_LEVEL) + 1; }
  function xpInLevel(xp) { return xp % XP_PER_LEVEL; }

  // ---------- Derived combat values ----------
  function armorPoints() {
    var pts = 0;
    ARMOR_SLOTS.forEach(function (sl) {
      var t = state.equip[sl.id];
      if (t >= 0) pts += t + 1;
    });
    return pts;
  }
  function totalHearts() {
    var h = 5 + Math.floor(armorPoints() / 3) + houseHeartBonus(state.house);
    if (petActive('huhn')) h += 1;
    return Math.min(10, h);
  }
  function swordDamage() {
    var d = state.equip.schwert < 0 ? 1 : state.equip.schwert + 2;
    if (petActive('wolf')) d += 1;
    return d;
  }
  function bossRotation() { return Math.floor(state.stats.bossesDefeated / 3); }
  function bossMaxHp(boss) {
    return Math.min(4 + 3 * bossRotation() + (boss ? boss.hpBonus : 0), 18);
  }
  function bossLoot() {
    var rot = bossRotation();
    var loot = {
      holz: 2,
      stein: 3 + Math.min(rot, 5),
      eisen: 2 + Math.min(rot, 4),
      gold: 1 + Math.floor(rot / 2),
      diamant: Math.max(1, Math.floor((rot + 1) / 2))
    };
    if (state.house >= 6) RES_KEYS.forEach(function (k) { if (loot[k]) loot[k] *= 2; });
    if (petActive('fuchs')) loot.diamant += 1;
    return loot;
  }
  function bossXp(boss) { return 25 + 5 * bossRotation() + 3 * (boss ? boss.hpBonus : 0); }

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

  function canAfford(cost) {
    for (var k in cost) if ((state.res[k] || 0) < cost[k]) return false;
    return true;
  }
  function payCost(cost) {
    for (var k in cost) state.res[k] -= cost[k];
  }

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
      question: 'Wie viele ' + COUNT_ITEM_NAMES[item][1] + ' siehst du?',
      speak: 'Wie viele ' + COUNT_ITEM_NAMES[item][1] + ' siehst du?',
      correct: n, options: makeOptions(n, 1, 10, [-2, -1, 1, 2]), kind: 'number'
    };
  }

  function genAdd(diff) {
    var a, b;
    if (diff === 'leicht') { a = rnd(1, 9); b = rnd(1, Math.min(9, 10 - a)); }
    else if (diff === 'mittel') { a = rnd(2, 15); b = rnd(2, Math.min(18, 20 - a)); }
    else if (diff === 'schwer') {
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
      question: 'Wo sind mehr ' + COUNT_ITEM_NAMES[item][1] + '?',
      speak: 'Wo sind mehr ' + COUNT_ITEM_NAMES[item][1] + '? Links, rechts, oder sind es gleich viele?',
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
    var n = rnd(3, 50) * 2;
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
      equation: f + ' \u00d7 ' + n + ' = ?',
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
        equation: f + ' \u00d7 ' + n + ' = ?', correct: f * n,
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
      HOUSE_STAGES: HOUSE_STAGES, SWORD_TIERS: SWORD_TIERS, ARMOR_TIERS: ARMOR_TIERS,
      ARMOR_SLOTS: ARMOR_SLOTS, DROP_WEIGHTS: DROP_WEIGHTS, SESSION_PLANS: SESSION_PLANS,
      TROPHIES: TROPHIES, PETS: PETS, BOSSES: BOSSES
    };
    return;
  }

  // ---------- Sound engine v2 (8-bit synthesis, compressor, no files) ----------
  var Sound = (function () {
    var ctx = null, master = null;
    function ac() {
      if (!ctx) {
        try {
          ctx = new (window.AudioContext || window.webkitAudioContext)();
          var comp = ctx.createDynamicsCompressor();
          comp.threshold.value = -18;
          comp.ratio.value = 6;
          master = ctx.createGain();
          master.gain.value = 0.9;
          master.connect(comp);
          comp.connect(ctx.destination);
        } catch (e) {}
      }
      if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
      return ctx;
    }
    function on() { return !!(state.settings && state.settings.sound); }
    function tone(freq, dur, type, vol, delay, endFreq) {
      var c = ac(); if (!c) return;
      try {
        var t0 = c.currentTime + (delay || 0);
        var o = c.createOscillator(), g = c.createGain();
        o.type = type || 'square';
        o.frequency.setValueAtTime(freq, t0);
        if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
        g.gain.setValueAtTime(vol || 0.2, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        o.connect(g); g.connect(master);
        o.start(t0); o.stop(t0 + dur + 0.05);
      } catch (e) {}
    }
    function noise(dur, vol, delay, filterFreq, drop, type) {
      var c = ac(); if (!c) return;
      try {
        var t0 = c.currentTime + (delay || 0);
        var len = Math.max(1, Math.floor(c.sampleRate * dur));
        var buf = c.createBuffer(1, len, c.sampleRate);
        var d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        var src = c.createBufferSource(); src.buffer = buf;
        var f = c.createBiquadFilter(); f.type = type || 'lowpass';
        f.frequency.setValueAtTime(filterFreq || 1200, t0);
        if (drop) f.frequency.exponentialRampToValueAtTime(drop, t0 + dur);
        var g = c.createGain();
        g.gain.setValueAtTime(vol || 0.25, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        src.connect(f); f.connect(g); g.connect(master);
        src.start(t0);
      } catch (e) {}
    }
    return {
      unlock: function () {
        var c = ac(); if (!c) return;
        try {
          var b = c.createBuffer(1, 1, 22050);
          var s = c.createBufferSource();
          s.buffer = b; s.connect(master); s.start(0);
        } catch (e) {}
      },
      click: function () {
        if (!on()) return;
        noise(0.05, 0.3, 0, 2200, 600);
        tone(760, 0.07, 'square', 0.22);
      },
      correct: function () {
        if (!on()) return;
        tone(660, 0.1, 'square', 0.26);
        tone(990, 0.16, 'square', 0.26, 0.1);
      },
      wrong: function () { if (on()) tone(190, 0.35, 'sawtooth', 0.24, 0, 85); },
      mine: function () {
        if (!on()) return;
        noise(0.09, 0.4, 0, 1100, 300);
        tone(150, 0.08, 'triangle', 0.24);
        noise(0.06, 0.25, 0.07, 800);
      },
      hit: function () {
        if (!on()) return;
        noise(0.16, 0.3, 0, 2400, 280, 'bandpass');
        noise(0.16, 0.5, 0.07, 600, 150);
        tone(85, 0.22, 'triangle', 0.42, 0.07, 45);
      },
      explode: function () {
        if (!on()) return;
        noise(0.65, 0.55, 0, 1600, 60);
        tone(170, 0.55, 'sine', 0.36, 0, 35);
        tone(90, 0.4, 'square', 0.18, 0.05, 40);
      },
      levelup: function () {
        if (!on()) return;
        [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.13, 'square', 0.22, i * 0.1); });
      },
      craft: function () {
        if (!on()) return;
        tone(1200, 0.07, 'triangle', 0.3);
        tone(1600, 0.12, 'triangle', 0.26, 0.08);
        noise(0.06, 0.2, 0, 3200);
      },
      build: function () {
        if (!on()) return;
        [0, 0.13, 0.26].forEach(function (d) {
          noise(0.08, 0.38, d, 750, 250);
          tone(130, 0.07, 'triangle', 0.22, d);
        });
      },
      trophy: function () {
        if (!on()) return;
        [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, 0.14, 'sine', 0.24, i * 0.09); });
      },
      pet: function () {
        if (!on()) return;
        [880, 1108, 1318].forEach(function (f, i) { tone(f, 0.11, 'square', 0.2, i * 0.08); });
      },
      bossIntro: function () {
        if (!on()) return;
        tone(110, 0.55, 'sawtooth', 0.26, 0, 65);
        noise(0.35, 0.28, 0.1, 320);
        tone(55, 0.5, 'sine', 0.3, 0.05);
      },
      whee: function () { if (on()) tone(280, 0.4, 'square', 0.22, 0, 1100); },
      deny: function () {
        if (!on()) return;
        tone(230, 0.09, 'square', 0.2);
        tone(175, 0.14, 'square', 0.2, 0.1);
      },
      sad: function () {
        if (!on()) return;
        tone(392, 0.25, 'triangle', 0.24);
        tone(311, 0.4, 'triangle', 0.24, 0.25);
      },
      place: function () {
        if (!on()) return;
        noise(0.07, 0.38, 0, 850, 280);
        tone(135, 0.06, 'triangle', 0.22);
      },
      grr: function () {
        if (!on()) return;
        tone(130, 0.3, 'sawtooth', 0.28, 0, 70);
        noise(0.2, 0.22, 0, 380);
      }
    };
  })();

  // Robust audio unlock: revive the context on every interaction (iOS suspends it)
  ['pointerdown', 'touchend', 'mousedown', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, function () { Sound.unlock(); }, { passive: true });
  });

  // UI click sound via delegation (answers play their own feedback sounds)
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var btn = e.target.closest('.mc-btn, .biome-tile, .pet-card, .trophy-card');
    if (btn && !btn.classList.contains('answer')) Sound.click();
  });

  // ---------- Speech ----------
  var deVoice = null;
  function pickVoice() {
    try {
      var vs = window.speechSynthesis.getVoices() || [];
      deVoice = null;
      for (var i = 0; i < vs.length; i++) {
        if (/de[-_]DE/i.test(vs[i].lang)) { deVoice = vs[i]; break; }
      }
      if (!deVoice) {
        for (var j = 0; j < vs.length; j++) {
          if (/^de/i.test(vs[j].lang)) { deVoice = vs[j]; break; }
        }
      }
    } catch (e) {}
  }
  try {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  } catch (e) {}

  function speak(text) {
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      if (deVoice) u.voice = deVoice;
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  var PRAISE = ['Super', 'Stark', 'Klasse', 'Wow', 'Spitze'];
  function praiseLine() { return pick(PRAISE) + ', ' + state.playerName + '!'; }
  var autoSpeakTimer = null;
  function autoSpeak(text, delay) {
    if (!state.settings.autoSpeak) return;
    clearTimeout(autoSpeakTimer);
    autoSpeakTimer = setTimeout(function () { speak(text); }, delay || 300);
  }

  // ---------- Screen management ----------
  var screens = ['screen-start', 'screen-practice', 'screen-home', 'screen-forge',
    'screen-pets', 'screen-trophies', 'screen-worldmap', 'screen-parent'];
  function show(id) {
    screens.forEach(function (s) { $(s).classList.toggle('active', s === id); });
    var block = (id === 'screen-practice')
      ? ASSETS.blocks[biomeById(state.biome).blockKey]
      : ASSETS.blocks.dirt;
    document.documentElement.style.backgroundImage = "url('" + block + "')";
    window.scrollTo(0, 0);
  }
  function showOverlay(id, on) { $(id).classList.toggle('active', on); }

  // ---------- Effects ----------
  function burst(x, y, srcs, count) {
    for (var i = 0; i < count; i++) {
      (function () {
        var p = img(pick(srcs), 'particle');
        p.style.left = (x - 12) + 'px';
        p.style.top = (y - 12) + 'px';
        document.body.appendChild(p);
        var ang = Math.random() * Math.PI * 2;
        var dist = 50 + Math.random() * 90;
        var dx = Math.cos(ang) * dist;
        var dy = Math.sin(ang) * dist - 40;
        requestAnimationFrame(function () {
          p.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (Math.random() * 360 - 180) + 'deg) scale(0.3)';
          p.style.opacity = '0';
        });
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 800);
      })();
    }
  }

  function shakeScreen() {
    document.body.classList.remove('shake');
    void document.body.offsetWidth;
    document.body.classList.add('shake');
    setTimeout(function () { document.body.classList.remove('shake'); }, 350);
  }

  function dmgPopup(targetEl, text) {
    try {
      var r = targetEl.getBoundingClientRect();
      var d = el('div', 'dmg-pop', text);
      d.style.left = (r.left + r.width / 2 - 30) + 'px';
      d.style.top = (r.top + 10) + 'px';
      document.body.appendChild(d);
      requestAnimationFrame(function () {
        d.style.transform = 'translateY(-70px) scale(1.3)';
        d.style.opacity = '0';
      });
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 900);
    } catch (e) {}
  }

  function flyTo(fromEl, targetEl, src) {
    try {
      var from = fromEl.getBoundingClientRect();
      var to = targetEl.getBoundingClientRect();
      var fly = img(src, 'fly-block');
      fly.style.left = (from.left + from.width / 2 - 20) + 'px';
      fly.style.top = (from.top + from.height / 2 - 20) + 'px';
      document.body.appendChild(fly);
      var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      var dy = (to.top + to.height / 2) - (from.top + from.height / 2);
      requestAnimationFrame(function () {
        fly.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.45)';
        fly.style.opacity = '0.25';
      });
      setTimeout(function () { if (fly.parentNode) fly.parentNode.removeChild(fly); }, 750);
    } catch (e) {}
  }

  // ---------- Resource bar ----------
  function renderResBar(containerId, withFlyIds) {
    var c = $(containerId);
    clear(c);
    RES_KEYS.forEach(function (k) {
      var chip = el('div', 'res-chip');
      var ic = img(RES[k].src);
      if (withFlyIds) ic.id = 'fly-target-' + k;
      chip.appendChild(ic);
      chip.appendChild(el('span', 'res-count', String(state.res[k] || 0)));
      chip.title = RES[k].name;
      c.appendChild(chip);
    });
  }
  function refreshAllResBars() {
    ['res-start', 'res-practice', 'res-home', 'res-forge'].forEach(function (id) {
      if ($(id) && $(id).offsetParent !== null) renderResBar(id, id === 'res-practice');
    });
  }

  // ---------- Trophies: check + ceremony queue ----------
  var pendingCeremonies = [];

  function checkTrophies() {
    TROPHIES.forEach(function (t) {
      if (!state.trophies[t.id] && t.cond(state)) {
        state.trophies[t.id] = true;
        pendingCeremonies.push({ type: 'trophy', trophy: t });
        if (t.pet && !state.pets[t.pet]) {
          state.pets[t.pet] = true;
          if (!state.activePet) state.activePet = t.pet;
          pendingCeremonies.push({ type: 'pet', pet: petById(t.pet) });
        }
      }
    });
    saveState();
  }

  var drainNext = null;
  function drainCeremonies(next) {
    if (pendingCeremonies.length === 0) { next(); return; }
    var c = pendingCeremonies.shift();
    drainNext = next;
    if (c.type === 'trophy') {
      var ic = $('trophy-icon');
      ic.src = c.trophy.icon;
      ic.classList.remove('pop'); void ic.offsetWidth; ic.classList.add('pop');
      $('trophy-name').textContent = c.trophy.name;
      Sound.trophy();
      autoSpeak('Neue Troph\u00e4e: ' + c.trophy.name + '!', 200);
      burst(window.innerWidth / 2, window.innerHeight / 2, [c.trophy.icon, ASSETS.items.gold_ingot], 10);
      showOverlay('overlay-trophy', true);
    } else {
      var pi = $('petwin-img');
      pi.src = c.pet.src;
      pi.classList.remove('pop'); void pi.offsetWidth; pi.classList.add('pop');
      $('petwin-name').textContent = c.pet.name;
      $('petwin-bonus').textContent = c.pet.bonus;
      Sound.pet();
      autoSpeak('Neuer Begleiter: ' + c.pet.name + '! ' + c.pet.speakBonus, 200);
      burst(window.innerWidth / 2, window.innerHeight / 2, [c.pet.src, ASSETS.ui.heart], 12);
      showOverlay('overlay-pet', true);
    }
  }

  $('btn-trophy-next').addEventListener('click', function () {
    showOverlay('overlay-trophy', false);
    var n = drainNext;
    drainCeremonies(n);
  });
  $('btn-pet-next').addEventListener('click', function () {
    showOverlay('overlay-pet', false);
    var n = drainNext;
    drainCeremonies(n);
  });

  // ---------- Session ----------
  var session = null;

  function startSession() {
    var pool = unlockedBosses();
    session = {
      tasks: genSession(state.difficulty, state.mistakes),
      index: 0,
      phase: 'tasks',
      boss: pool[state.stats.sessions % pool.length],
      bossHp: 0,
      bossMax: 0,
      bossDefeated: false,
      halfHearts: totalHearts() * 2,
      shieldAvailable: petActive('axolotl'),
      shieldUsed: false,
      earnedRes: {},
      xpGained: 0,
      streak: 0,
      pendingLevelUp: null,
      firstTry: true,
      greet: true,
      ended: false,
      locked: false
    };
    show('screen-practice');
    renderResBar('res-practice', true);
    renderHUD();
    renderTask();
  }

  function startBoss() {
    session.phase = 'boss';
    session.bossMax = bossMaxHp(session.boss);
    session.bossHp = session.bossMax;
    session.tasks = [genBossTask()];
    session.index = 0;
    if (!state.seenBosses[session.boss.id]) {
      state.seenBosses[session.boss.id] = true;
      saveState();
      var bi = $('bossintro-img');
      bi.src = session.boss.src;
      bi.classList.remove('pop'); void bi.offsetWidth; bi.classList.add('pop');
      $('bossintro-name').textContent = session.boss.name;
      Sound.bossIntro();
      shakeScreen();
      flashRed();
      autoSpeak('Achtung, ' + state.playerName + '! ' + session.boss.name + ' greift an! ' + session.boss.introLine, 250);
      showOverlay('overlay-bossintro', true);
    } else {
      renderTask();
    }
  }

  function flashRed(opacity) {
    var f = el('div', 'flash-red');
    if (opacity) f.style.setProperty('--flash-o', opacity);
    document.body.appendChild(f);
    setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 650);
  }

  $('btn-bossintro-next').addEventListener('click', function () {
    showOverlay('overlay-bossintro', false);
    renderTask();
  });

  function genBossTask() {
    var diff = state.difficulty;
    return Math.random() < 0.5 ? genAdd(diff) : genSub(diff);
  }

  function currentTask() { return session.tasks[session.index]; }

  // ---------- Resource drops ----------
  function rollResource(firstTry) {
    if (!firstTry) return pick(['holz', 'stein']);
    var w = DROP_WEIGHTS[state.difficulty] || DROP_WEIGHTS.leicht;
    function roll() {
      var total = 0, k;
      for (k in w) total += w[k];
      var r = Math.random() * total;
      for (k in w) {
        r -= w[k];
        if (r <= 0) return k;
      }
      return 'holz';
    }
    var res = roll();
    if (petActive('katze') && (res === 'holz' || res === 'stein') && Math.random() < 0.35) {
      res = roll();
    }
    return res;
  }

  function earnResource(key, amount) {
    state.res[key] = (state.res[key] || 0) + amount;
    session.earnedRes[key] = (session.earnedRes[key] || 0) + amount;
  }

  // ---------- HUD ----------
  function renderHUD() {
    var hearts = $('hud-hearts');
    clear(hearts);
    var max = totalHearts();
    for (var i = 0; i < max; i++) {
      var slot = el('div', 'heart-slot');
      slot.appendChild(img(ASSETS.ui.heartBg));
      var hh = session.halfHearts - i * 2;
      if (hh >= 2) slot.appendChild(img(ASSETS.ui.heart));
      else if (hh === 1) slot.appendChild(img(ASSETS.ui.heartHalf));
      hearts.appendChild(slot);
    }
    var petImg = $('hud-pet');
    if (state.activePet && state.pets[state.activePet]) {
      petImg.src = petById(state.activePet).src;
      petImg.style.display = 'block';
    } else {
      petImg.style.display = 'none';
    }
    $('hud-progress').textContent = (session.phase === 'boss')
      ? state.playerName + ' gegen ' + session.boss.name + '!'
      : 'Aufgabe ' + (session.index + 1) + ' / ' + session.tasks.length;
    var streakEl = $('hud-streak');
    if (session.streak >= 2) {
      var txt = 'Serie: ' + session.streak;
      if (session.streak % STREAK_BONUS_EVERY === STREAK_BONUS_EVERY - 1) txt += ' \u2014 noch 1 bis zum Diamant!';
      streakEl.textContent = txt;
      streakEl.classList.toggle('hot', session.streak >= 3);
    } else {
      streakEl.textContent = '';
      streakEl.classList.remove('hot');
    }
    renderXpBar();
  }

  function renderXpBar() {
    $('hud-level-label').textContent = 'Level ' + levelOf(state.xp);
    var pct = xpInLevel(state.xp) / XP_PER_LEVEL;
    $('xp-fill-clip').style.width = Math.round(240 * pct) + 'px';
  }

  // ---------- Task rendering ----------
  function renderItemRow(container, item, n, fadedFrom) {
    for (var i = 0; i < n; i++) {
      var im = img(COUNT_ITEM_SRC[item]);
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
      $('boss-img').src = session.boss.src;
      $('boss-name').textContent = session.boss.name;
      $('boss-dmg-label').textContent = 'Dein Schwert: ' + swordDamage() + ' Schaden';
      renderBossHp();
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
    $('reward-banner').classList.remove('show');
    var speech = t.speak;
    if (session.greet) {
      session.greet = false;
      speech = 'Los geht\u2019s, ' + state.playerName + '! ' + speech;
    }
    autoSpeak(speech, 350);
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
      btn.classList.add('correct', 'bounce');
      state.stats.correct++;
      state.stats.byType[t.type].correct++;

      if (session.firstTry) {
        session.streak++;
        if (session.streak > state.stats.bestStreak) state.stats.bestStreak = session.streak;
      }

      var levelBefore = levelOf(state.xp);
      var xp = session.firstTry ? 10 : 3;
      var bonusDiamond = false;
      var bonus = 0;
      if (session.firstTry && session.streak > 0 && session.streak % STREAK_BONUS_EVERY === 0) {
        bonus = STREAK_BONUS_XP;
        bonusDiamond = true;
        earnResource('diamant', 1);
      }
      state.xp += xp + bonus;
      session.xpGained += xp + bonus;
      if (levelOf(state.xp) > levelBefore) session.pendingLevelUp = levelOf(state.xp);

      var resKey = null;
      if (session.firstTry) {
        resKey = rollResource(true);
        earnResource(resKey, 1);
        var target = $('fly-target-' + resKey) || $('hud-progress');
        flyTo(btn, target, RES[resKey].src);
        setTimeout(refreshAllResBars, 650);
      }
      checkTrophies();

      if (session.phase === 'boss') {
        var dmg = swordDamage();
        session.bossHp = Math.max(0, session.bossHp - dmg);
        Sound.hit();
        dmgPopup($('boss-img'), '\u2212' + dmg);
        shakeScreen();
        bossHitAnimation();
        renderBossHp();
        var fill = $('boss-hp-fill');
        fill.classList.remove('dmg-flash');
        void fill.offsetWidth;
        fill.classList.add('dmg-flash');
        renderHUD();
        if (session.firstTry && session.streak > 0 && session.streak % STREAK_BONUS_EVERY === 0) {
          autoSpeak(praiseLine() + ' ' + session.streak + ' am St\u00fcck \u2014 ein Diamant f\u00fcr dich!', 150);
        }
        var r = $('boss-img').getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, [RES.eisen.src, RES.gold.src], 6);
        setTimeout(function () {
          if (!session || session.ended) return;
          if (session.bossHp <= 0) {
            bossDefeated();
          } else {
            session.tasks.push(genBossTask());
            session.index++;
            renderTask();
          }
        }, 950);
      } else {
        Sound.correct();
        Sound.mine();
        renderXpBar();
        if (bonusDiamond) {
          autoSpeak(praiseLine() + ' ' + session.streak + ' am St\u00fcck \u2014 ein Diamant f\u00fcr dich!', 500);
          setTimeout(function () { showReward(resKey, xp + bonus, true); }, 550);
        } else {
          if (session.streak === 3) autoSpeak(praiseLine(), 150);
          showInlineReward(resKey, xp + bonus);
          setTimeout(function () {
            if (!session || session.ended) return;
            maybeLevelUp(function () { drainCeremonies(nextTask); });
          }, 1350);
        }
      }
    } else {
      btn.classList.add('wrong', 'shake-x');
      btn.disabled = true;
      session.firstTry = false;
      session.streak = 0;
      Sound.wrong();
      var shielded = false;
      if (session.shieldAvailable && !session.shieldUsed) {
        session.shieldUsed = true;
        shielded = true;
        var petImg = $('hud-pet');
        petImg.classList.remove('shield-pulse');
        void petImg.offsetWidth;
        petImg.classList.add('shield-pulse');
        dmgPopup(petImg, 'Schutz!');
        autoSpeak('Der Axolotl hat dich besch\u00fctzt!', 100);
      } else {
        session.halfHearts = Math.max(0, session.halfHearts - 2);
        dmgPopup($('hud-hearts'), '\u22121');
        if (session.phase === 'boss') {
          var b = $('boss-img');
          b.classList.remove('attack');
          void b.offsetWidth;
          b.classList.add('attack');
          flashRed(0.3);
          shakeScreen();
        }
      }
      state.mistakes.push({ type: t.type, task: taskSignature(t), ts: Date.now() });
      if (state.mistakes.length > 200) state.mistakes = state.mistakes.slice(-200);
      saveState();
      renderHUD();
      if (!shielded && session.halfHearts <= 0) {
        setTimeout(gameOver, 700);
      } else {
        setTimeout(function () { showExplanation(t); }, 600);
      }
    }
  }

  // ---------- Game Over ----------
  function gameOver() {
    if (!session || session.ended) return;
    session.ended = true;
    Sound.sad();
    autoSpeak('Oh nein, deine Herzen sind leer! Ruh dich kurz aus \u2014 gleich klappt es bestimmt!', 300);
    showOverlay('overlay-ko', true);
  }

  $('btn-ko-retry').addEventListener('click', function () {
    showOverlay('overlay-ko', false);
    startSession();
  });
  $('btn-ko-home').addEventListener('click', function () {
    showOverlay('overlay-ko', false);
    try { window.speechSynthesis.cancel(); } catch (e) {}
    renderStart();
    show('screen-start');
  });

  // ---------- Quit (back to menu) ----------
  $('btn-quit').addEventListener('click', function () {
    autoSpeak('Willst du schon aufh\u00f6ren?', 150);
    showOverlay('overlay-quit', true);
  });
  $('btn-quit-no').addEventListener('click', function () {
    showOverlay('overlay-quit', false);
  });
  $('btn-quit-yes').addEventListener('click', function () {
    showOverlay('overlay-quit', false);
    if (session) session.ended = true;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    renderStart();
    show('screen-start');
  });

  function bossDefeated() {
    session.bossDefeated = true;
    state.stats.bossesDefeated++;
    var loot = bossLoot();
    var xpGain = bossXp(session.boss);
    state.xp += xpGain;
    session.xpGained += xpGain;
    for (var k in loot) earnResource(k, loot[k]);
    if (levelOf(state.xp) > levelOf(state.xp - xpGain)) session.pendingLevelUp = levelOf(state.xp);
    checkTrophies();

    Sound.explode();
    var r = $('boss-img').getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2,
      [RES.eisen.src, RES.gold.src, RES.diamant.src, ASSETS.ui.heart], 14);
    $('boss-img').classList.add('defeated');

    setTimeout(function () {
      $('boss-img').classList.remove('defeated');
      $('bosswin-title').textContent = session.boss.name + ' besiegt!';
      var lootRow = $('bosswin-loot');
      clear(lootRow);
      var delay = 0;
      for (var k in loot) {
        var li = el('div', 'loot-item');
        var ic = img(RES[k].src, 'pop');
        ic.style.animationDelay = delay + 'ms';
        li.appendChild(ic);
        li.appendChild(el('div', null, '\u00d7 ' + loot[k]));
        lootRow.appendChild(li);
        delay += 150;
      }
      var foxNote = $('bosswin-fox');
      foxNote.style.display = petActive('fuchs') ? 'flex' : 'none';
      $('bosswin-text').textContent = '+' + xpGain + ' XP';
      renderXpBar();
      refreshAllResBars();
      autoSpeak(session.boss.defeatLine + ' ' + state.playerName + ' hat ' + session.boss.name + ' besiegt! Du bekommst eine Schatztruhe!', 300);
      showOverlay('overlay-bosswin', true);
    }, 1000);
  }

  $('btn-bosswin-next').addEventListener('click', function () {
    showOverlay('overlay-bosswin', false);
    maybeLevelUp(function () { drainCeremonies(showSummary); });
  });

  // ---------- Boss rendering ----------
  function renderBossHp() {
    $('boss-hp-text').textContent = session.bossHp + ' / ' + session.bossMax;
    var pct = session.bossMax > 0 ? (session.bossHp / session.bossMax) : 0;
    $('boss-hp-fill').style.width = Math.round(pct * 100) + '%';
  }

  function bossHitAnimation() {
    var b = $('boss-img');
    b.classList.remove('hit');
    void b.offsetWidth;
    b.classList.add('hit');
  }

  // ---------- Level-Up chain ----------
  var levelUpNext = null;
  function maybeLevelUp(next) {
    if (session && session.pendingLevelUp) {
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
      Sound.levelup();
      autoSpeak('Level ' + lvl + '! ' + msg, 200);
      levelUpNext = next;
      checkTrophies();
      showOverlay('overlay-levelup', true);
    } else {
      next();
    }
  }
  $('btn-levelup-next').addEventListener('click', function () {
    showOverlay('overlay-levelup', false);
    if (levelUpNext) { var n = levelUpNext; levelUpNext = null; n(); }
  });

  // ---------- Reward: inline banner + diamond overlay ----------
  function showInlineReward(resKey, xp) {
    var b = $('reward-banner');
    clear(b);
    if (resKey) {
      b.appendChild(img(RES[resKey].src));
      b.appendChild(el('span', null, '+1 ' + RES[resKey].name + '  \u00b7  +' + xp + ' XP'));
    } else {
      b.appendChild(el('span', null, '+' + xp + ' XP'));
    }
    b.classList.remove('show');
    void b.offsetWidth;
    b.classList.add('show');
  }

  function showReward(resKey, xp, withDiamond) {
    var item = $('reward-item');
    item.classList.remove('pop');
    item.src = withDiamond ? RES.diamant.src : RES[resKey].src;
    void item.offsetWidth;
    item.classList.add('pop');
    $('reward-text').textContent = withDiamond
      ? 'Serien-Bonus: +1 Diamant!'
      : '+1 ' + RES[resKey].name + ' gesch\u00fcrft!';
    $('reward-xp').textContent = '+' + xp + ' XP' + (withDiamond ? '  \u00b7  Dazu: +1 ' + RES[resKey].name : '');
    renderXpBar();
    showOverlay('overlay-reward', true);
  }

  $('btn-reward-next').addEventListener('click', function () {
    showOverlay('overlay-reward', false);
    maybeLevelUp(function () { drainCeremonies(nextTask); });
  });

  function nextTask() {
    session.index++;
    if (session.phase === 'tasks' && session.index >= session.tasks.length) {
      startBoss();
    } else {
      renderTask();
    }
  }

  // ---------- Hilfestellung (Tipps ohne Loesung) ----------
  function makeCountable(groupEl, counterRef) {
    var imgs = groupEl.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      (function (im) {
        if (im.classList.contains('faded')) return;
        var wrap = el('span', 'count-wrap');
        im.parentNode.insertBefore(wrap, im);
        wrap.appendChild(im);
        wrap.addEventListener('click', function () {
          if (wrap.querySelector('.count-badge')) return;
          counterRef.n++;
          var badge = el('div', 'count-badge', String(counterRef.n));
          wrap.appendChild(badge);
          Sound.click();
        });
      })(imgs[i]);
    }
  }

  function makeGapCountable(groupEl, counterRef) {
    var imgs = groupEl.querySelectorAll('img.gap');
    for (var i = 0; i < imgs.length; i++) {
      (function (im) {
        var wrap = el('span', 'count-wrap');
        im.parentNode.insertBefore(wrap, im);
        wrap.appendChild(im);
        wrap.addEventListener('click', function () {
          if (wrap.querySelector('.count-badge')) return;
          counterRef.n++;
          wrap.appendChild(el('div', 'count-badge', String(counterRef.n)));
          Sound.click();
        });
      })(imgs[i]);
    }
  }

  function hintTens(b) { return Math.floor(b / 10) * 10; }

  function showExplanation(t) {
    var vis = $('explain-visual');
    var txt = $('explain-text');
    var tap = $('explain-tap-hint');
    clear(vis);
    tap.style.display = 'none';
    var counter = { n: 0 };

    if (t.type === 'count') {
      var g = el('div', 'group');
      renderItemRow(g, t.item, t.n);
      vis.appendChild(g);
      makeCountable(g, counter);
      tap.style.display = 'block';
      txt.textContent = 'Z\u00e4hle ganz langsam \u2014 tippe jeden an, dann verz\u00e4hlst du dich nicht!';
    } else if (t.type === 'add' || t.type === 'double') {
      if (t.a <= 10 && t.b <= 10) {
        var gA = el('div', 'group'); renderItemRow(gA, t.item, t.a);
        var gB = el('div', 'group'); renderItemRow(gB, t.item, t.b);
        vis.appendChild(gA);
        vis.appendChild(el('div', 'op', '+'));
        vis.appendChild(gB);
        makeCountable(gA, counter);
        makeCountable(gB, counter);
        tap.style.display = 'block';
        txt.textContent = (t.type === 'double')
          ? 'Beide Gruppen sind gleich gro\u00df. Z\u00e4hle links los und rechts einfach weiter!'
          : 'Z\u00e4hle erst links alle \u2014 und z\u00e4hle dann rechts einfach weiter!';
      } else {
        var tens = hintTens(t.b);
        var ones = t.b - tens;
        if (tens > 0 && ones > 0) {
          txt.textContent = 'Tipp: Rechne in Schritten! Erst ' + t.a + ' plus ' + tens + ', und dann noch plus ' + ones + '.';
        } else if (tens > 0) {
          txt.textContent = 'Tipp: Gehe in Zehner-Schritten! Immer 10 dazu, ' + (tens / 10) + ' mal.';
        } else {
          txt.textContent = 'Tipp: Z\u00e4hle von ' + t.a + ' aus weiter \u2014 ' + t.b + ' Schritte.';
        }
      }
    } else if (t.type === 'sub') {
      if (t.a <= 12) {
        var gs = el('div', 'group');
        renderItemRow(gs, t.item, t.a, t.a - t.b);
        vis.appendChild(gs);
        makeCountable(gs, counter);
        tap.style.display = 'block';
        txt.textContent = 'Die blassen sind weg. Tippe und z\u00e4hle, was \u00fcbrig bleibt!';
      } else {
        var tens2 = hintTens(t.b);
        var ones2 = t.b - tens2;
        if (tens2 > 0 && ones2 > 0) {
          txt.textContent = 'Tipp: Rechne in Schritten! Erst ' + t.a + ' minus ' + tens2 + ', und dann noch minus ' + ones2 + '.';
        } else if (tens2 > 0) {
          txt.textContent = 'Tipp: Gehe ' + (tens2 / 10) + ' Zehner-Schritte zur\u00fcck!';
        } else {
          txt.textContent = 'Tipp: Z\u00e4hle von ' + t.a + ' aus r\u00fcckw\u00e4rts \u2014 ' + t.b + ' Schritte.';
        }
      }
    } else if (t.type === 'missing') {
      if (t.c <= 20) {
        var gm = el('div', 'group');
        for (var i = 0; i < t.c; i++) {
          var im = img(COUNT_ITEM_SRC[pickMissingItem(t)]);
          if (i >= t.a) im.classList.add('gap');
          else im.classList.add('solid-dim');
          gm.appendChild(im);
        }
        vis.appendChild(gm);
        makeGapCountable(gm, counter);
        tap.style.display = 'block';
        txt.textContent = 'Du hast schon ' + t.a + '. Tippe die hellen an und z\u00e4hle, wie viele noch fehlen!';
      } else {
        txt.textContent = 'Tipp: Z\u00e4hle von ' + t.a + ' weiter, bis du bei ' + t.c + ' bist. Zehner-Schritte helfen!';
      }
    } else if (t.type === 'mul') {
      if (t.f * t.n <= 30) {
        for (var gi = 0; gi < t.n; gi++) {
          var gg = el('div', 'group boxed');
          renderItemRow(gg, 'apfel', t.f);
          vis.appendChild(gg);
          makeCountable(gg, counter);
        }
        tap.style.display = 'block';
        txt.textContent = 'Das sind ' + t.n + ' Gruppen mit je ' + t.f + '. Tippe alle an und z\u00e4hle durch!';
      } else {
        var steps = [];
        var showN = Math.min(3, t.n - 1);
        for (var si = 1; si <= showN; si++) steps.push(t.f * si);
        txt.textContent = 'Tipp: Nutze die ' + t.f + 'er-Reihe! ' + steps.join(', ') + ' \u2026 spring weiter, bis du ' + t.n + ' mal gesprungen bist!';
      }
    } else if (t.type === 'half') {
      txt.textContent = 'Tipp: Teile ' + t.n + ' in zwei gleich gro\u00dfe Haufen. Welche Zahl plus sich selbst ergibt ' + t.n + '?';
    } else if (t.type === 'compare') {
      [['Links', t.left], ['Rechts', t.right]].forEach(function (s) {
        var side = el('div', 'compare-side');
        side.appendChild(el('div', 'side-name', s[0]));
        var sg = el('div', 'group');
        renderItemRow(sg, t.item, s[1]);
        side.appendChild(sg);
        vis.appendChild(side);
        makeCountable(sg, { n: 0 });
      });
      tap.style.display = 'block';
      txt.textContent = 'Z\u00e4hle erst links, dann rechts \u2014 tippe zum Z\u00e4hlen!';
    }

    autoSpeak(txt.textContent, 400);
    showOverlay('overlay-explain', true);
  }

  function pickMissingItem(t) {
    if (!t._hintItem) t._hintItem = pick(COUNT_ITEMS);
    return t._hintItem;
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

    if (petActive('schwein')) {
      earnResource('holz', 2);
      earnResource('stein', 2);
    }
    checkTrophies();
    saveState();

    var items = $('summary-items');
    clear(items);
    var any = false;
    RES_KEYS.forEach(function (k) {
      if (session.earnedRes[k]) {
        any = true;
        var s = el('div', 'summary-item');
        s.appendChild(img(RES[k].src));
        s.appendChild(el('div', null, '\u00d7 ' + session.earnedRes[k]));
        items.appendChild(s);
      }
    });
    if (!any) items.appendChild(el('div', null, 'Diesmal nichts geschürft — gleich nochmal!'));

    $('summary-pig').style.display = petActive('schwein') ? 'flex' : 'none';

    $('summary-title').textContent = session.bossDefeated ? session.boss.name + ' besiegt!' : 'Geschafft, ' + state.playerName + '!';
    $('summary-stats').textContent = '+' + session.xpGained + ' XP  \u00b7  Level ' + levelOf(state.xp);

    var hint = '';
    var ns = nextSwordTier();
    if (ns !== null && canAfford(SWORD_TIERS[ns].cost)) hint = 'In der Schmiede wartet: ' + SWORD_TIERS[ns].name + '!';
    else {
      var st = HOUSE_STAGES[state.house];
      if (st && canAfford(st.cost)) hint = 'Dein Zuhause kann ausgebaut werden: ' + st.name + '!';
      else {
        for (var i = 0; i < ARMOR_SLOTS.length; i++) {
          var sl = ARMOR_SLOTS[i];
          var nt = state.equip[sl.id] + 1;
          if (nt < ARMOR_TIERS.length) {
            var cost = {};
            cost[ARMOR_TIERS[nt].res] = ARMOR_TIERS[nt].costs[sl.id];
            if (canAfford(cost)) { hint = 'In der Schmiede wartet: ' + ARMOR_TIERS[nt].name + '-' + sl.name + '!'; break; }
          }
        }
      }
    }
    $('summary-hint').textContent = hint;
    if (hint) autoSpeak(hint, 600);

    showOverlay('overlay-summary', true);
  }

  function leaveSummary(action) {
    showOverlay('overlay-summary', false);
    drainCeremonies(action);
  }
  $('btn-summary-again').addEventListener('click', function () { leaveSummary(startSession); });
  $('btn-summary-forge').addEventListener('click', function () {
    leaveSummary(function () { renderForge(); show('screen-forge'); });
  });
  $('btn-summary-home').addEventListener('click', function () {
    leaveSummary(function () { renderHome(); show('screen-home'); });
  });
  $('btn-summary-start').addEventListener('click', function () {
    leaveSummary(function () { renderStart(); show('screen-start'); });
  });

  // ---------- Vorlesen ----------
  $('btn-speak').addEventListener('click', function () { speak(currentTask().speak); });

  // ---------- Blueprint rendering (mit Geister-Bloecken) ----------
  function renderBlueprint(container, stage, cellSize, animate, placedCount) {
    clear(container);
    var cols = stage.rows[0].length;
    container.style.gridTemplateColumns = 'repeat(' + cols + ', ' + cellSize + 'px)';
    var idxMap = {};
    stage.order.forEach(function (o, i) { idxMap[o.r + ':' + o.c] = i; });
    var ghostMode = (placedCount !== undefined);
    for (var r = 0; r < stage.rows.length; r++) {
      for (var c = 0; c < stage.rows[r].length; c++) {
        var ch = stage.rows[r][c];
        var cell = el('div', 'build-cell');
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        if (ch === '.') {
          cell.classList.add('air');
        } else {
          var idx = idxMap[r + ':' + c];
          if (ghostMode && idx >= placedCount) {
            cell.classList.add('ghost');
            if (idx === placedCount) cell.classList.add('next');
          } else {
            var im = img(ASSETS.blocks[stage.map[ch]]);
            if (animate === true) {
              im.classList.add('placed-pop');
              im.style.animationDelay = (idx * 35) + 'ms';
            } else if (ghostMode && animate && idx >= animate.from) {
              im.classList.add('placed-pop');
              im.style.animationDelay = ((idx - animate.from) * 60) + 'ms';
            }
            cell.appendChild(im);
          }
        }
        container.appendChild(cell);
      }
    }
  }

  function blueprintCellSize(stage, maxWidth) {
    return Math.min(44, Math.floor(maxWidth / stage.rows[0].length));
  }

  // ---------- Mein Zuhause ----------
  function homeGridStage() {
    return state.building ? HOUSE_STAGES[state.building.stage - 1] : HOUSE_STAGES[state.house - 1];
  }

  function renderHomeGrid(animateFrom) {
    var stage = homeGridStage();
    var maxW = Math.min(560, window.innerWidth * 0.84);
    var anim = (animateFrom !== undefined) ? { from: animateFrom } : false;
    renderBlueprint($('home-grid'), stage, blueprintCellSize(stage, maxW), anim,
      state.building ? state.building.placed : undefined);
  }

  function renderHome(animate) {
    buildPanorama($('panorama-home'));
    renderResBar('res-home');
    var pet = (state.activePet && state.pets[state.activePet]) ? petById(state.activePet) : null;
    var hp = $('home-pet');
    if (pet) { hp.src = pet.src; hp.style.display = 'inline-block'; }
    else hp.style.display = 'none';

    if (state.building) {
      var target = HOUSE_STAGES[state.building.stage - 1];
      $('home-title').textContent = 'Baustelle: ' + target.name;
      $('home-effect').textContent = '';
      $('home-build-hint').style.display = 'flex';
      $('home-build-progress').textContent = state.building.placed + ' / ' + target.total + ' Bl\u00f6cke';
      $('home-next-panel').style.display = 'none';
      $('home-max').style.display = 'none';
      renderHomeGrid();
      return;
    }

    var stage = HOUSE_STAGES[state.house - 1];
    $('home-title').textContent = 'Stufe ' + state.house + ': ' + stage.name;
    $('home-effect').textContent = stage.effect ? 'Bonus: ' + stage.effect : '';
    $('home-build-hint').style.display = 'none';
    var maxW = Math.min(560, window.innerWidth * 0.84);
    renderBlueprint($('home-grid'), stage, blueprintCellSize(stage, maxW), animate === true);

    var next = HOUSE_STAGES[state.house];
    if (next) {
      var afford = canAfford(next.cost);
      $('home-next-panel').style.display = 'flex';
      $('home-max').style.display = 'none';
      $('home-next-name').textContent = 'N\u00e4chste Stufe: ' + next.name + (next.effect ? '  (' + next.effect + ')' : '');
      renderCostRow($('home-next-cost'), next.cost);
      $('btn-home-upgrade').disabled = false;
      $('home-next-hint').textContent = afford
        ? 'Du baust selbst \u2014 Block f\u00fcr Block!'
        : 'Dir fehlen noch Rohstoffe \u2014 sammle sie beim Rechnen!';
      $('btn-home-play').style.display = afford ? 'none' : 'flex';
    } else {
      $('home-next-panel').style.display = 'none';
      $('home-max').style.display = 'block';
    }
  }

  function renderCostRow(container, cost, wiggle) {
    clear(container);
    for (var k in cost) {
      var ok = (state.res[k] || 0) >= cost[k];
      var chip = el('div', 'res-chip cost-chip' + (ok ? ' ok' : ' missing' + (wiggle ? ' wiggle' : '')));
      chip.appendChild(img(RES[k].src));
      chip.appendChild(el('span', 'res-count', cost[k] + ' / ' + (state.res[k] || 0)));
      container.appendChild(chip);
    }
  }

  $('btn-home-upgrade').addEventListener('click', function () {
    if (state.building) return;
    var next = HOUSE_STAGES[state.house];
    if (!next) return;
    if (!canAfford(next.cost)) {
      Sound.deny();
      renderCostRow($('home-next-cost'), next.cost, true);
      var missing = RES_KEYS.filter(function (k) {
        return (next.cost[k] || 0) > (state.res[k] || 0);
      }).map(function (k) { return RES[k].name; });
      autoSpeak('Dir fehlt noch: ' + missing.join(' und ') + '! Sammle beim Rechnen weiter.', 100);
      return;
    }
    payCost(next.cost);
    state.building = { stage: state.house + 1, placed: 0 };
    saveState();
    Sound.craft();
    autoSpeak('Bauplan gekauft! Tippe auf die Baustelle und bau dein Haus \u2014 Block f\u00fcr Block!', 250);
    renderHome();
  });

  function rowsComplete(stage, placed) {
    var perRow = {};
    stage.order.forEach(function (o, i) {
      perRow[o.r] = perRow[o.r] || { total: 0, placed: 0 };
      perRow[o.r].total++;
      if (i < placed) perRow[o.r].placed++;
    });
    var done = 0;
    for (var r in perRow) if (perRow[r].placed === perRow[r].total) done++;
    return done;
  }

  $('home-grid').addEventListener('click', function () {
    var b = state.building;
    if (!b) return;
    var stage = HOUSE_STAGES[b.stage - 1];
    var per = Math.max(1, Math.ceil(stage.total / 16));
    var before = b.placed;
    b.placed = Math.min(stage.total, b.placed + per);
    saveState();
    Sound.place();

    var grid = $('home-grid');
    var r = grid.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.55,
      [ASSETS.blocks[stage.map[Object.keys(stage.map)[0]]], ASSETS.blocks.planks], 4);

    if (b.placed >= stage.total) {
      state.house = b.stage;
      state.building = null;
      saveState();
      checkTrophies();
      Sound.build();
      shakeScreen();
      renderHome();
      renderHomeGrid(before);
      autoSpeak('Du hast gebaut: ' + stage.name + '!', 400);
      setTimeout(function () {
        $('upgrade-title').textContent = stage.name + ' gebaut!';
        $('upgrade-text').textContent = stage.effect ? 'Neuer Bonus: ' + stage.effect : 'Dein Zuhause ist gewachsen!';
        showOverlay('overlay-upgrade', true);
      }, 900);
      return;
    }

    if (rowsComplete(stage, b.placed) > rowsComplete(stage, before)) {
      Sound.correct();
    }
    renderHomeGrid(before);
    $('home-build-progress').textContent = b.placed + ' / ' + stage.total + ' Bl\u00f6cke';
  });

  $('btn-home-play').addEventListener('click', function () { startSession(); });

  $('home-pet').addEventListener('click', function () {
    var hp = $('home-pet');
    hp.classList.remove('bounce-egg');
    void hp.offsetWidth;
    hp.classList.add('bounce-egg');
    Sound.pet();
  });

  $('btn-upgrade-next').addEventListener('click', function () {
    showOverlay('overlay-upgrade', false);
    drainCeremonies(renderHome);
  });

  $('btn-home-forge').addEventListener('click', function () { renderForge(); show('screen-forge'); });
  $('btn-home-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Schmiede ----------
  function nextSwordTier() {
    var n = state.equip.schwert + 1;
    return n < SWORD_TIERS.length ? n : null;
  }

  function renderForge() {
    renderResBar('res-forge');

    var ch = $('forge-character');
    clear(ch);
    ch.appendChild(img(ASSETS.mobs.steve, 'forge-avatar'));
    var equipRow = el('div', 'forge-equip-row');
    var sw = state.equip.schwert;
    equipRow.appendChild(equipIcon(sw >= 0 ? SWORD_TIERS[sw].src : null, 'Schwert'));
    ARMOR_SLOTS.forEach(function (sl) {
      var t = state.equip[sl.id];
      equipRow.appendChild(equipIcon(t >= 0 ? armorSrc(t, sl) : null, sl.name));
    });
    ch.appendChild(equipRow);
    $('forge-stats').textContent = 'Schaden: ' + swordDamage() + '  \u00b7  Herzen: ' + totalHearts();

    var rows = $('forge-rows');
    clear(rows);

    var ns = nextSwordTier();
    rows.appendChild(forgeRow(
      'Schwert',
      sw >= 0 ? SWORD_TIERS[sw].src : null,
      ns !== null ? SWORD_TIERS[ns].name : null,
      ns !== null ? SWORD_TIERS[ns].src : null,
      ns !== null ? SWORD_TIERS[ns].cost : null,
      function () { craftSword(); }
    ));

    ARMOR_SLOTS.forEach(function (sl) {
      var t = state.equip[sl.id];
      var nt = t + 1;
      var hasNext = nt < ARMOR_TIERS.length;
      var cost = null;
      if (hasNext) {
        cost = {};
        cost[ARMOR_TIERS[nt].res] = ARMOR_TIERS[nt].costs[sl.id];
      }
      rows.appendChild(forgeRow(
        sl.name,
        t >= 0 ? armorSrc(t, sl) : null,
        hasNext ? ARMOR_TIERS[nt].name + '-' + sl.name : null,
        hasNext ? armorSrc(nt, sl) : null,
        cost,
        function () { craftArmor(sl.id); }
      ));
    });
  }

  function equipIcon(src, label) {
    var w = el('div', 'equip-slot');
    if (src) w.appendChild(img(src));
    else w.appendChild(el('div', 'equip-empty', '?'));
    w.title = label;
    return w;
  }

  function forgeRow(label, currentSrc, nextName, nextSrc, cost, onCraft) {
    var row = el('div', 'forge-row');

    var line1 = el('div', 'forge-line');
    var cur = el('div', 'forge-cur');
    cur.appendChild(el('div', 'forge-label', label));
    cur.appendChild(currentSrc ? img(currentSrc) : el('div', 'equip-empty', '\u2014'));
    line1.appendChild(cur);

    if (nextSrc) {
      line1.appendChild(el('div', 'forge-arrow', '\u2192'));
      var nxt = el('div', 'forge-next');
      nxt.appendChild(img(nextSrc));
      nxt.appendChild(el('div', 'forge-next-name', nextName));
      line1.appendChild(nxt);
      row.appendChild(line1);

      var line2 = el('div', 'forge-line');
      var costEl = el('div', 'forge-cost');
      renderCostRow(costEl, cost);
      line2.appendChild(costEl);
      var btn = el('button', 'mc-btn small forge-btn');
      btn.appendChild(el('span', null, 'Schmieden'));
      btn.disabled = !canAfford(cost);
      btn.addEventListener('click', onCraft);
      line2.appendChild(btn);
      row.appendChild(line2);
    } else {
      line1.appendChild(el('div', 'forge-maxed', 'Meisterst\u00fcck!'));
      row.appendChild(line1);
    }
    return row;
  }

  function craftSword() {
    var ns = nextSwordTier();
    if (ns === null || !canAfford(SWORD_TIERS[ns].cost)) return;
    payCost(SWORD_TIERS[ns].cost);
    state.equip.schwert = ns;
    checkTrophies();
    craftCelebrate(SWORD_TIERS[ns].src, SWORD_TIERS[ns].name, 'Schaden: ' + swordDamage());
  }

  function craftArmor(slotId) {
    var sl = null;
    for (var i = 0; i < ARMOR_SLOTS.length; i++) if (ARMOR_SLOTS[i].id === slotId) sl = ARMOR_SLOTS[i];
    var nt = state.equip[slotId] + 1;
    if (nt >= ARMOR_TIERS.length) return;
    var cost = {};
    cost[ARMOR_TIERS[nt].res] = ARMOR_TIERS[nt].costs[slotId];
    if (!canAfford(cost)) return;
    payCost(cost);
    state.equip[slotId] = nt;
    checkTrophies();
    craftCelebrate(armorSrc(nt, sl), ARMOR_TIERS[nt].name + '-' + sl.name, 'Herzen: ' + totalHearts());
  }

  function craftCelebrate(src, name, effectText) {
    var item = $('craft-item');
    item.src = src;
    item.classList.remove('pop');
    void item.offsetWidth;
    item.classList.add('pop');
    $('craft-title').textContent = 'Geschmiedet!';
    $('craft-text').textContent = name + '  \u00b7  ' + effectText;
    Sound.craft();
    autoSpeak('Geschmiedet: ' + name + '!', 250);
    burst(window.innerWidth / 2, window.innerHeight / 2, [src, RES.eisen.src, RES.gold.src], 12);
    shakeScreen();
    showOverlay('overlay-craft', true);
  }

  $('btn-craft-next').addEventListener('click', function () {
    showOverlay('overlay-craft', false);
    drainCeremonies(renderForge);
  });

  $('btn-forge-home').addEventListener('click', function () { renderHome(); show('screen-home'); });
  $('btn-forge-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Begleiter ----------
  function trophyForPet(petId) {
    for (var i = 0; i < TROPHIES.length; i++) if (TROPHIES[i].pet === petId) return TROPHIES[i];
    return null;
  }

  function renderPets() {
    var active = state.activePet && state.pets[state.activePet] ? petById(state.activePet) : null;
    var ad = $('pets-active');
    clear(ad);
    if (active) {
      ad.appendChild(img(active.src, 'pets-active-img'));
      ad.appendChild(el('div', 'pets-active-name', active.name + ' begleitet dich'));
      ad.appendChild(el('div', 'pets-active-bonus', active.bonus));
    } else {
      ad.appendChild(el('div', 'pets-active-name', 'Noch kein Begleiter dabei'));
    }

    var grid = $('pets-grid');
    clear(grid);
    PETS.forEach(function (p) {
      var owned = !!state.pets[p.id];
      var card = el('button', 'pet-card' + (owned ? '' : ' locked') + (petActive(p.id) ? ' selected' : ''));
      var im = img(p.src, 'pet-face');
      card.appendChild(im);
      card.appendChild(el('div', 'pet-name', owned ? p.name : '???'));
      if (owned) {
        card.appendChild(el('div', 'pet-bonus', p.bonus));
      } else {
        var t = trophyForPet(p.id);
        var hint = el('div', 'pet-unlock');
        if (t) {
          hint.appendChild(img(t.icon));
          hint.appendChild(el('span', null, t.name));
        }
        card.appendChild(hint);
      }
      card.addEventListener('click', function () {
        if (owned) {
          state.activePet = petActive(p.id) ? null : p.id;
          saveState();
          Sound.pet();
          if (state.activePet) autoSpeak(p.name + ' begleitet dich jetzt. ' + p.speakBonus, 100);
          renderPets();
        } else {
          var t2 = trophyForPet(p.id);
          if (t2) autoSpeak('Diesen Begleiter bekommst du f\u00fcr: ' + t2.name + '.', 100);
        }
      });
      grid.appendChild(card);
    });
  }

  $('btn-pets-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Trophäen ----------
  function renderTrophies() {
    var earned = TROPHIES.filter(function (t) { return state.trophies[t.id]; }).length;
    $('trophies-count').textContent = earned + ' / ' + TROPHIES.length;
    var grid = $('trophies-grid');
    clear(grid);
    TROPHIES.forEach(function (t) {
      var has = !!state.trophies[t.id];
      var card = el('button', 'trophy-card' + (has ? '' : ' locked'));
      card.appendChild(img(t.icon, 'trophy-img'));
      card.appendChild(el('div', 'trophy-label', t.name));
      var p = null;
      if (!has && t.prog) {
        p = t.prog(state);
        var bar = el('div', 'trophy-prog');
        var fill = el('div', 'trophy-prog-fill');
        fill.style.width = Math.min(100, Math.round((p.cur / p.max) * 100)) + '%';
        bar.appendChild(fill);
        card.appendChild(bar);
      }
      if (t.pet) {
        var pb = el('div', 'trophy-pet');
        pb.appendChild(img(petById(t.pet).src));
        card.appendChild(pb);
      }
      card.addEventListener('click', function () {
        if (has) {
          autoSpeak('Troph\u00e4e: ' + t.name + '. Geschafft!', 100);
        } else if (p) {
          autoSpeak(t.name + '. Du hast schon ' + p.cur + ' von ' + p.max + '!', 100);
        } else {
          autoSpeak(t.name + '. Das hast du noch nicht geschafft.', 100);
        }
      });
      grid.appendChild(card);
    });
  }

  $('btn-trophies-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Panorama (lebendige Szene) ----------
  var PAN_BLOCKS = {
    cherry: A + 'blocks/cherry_leaves_opaque.png',
    cherryLog: A + 'blocks/cherry_log_side.png',
    snow: A + 'blocks/snow.png',
    grassTop: A + 'blocks/grass_top.png',
    tallgrass: A + 'blocks/tallgrass.png',
    water: A + 'blocks/water_still_blue.png'
  };

  function panPhase() {
    var h = new Date().getHours();
    if (h >= 6 && h < 11) return 'pan-morning';
    if (h >= 11 && h < 18) return 'pan-day';
    return 'pan-evening';
  }

  function skylineHeights(cols, min, max, seedStep) {
    var hts = [];
    var h = rnd(min, max);
    for (var i = 0; i < cols; i++) {
      h += rnd(-seedStep, seedStep);
      if (h < min) h = min;
      if (h > max) h = max;
      hts.push(h);
    }
    return hts;
  }

  function panLayer(cls, tile, cols, min, max, step) {
    var layer = el('div', 'pan-layer ' + cls);
    var hts = skylineHeights(cols, min, max, step);
    for (var i = 0; i < cols; i++) {
      var col = el('div', 'pan-col');
      col.style.left = (i * 16) + 'px';
      col.style.height = (hts[i] * 16) + 'px';
      col.style.backgroundImage = "url('" + tile + "')";
      layer.appendChild(col);
    }
    return layer;
  }

  function panTree(x, leafTile, logTile, big) {
    var t = el('div', 'pan-tree');
    t.style.left = x + '%';
    var s = big ? 1.4 : 1;
    var trunk = el('div', 'pan-trunk');
    trunk.style.width = Math.round(10 * s) + 'px';
    trunk.style.height = Math.round(26 * s) + 'px';
    trunk.style.backgroundImage = "url('" + logTile + "')";
    var c1 = el('div', 'pan-canopy');
    c1.style.width = Math.round(54 * s) + 'px';
    c1.style.height = Math.round(22 * s) + 'px';
    c1.style.bottom = Math.round(22 * s) + 'px';
    c1.style.backgroundImage = "url('" + leafTile + "')";
    var c2 = el('div', 'pan-canopy');
    c2.style.width = Math.round(32 * s) + 'px';
    c2.style.height = Math.round(14 * s) + 'px';
    c2.style.bottom = Math.round(42 * s) + 'px';
    c2.style.backgroundImage = "url('" + leafTile + "')";
    t.appendChild(trunk); t.appendChild(c1); t.appendChild(c2);
    return t;
  }

  function buildPanorama(container) {
    var stamp = state.house + ':' + (state.activePet || '') + ':' + panPhase();
    if (container.getAttribute('data-stamp') === stamp) return;
    container.setAttribute('data-stamp', stamp);
    clear(container);
    container.className = 'panorama ' + panPhase();

    var w = container.clientWidth || window.innerWidth;
    var cols = Math.ceil(w / 16) + 1;

    container.appendChild(el('div', 'pan-sky'));

    var sun = img(ASSETS.blocks.glowstone, 'pan-sun');
    container.appendChild(sun);

    for (var ci = 0; ci < 3; ci++) {
      var cloud = el('div', 'pan-cloud c' + ci);
      for (var cj = 0; cj < 3; cj++) cloud.appendChild(img(PAN_BLOCKS.snow));
      container.appendChild(cloud);
    }

    container.appendChild(panLayer('back', PAN_BLOCKS.cherry, cols, 2, 6, 2));
    container.appendChild(panLayer('mid', ASSETS.blocks.leavesOak, cols, 1, 4, 1));

    container.appendChild(panTree(8, PAN_BLOCKS.cherry, PAN_BLOCKS.cherryLog, true));
    container.appendChild(panTree(72, ASSETS.blocks.leavesOak, ASSETS.blocks.logOak, false));
    container.appendChild(panTree(88, PAN_BLOCKS.cherry, PAN_BLOCKS.cherryLog, false));

    var fall = el('div', 'pan-waterfall');
    container.appendChild(fall);

    var ground = el('div', 'pan-ground');
    var top = el('div', 'pan-ground-top');
    top.style.backgroundImage = "url('" + PAN_BLOCKS.grassTop + "')";
    var side = el('div', 'pan-ground-side');
    side.style.backgroundImage = "url('" + ASSETS.blocks.grass + "')";
    ground.appendChild(top); ground.appendChild(side);
    container.appendChild(ground);

    for (var gi = 0; gi < 5; gi++) {
      var g = img(PAN_BLOCKS.tallgrass, 'pan-grass');
      g.style.left = rnd(4, 92) + '%';
      container.appendChild(g);
    }

    var stage = HOUSE_STAGES[state.house - 1];
    var house = el('div', 'pan-house build-grid');
    renderBlueprint(house, stage, 9, false);
    container.appendChild(house);

    if (state.activePet && state.pets[state.activePet]) {
      var pp = img(petById(state.activePet).src, 'pan-pet');
      container.appendChild(pp);
    }
  }

  function spawnPetal() {
    var pan = null;
    if ($('screen-start').classList.contains('active')) pan = $('panorama-start');
    else if ($('screen-home').classList.contains('active')) pan = $('panorama-home');
    if (!pan || !pan.firstChild) return;
    var p = img(PAN_BLOCKS.cherry, 'pan-petal');
    p.style.left = rnd(2, 96) + '%';
    p.style.animationDuration = (3.5 + Math.random() * 3) + 's';
    pan.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 7000);
  }
  setInterval(spawnPetal, 1900);

  // ---------- Start screen ----------
  function renderStart() {
    buildPanorama($('panorama-start'));
    var lvl = levelOf(state.xp);
    $('start-name').textContent = state.playerName;
    $('start-level').textContent = 'Level ' + lvl + '  \u00b7  ' + state.xp + ' XP  \u00b7  ' + totalHearts() + ' Herzen';
    $('start-pickaxe').src = pickaxeForLevel(lvl).src;
    renderResBar('res-start');

    var eq = $('start-equip');
    clear(eq);
    function slot(src, cls) {
      var w = el('div', 'equip-slot');
      w.appendChild(img(src, cls));
      return w;
    }
    var sw = state.equip.schwert;
    if (sw >= 0) eq.appendChild(slot(SWORD_TIERS[sw].src));
    ARMOR_SLOTS.forEach(function (sl) {
      var t = state.equip[sl.id];
      if (t >= 0) eq.appendChild(slot(armorSrc(t, sl)));
    });
    if (state.activePet && state.pets[state.activePet]) {
      eq.appendChild(slot(petById(state.activePet).src, 'start-pet'));
    }

    renderGroundStrip();
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

  // ---------- Easter Eggs ----------
  $('start-pickaxe').addEventListener('click', function () {
    var p = $('start-pickaxe');
    p.classList.remove('spin'); void p.offsetWidth; p.classList.add('spin');
    Sound.whee();
  });
  $('start-face').addEventListener('click', function () {
    var f = $('start-face');
    f.classList.remove('bounce-egg'); void f.offsetWidth; f.classList.add('bounce-egg');
    Sound.pet();
    autoSpeak('Hallo, ich bin ' + state.playerName + '!', 50);
  });
  $('start-equip').addEventListener('click', function (e) {
    if (e.target.classList && e.target.classList.contains('start-pet')) {
      e.target.classList.remove('bounce-egg'); void e.target.offsetWidth; e.target.classList.add('bounce-egg');
      Sound.pet();
    }
  });
  $('boss-img').addEventListener('click', function () {
    var b = $('boss-img');
    b.classList.remove('wobble'); void b.offsetWidth; b.classList.add('wobble');
    Sound.grr();
  });

  var STROLLERS = [ASSETS.mobs.pig, ASSETS.mobs.chicken, ASSETS.mobs.cat, ASSETS.mobs.wolf, ASSETS.mobs.fox, ASSETS.mobs.axolotl];
  setInterval(function () {
    if (!$('screen-start').classList.contains('active')) return;
    if (Math.random() < 0.4) return;
    var wrap = el('div', 'strolling-mob');
    var face = img(pick(STROLLERS));
    wrap.appendChild(face);
    var ltr = Math.random() < 0.5;
    wrap.style.left = ltr ? '-70px' : (window.innerWidth + 10) + 'px';
    document.body.appendChild(wrap);
    var dx = (window.innerWidth + 140) * (ltr ? 1 : -1);
    requestAnimationFrame(function () {
      wrap.style.transform = 'translateX(' + dx + 'px)';
    });
    setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 9500);
  }, 11000);

  $('btn-start-game').addEventListener('click', startSession);
  $('btn-start-home').addEventListener('click', function () { renderHome(); show('screen-home'); });
  $('btn-start-forge').addEventListener('click', function () { renderForge(); show('screen-forge'); });
  $('btn-start-pets').addEventListener('click', function () { renderPets(); show('screen-pets'); });
  $('btn-start-trophies').addEventListener('click', function () { renderTrophies(); show('screen-trophies'); });
  $('btn-start-world').addEventListener('click', function () { renderWorldMap(); show('screen-worldmap'); });
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
        if (!unlocked) {
          autoSpeak(b.name + ' kannst du ab Level ' + b.minLevel + ' entdecken.', 100);
          return;
        }
        state.biome = b.id;
        saveState();
        autoSpeak('Du spielst jetzt im Biom: ' + b.name + '.', 100);
        renderWorldMap();
      });
      grid.appendChild(tile);
    });
  }

  $('btn-world-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

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
      'Besiegte Bosse: ' + s.bossesDefeated,
      'Beste Serie: ' + s.bestStreak,
      'XP gesamt: ' + state.xp + '  \u00b7  Level ' + levelOf(state.xp),
      'Haus-Stufe: ' + state.house + ' von ' + HOUSE_STAGES.length,
      'Troph\u00e4en: ' + TROPHIES.filter(function (t) { return state.trophies[t.id]; }).length + ' von ' + TROPHIES.length,
      'Begleiter: ' + PETS.filter(function (p) { return state.pets[p.id]; }).length + ' von ' + PETS.length
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
    renderToggles();
    $('inp-name').value = state.playerName;
    $('parent-gate-panel').style.display = 'none';
    $('parent-stats-panel').style.display = 'flex';
  }

  $('inp-name').addEventListener('input', function () {
    var v = $('inp-name').value.trim();
    state.playerName = v || 'Hugo';
    saveState();
  });

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

  function renderToggles() {
    $('tog-sound').querySelector('span').textContent = 'Sound: ' + (state.settings.sound ? 'An' : 'Aus');
    $('tog-sound').classList.toggle('selected', state.settings.sound);
    $('tog-speak').querySelector('span').textContent = 'Vorlesen: ' + (state.settings.autoSpeak ? 'An' : 'Aus');
    $('tog-speak').classList.toggle('selected', state.settings.autoSpeak);
  }

  $('tog-sound').addEventListener('click', function () {
    state.settings.sound = !state.settings.sound;
    saveState();
    renderToggles();
    if (state.settings.sound) Sound.correct();
  });
  $('tog-speak').addEventListener('click', function () {
    state.settings.autoSpeak = !state.settings.autoSpeak;
    saveState();
    renderToggles();
    if (state.settings.autoSpeak) speak('Vorlesen ist an.');
    else { try { window.speechSynthesis.cancel(); } catch (e) {} }
  });

  $('btn-parent-reset').addEventListener('click', function () {
    if (window.confirm('Wirklich den gesamten Fortschritt l\u00f6schen?')) {
      state = defaultState();
      saveState();
      openParent();
    }
  });

  $('btn-parent-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Init ----------
  checkTrophies();
  pendingCeremonies = [];
  renderStart();
  show('screen-start');
})();
