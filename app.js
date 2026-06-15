/* ============================================================
   Hugos Block-Abenteuer — App-Logik (Version 7.0)
   Neu: 8-Bit-Sound-Engine, Auto-Vorlesen für Nicht-Leser,
   Begleiter-Tiere mit echten Boni, Trophäen-Wand,
   6 Bosse mit progressiver Freischaltung.
   ============================================================ */

(function () {
  'use strict';
  var APP_V = 52;
  var AUDIO_VER = '?v=52';

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
      leavesOak: A + 'blocks/leaves_oak_green.png',
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
    { id: 'witch', name: 'Hexe', src: ASSETS.mobs.witch, hpBonus: 2, unlockAt: 6,
      introLine: 'Hihihihi!', defeatLine: 'Meine Tr\u00e4nke!' },
    { id: 'piglin', name: 'Piglin', src: ASSETS.mobs.piglin, hpBonus: 3, unlockAt: 14,
      introLine: 'Grunz, grunz! Her mit dem Gold!', defeatLine: 'Mein Gold!' },
    { id: 'ghast', name: 'Ghast', src: ASSETS.mobs.ghast, hpBonus: 4, unlockAt: 24,
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
    { id: 'richtig30', name: '60 Aufgaben richtig', icon: ASSETS.items.apple, pet: 'huhn',
      prog: function (s) { return { cur: Math.min(s.stats.correct, 60), max: 60 }; },
      cond: function (s) { return s.stats.correct >= 60; } },
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
    { id: 'boss5', name: '8 Bosse besiegt', icon: ASSETS.mobs.zombie, pet: 'katze',
      prog: function (s) { return { cur: Math.min(s.stats.bossesDefeated, 8), max: 8 }; },
      cond: function (s) { return s.stats.bossesDefeated >= 8; } },
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
  var STREAK_BONUS_EVERY = 20;
  var STREAK_BONUS_XP = 3;

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
    { id: 'cave', name: 'H\u00f6hle', blockKey: 'stone', minLevel: 3 },
    { id: 'desert', name: 'W\u00fcste', blockKey: 'sand', minLevel: 5 },
    { id: 'snow', name: 'Schnee', blockKey: 'snowGrass', minLevel: 7 },
    { id: 'nether', name: 'Nether', blockKey: 'netherrack', minLevel: 10 }
  ];
  var DECO = A + 'deco/';
  // Bau-Palette: jeder Eintrag kostet Ressourcen. Erst freischalten (kaufen), dann frei platzieren.
  var BUILD_ITEMS = [
    { id: 'wool_white', cat: 'block',  src: DECO + 'wool_colored_white.png',  name: 'Wei\u00dfe Wolle', cost: { holz: 1 } },
    { id: 'wool_red', cat: 'block',    src: DECO + 'wool_colored_red.png',    name: 'Rote Wolle',    cost: { holz: 1 } },
    { id: 'wool_blue', cat: 'block',   src: DECO + 'wool_colored_blue.png',   name: 'Blaue Wolle',   cost: { holz: 1 } },
    { id: 'wool_yellow', cat: 'block', src: DECO + 'wool_colored_yellow.png', name: 'Gelbe Wolle',   cost: { holz: 1 } },
    { id: 'wool_green', cat: 'block',  src: DECO + 'wool_colored_green.png',  name: 'Gr\u00fcne Wolle',  cost: { holz: 1 } },
    { id: 'wool_pink', cat: 'block',   src: DECO + 'wool_colored_pink.png',   name: 'Rosa Wolle',    cost: { holz: 1 } },
    { id: 'wool_orange', cat: 'block', src: DECO + 'wool_colored_orange.png', name: 'Orange Wolle',  cost: { holz: 1 } },
    { id: 'wool_purple', cat: 'block', src: DECO + 'wool_colored_purple.png', name: 'Lila Wolle',    cost: { holz: 1 } },
    { id: 'wool_lime', cat: 'block',   src: DECO + 'wool_colored_lime.png',   name: 'Hellgr\u00fcn',     cost: { holz: 1 } },
    { id: 'wool_cyan', cat: 'block',   src: DECO + 'wool_colored_cyan.png',   name: 'T\u00fcrkis',       cost: { holz: 1 } },
    { id: 'glass', cat: 'block',       src: DECO + 'glass.png',               name: 'Glas',          cost: { stein: 1 } },
    { id: 'hay', cat: 'block',         src: DECO + 'hay_block_side.png',      name: 'Heuballen',     cost: { holz: 2 } },
    { id: 'pumpkin', cat: 'block',     src: DECO + 'pumpkin_side.png',        name: 'K\u00fcrbis',       cost: { holz: 2 } },
    { id: 'melon', cat: 'block',       src: DECO + 'melon_side.png',          name: 'Melone',        cost: { holz: 2 } },
    { id: 'flower_rose', cat: 'ground', src: DECO + 'flower_rose.png',         name: 'Rose',          cost: { holz: 1 } },
    { id: 'flower_tulip', cat: 'ground',src: DECO + 'flower_tulip_pink.png',   name: 'Tulpe',         cost: { holz: 1 } },
    { id: 'flower_dande', cat: 'ground',src: DECO + 'flower_dandelion.png',    name: 'L\u00f6wenzahn',    cost: { holz: 1 } },
    { id: 'flower_orchid', cat: 'ground',src: DECO + 'flower_blue_orchid.png', name: 'Orchidee',      cost: { holz: 1 } },
    { id: 'flower_allium', cat: 'ground',src: DECO + 'flower_allium.png',      name: 'Allium',        cost: { holz: 1 } },
    { id: 'sunflower', cat: 'ground',   src: DECO + 'double_plant_sunflower_front.png', name: 'Sonnenblume', cost: { holz: 2 } },
    { id: 'sapling', cat: 'ground',     src: DECO + 'sapling_oak.png',         name: 'B\u00e4umchen',     cost: { holz: 2 } },
    { id: 'mushroom_red', cat: 'ground',src: DECO + 'mushroom_red.png',        name: 'Roter Pilz',    cost: { holz: 1 } },
    { id: 'mushroom_brown', cat: 'ground',src: DECO + 'mushroom_brown.png',    name: 'Brauner Pilz',  cost: { holz: 1 } },
    { id: 'torch', cat: 'furniture',       src: DECO + 'torch_on.png',            name: 'Fackel',        cost: { holz: 1 } },
    { id: 'glowstone', cat: 'block',   src: DECO + 'glowstone.png',           name: 'Leuchtstein',   cost: { gold: 1 } },
    { id: 'bookshelf', cat: 'furniture',   src: DECO + 'bookshelf.png',           name: 'B\u00fccherregal',  cost: { holz: 3 } },
    { id: 'chest', cat: 'furniture',       src: DECO + 'chest_front.png',         name: 'Truhe',         cost: { holz: 3 } },
    { id: 'crafting', cat: 'furniture',    src: DECO + 'crafting_table_front.png',name: 'Werkbank',      cost: { holz: 3 } },
    { id: 'jack', cat: 'furniture',        src: DECO + 'pumpkin_face_on.png',     name: 'K\u00fcrbislaterne', cost: { gold: 1 } },
    { id: 'cake', cat: 'furniture',        src: DECO + 'cake_side.png',           name: 'Kuchen',        cost: { holz: 2 } },
    { id: 'barrel', cat: 'furniture',      src: DECO + 'barrel_side.png',         name: 'Fass',          cost: { holz: 2 } },
    { id: 'beacon', cat: 'block',      src: DECO + 'beacon.png',              name: 'Leuchtfeuer',   cost: { diamant: 1 } }
  ];
  function buildItemById(id) {
    for (var i = 0; i < BUILD_ITEMS.length; i++) if (BUILD_ITEMS[i].id === id) return BUILD_ITEMS[i];
    return null;
  }
  var BUILD_COLS = 12, BUILD_ROWS = 7;

  // ---------- Baupläne (geführtes Bauen) ----------
  var BUILD_TEX = {
    G: 'grass.png', D: 'dirt.png', o: 'planks_oak.png', L: 'log_oak.png', P: 'log_oak_top.png',
    c: 'cobblestone.png', M: 'cobblestone_mossy.png', s: 'stonebrick.png', S: 'stonebrick_mossy.png',
    g: 'glass.png', b: 'brick.png', a: 'sandstone_normal.png', n: 'sand.png',
    w: 'water_still_blue.png', t: 'torch_on.png', f: 'furnace_front_off.png', k: 'crafting_table_front.png',
    h: 'bookshelf.png', r: 'wool_colored_red.png', W: 'wool_colored_white.png',
    T: 'door_wood_lower.png', U: 'door_wood_upper.png', e: 'glowstone.png',
    x: 'stripped_oak_log.png', q: 'log_spruce.png', v: 'stone_slab_side.png'
  };
  var BUILD_NAMES = {
    o: 'Holz', L: 'Stamm', c: 'Stein', M: 'Moos-Stein', s: 'Steinziegel', g: 'Glas', b: 'Ziegel',
    a: 'Sandstein', n: 'Sand', w: 'Wasser', t: 'Fackel', f: 'Ofen', k: 'Werkbank', h: 'B\u00fccherregal',
    r: 'Rote Wolle', W: 'Wei\u00dfe Wolle', T: 'T\u00fcr', e: 'Leuchtstein',
    x: 'Stamm', v: 'Dachstein'
  };
  var BLUEPRINTS = [
    { id: 'starter', name: 'Eichenhaus', cost: { holz: 8 },
      grid: ['....v....', '...vooo..', '..voooov.', '.LoooooL.', '.LgxxxgL.', '.LgTggtL.', 'GGGGGGGGG', 'DDDDDDDDD'] },
    { id: 'stone', name: 'Steinhaus', cost: { holz: 4, stein: 6 },
      grid: ['...vvv...', '..vsssv..', '.vsgggsv.', '.LsgggsL.', '.LcTgfcL.', 'GGGGGGGGG', 'DDDDDDDDD'] },
    { id: 'tower', name: 'Wachturm', cost: { stein: 8, gold: 1 },
      grid: ['..vssv..', '..LeeL..', '..sggs..', '..LxxL..', '..sggs..', '..LTcL..', 'GGGGGGGG', 'DDDDDDDD'] },
    { id: 'porch', name: 'Veranda-Haus', cost: { holz: 6, stein: 2 },
      grid: ['..vvvv...', '.voooov..', '.LgxxgL..', '.LgTtgLL.', 'GGGGGGGGG', 'DDDDDDDDD'] }
  ];
  function blueprintById(id) {
    for (var i = 0; i < BLUEPRINTS.length; i++) if (BLUEPRINTS[i].id === id) return BLUEPRINTS[i];
    return null;
  }
  // Zellen, die fester Untergrund sind (vorgegeben, nicht zu bauen)
  function isGroundChar(ch) { return ch === 'G' || ch === 'D' || ch === 'n' || ch === 'w'; }
  // Liste der baubaren Zellen eines Plans, von unten nach oben
  function buildableCells(bp) {
    var cells = [];
    for (var r = bp.grid.length - 1; r >= 0; r--) {
      for (var c = 0; c < bp.grid[r].length; c++) {
        var ch = bp.grid[r][c];
        if (ch !== '.' && ch !== ' ' && !isGroundChar(ch)) cells.push({ c: c, r: r, ch: ch });
      }
    }
    return cells;
  }

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
      buildProject: null,
      builtProjects: {},
      worldPlacements: [],
      worldAnimals: null,
      pets: {},
      activePet: null,
      trophies: {},
      seenBosses: {},
      settings: { sound: true, autoSpeak: true, dailyLimit: 0 },
      seen: { biomes: { forest: true }, pets: {}, trophies: {} },
      daily: { date: '', rounds: 0 },
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
      s.seen = old.seen || { biomes: { forest: true }, pets: {}, trophies: {} };
      s.seen.biomes = s.seen.biomes || { forest: true };
      s.seen.pets = s.seen.pets || {};
      s.seen.trophies = s.seen.trophies || {};
      s.daily = old.daily || { date: '', rounds: 0 };
      s.buildProject = old.buildProject || null;
      s.builtProjects = old.builtProjects || {};
      s.worldPlacements = old.worldPlacements || [];
      s.worldAnimals = old.worldAnimals || null;
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
    // Faust=1, Holz=1, Stein=2, Eisen=3, Gold=4, Diamant=5 (vorher 2..6)
    var d = state.equip.schwert < 0 ? 1 : state.equip.schwert + 1;
    if (petActive('wolf')) d += 1;
    return d;
  }
  function bossRotation() { return Math.floor(state.stats.bossesDefeated / 3); }
  function bossMaxHp(boss) {
    return Math.min(6 + 4 * bossRotation() + (boss ? boss.hpBonus : 0), 26);
  }
  function bossLoot() {
    var rot = bossRotation();
    var loot = {
      holz: 2,
      stein: Math.round((3 + Math.min(rot, 5)) * 0.65),
      eisen: Math.round((2 + Math.min(rot, 4)) * 0.65),
      gold: Math.round((1 + Math.floor(rot / 2)) * 0.65),
      diamant: (state.stats.bossesDefeated % 4 === 0 && state.stats.bossesDefeated > 0) ? 1 : 0
    };
    if (state.house >= 6) RES_KEYS.forEach(function (k) { if (loot[k]) loot[k] *= 2; });
    if (petActive('fuchs') && state.stats.bossesDefeated % 4 === 0 && state.stats.bossesDefeated > 0) loot.diamant += 1;
    return loot;
  }
  function bossXp(boss) { return 16 + 4 * bossRotation() + 3 * (boss ? boss.hpBonus : 0); }

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
      ctx: function () { return ac(); },
      master: function () { ac(); return master; },
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
    document.addEventListener(ev, function () { Sound.unlock(); unlockVoice(); }, { passive: true });
  });

  // UI click sound via delegation (answers play their own feedback sounds)
  $('btn-music').addEventListener('click', function (e) {
    e.stopPropagation();
    if (introPlaying()) { stopIntro(); }
    else { introDone = false; introWanted = true; if (introBuffer) startIntroNow(); else tryStartIntro(); }
    $('btn-music').classList.toggle('selected', introPlaying());
  });

  document.addEventListener('click', function (e) {
    tryStartIntro();
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
    stopVoiceClip();
    clearTimeout(autoSpeakTimer);
    autoSpeakTimer = setTimeout(function () { speak(text); }, delay || 300);
  }

  // ---------- Sprach-Clips (eingesprochene Audio-Dateien, TTS-Fallback) ----------
  var AUDIO_BASE = 'assets/audio/';
  var NAME_CLIPS = {};
  ['greet', 'hallo', 'praise_super', 'praise_stark', 'boss_intro', 'boss_win']
    .forEach(function (c) { NAME_CLIPS[c] = true; });

  var voiceAudio = null;
  function voiceEl() {
    if (!voiceAudio) {
      try { voiceAudio = new Audio(); voiceAudio.preload = 'auto'; } catch (e) {}
    }
    return voiceAudio;
  }
  function unlockVoice() {
    try {
      var v = voiceEl();
      if (v && !v._unlocked) {
        v._unlocked = true;
        v.muted = true;
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
        setTimeout(function () { try { v.pause(); v.muted = false; } catch (e) {} }, 60);
      }
    } catch (e) {}
  }
  // ---------- Intro-Song: WebAudio (gleiche Schiene wie die Tipp-Sounds) ----------
  var introBuffer = null;
  var introSource = null;
  var introGain = null;
  var introDone = false;
  var introWanted = false;
  var introHtml = null;

  (function loadIntroBuffer() {
    if (typeof fetch === 'undefined') return;
    try {
      fetch(AUDIO_BASE + 'intro.mp3' + AUDIO_VER, { cache: 'reload' })
        .then(function (r) { return r.arrayBuffer(); })
        .then(function (buf) {
          var c = Sound.ctx ? Sound.ctx() : null;
          if (!c) return;
          c.decodeAudioData(buf, function (decoded) {
            introBuffer = decoded;
            if (introWanted) startIntroNow();
          }, function () {});
        })
        .catch(function () {});
    } catch (e) {}
  })();

  function startIntroNow() {
    if (introDone || introSource) return;
    if (!$('screen-start').classList.contains('active')) return;
    var c = Sound.ctx ? Sound.ctx() : null;
    if (!c || !introBuffer) return;
    try {
      if (c.state === 'suspended') c.resume();
      introGain = c.createGain();
      introGain.gain.value = 0.55;
      introGain.connect(c.destination);
      introSource = c.createBufferSource();
      introSource.buffer = introBuffer;
      introSource.connect(introGain);
      introSource.onended = function () { introDone = true; introSource = null; };
      introSource.start(0);
      introDone = true;
    } catch (e) { introSource = null; }
  }

  function tryStartIntro() {
    if (introDone) return;
    if (!$('screen-start').classList.contains('active')) return;
    introWanted = true;
    if (introBuffer) { startIntroNow(); return; }
    // Fallback, falls WebAudio-Decode (noch) fehlt: HTML-Audio im Gesten-Kontext
    try {
      if (!introHtml) {
        introHtml = new Audio(AUDIO_BASE + 'intro.mp3' + AUDIO_VER);
        introHtml.volume = 0.6;
        introHtml.onended = function () { introDone = true; introHtml = null; };
      }
      var p = introHtml.play();
      if (p && p.then) p.then(function () { introDone = true; introWanted = false; }).catch(function () {});
    } catch (e) {}
  }
  function stopIntro() {
    introDone = true;
    introWanted = false;
    if (introSource) {
      var s = introSource, g = introGain;
      introSource = null;
      try {
        var c = Sound.ctx();
        g.gain.setValueAtTime(g.gain.value, c.currentTime);
        g.gain.linearRampToValueAtTime(0.0001, c.currentTime + 1.0);
        setTimeout(function () { try { s.stop(); } catch (e) {} }, 1100);
      } catch (e) { try { s.stop(); } catch (e2) {} }
    }
    if (introHtml) { try { introHtml.pause(); } catch (e) {} introHtml = null; }
  }
  function introPlaying() { return !!introSource || (introHtml && !introHtml.paused); }

  function stopVoiceClip() {
    try { if (voiceAudio && !voiceAudio.paused) voiceAudio.pause(); } catch (e) {}
  }

  function say(clip, fallback, onend) {
    if (!state.settings.autoSpeak) { if (onend) onend(); return; }
    var useClip = clip && (!NAME_CLIPS[clip] || state.playerName === 'Hugo');
    if (!useClip) {
      autoSpeak(fallback, 100);
      if (onend) setTimeout(onend, 900);
      return;
    }
    var v = voiceEl();
    if (!v) { autoSpeak(fallback, 100); if (onend) setTimeout(onend, 900); return; }
    try { window.speechSynthesis.cancel(); } catch (e) {}
    clearTimeout(autoSpeakTimer);
    var done = false;
    function fail() {
      if (done) return; done = true;
      v.onended = v.onerror = null;
      autoSpeak(fallback, 60);
      if (onend) setTimeout(onend, 800);
    }
    v.onended = function () { if (done) return; done = true; if (onend) onend(); };
    v.onerror = fail;
    try {
      v.src = AUDIO_BASE + clip + '.mp3';
      var p = v.play();
      if (p && p.catch) p.catch(fail);
    } catch (e) { fail(); }
  }
  function sayPraise(suffix) {
    var ids = ['praise_super', 'praise_stark'];
    var id = ids[rnd(0, ids.length - 1)];
    if (suffix) say(id, praiseLine(), function () { say(suffix.clip, suffix.text); });
    else say(id, praiseLine());
  }

  // ---------- Screen management ----------
  var screens = ['screen-start', 'screen-practice', 'screen-home', 'screen-forge',
    'screen-pets', 'screen-trophies', 'screen-worldmap', 'screen-parent', 'screen-build', 'screen-myworld'];
  function show(id) {
    if (id !== 'screen-start') stopIntro();
    if (id !== 'screen-build') build3dStop();
    if (id !== 'screen-myworld') myWorldStop();
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
      say('trophy', 'Neue Troph\u00e4e: ' + c.trophy.name + '!');
      burst(window.innerWidth / 2, window.innerHeight / 2, [c.trophy.icon, ASSETS.items.gold_ingot], 10);
      showOverlay('overlay-trophy', true);
    } else {
      var pi = $('petwin-img');
      pi.src = c.pet.src;
      pi.classList.remove('pop'); void pi.offsetWidth; pi.classList.add('pop');
      $('petwin-name').textContent = c.pet.name;
      $('petwin-bonus').textContent = c.pet.bonus;
      Sound.pet();
      say('pet_new', 'Neuer Begleiter: ' + c.pet.name + '! ' + c.pet.speakBonus);
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
      bossThisRound: (state.stats.sessions % 2 === 0),
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
      say('boss_intro', 'Achtung, ' + state.playerName + '! ' + session.boss.name + ' greift an! ' + session.boss.introLine);
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
    if (session.greet) {
      session.greet = false;
      say('greet', 'Los geht\u2019s, ' + state.playerName + '!');
    }
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
      var xp = session.firstTry ? 4 : 1;
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
        session.dropProgress = (session.dropProgress || 0) + 1;
        var dropEvery = petActive('schwein') ? 2 : 4;
        if (session.dropProgress >= dropEvery) {
          session.dropProgress = 0;
          resKey = rollResource(true);
          earnResource(resKey, 1);
          var target = $('fly-target-' + resKey) || $('hud-progress');
          flyTo(btn, target, RES[resKey].src);
          setTimeout(refreshAllResBars, 650);
        }
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
          sayPraise({ clip: 'streak_diamant', text: 'Ein Diamant f\u00fcr dich!' });
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
          sayPraise({ clip: 'streak_diamant', text: 'Ein Diamant f\u00fcr dich!' });
          setTimeout(function () { showReward(resKey, xp + bonus, true); }, 550);
        } else {
          if (session.streak === 3) sayPraise();
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
    say('ko', 'Oh nein, deine Herzen sind leer! Ruh dich kurz aus \u2014 gleich klappt es bestimmt!');
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
      say('boss_win', session.boss.defeatLine + ' ' + state.playerName + ' hat ' + session.boss.name + ' besiegt! Du bekommst eine Schatztruhe!');
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
      say('levelup', 'Level ' + lvl + '! ' + msg);
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
      if (session.bossThisRound) startBoss();
      else maybeLevelUp(function () { drainCeremonies(showSummary); });
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
  function dailyTick() {
    var today = new Date().toISOString().slice(0, 10);
    if (state.daily.date !== today) { state.daily.date = today; state.daily.rounds = 0; }
    state.daily.rounds++;
    saveState();
  }
  function pauseDue() {
    var lim = state.settings.dailyLimit;
    return lim > 0 && state.daily.rounds >= lim;
  }

  function showSummary() {
    dailyTick();
    var paused = pauseDue();
    $('summary-pause').style.display = paused ? 'flex' : 'none';
    $('btn-summary-again').classList.toggle('small', paused);
    $('btn-summary-again').classList.toggle('play', !paused);
    if (paused) autoSpeak('Toll gespielt! Jetzt ist Zeit f\u00fcr eine Pause.', 600);
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
  $('btn-speak').addEventListener('click', function () {
    Sound.click();
    var t = currentTask();
    speak(t ? t.speak : '');
  });

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

  // ---------- Bau-Modus (freies Gestalten) ----------
  // ---------- 3D-Bau-Modul (three.js, lazy geladen) ----------
  var THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  var threeLoading = false, threeReady = false, threeWaiters = [];
  function loadThree(cb) {
    if (threeReady) { cb(); return; }
    threeWaiters.push(cb);
    if (threeLoading) return;
    threeLoading = true;
    var s = document.createElement('script');
    s.src = THREE_URL;
    s.onload = function () {
      threeReady = true;
      threeWaiters.forEach(function (f) { f(); });
      threeWaiters = [];
    };
    s.onerror = function () {
      threeLoading = false;
      $('build3d-hint').textContent = '3D konnte nicht geladen werden (Internet?)';
    };
    (document.head || document.body || document.documentElement).appendChild(s);
  }

  var BUILD3D_DATA = {
    grass_top: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVQ4y3VSSUuDQQydXyN48OhCse4LVg+KFhcUaxXrMqJiFbwoIvKBIBQFexFcEHexrlAQix68+KOeJJCPNG0PmWSyvJdkxqXfYtj46MPaaw9mrxpZlp86MXlaC//Qhq2vIY4v3LUgdR3F/G0zps7r0Z+pwtJjO9z6ey8n7ufHsJMbwO7LIEaj1Zi7aULyooGBjn6mkSkkmISKKZ/AFu9b4Q4+J7jg5M9j5jLCDHRfyXWxpg63C3EcfieR/U2xbzhbg8RZHduODu89X0hWn7tDm4Q6IE3tkt6MR8IY2e7Yx9ggnd8b54D4dLIQSW4IIEnk1GC6UIOJTUKEjg7tDIKgKEHi2tZEzibrTnQ35fwMYJ1aS8u2WMecXYrdshU7itOMdmYBFr8eRXblys2lGejp9Aj6mfkjWacFqSTSVdEIJOmRjpLFyRiyF/1azibpDev5LVEJgP0DsqRK7y8E/2kQKqQTbHIJAAAAAElFTkSuQmCC',
    dirt: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADRSURBVDjLdZKxDUIxDES9Disg0VHRI4HECClpGAD9DdiF6UAX6aL37+cXVhLbOfvOru/78fu0S7fX9dht5rufDqu4z9JFiUzQe1mW4TMg74rJymiuwjerMYd5JbTW2nCwm6SSXQwABxXQZ3InoAqlr9xWVnKr1Ib3IWJylHhMoOKk6bMyOcfnbmb+DpBOnm45PzM23YPknrxJpXI85Gxg+0nFWtWMFytodKTAMfdNTGeC7Jm7WlGQPW/njXCmMdvQyiQqTP5ZaAOQO2CR9ubvAn/2hSirp9qLQAAAAABJRU5ErkJggg==',
    planks: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADTSURBVDjLfVMxDgIxDPOD2JnvAUgszEi38AFmJnYWxIZ4wq3MfKzIlVwZExh8aZOoiZ0cntd9Wy67Rvu6z1/4578dpwYe9AhB5+O8GY9mXHfmEKgSZZUk5CO9A35O87qDZ90P21WHYjq7nxbiyArJM31OhTHePygoIOt6JFXlw/l5BQlaCem6ILmmBhnPHPicvUo1+9Sjd+Cjy3ZzhG6lESp1q9lnfHTgHKs98JjvhADNO7VQhWovPBe/djzbzTUX4In5H/geVPoMDZKb6+GaVPvxBn7ucsZoL/oUAAAAAElFTkSuQmCC',
    log: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADOSURBVDjLdZMxDgIxDATzDF5Acz2ioaED8QIa3oBEwTfo+G3QIq01t8kVUc5OPN7Yvva6H/rttO+f57nrW+u47AZbu3y8+7guvRnwfV/+DgekTYDBBdAFGVsAB2kfAKI6QwbYJthniitABhBIJUzgOjR/kEzJBqS/ACnb0uz3RXZlCmClLZdBBudZtdGVZ4UTlnsB+F4CEkbpVlyAlJ/dyLevACxgAqiKtmOaHJwuvnFrpJmkJXHWrmw112qQsm3OmP8C7w2ArYmcDZGU/QA2+PP4flUlyQAAAABJRU5ErkJggg==',
    stripped: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAHQSURBVHjabJNNkpswEIU/hECyAZvYnkxlkZwmV8pJcsKsUqnJODYYEFiILGTJ5Zl5K/WP1N3vtZKfP74vdZXxeb8FQOk1x/OJ3bYmYDQ9Sq/jeRhnViplGGdESOrGibdwzIymRyoFgJAyxoZxpml6hFZpdP55aXHMCLzvakYA0iSl7fuY1zQ98yJuuYAxNgZP5xaAJeFDZFrFc72pECoT75LqbcWl8xXTPLuPZC2ClG9fnwH49fsv4ny5olVGoXLKjaLeVg+zJolASEkuIMm8//XUxbh8S2CYP1RPk7tt2obJwWQNudR8KtaPKoTLztpYPdiZVu+UGqzxKhQqx83cyFtweCPLFKPpEVI+dPblsGeyhpXUCDPOFJVG6ZzhOrEsDjtdHyqdmyaSG3AdrO/AMdO1Jga61rA4Ry586904kQtYhNc1cX4bI2crJdnvNgCU69WH2ofZT+eWTMLFLBRViZTSkzhME/9e/QKp22YqvcYxU6jcE9b6MS5moWsvvByPZEjEMFr6fiARzpPoXPwHYZUP+wPG+se69nLfEeFuqzxYqrIkcfe2r2aMPzDIGlBUJU+7Hd1oEYIUrSX1tqIs1zEpXA4I3/v5qWJfF9H/fwA0m9jT6904XAAAAABJRU5ErkJggg==',
    stone: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAC5SURBVDjLnVJBCoQwEJtvrtfehL2Kt54XX7DgXysRMsRQ7bKHUCfOxLFJbJ+t7d/9Z6CfmF5TC5C11pPg6QDvuAjocK9ZhddlTe6yAV/oV5XTGieQAijm95wvfBvl2ZsbcC2SOuCC2pcbgPgXp0AppQEoAK+V6yGe/MbwKCeBf7nzHQJus/eFDvjNU4A1L1L7wr1XqyigFnq4whOnzbyDXj7IBR8YJFqkAr1AsY6Rz6MsxJ2/moOnLBxZum3avyu6ywAAAABJRU5ErkJggg==',
    cobble: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADQSURBVDjLbZLRDYUwDAMzIxswAG+NxyTdgPlAqXTVYfFRUNzESVzX7zjufd/vMcY827bNGOy6rvk//+fE+m+snNhAnybp2IngkHTjF0EH/fdEFBpPkmJcgIyNQ8Y6TVb9cQJjE0MIzuGu+qIJUgePDGZNlgapsHf3SjQx3oTlZFhzb69FDndlNtTOYkitCdqVi1N5T0R3rzpFzKLsQqFF5SWWBk7wnt7dL4JLlwZOTk3SiRZ5WTk9byt/vczLynZWWver2L6ZIqZlv0jcNV/sAQPDfdDsTz2nAAAAAElFTkSuQmCC',
    glass: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABaSURBVDjLY7jw6uV/cvGKCzf/M4AYDQ0NDORgrAaQYmD1uu2oBpDqGhQDQM4h1QsYLiAVdx88S5kBA++C4WIAOfEPs5QsFyCrJ9sFKJkJRIAwyDQYTQyG6QMAiP/54kqEtt0AAAAASUVORK5CYII=',
    door_low: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAC3SURBVDjLY8jOr/o/rcTxf3qADpgG4bokczDe2huAIh5oqwLGIHGYOoZlTb5wDogNkoRhEB+XOMxSuAEgGsZGdgWMj00MbMCOKfFw54EEkDEucZhFIDm4Ach+hWGQQlzi8DDAZQC2QEQWx/ACMbGALI5hAKmxABIHhwF6LCD7Dxbi2MRhmGAsgBThigWwFxq6p5IdC2ADsCVlYmMBJQzIiQWK8gIsbMCBSCjEcYmDDQARsGxKDgYAdT80X3+b8xAAAAAASUVORK5CYII=',
    door_up: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsUlEQVQ4y2PYMSX+/7ImXzAGsZExIbFpJY7/GUACIAY5OD1A5z8DzKRAWxWwADLGJ45hAJiDBkCuwyUOM5yhoXsqTgO29gbgFAfpqUsy/8+Qn59PtgvAcjAOyDQQG2Q6CMNiBpc4VQIRHAaUBCI4DFCcQ2IgUhyNKAaQE4goYQCTQPYfTDM2cXgYUJyUkf2DnllgYQDjg1ItCGfnVyEMQE7KyJphzkcWB2kEuQjmBRAbAHXF0T1BG/MOAAAAAElFTkSuQmCC',
    glow: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAD6SURBVDjLbZOxDUIxEENvFgokRmAAWkTBEHQUsAKI4ZjgT0FPEfCJF1kWkfJ//sW5s3359V6u43k/jtthM867VU99E9dUTPs9XsvEP07bUQoAFvCyX/cUgJiAWgub+EqgvmFDMsX1VswPNwM9vEpK0kENxUkCvhMAaoo/jeikosdghJTCIAdqrYk8Z8VhWJXTAuw6XQoegWsTtXCT3FRi2ocRSSg428gmSbwi3lBVey35Owpz0Oh9zv57+2BV3rI0LOPpR3vgfQVAdlUF6L4gV+siW15nb5VTd8+awaxml8hZIMeNcz/Kjfp3jVNi7hdasppT5acimRv5Achkgl/nEOAdAAAAAElFTkSuQmCC',
    slab: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADJSURBVDjLnVOxDQQhDGNoekZgAahoKFmBAZiJVzgZJf7cF19YcElknMQX1lrbw5zT4K0myKX3vltr5xSMMQwQr7WeOtSmlB4CCUiSC3DXMY2c80OgX+NCTwkILwEntAKvJcSNApbHQJv6vDPw5EqBJ12Txhh3KKWci8gRCKsA34hJDYD8VYCd6pO9wPvH9kwL3LO3Bf1tZsC7/+UL3L/W+OZEPUgdOwTSD++f9+2puj4QArzgWZY9ovPmX3gbmo6xW48PYIh/ffABM7/1w1U+cZ8AAAAASUVORK5CYII=',
    leaves: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABVElEQVR4nG2TQYqDQBBF37SmQWwIMosoZDkeIAfIao7uAXKAbAXNKggtgRaZ2UzVVEx6p12//q//qz++vj9/+DvH856+m6jaAoD79cEuZAAscaVqC+7Xh9beLhEnxQB9NykwDomqLVjiSmi8NhLwPCYOp4CTjruQaVHVFoTGE4fE8bznfn0QGq/sAGXtAXACEJmioKw9ofEKsGBR2ncTedUWxCEpozSZx0RZey2WI2Ty3wEv4ON5TxzSC3jrD0Aeh/Qk3xo0j+ltEoD64yx4a5DMLfcSo9zPY8IdToF3Uc7jv8xdyHTMqi3ou0m/863DtskuZE/LY1PRGGXzrAqRu90FS9Z3E2XtceL4VsW7XbDuSxN3u0RC4/XCqhEWGWmJqyqSxPLQeC2SB2JTsbtQtQVl7bldopI4C5b8rUz7RqyZgnPzmF6ctX4scWWJqzaxY1VtwS+jsfOTs80V8wAAAABJRU5ErkJggg==',
    path: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADhSURBVDjLdZOxDsIwDET9n11ZEBsfQNWRpSPd+wEVfGHQRXrVcS1DlNjxnX12UpdhaM/p0V7z3O63a1/LsrRpHPsuW2d2/PgKI4NE6mAlws8SthxMNTp7kJNS1YFADt9dSsohRqtgk/FZ159eEJQyRAamcCpAYNlnEt7b1s/Zs0KzgCLgEgBSyEqCXYJfennZvJRFXCUgR+kVAlR1xFVmoPSchHfeG18+GpeTWRMon+4rNUGkSgA58PCUk9kXpP4+fJT9Jf5rlOv28WZvipL9KefYRJCJ9r9AkJfp2c7+iO9fL5mBBa8iorMAAAAASUVORK5CYII=',
    pig_body: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAA0UlEQVR4nO2XsQ7CMAxEIY1UUKkEWxnKh7Hxs3wPUsvAgGC2h0RWEk7I9zY3TnQ62Za7vd+un02CS38UcTjtZcI0iXAYx9RzzXn3B1N+aKTjb6ABaAFoorXHNa17Xvd091qT51bcVwANQAtAE8N8ll/WR/LCr3veeq7JzQz3FUAD0ALQxNIHnssi4tYzgntAZWgAWgCa4hlQirWH9czZZe7n8t1XAA1AC0BDA9AC0NAAtAA08D0gh979a+O+AmgAWgAa+Ayo/X9vxX0F0AC0ADRftEIihQB4yM4AAAAASUVORK5CYII=',
    pig_head: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3klEQVR4nO1XsQrCMBCNsVClKdStDi06+p3iNzoqDprNQlO0g+jqu8iFoJjlbnu5XHg8Hu/I5LzbPtV7mZniqihLtv/IDdufjg6wZm//oYRAFjsw9D3bLwLz1CPJFRACmXIdnpg67gVrAfb7A2C9WQOmHkmugBDwc8DdEQd2A63T2AFuiScG4onkCgiBDx7oEMfmAim9mPP9r17/QQmB7GgvcNDmFWCtMOtVzXtiVS+j7idXQAh4OeBl+RX7nidMRXDc7kiugBAI/guoJ5RF3OY3dl43JBfIrkmugBB4AblRLJAFSyqsAAAAAElFTkSuQmCC',
    pig_leg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAAAcUlEQVR4nGP8OG/GfwY84Ovnz6gCX36gcJnwaSYGDLwBLIQUcPPyovC/UtsFA28Ay9fnr1FFeDhQuOhhgM4feC/QIB2gpXX0eKe6CwbeABZuSdGBdcHAG8DY6e6GUiZmhAehKJixch0DPvmB9wLFBgAA9jwVozhghswAAAAASUVORK5CYII=',
    skin_pig: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAALeSURBVGje7Zi/TsQwDMYLDwcTEjMbG2JlYkYMiAlYmJjgNW7kSdCNSMwMpY7O5YvzOX/u6J2gVLKaJmka/2I7TruucC3vbvuPp8cg7y/P0V3aXk9PstL99osprneR2QFQmT0ArZsNACb/FjBXC0Aos3WBPxMEl9dXYT+3+701e1Zm/VXCmDC2J8l8Li/6asmNL21DnyYADAQqxWBQxXESUwNg39D6KgAyEL48PL+dnY8gPChYL/fwDhmrtEr9w32HshaAQRbHR0Gwrh4ATnJ4Ft9VCPvdXi9XRHYoyyVtqry8EwFYTaAVQPiuvusoPcIG5bV8c3gQAbDjo8QmZwBgnTXtxNzJO7Vm6gJgEFb10gchhG8T5aVPEcC42jp5C6QUaKzC4EYjFDRLY6IUQOGdCIC6rOnTBCCCYBUuBRpsgwniVoiTxclJm51UsiAkPrFxFYpC98Z3AeCgiR9mVgP90irujY11DACFQMCW4FYBYIkP+nfwq2FQvbOBPheLeCs0Zop9ky1zTcUYKBybCdu6KQA0uxIA9uGwSzjUWV8WN5if6zOzkJzSuWw2C0DKNQC0bYzEGQCYR1hLsEHOE+xbUt47x+h7rguoFAEME0lWlWxv6wCwcSMHgIHIpfHSX+6dTVjcXF7Lpi4XZDwAuALjeI4F2ABaCwBXXZXF8jcAiOQ5//TygVYA1gRzACTDUwBSngYArDyusDXpJMdfTWJKAD9hAdrmAzBKs8QncQuwiCldwM1RGmKAB0Dbu9I2Qo+5G7hAC4BaF9CFaQEwboM23ZVor9E/WnWwCt3q5L4OAFyxxKpaXQCCs7cLZAHYq1WhTQDg6nl5vesC9q9QJQAbH7YOIAmszklPzR5dwEJIjs5OHLB+n02FtwEg8nlyhC1ZQGQF5FTK4lc1gMl/wrLjNFE+lwnWQGDbIgOzGwDkj09JSQ+O+5MUynRHW7Xv5je8UbzmB4p3JHYDY+Vf4y9tRXXRGVGwpwAAAABJRU5ErkJggg==',
    skin_chicken: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAGfSURBVGje7Vg7TgMxEPWh6FHEHSgoSUWHuAoSd6DhAlRptkoRaS8AK3ELJJMJO9HLaGbiJOB1HD/pyZv9KPvejmfGDgEQ1xiGITL6vt9hULB4vomr1+tII/Hl6WqHIQHfX49J9/07WDibQKK7rtvQMmB+O9uKp+NDDSDxzCIMwAgg4ZFOr0nH8st7TDXi4/1hI57GSb/6oZAC9zH1ffq3uziZAfSTIoDIlzgicByv/z4/Rgjz1PfJHglS2D5SLqjKABaUIhorghT+V0Z8Lu/zG4ACWYAmmqtClQawOMz6eF4y1A5vSkhgTqgGWm7gcxdlABqB+QLFW11iVQbIthhNqTInYBJEoVpSPCYCvAVWMQZYlUArjccm2WJWgDifveZIywO8cpR9gyeweAOsKmAZoHWN4/rC/d8iDZDzH8VjEpTPauNZGSBFasRrGqQxZ2GA9pWtZKdFhwc2Sm614Sh3obJWB22Oa72/VgW8FtnaR7CiBu/LaoCWvVMNkD2CFGx1jtooc1D2en8qvYZJqyBW2byY1WZDQ0NDQ0NDw9T4AXr53/OT/m8uAAAAAElFTkSuQmCC',
    skin_cat: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATxSURBVGhD7ZhNaB1VGIa/e0NLaJPatNpUUUoiYgNaRY0VKV2IXURXVqm4sP6CYl1J6w8qKOpCUl21iohY68pi7ULaLvxZhCKJFbFViAomSGqahpTENC1pgl59Tu47fJnM3JvcyaUQ8sBwzpk7c+Z87/dzTpKzBLbfdWNhzeUNtvqyOjv795gNDg0b4zi7D3Qkvp/E3ue2FTZtudeab7nT9r/9snX91F38ZYr93/5ccq6d2zYXaHe98aYtW3ml1TdeN+tvlyJfbGeA0Svq60IrEKTp6rWhrZQLI6dD6wVNEjcNjNcc80GiAPEFKRoQBC/SViLC2uYmG+jpLY7MWq69Jpo7jfs3rS/I+zhjx0Nbrf3VV0JE6H4WEgVgQSxs9NzYDOMJ4UrBe0JzlhNy+dIl1ts/GC44PzEZhCj33mxJTQFC3bcg47e/8FZY/FxAPCAKFEVqS81FlCACYPxtLc2h7f6jb15EyKngyVC8rgWxwGNfHQ59f7/31MC02uBJK2ZnfusoKAJ8Dislbmp7JPE9UgCjBUVZIMBLHx7JVAyDAHQkAoY+s2vUvj/0i93x6HHr3Ndqt993g73XviIIUMp4wGOC5xERr4MvYBiOuHwPtNsAHsbrrIl7jD38xnd4Zy47URI1W1rXv3b+wrhx/TUwZPmaGlu37klb3thmw6f7QjsyfKt1dnbZ7z194Tlgcep7hoZHwxzLapfaxYkJO3PqT1u16gqra2iwJbX14ZocHwtj7vM7z/E87w2OnAsGYvTkxYnwHdrJf/4N8zddtSY80/+/MNw/0Tv4evihQqIUiOfTPVsfLPbMjnzxWbE3hfdWKTSvUueBp54NUdDz43eR9xXS3tMSAAh/nomvT/cyp0CxnTf8lgWIQGphPCgNPv9gz4x0kmA/dPcET3ujZTCt6hXvZ02BaBfgpMZVHEak3S8FC9UeLzBcRVDIQJ7jeRkIbHtUeqJHRksEDJ8vIvVk5I53D0xTNO1+Gj6lSCMdfthC8bxE8MWQFMO4eBpA+/t7QxsXT3NlPRLn+g/vKYyPjdjRrpORsqjt+20bN1ht3Uo79E1HWSHYtlTBvQgsVkbLGGrBpx9/FKWBr/aqAweP/ZrJwHLMevL4sTMt94gAFi4PEtqP73wx9IXEwPvvtO8u3p1KBS8GdSBrjpcj9SRYKRhM5cYYLnJYHlcLCn2e4R3VAMaCcbUJ6hK2tAo3P5ZHwVdmChTET35Eip7x4e+R9+MHIZ33QWlU7QiIToJCoYcRqrpJBQqPcT++wLQaABJCAoBqgNKG9yQE43L/J8hKng/7i4+yIG88LQsjtBGHvu7H4X3m0RyEOXs+xIsgvynnvWh+XG3yGIRhuvRRvMCBhAWRx74FHUbiEBnMCRhHqhDm8jggBOGPQHyPSzXAEx9Xg7wM5VJee+UxGgN8y8LUT4LfMYh5Nt7cklgLOBk+/NgTQUgZiiBciiL61SbUAOWzzz1gEfsOfhn6PnzVh8brN0/LUX8QAowHL4BqQPzvAVA9ANZR7RqQU8UHUgC8GHM9iLALKK8lhCIl7Y8hiUUEeuNxTNY/dsqR83+88HG/1bG4am9Dl5ppEaDQFwhS7aPopSYy7sTRTyIhtG9DPMcXGtFRmJz0ra/YC5moBrAlnf36pK2+e0M4ncFCz38IEYDxhH3r80+HlvEiiyyyyMLH7D+mOQv2YM3IzAAAAABJRU5ErkJggg==',
    skin_wolf: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAU4SURBVGje7ZnNa55FFMXnbxAR4kJBVGppSiFGDH5U2oC4cCMhiIILQXHjx0KCIhSDWFwUpGArBIsNKAUrKISSXaFVbO3CRqxiNLabgm78Gx5zBn4v5z3ME/B5s8zAZeaZr3fOmXvv3Jm3FEu3b94qv1y/3v31x5+d59euXK35pYsXa06dvp984lBBDh+6v8rs/nvrfAsLC2Xu0dkx0ZhvvzrXfb5yuo4nVx1z+m8pp175+2WpIFcvf1eOLb1V81ubm2XiBAGA1w86eJVVDzGqm57eVxABh4TFxcUKWHNKVNZCGSfAKivXt5PrBPgaJEnAv3//MyJi4sQCHSRlFuH1qnMCAC+Zn58fgZZABmMF3Ilszd1qdwIcvPLBuy7RBMph3ElwFUyTYBxzQMbMzEx55dXpcveF56u8cePT8vbZ44V5Ndbnp94Jb7UnAchgE3BVc1VMVc8+TobbKQT0JZ8zwSbprfaWBgi8yoNSMp326GBdTZOkdIp9KW3czavlA7K95QNEwGATSGBKd9x5V3fu42NVVFZK8Ekci4aA+UceLOvr61WqT9j+Vu5909PnXK12JyBlsAY46wJ94s3nupUTH1VRWXWtIzCPR5ximknLnLyuz/H2mR3mk8QNJoBJHPyp4+9WcRL8WPJFef7yC0+NnSQJJIH7rieonMP7pG9Q22AnyM4DOO0RQtCEnQQ1T81CnJCUVP3slz4hiRpEgJ/d+5YOlu/Pf9Z98t5rnXIv3/z6wyLxaM8DH5fUjAx4diLBg6TUrvQ5aRK7QsBP35yuoJW3CHj4oXuaBFCWs3MgAFDI2zKDPAGyr89BHw+bldNnEAEAkYiAGxe+qKCVtwjY2toaG5MEYALE+yzOyy2n5+D8fsA4B+pzeZ9BBLz0wX1jIuBzjx+uBLg2QMCZM8+OSYKXBrhc++HKKCTmQqTQNaM4zvTl5eVRcEMYrXrNwzehL/3UNjgQEjiBvf375kh09vs3ZGAWEpVFgNI2qM5lbW2trK6uVjAQoEUr17ckTQHvLjIBK3AufQQgExGQJDh4CMAkMAsRIMAAURkwAi8SfMGe5zEHEUdnH6hg1s9/WfuSQwBEQoC3DUoCox2X2veJ2gHdIgD7hQyV2RV2UwtH9O2BEV5fdZiEk+DqjykxD/cB9dmVpF3TLmDXU1NT9W4vUTlT686vMkDYscxxhnJgY48i20BcrQGIv9D4p488Vg4c2D9WP1gDSNshrMLYbvWdF6uIABHhBDxzZK6TLC+93v146XIHAXnn90uKALn90989uhPgjjFJoCzw7gf4vV0nIDUAAgReJPj43zZ+HvPqrpqtU0BgEY4xiQjsA+6O0IFP9B6w0zucRER4MOL9+faQOp2b3xn8DpHOL6NEXo3wL5AAKXkKDNaADC3z1iWf0IrPCU64hHh7Hm0exWVY60GQX3LSOXK04p9URtSmU2ei94DcXeo0eV84Sl8noHW2J8FJQL4S+fy0E1dwvGpdAKduIg1wNXWgmtjBtszA3xVab3t5u2y9AebtDsdIG7tNCO7AKU/kA9IX8N0iAPWnjz+t5c6m5qQP6Ht5hgC+kwA5aJmD8okIWDl1cuSJKUtUVp0mzhcZbNNNIO285QRbDyOtccQHEE1kKckruGvDoOTgPWcBfgq0/rRwH5D38zxRWi/P+eLsWsa1mBA53yKSjMEvQizu142NkbCgJKDlL3Kevmd0fxnKf5xa4yBA4irvRFCnfFBiAthMG+NHPEflnPW+N8K+OKCvrztaP318Xa4BXreX9tJe+t/pPwjVz/Na1q/9AAAAAElFTkSuQmCC',
    skin_fox: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAACoklEQVRo3uVZMU4DMRBMgSh5AyCeQB/xBBr+wB8oItGTJ/AFCsQr6BAFLU0+kIbqYE9MNLfatdf2cbmIk0Z2zom9O6y9s2axWq0Wx0cnHUPevd6edoLPu7MB8P7p+rx7Xt+bkDFvXuvBnMDXdjvAwnm6rmtGbyQWYmPZ+c36atCCgPeXx95htOjLmDfv7AgQY2UR/OUAECBOM0AAnLWAuaSVuXneKAEyzyQESFhayBHgOQ9480YIYOel/y8JYOydAG5bCWBHeWtY0MTADumP4XxPgF5EL2gh9ZsS1BCA9UcjwFuslICcM9460e8JOBpHJcAzytMBOWcelhcmWgjQ23D0CBDAQeRuafkglD6PwTCew3MemDUBuRCMGH5wBCA0IYg2H2+7NgX+btR5ASIHLYsntDzOLfSBtKMRkEtXLbWABS1zvTSqv6cxCQEttUCEgJSOmA0BtbVAiRKsfQ5SCieN+ZXF3raz3nukHiwBpeqzZp291gK5p1d8KuOk0nEzAVPXAjkCvLT7ZwRMXQvMkgDLGd7zDLyvrQU8gwFvS3mEjhYBXAvwHZ6uBax7wxIpjIWxlo4oK71CHXJkcmvplNnWAlhY1/elBDAJOkuV1AqT1wIcAdp5yGvvkjV1PukoqEqDml1xEBJX+tZeg/N89x8Zt2qLHAFMgnZcf64iQO/3SG5vIcDaUlECUjqlmAA8JQR45wGf+JbRGNcHGQ5TLqq4yOJDmludnYoJGITTT5jjLyV9DlP9b67UgZgjAM5Y+oIJ4BI7pUus7RAmIFWC8pgmgB2LXoTqlGuJK6u85ixg/c7SK2ECasvIKQiw0qBHQHUW2CcBWgjpWyZ9BlhCyEqDRUKolgAx6mZ5udsS0hfAYHzmcb2nvXPEumKL1Cw1SvAbN645ZRyZz+UAAAAASUVORK5CYII=',
    skin_axolotl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACJklEQVR42u1ZoVLDQBDND2ERSDz8Q6sRiP4BmNYyIJE4BB6Dq8UUC63Ag4SZg82w8Pp611yDSG6zb2Ynl7sk0/ey924vrSrHJt5vF2F1fl+HtPn87vAszMfXdWi/nsuYCQEkPh5Wa6H9TJ5FMCEAk0cRYuRRhOIFSJHXcAF+Uj3mAcUJoMbWRHrblEARUAzs6/18byMC3stZwFnSewE0Ew6qkzo43fVcx5U0GuO26P0U4LU+J+XxvmIFwKIGUzZVB8TIyjP0OdrmPlMrg2YA9t3sTUJMTOmTMfMCmCiP8U3xW4uVxDEBYoVRMQLgD+UfPQgB0K3ZuXfxACZfhAc87k/C5/w1yBHbu3pA0RmAhLHNAnBxZCIDclcBrPrQB0xkwH8EkLecWgbNZIBWglrlYcWoU0D78bpeC5C78+MtL7fbbqc5Ohcgtj3O2e7y9Tlb7Fg90dkXYCTKR/7QERMAheAjbrdTu8rOBGCCOoexD+d3avenJoj34sqARzVSfI4KUjk6wtPRLEgsR1drof0SpgVIGZgalYR5AWLkUQTzAvC6jg5u4g+PJg/g+c8xSHN8GV0GjcXx7DfMkxaSSJ59wTzpJlM0J4CQZ6L60SN2NClATmimeOlo1fzajJnB2+nFd3pPw+b0mAYZG0QWCNHn8V/RI23T5NtUeKaqQnm7u2x15VpzGcFpn4Lp6ZBDzCR59wD3APcAh8PhcDgcDofD4XA4HI5B4QtA6wgi82HQ1QAAAABJRU5ErkJggg=='
  };
  var BUILD3D_TEX = {
    grass_top: 'grass.png', dirt: 'dirt.png', planks: 'planks_oak.png', log: 'log_oak.png',
    stripped: 'stripped_oak_log.png', stone: 'stonebrick.png', cobble: 'cobblestone.png',
    glass: 'glass.png', door_low: 'door_wood_lower.png', door_up: 'door_wood_upper.png',
    glow: 'glowstone.png', slab: 'stone_slab_side.png'
  };

  // Voxel-Haus (gleiches Modell wie der abgenommene Prototyp v4)
  var HOUSE_MODELS = {"starter":[[-1,0,-1,"grass_top"],[-1,-1,-1,"dirt"],[-1,0,0,"grass_top"],[-1,-1,0,"dirt"],[-1,0,1,"grass_top"],[-1,-1,1,"dirt"],[-1,0,2,"grass_top"],[-1,-1,2,"dirt"],[-1,0,3,"grass_top"],[-1,-1,3,"dirt"],[-1,0,4,"grass_top"],[-1,-1,4,"dirt"],[-1,0,5,"grass_top"],[-1,-1,5,"dirt"],[-1,0,6,"grass_top"],[-1,-1,6,"dirt"],[-1,0,7,"grass_top"],[-1,-1,7,"dirt"],[0,0,-1,"grass_top"],[0,-1,-1,"dirt"],[0,0,0,"grass_top"],[0,-1,0,"dirt"],[0,0,1,"grass_top"],[0,-1,1,"dirt"],[0,0,2,"grass_top"],[0,-1,2,"dirt"],[0,0,3,"grass_top"],[0,-1,3,"dirt"],[0,0,4,"grass_top"],[0,-1,4,"dirt"],[0,0,5,"grass_top"],[0,-1,5,"dirt"],[0,0,6,"grass_top"],[0,-1,6,"dirt"],[0,0,7,"grass_top"],[0,-1,7,"dirt"],[1,0,-1,"grass_top"],[1,-1,-1,"dirt"],[1,0,0,"grass_top"],[1,-1,0,"dirt"],[1,0,1,"grass_top"],[1,-1,1,"dirt"],[1,0,2,"grass_top"],[1,-1,2,"dirt"],[1,0,3,"grass_top"],[1,-1,3,"dirt"],[1,0,4,"grass_top"],[1,-1,4,"dirt"],[1,0,5,"grass_top"],[1,-1,5,"dirt"],[1,0,6,"grass_top"],[1,-1,6,"dirt"],[1,0,7,"grass_top"],[1,-1,7,"dirt"],[2,0,-1,"grass_top"],[2,-1,-1,"dirt"],[2,0,0,"grass_top"],[2,-1,0,"dirt"],[2,0,1,"grass_top"],[2,-1,1,"dirt"],[2,0,2,"grass_top"],[2,-1,2,"dirt"],[2,0,3,"grass_top"],[2,-1,3,"dirt"],[2,0,4,"grass_top"],[2,-1,4,"dirt"],[2,0,5,"grass_top"],[2,-1,5,"dirt"],[2,0,6,"grass_top"],[2,-1,6,"dirt"],[2,0,7,"grass_top"],[2,-1,7,"dirt"],[3,0,-1,"grass_top"],[3,-1,-1,"dirt"],[3,0,0,"grass_top"],[3,-1,0,"dirt"],[3,0,1,"grass_top"],[3,-1,1,"dirt"],[3,0,2,"grass_top"],[3,-1,2,"dirt"],[3,0,3,"grass_top"],[3,-1,3,"dirt"],[3,0,4,"grass_top"],[3,-1,4,"dirt"],[3,0,5,"grass_top"],[3,-1,5,"dirt"],[3,0,6,"grass_top"],[3,-1,6,"dirt"],[3,0,7,"grass_top"],[3,-1,7,"dirt"],[4,0,-1,"grass_top"],[4,-1,-1,"dirt"],[4,0,0,"grass_top"],[4,-1,0,"dirt"],[4,0,1,"grass_top"],[4,-1,1,"dirt"],[4,0,2,"grass_top"],[4,-1,2,"dirt"],[4,0,3,"grass_top"],[4,-1,3,"dirt"],[4,0,4,"grass_top"],[4,-1,4,"dirt"],[4,0,5,"grass_top"],[4,-1,5,"dirt"],[4,0,6,"grass_top"],[4,-1,6,"dirt"],[4,0,7,"grass_top"],[4,-1,7,"dirt"],[5,0,-1,"grass_top"],[5,-1,-1,"dirt"],[5,0,0,"grass_top"],[5,-1,0,"dirt"],[5,0,1,"grass_top"],[5,-1,1,"dirt"],[5,0,2,"grass_top"],[5,-1,2,"dirt"],[5,0,3,"grass_top"],[5,-1,3,"dirt"],[5,0,4,"grass_top"],[5,-1,4,"dirt"],[5,0,5,"grass_top"],[5,-1,5,"dirt"],[5,0,6,"grass_top"],[5,-1,6,"dirt"],[5,0,7,"grass_top"],[5,-1,7,"dirt"],[6,0,-1,"grass_top"],[6,-1,-1,"dirt"],[6,0,0,"grass_top"],[6,-1,0,"dirt"],[6,0,1,"grass_top"],[6,-1,1,"dirt"],[6,0,2,"grass_top"],[6,-1,2,"dirt"],[6,0,3,"grass_top"],[6,-1,3,"dirt"],[6,0,4,"grass_top"],[6,-1,4,"dirt"],[6,0,5,"grass_top"],[6,-1,5,"dirt"],[6,0,6,"grass_top"],[6,-1,6,"dirt"],[6,0,7,"grass_top"],[6,-1,7,"dirt"],[7,0,-1,"grass_top"],[7,-1,-1,"dirt"],[7,0,0,"grass_top"],[7,-1,0,"dirt"],[7,0,1,"grass_top"],[7,-1,1,"dirt"],[7,0,2,"grass_top"],[7,-1,2,"dirt"],[7,0,3,"grass_top"],[7,-1,3,"dirt"],[7,0,4,"grass_top"],[7,-1,4,"dirt"],[7,0,5,"grass_top"],[7,-1,5,"dirt"],[7,0,6,"grass_top"],[7,-1,6,"dirt"],[7,0,7,"grass_top"],[7,-1,7,"dirt"],[0,1,0,"log"],[0,1,1,"planks"],[0,1,2,"planks"],[0,1,3,"planks"],[0,1,4,"planks"],[0,1,5,"planks"],[0,1,6,"log"],[1,1,0,"planks"],[1,1,6,"planks"],[2,1,0,"planks"],[2,1,6,"planks"],[3,1,6,"planks"],[4,1,0,"planks"],[4,1,6,"planks"],[5,1,0,"planks"],[5,1,6,"planks"],[6,1,0,"log"],[6,1,1,"planks"],[6,1,2,"planks"],[6,1,3,"planks"],[6,1,4,"planks"],[6,1,5,"planks"],[6,1,6,"log"],[0,2,0,"log"],[0,2,1,"stripped"],[0,2,2,"glass"],[0,2,3,"stripped"],[0,2,4,"glass"],[0,2,5,"stripped"],[0,2,6,"log"],[1,2,0,"stripped"],[1,2,6,"stripped"],[2,2,0,"glass"],[2,2,6,"glass"],[3,2,6,"stripped"],[4,2,0,"glass"],[4,2,6,"glass"],[5,2,0,"stripped"],[5,2,6,"stripped"],[6,2,0,"log"],[6,2,1,"stripped"],[6,2,2,"glass"],[6,2,3,"stripped"],[6,2,4,"glass"],[6,2,5,"stripped"],[6,2,6,"log"],[0,3,0,"log"],[0,3,1,"planks"],[0,3,2,"planks"],[0,3,3,"planks"],[0,3,4,"planks"],[0,3,5,"planks"],[0,3,6,"log"],[1,3,0,"planks"],[1,3,6,"planks"],[2,3,0,"planks"],[2,3,6,"planks"],[3,3,0,"planks"],[3,3,6,"planks"],[4,3,0,"planks"],[4,3,6,"planks"],[5,3,0,"planks"],[5,3,6,"planks"],[6,3,0,"log"],[6,3,1,"planks"],[6,3,2,"planks"],[6,3,3,"planks"],[6,3,4,"planks"],[6,3,5,"planks"],[6,3,6,"log"],[3,1,0,"door_low"],[3,2,0,"door_up"],[0,4,0,"slab"],[0,4,1,"slab"],[0,4,2,"slab"],[0,4,3,"slab"],[0,4,4,"slab"],[0,4,5,"slab"],[0,4,6,"slab"],[1,4,0,"slab"],[1,4,6,"slab"],[2,4,0,"slab"],[2,4,6,"slab"],[3,4,0,"slab"],[3,4,6,"slab"],[4,4,0,"slab"],[4,4,6,"slab"],[5,4,0,"slab"],[5,4,6,"slab"],[6,4,0,"slab"],[6,4,1,"slab"],[6,4,2,"slab"],[6,4,3,"slab"],[6,4,4,"slab"],[6,4,5,"slab"],[6,4,6,"slab"],[3,5,3,"slab"],[0,4,0,"slab"],[0,4,1,"slab"],[0,4,2,"slab"],[0,4,3,"slab"],[0,4,4,"slab"],[0,4,5,"slab"],[0,4,6,"slab"],[1,4,0,"slab"],[1,4,6,"slab"],[2,4,0,"slab"],[2,4,6,"slab"],[3,4,0,"slab"],[3,4,6,"slab"],[4,4,0,"slab"],[4,4,6,"slab"],[5,4,0,"slab"],[5,4,6,"slab"],[6,4,0,"slab"],[6,4,1,"slab"],[6,4,2,"slab"],[6,4,3,"slab"],[6,4,4,"slab"],[6,4,5,"slab"],[6,4,6,"slab"],[1,5,1,"stone"],[1,5,2,"stone"],[1,5,3,"stone"],[1,5,4,"stone"],[1,5,5,"stone"],[2,5,1,"stone"],[2,5,5,"stone"],[3,5,1,"stone"],[3,5,5,"stone"],[4,5,1,"stone"],[4,5,5,"stone"],[5,5,1,"stone"],[5,5,2,"stone"],[5,5,3,"stone"],[5,5,4,"stone"],[5,5,5,"stone"],[2,6,2,"stone"],[2,6,3,"stone"],[2,6,4,"stone"],[3,6,2,"stone"],[3,6,4,"stone"],[4,6,2,"stone"],[4,6,3,"stone"],[4,6,4,"stone"],[3,7,3,"stone"],[1,5,1,"cobble"],[1,6,1,"cobble"],[5,1,-1,"glow"]],"stone":[[-1,0,-1,"grass_top"],[-1,-1,-1,"dirt"],[-1,0,0,"grass_top"],[-1,-1,0,"dirt"],[-1,0,1,"grass_top"],[-1,-1,1,"dirt"],[-1,0,2,"grass_top"],[-1,-1,2,"dirt"],[-1,0,3,"grass_top"],[-1,-1,3,"dirt"],[-1,0,4,"grass_top"],[-1,-1,4,"dirt"],[-1,0,5,"grass_top"],[-1,-1,5,"dirt"],[-1,0,6,"grass_top"],[-1,-1,6,"dirt"],[-1,0,7,"grass_top"],[-1,-1,7,"dirt"],[0,0,-1,"grass_top"],[0,-1,-1,"dirt"],[0,0,0,"grass_top"],[0,-1,0,"dirt"],[0,0,1,"grass_top"],[0,-1,1,"dirt"],[0,0,2,"grass_top"],[0,-1,2,"dirt"],[0,0,3,"grass_top"],[0,-1,3,"dirt"],[0,0,4,"grass_top"],[0,-1,4,"dirt"],[0,0,5,"grass_top"],[0,-1,5,"dirt"],[0,0,6,"grass_top"],[0,-1,6,"dirt"],[0,0,7,"grass_top"],[0,-1,7,"dirt"],[1,0,-1,"grass_top"],[1,-1,-1,"dirt"],[1,0,0,"grass_top"],[1,-1,0,"dirt"],[1,0,1,"grass_top"],[1,-1,1,"dirt"],[1,0,2,"grass_top"],[1,-1,2,"dirt"],[1,0,3,"grass_top"],[1,-1,3,"dirt"],[1,0,4,"grass_top"],[1,-1,4,"dirt"],[1,0,5,"grass_top"],[1,-1,5,"dirt"],[1,0,6,"grass_top"],[1,-1,6,"dirt"],[1,0,7,"grass_top"],[1,-1,7,"dirt"],[2,0,-1,"grass_top"],[2,-1,-1,"dirt"],[2,0,0,"grass_top"],[2,-1,0,"dirt"],[2,0,1,"grass_top"],[2,-1,1,"dirt"],[2,0,2,"grass_top"],[2,-1,2,"dirt"],[2,0,3,"grass_top"],[2,-1,3,"dirt"],[2,0,4,"grass_top"],[2,-1,4,"dirt"],[2,0,5,"grass_top"],[2,-1,5,"dirt"],[2,0,6,"grass_top"],[2,-1,6,"dirt"],[2,0,7,"grass_top"],[2,-1,7,"dirt"],[3,0,-1,"grass_top"],[3,-1,-1,"dirt"],[3,0,0,"grass_top"],[3,-1,0,"dirt"],[3,0,1,"grass_top"],[3,-1,1,"dirt"],[3,0,2,"grass_top"],[3,-1,2,"dirt"],[3,0,3,"grass_top"],[3,-1,3,"dirt"],[3,0,4,"grass_top"],[3,-1,4,"dirt"],[3,0,5,"grass_top"],[3,-1,5,"dirt"],[3,0,6,"grass_top"],[3,-1,6,"dirt"],[3,0,7,"grass_top"],[3,-1,7,"dirt"],[4,0,-1,"grass_top"],[4,-1,-1,"dirt"],[4,0,0,"grass_top"],[4,-1,0,"dirt"],[4,0,1,"grass_top"],[4,-1,1,"dirt"],[4,0,2,"grass_top"],[4,-1,2,"dirt"],[4,0,3,"grass_top"],[4,-1,3,"dirt"],[4,0,4,"grass_top"],[4,-1,4,"dirt"],[4,0,5,"grass_top"],[4,-1,5,"dirt"],[4,0,6,"grass_top"],[4,-1,6,"dirt"],[4,0,7,"grass_top"],[4,-1,7,"dirt"],[5,0,-1,"grass_top"],[5,-1,-1,"dirt"],[5,0,0,"grass_top"],[5,-1,0,"dirt"],[5,0,1,"grass_top"],[5,-1,1,"dirt"],[5,0,2,"grass_top"],[5,-1,2,"dirt"],[5,0,3,"grass_top"],[5,-1,3,"dirt"],[5,0,4,"grass_top"],[5,-1,4,"dirt"],[5,0,5,"grass_top"],[5,-1,5,"dirt"],[5,0,6,"grass_top"],[5,-1,6,"dirt"],[5,0,7,"grass_top"],[5,-1,7,"dirt"],[6,0,-1,"grass_top"],[6,-1,-1,"dirt"],[6,0,0,"grass_top"],[6,-1,0,"dirt"],[6,0,1,"grass_top"],[6,-1,1,"dirt"],[6,0,2,"grass_top"],[6,-1,2,"dirt"],[6,0,3,"grass_top"],[6,-1,3,"dirt"],[6,0,4,"grass_top"],[6,-1,4,"dirt"],[6,0,5,"grass_top"],[6,-1,5,"dirt"],[6,0,6,"grass_top"],[6,-1,6,"dirt"],[6,0,7,"grass_top"],[6,-1,7,"dirt"],[7,0,-1,"grass_top"],[7,-1,-1,"dirt"],[7,0,0,"grass_top"],[7,-1,0,"dirt"],[7,0,1,"grass_top"],[7,-1,1,"dirt"],[7,0,2,"grass_top"],[7,-1,2,"dirt"],[7,0,3,"grass_top"],[7,-1,3,"dirt"],[7,0,4,"grass_top"],[7,-1,4,"dirt"],[7,0,5,"grass_top"],[7,-1,5,"dirt"],[7,0,6,"grass_top"],[7,-1,6,"dirt"],[7,0,7,"grass_top"],[7,-1,7,"dirt"],[0,1,0,"log"],[0,1,1,"stone"],[0,1,2,"stone"],[0,1,3,"stone"],[0,1,4,"stone"],[0,1,5,"stone"],[0,1,6,"log"],[1,1,0,"stone"],[1,1,6,"stone"],[2,1,0,"stone"],[2,1,6,"stone"],[3,1,6,"stone"],[4,1,0,"stone"],[4,1,6,"stone"],[5,1,0,"stone"],[5,1,6,"stone"],[6,1,0,"log"],[6,1,1,"stone"],[6,1,2,"stone"],[6,1,3,"stone"],[6,1,4,"stone"],[6,1,5,"stone"],[6,1,6,"log"],[0,2,0,"log"],[0,2,1,"stone"],[0,2,2,"glass"],[0,2,3,"stone"],[0,2,4,"glass"],[0,2,5,"stone"],[0,2,6,"log"],[1,2,0,"stone"],[1,2,6,"stone"],[2,2,0,"glass"],[2,2,6,"glass"],[3,2,6,"stone"],[4,2,0,"glass"],[4,2,6,"glass"],[5,2,0,"stone"],[5,2,6,"stone"],[6,2,0,"log"],[6,2,1,"stone"],[6,2,2,"glass"],[6,2,3,"stone"],[6,2,4,"glass"],[6,2,5,"stone"],[6,2,6,"log"],[0,3,0,"log"],[0,3,1,"stone"],[0,3,2,"stone"],[0,3,3,"stone"],[0,3,4,"stone"],[0,3,5,"stone"],[0,3,6,"log"],[1,3,0,"stone"],[1,3,6,"stone"],[2,3,0,"stone"],[2,3,6,"stone"],[3,3,0,"stone"],[3,3,6,"stone"],[4,3,0,"stone"],[4,3,6,"stone"],[5,3,0,"stone"],[5,3,6,"stone"],[6,3,0,"log"],[6,3,1,"stone"],[6,3,2,"stone"],[6,3,3,"stone"],[6,3,4,"stone"],[6,3,5,"stone"],[6,3,6,"log"],[3,1,0,"door_low"],[3,2,0,"door_up"],[0,4,0,"slab"],[0,4,1,"slab"],[0,4,2,"slab"],[0,4,3,"slab"],[0,4,4,"slab"],[0,4,5,"slab"],[0,4,6,"slab"],[1,4,0,"slab"],[1,4,6,"slab"],[2,4,0,"slab"],[2,4,6,"slab"],[3,4,0,"slab"],[3,4,6,"slab"],[4,4,0,"slab"],[4,4,6,"slab"],[5,4,0,"slab"],[5,4,6,"slab"],[6,4,0,"slab"],[6,4,1,"slab"],[6,4,2,"slab"],[6,4,3,"slab"],[6,4,4,"slab"],[6,4,5,"slab"],[6,4,6,"slab"],[1,5,1,"cobble"],[1,5,2,"cobble"],[1,5,3,"cobble"],[1,5,4,"cobble"],[1,5,5,"cobble"],[2,5,1,"cobble"],[2,5,5,"cobble"],[3,5,1,"cobble"],[3,5,5,"cobble"],[4,5,1,"cobble"],[4,5,5,"cobble"],[5,5,1,"cobble"],[5,5,2,"cobble"],[5,5,3,"cobble"],[5,5,4,"cobble"],[5,5,5,"cobble"],[2,6,2,"cobble"],[2,6,3,"cobble"],[2,6,4,"cobble"],[3,6,2,"cobble"],[3,6,4,"cobble"],[4,6,2,"cobble"],[4,6,3,"cobble"],[4,6,4,"cobble"],[3,7,3,"cobble"],[5,1,-1,"glow"]],"tower":[[-1,0,-1,"grass_top"],[-1,-1,-1,"dirt"],[-1,0,0,"grass_top"],[-1,-1,0,"dirt"],[-1,0,1,"grass_top"],[-1,-1,1,"dirt"],[-1,0,2,"grass_top"],[-1,-1,2,"dirt"],[-1,0,3,"grass_top"],[-1,-1,3,"dirt"],[-1,0,4,"grass_top"],[-1,-1,4,"dirt"],[-1,0,5,"grass_top"],[-1,-1,5,"dirt"],[0,0,-1,"grass_top"],[0,-1,-1,"dirt"],[0,0,0,"grass_top"],[0,-1,0,"dirt"],[0,0,1,"grass_top"],[0,-1,1,"dirt"],[0,0,2,"grass_top"],[0,-1,2,"dirt"],[0,0,3,"grass_top"],[0,-1,3,"dirt"],[0,0,4,"grass_top"],[0,-1,4,"dirt"],[0,0,5,"grass_top"],[0,-1,5,"dirt"],[1,0,-1,"grass_top"],[1,-1,-1,"dirt"],[1,0,0,"grass_top"],[1,-1,0,"dirt"],[1,0,1,"grass_top"],[1,-1,1,"dirt"],[1,0,2,"grass_top"],[1,-1,2,"dirt"],[1,0,3,"grass_top"],[1,-1,3,"dirt"],[1,0,4,"grass_top"],[1,-1,4,"dirt"],[1,0,5,"grass_top"],[1,-1,5,"dirt"],[2,0,-1,"grass_top"],[2,-1,-1,"dirt"],[2,0,0,"grass_top"],[2,-1,0,"dirt"],[2,0,1,"grass_top"],[2,-1,1,"dirt"],[2,0,2,"grass_top"],[2,-1,2,"dirt"],[2,0,3,"grass_top"],[2,-1,3,"dirt"],[2,0,4,"grass_top"],[2,-1,4,"dirt"],[2,0,5,"grass_top"],[2,-1,5,"dirt"],[3,0,-1,"grass_top"],[3,-1,-1,"dirt"],[3,0,0,"grass_top"],[3,-1,0,"dirt"],[3,0,1,"grass_top"],[3,-1,1,"dirt"],[3,0,2,"grass_top"],[3,-1,2,"dirt"],[3,0,3,"grass_top"],[3,-1,3,"dirt"],[3,0,4,"grass_top"],[3,-1,4,"dirt"],[3,0,5,"grass_top"],[3,-1,5,"dirt"],[4,0,-1,"grass_top"],[4,-1,-1,"dirt"],[4,0,0,"grass_top"],[4,-1,0,"dirt"],[4,0,1,"grass_top"],[4,-1,1,"dirt"],[4,0,2,"grass_top"],[4,-1,2,"dirt"],[4,0,3,"grass_top"],[4,-1,3,"dirt"],[4,0,4,"grass_top"],[4,-1,4,"dirt"],[4,0,5,"grass_top"],[4,-1,5,"dirt"],[5,0,-1,"grass_top"],[5,-1,-1,"dirt"],[5,0,0,"grass_top"],[5,-1,0,"dirt"],[5,0,1,"grass_top"],[5,-1,1,"dirt"],[5,0,2,"grass_top"],[5,-1,2,"dirt"],[5,0,3,"grass_top"],[5,-1,3,"dirt"],[5,0,4,"grass_top"],[5,-1,4,"dirt"],[5,0,5,"grass_top"],[5,-1,5,"dirt"],[0,1,0,"log"],[0,1,1,"stone"],[0,1,2,"stone"],[0,1,3,"stone"],[0,1,4,"log"],[1,1,0,"stone"],[1,1,4,"stone"],[2,1,4,"stone"],[3,1,0,"stone"],[3,1,4,"stone"],[4,1,0,"log"],[4,1,1,"stone"],[4,1,2,"stone"],[4,1,3,"stone"],[4,1,4,"log"],[0,2,0,"log"],[0,2,1,"stone"],[0,2,2,"glass"],[0,2,3,"stone"],[0,2,4,"log"],[1,2,0,"stone"],[1,2,4,"stone"],[2,2,4,"glass"],[3,2,0,"stone"],[3,2,4,"stone"],[4,2,0,"log"],[4,2,1,"stone"],[4,2,2,"glass"],[4,2,3,"stone"],[4,2,4,"log"],[0,3,0,"log"],[0,3,1,"stone"],[0,3,2,"stone"],[0,3,3,"stone"],[0,3,4,"log"],[1,3,0,"stone"],[1,3,4,"stone"],[2,3,0,"stone"],[2,3,4,"stone"],[3,3,0,"stone"],[3,3,4,"stone"],[4,3,0,"log"],[4,3,1,"stone"],[4,3,2,"stone"],[4,3,3,"stone"],[4,3,4,"log"],[0,4,0,"log"],[0,4,1,"stone"],[0,4,2,"glass"],[0,4,3,"stone"],[0,4,4,"log"],[1,4,0,"stone"],[1,4,4,"stone"],[2,4,0,"glass"],[2,4,4,"glass"],[3,4,0,"stone"],[3,4,4,"stone"],[4,4,0,"log"],[4,4,1,"stone"],[4,4,2,"glass"],[4,4,3,"stone"],[4,4,4,"log"],[0,5,0,"log"],[0,5,1,"stone"],[0,5,2,"stone"],[0,5,3,"stone"],[0,5,4,"log"],[1,5,0,"stone"],[1,5,4,"stone"],[2,5,0,"stone"],[2,5,4,"stone"],[3,5,0,"stone"],[3,5,4,"stone"],[4,5,0,"log"],[4,5,1,"stone"],[4,5,2,"stone"],[4,5,3,"stone"],[4,5,4,"log"],[2,1,0,"door_low"],[2,2,0,"door_up"],[0,6,0,"stone"],[0,6,1,"stone"],[0,6,2,"stone"],[0,6,3,"stone"],[0,6,4,"stone"],[1,6,0,"stone"],[1,6,4,"stone"],[2,6,0,"stone"],[2,6,4,"stone"],[3,6,0,"stone"],[3,6,4,"stone"],[4,6,0,"stone"],[4,6,1,"stone"],[4,6,2,"stone"],[4,6,3,"stone"],[4,6,4,"stone"],[2,6,2,"glow"]],"porch":[[-2,0,-2,"grass_top"],[-2,-1,-2,"dirt"],[-2,0,-1,"grass_top"],[-2,-1,-1,"dirt"],[-2,0,0,"grass_top"],[-2,-1,0,"dirt"],[-2,0,1,"grass_top"],[-2,-1,1,"dirt"],[-2,0,2,"grass_top"],[-2,-1,2,"dirt"],[-2,0,3,"grass_top"],[-2,-1,3,"dirt"],[-2,0,4,"grass_top"],[-2,-1,4,"dirt"],[-2,0,5,"grass_top"],[-2,-1,5,"dirt"],[-2,0,6,"grass_top"],[-2,-1,6,"dirt"],[-2,0,7,"grass_top"],[-2,-1,7,"dirt"],[-2,0,8,"grass_top"],[-2,-1,8,"dirt"],[-1,0,-2,"grass_top"],[-1,-1,-2,"dirt"],[-1,0,-1,"grass_top"],[-1,-1,-1,"dirt"],[-1,0,0,"grass_top"],[-1,-1,0,"dirt"],[-1,0,1,"grass_top"],[-1,-1,1,"dirt"],[-1,0,2,"grass_top"],[-1,-1,2,"dirt"],[-1,0,3,"grass_top"],[-1,-1,3,"dirt"],[-1,0,4,"grass_top"],[-1,-1,4,"dirt"],[-1,0,5,"grass_top"],[-1,-1,5,"dirt"],[-1,0,6,"grass_top"],[-1,-1,6,"dirt"],[-1,0,7,"grass_top"],[-1,-1,7,"dirt"],[-1,0,8,"grass_top"],[-1,-1,8,"dirt"],[0,0,-2,"grass_top"],[0,-1,-2,"dirt"],[0,0,-1,"grass_top"],[0,-1,-1,"dirt"],[0,0,0,"grass_top"],[0,-1,0,"dirt"],[0,0,1,"grass_top"],[0,-1,1,"dirt"],[0,0,2,"grass_top"],[0,-1,2,"dirt"],[0,0,3,"grass_top"],[0,-1,3,"dirt"],[0,0,4,"grass_top"],[0,-1,4,"dirt"],[0,0,5,"grass_top"],[0,-1,5,"dirt"],[0,0,6,"grass_top"],[0,-1,6,"dirt"],[0,0,7,"grass_top"],[0,-1,7,"dirt"],[0,0,8,"grass_top"],[0,-1,8,"dirt"],[1,0,-2,"grass_top"],[1,-1,-2,"dirt"],[1,0,-1,"grass_top"],[1,-1,-1,"dirt"],[1,0,0,"grass_top"],[1,-1,0,"dirt"],[1,0,1,"grass_top"],[1,-1,1,"dirt"],[1,0,2,"grass_top"],[1,-1,2,"dirt"],[1,0,3,"grass_top"],[1,-1,3,"dirt"],[1,0,4,"grass_top"],[1,-1,4,"dirt"],[1,0,5,"grass_top"],[1,-1,5,"dirt"],[1,0,6,"grass_top"],[1,-1,6,"dirt"],[1,0,7,"grass_top"],[1,-1,7,"dirt"],[1,0,8,"grass_top"],[1,-1,8,"dirt"],[2,0,-2,"grass_top"],[2,-1,-2,"dirt"],[2,0,-1,"grass_top"],[2,-1,-1,"dirt"],[2,0,0,"grass_top"],[2,-1,0,"dirt"],[2,0,1,"grass_top"],[2,-1,1,"dirt"],[2,0,2,"grass_top"],[2,-1,2,"dirt"],[2,0,3,"grass_top"],[2,-1,3,"dirt"],[2,0,4,"grass_top"],[2,-1,4,"dirt"],[2,0,5,"grass_top"],[2,-1,5,"dirt"],[2,0,6,"grass_top"],[2,-1,6,"dirt"],[2,0,7,"grass_top"],[2,-1,7,"dirt"],[2,0,8,"grass_top"],[2,-1,8,"dirt"],[3,0,-2,"grass_top"],[3,-1,-2,"dirt"],[3,0,-1,"grass_top"],[3,-1,-1,"dirt"],[3,0,0,"grass_top"],[3,-1,0,"dirt"],[3,0,1,"grass_top"],[3,-1,1,"dirt"],[3,0,2,"grass_top"],[3,-1,2,"dirt"],[3,0,3,"grass_top"],[3,-1,3,"dirt"],[3,0,4,"grass_top"],[3,-1,4,"dirt"],[3,0,5,"grass_top"],[3,-1,5,"dirt"],[3,0,6,"grass_top"],[3,-1,6,"dirt"],[3,0,7,"grass_top"],[3,-1,7,"dirt"],[3,0,8,"grass_top"],[3,-1,8,"dirt"],[4,0,-2,"grass_top"],[4,-1,-2,"dirt"],[4,0,-1,"grass_top"],[4,-1,-1,"dirt"],[4,0,0,"grass_top"],[4,-1,0,"dirt"],[4,0,1,"grass_top"],[4,-1,1,"dirt"],[4,0,2,"grass_top"],[4,-1,2,"dirt"],[4,0,3,"grass_top"],[4,-1,3,"dirt"],[4,0,4,"grass_top"],[4,-1,4,"dirt"],[4,0,5,"grass_top"],[4,-1,5,"dirt"],[4,0,6,"grass_top"],[4,-1,6,"dirt"],[4,0,7,"grass_top"],[4,-1,7,"dirt"],[4,0,8,"grass_top"],[4,-1,8,"dirt"],[5,0,-2,"grass_top"],[5,-1,-2,"dirt"],[5,0,-1,"grass_top"],[5,-1,-1,"dirt"],[5,0,0,"grass_top"],[5,-1,0,"dirt"],[5,0,1,"grass_top"],[5,-1,1,"dirt"],[5,0,2,"grass_top"],[5,-1,2,"dirt"],[5,0,3,"grass_top"],[5,-1,3,"dirt"],[5,0,4,"grass_top"],[5,-1,4,"dirt"],[5,0,5,"grass_top"],[5,-1,5,"dirt"],[5,0,6,"grass_top"],[5,-1,6,"dirt"],[5,0,7,"grass_top"],[5,-1,7,"dirt"],[5,0,8,"grass_top"],[5,-1,8,"dirt"],[6,0,-2,"grass_top"],[6,-1,-2,"dirt"],[6,0,-1,"grass_top"],[6,-1,-1,"dirt"],[6,0,0,"grass_top"],[6,-1,0,"dirt"],[6,0,1,"grass_top"],[6,-1,1,"dirt"],[6,0,2,"grass_top"],[6,-1,2,"dirt"],[6,0,3,"grass_top"],[6,-1,3,"dirt"],[6,0,4,"grass_top"],[6,-1,4,"dirt"],[6,0,5,"grass_top"],[6,-1,5,"dirt"],[6,0,6,"grass_top"],[6,-1,6,"dirt"],[6,0,7,"grass_top"],[6,-1,7,"dirt"],[6,0,8,"grass_top"],[6,-1,8,"dirt"],[7,0,-2,"grass_top"],[7,-1,-2,"dirt"],[7,0,-1,"grass_top"],[7,-1,-1,"dirt"],[7,0,0,"grass_top"],[7,-1,0,"dirt"],[7,0,1,"grass_top"],[7,-1,1,"dirt"],[7,0,2,"grass_top"],[7,-1,2,"dirt"],[7,0,3,"grass_top"],[7,-1,3,"dirt"],[7,0,4,"grass_top"],[7,-1,4,"dirt"],[7,0,5,"grass_top"],[7,-1,5,"dirt"],[7,0,6,"grass_top"],[7,-1,6,"dirt"],[7,0,7,"grass_top"],[7,-1,7,"dirt"],[7,0,8,"grass_top"],[7,-1,8,"dirt"],[8,0,-2,"grass_top"],[8,-1,-2,"dirt"],[8,0,-1,"grass_top"],[8,-1,-1,"dirt"],[8,0,0,"grass_top"],[8,-1,0,"dirt"],[8,0,1,"grass_top"],[8,-1,1,"dirt"],[8,0,2,"grass_top"],[8,-1,2,"dirt"],[8,0,3,"grass_top"],[8,-1,3,"dirt"],[8,0,4,"grass_top"],[8,-1,4,"dirt"],[8,0,5,"grass_top"],[8,-1,5,"dirt"],[8,0,6,"grass_top"],[8,-1,6,"dirt"],[8,0,7,"grass_top"],[8,-1,7,"dirt"],[8,0,8,"grass_top"],[8,-1,8,"dirt"],[0,1,2,"log"],[0,1,3,"planks"],[0,1,4,"planks"],[0,1,5,"planks"],[0,1,6,"log"],[1,1,2,"planks"],[1,1,6,"planks"],[2,1,2,"planks"],[2,1,6,"planks"],[3,1,6,"planks"],[4,1,2,"planks"],[4,1,6,"planks"],[5,1,2,"planks"],[5,1,6,"planks"],[6,1,2,"log"],[6,1,3,"planks"],[6,1,4,"planks"],[6,1,5,"planks"],[6,1,6,"log"],[0,2,2,"log"],[0,2,3,"glass"],[0,2,4,"planks"],[0,2,5,"glass"],[0,2,6,"log"],[1,2,2,"glass"],[1,2,6,"glass"],[2,2,2,"planks"],[2,2,6,"planks"],[3,2,6,"planks"],[4,2,2,"planks"],[4,2,6,"planks"],[5,2,2,"glass"],[5,2,6,"glass"],[6,2,2,"log"],[6,2,3,"glass"],[6,2,4,"planks"],[6,2,5,"glass"],[6,2,6,"log"],[3,1,2,"door_low"],[3,2,2,"door_up"],[0,1,0,"log"],[0,2,0,"log"],[6,1,0,"log"],[6,2,0,"log"],[0,3,0,"slab"],[0,3,1,"slab"],[0,3,2,"slab"],[1,3,0,"slab"],[1,3,1,"slab"],[1,3,2,"slab"],[2,3,0,"slab"],[2,3,1,"slab"],[2,3,2,"slab"],[3,3,0,"slab"],[3,3,1,"slab"],[3,3,2,"slab"],[4,3,0,"slab"],[4,3,1,"slab"],[4,3,2,"slab"],[5,3,0,"slab"],[5,3,1,"slab"],[5,3,2,"slab"],[6,3,0,"slab"],[6,3,1,"slab"],[6,3,2,"slab"],[0,3,2,"stone"],[0,3,3,"stone"],[0,3,4,"stone"],[0,3,5,"stone"],[0,3,6,"stone"],[1,3,2,"stone"],[1,3,3,"stone"],[1,3,4,"stone"],[1,3,5,"stone"],[1,3,6,"stone"],[2,3,2,"stone"],[2,3,3,"stone"],[2,3,4,"stone"],[2,3,5,"stone"],[2,3,6,"stone"],[3,3,2,"stone"],[3,3,3,"stone"],[3,3,4,"stone"],[3,3,5,"stone"],[3,3,6,"stone"],[4,3,2,"stone"],[4,3,3,"stone"],[4,3,4,"stone"],[4,3,5,"stone"],[4,3,6,"stone"],[5,3,2,"stone"],[5,3,3,"stone"],[5,3,4,"stone"],[5,3,5,"stone"],[5,3,6,"stone"],[6,3,2,"stone"],[6,3,3,"stone"],[6,3,4,"stone"],[6,3,5,"stone"],[6,3,6,"stone"],[1,4,3,"stone"],[1,4,4,"stone"],[1,4,5,"stone"],[2,4,3,"stone"],[2,4,4,"stone"],[2,4,5,"stone"],[3,4,3,"stone"],[3,4,4,"stone"],[3,4,5,"stone"],[4,4,3,"stone"],[4,4,4,"stone"],[4,4,5,"stone"],[5,4,3,"stone"],[5,4,4,"stone"],[5,4,5,"stone"],[5,1,-1,"glow"]]};
  // Aktuell anzuzeigendes Hausmodell (Standard: Eichenhaus)
  var MOB_MODELS = {"pig":[{"name":"body","c":[0.0,0.75,0.0],"s":[0.625,0.5,1.0],"box":[10,8,16],"uv":[12,8],"tex":"skin_pig","texSize":[64,32]},{"name":"head","c":[0.0,0.75,-0.75],"s":[0.5,0.5,0.5],"box":[8,8,8],"uv":[0,0],"tex":"skin_pig","texSize":[64,32]},{"name":"leg","c":[-0.1875,0.1875,0.3125],"s":[0.25,0.375,0.25],"box":[4,6,4],"uv":[0,16],"tex":"skin_pig","texSize":[64,32]},{"name":"leg","c":[0.1875,0.1875,0.3125],"s":[0.25,0.375,0.25],"box":[4,6,4],"uv":[0,16],"tex":"skin_pig","texSize":[64,32]},{"name":"leg","c":[-0.1875,0.1875,-0.3125],"s":[0.25,0.375,0.25],"box":[4,6,4],"uv":[0,16],"tex":"skin_pig","texSize":[64,32]},{"name":"leg","c":[0.1875,0.1875,-0.3125],"s":[0.25,0.375,0.25],"box":[4,6,4],"uv":[0,16],"tex":"skin_pig","texSize":[64,32]}],"chicken":[{"name":"body","c":[0.0,0.5,0.0],"s":[0.375,0.5,0.375],"box":[6,8,6],"uv":[0,9],"tex":"skin_chicken","texSize":[64,32]},{"name":"head","c":[0.0,0.9375,-0.25],"s":[0.25,0.375,0.1875],"box":[4,6,3],"uv":[0,0],"tex":"skin_chicken","texSize":[64,32]},{"name":"beak","c":[0.0,0.875,-0.375],"s":[0.25,0.125,0.125],"box":[4,2,2],"uv":[14,0],"tex":"skin_chicken","texSize":[64,32]},{"name":"wing","c":[-0.1875,0.5625,0.0],"s":[0.0625,0.25,0.375],"box":[1,4,6],"uv":[22,0],"tex":"skin_chicken","texSize":[64,32]},{"name":"wing","c":[0.1875,0.5625,0.0],"s":[0.0625,0.25,0.375],"box":[1,4,6],"uv":[22,0],"tex":"skin_chicken","texSize":[64,32]},{"name":"leg","c":[-0.125,0.125,0.0],"s":[0.1875,0.3125,0.1875],"box":[3,5,3],"uv":[26,0],"tex":"skin_chicken","texSize":[64,32]},{"name":"leg","c":[0.125,0.125,0.0],"s":[0.1875,0.3125,0.1875],"box":[3,5,3],"uv":[26,0],"tex":"skin_chicken","texSize":[64,32]}],"cat":[{"name":"body","c":[0.0,0.375,0.0],"s":[0.375,0.375,0.625],"box":[6,6,10],"uv":[20,0],"tex":"skin_cat","texSize":[64,32]},{"name":"head","c":[0.0,0.5,-0.4375],"s":[0.3125,0.3125,0.3125],"box":[5,5,5],"uv":[0,0],"tex":"skin_cat","texSize":[64,32]},{"name":"leg","c":[-0.125,0.1875,0.1875],"s":[0.125,0.375,0.125],"box":[2,6,2],"uv":[8,13],"tex":"skin_cat","texSize":[64,32]},{"name":"leg","c":[0.125,0.1875,0.1875],"s":[0.125,0.375,0.125],"box":[2,6,2],"uv":[8,13],"tex":"skin_cat","texSize":[64,32]},{"name":"leg","c":[-0.125,0.1875,-0.1875],"s":[0.125,0.375,0.125],"box":[2,6,2],"uv":[8,13],"tex":"skin_cat","texSize":[64,32]},{"name":"leg","c":[0.125,0.1875,-0.1875],"s":[0.125,0.375,0.125],"box":[2,6,2],"uv":[8,13],"tex":"skin_cat","texSize":[64,32]},{"name":"tail","c":[0.0,0.4375,0.4375],"s":[0.125,0.5,0.125],"box":[2,8,2],"uv":[0,15],"tex":"skin_cat","texSize":[64,32]}],"wolf":[{"name":"body","c":[0.0,0.5,0.0],"s":[0.375,0.4375,0.625],"box":[6,7,10],"uv":[18,14],"tex":"skin_wolf","texSize":[64,32]},{"name":"head","c":[0.0,0.625,-0.5],"s":[0.375,0.375,0.375],"box":[6,6,6],"uv":[0,0],"tex":"skin_wolf","texSize":[64,32]},{"name":"leg","c":[-0.125,0.1875,0.25],"s":[0.125,0.5,0.125],"box":[2,8,2],"uv":[0,18],"tex":"skin_wolf","texSize":[64,32]},{"name":"leg","c":[0.125,0.1875,0.25],"s":[0.125,0.5,0.125],"box":[2,8,2],"uv":[0,18],"tex":"skin_wolf","texSize":[64,32]},{"name":"leg","c":[-0.125,0.1875,-0.1875],"s":[0.125,0.5,0.125],"box":[2,8,2],"uv":[0,18],"tex":"skin_wolf","texSize":[64,32]},{"name":"leg","c":[0.125,0.1875,-0.1875],"s":[0.125,0.5,0.125],"box":[2,8,2],"uv":[0,18],"tex":"skin_wolf","texSize":[64,32]},{"name":"tail","c":[0.0,0.625,0.4375],"s":[0.125,0.5,0.125],"box":[2,8,2],"uv":[9,18],"tex":"skin_wolf","texSize":[64,32]}],"fox":[{"name":"body","c":[0.0,0.375,0.0],"s":[0.375,0.375,0.75],"box":[6,6,12],"uv":[24,14],"tex":"skin_fox","texSize":[64,32]},{"name":"head","c":[0.0,0.5,-0.5],"s":[0.5,0.375,0.375],"box":[8,6,6],"uv":[1,5],"tex":"skin_fox","texSize":[64,32]},{"name":"leg","c":[-0.125,0.1875,0.3125],"s":[0.125,0.375,0.125],"box":[2,6,2],"uv":[13,24],"tex":"skin_fox","texSize":[64,32]},{"name":"leg","c":[0.125,0.1875,0.3125],"s":[0.125,0.375,0.125],"box":[2,6,2],"uv":[13,24],"tex":"skin_fox","texSize":[64,32]},{"name":"leg","c":[-0.125,0.1875,-0.25],"s":[0.125,0.375,0.125],"box":[2,6,2],"uv":[13,24],"tex":"skin_fox","texSize":[64,32]},{"name":"leg","c":[0.125,0.1875,-0.25],"s":[0.125,0.375,0.125],"box":[2,6,2],"uv":[13,24],"tex":"skin_fox","texSize":[64,32]},{"name":"tail","c":[0.0,0.4375,0.5625],"s":[0.25,0.25,0.4375],"box":[4,4,7],"uv":[30,0],"tex":"skin_fox","texSize":[64,32]}],"axolotl":[{"name":"body","c":[0.0,0.25,0.0],"s":[0.3125,0.25,0.5625],"box":[5,4,9],"uv":[11,8],"tex":"skin_axolotl","texSize":[64,64]},{"name":"head","c":[0.0,0.3125,-0.375],"s":[0.375,0.3125,0.3125],"box":[6,5,5],"uv":[0,0],"tex":"skin_axolotl","texSize":[64,64]},{"name":"tail","c":[0.0,0.25,0.4375],"s":[0.1875,0.3125,0.375],"box":[3,5,6],"uv":[2,19],"tex":"skin_axolotl","texSize":[64,64]},{"name":"leg","c":[-0.125,0.0625,0.1875],"s":[0.125,0.1875,0.125],"box":[2,3,2],"uv":[2,13],"tex":"skin_axolotl","texSize":[64,64]},{"name":"leg","c":[0.125,0.0625,0.1875],"s":[0.125,0.1875,0.125],"box":[2,3,2],"uv":[2,13],"tex":"skin_axolotl","texSize":[64,64]},{"name":"leg","c":[-0.125,0.0625,-0.125],"s":[0.125,0.1875,0.125],"box":[2,3,2],"uv":[2,13],"tex":"skin_axolotl","texSize":[64,64]},{"name":"leg","c":[0.125,0.0625,-0.125],"s":[0.125,0.1875,0.125],"box":[2,3,2],"uv":[2,13],"tex":"skin_axolotl","texSize":[64,64]}]};
  var house3dId = 'starter';
  function houseVoxels() {
    var m = HOUSE_MODELS[house3dId] || HOUSE_MODELS.starter;
    return m.map(function (a) { return { x: a[0], y: a[1], z: a[2], t: a[3] }; });
  }

  // Bau-Schritte: baubare Würfel (y>=1) in ~12 handhabbare Gruppen, unten->oben, hinten->vorne
  function buildSteps(modelId) {
    var m = HOUSE_MODELS[modelId] || HOUSE_MODELS.starter;
    var buildable = m.filter(function (a) { return a[1] >= 1; });
    var ys = [];
    buildable.forEach(function (a) { if (ys.indexOf(a[1]) < 0) ys.push(a[1]); });
    ys.sort(function (a, b) { return a - b; });
    var TARGET = 12;
    var perLayer = Math.max(1, Math.round(TARGET / ys.length));
    var steps = [];
    ys.forEach(function (y) {
      var layer = buildable.filter(function (a) { return a[1] === y; });
      layer.sort(function (a, b) { return (b[2] - a[2]) || (a[0] - b[0]); });
      var chunk = Math.max(1, Math.ceil(layer.length / perLayer));
      for (var i = 0; i < layer.length; i += chunk) {
        steps.push(layer.slice(i, i + chunk).map(function (a) {
          return { x: a[0], y: a[1], z: a[2], t: a[3] };
        }));
      }
    });
    return steps;
  }
  function groundVoxels(modelId) {
    var m = HOUSE_MODELS[modelId] || HOUSE_MODELS.starter;
    return m.filter(function (a) { return a[1] < 1; }).map(function (a) {
      return { x: a[0], y: a[1], z: a[2], t: a[3] };
    });
  }

  var b3d = null; // { renderer, scene, camera, pivot, raf, rotY, rotX, auto, camDist }
  function setBtnLabel(id, txt) {
    var btn = $(id);
    if (!btn) return;
    var span = btn.querySelector ? btn.querySelector('span') : null;
    if (span) span.textContent = txt; else btn.textContent = txt;
  }

  function build3dStart(guided) {
    var wrap = $('build3d-wrap');
    wrap.style.display = 'block';
    $('build3d-hint').textContent = '3D wird geladen ...';
    loadThree(function () {
      build3dInit(guided);
    });
  }
  function build3dStop() {
    $('build3d-wrap').style.display = 'none';
    if (b3d && b3d.raf) cancelAnimationFrame(b3d.raf);
    if (b3d && b3d.renderer) { b3d.renderer.dispose && b3d.renderer.dispose(); }
    b3d = null;
  }

  function build3dInit(guided) {
    var THREE = window.THREE;
    var canvas = $('build3d-canvas');
    var wrap = $('build3d-wrap');
    var W = wrap.clientWidth || Math.min(window.innerWidth, 760);
    var H = Math.min(window.innerHeight * 0.62, 520);
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xdfeeff, 22, 48);
    var camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 200);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    var skyGeo = new THREE.SphereGeometry(90, 16, 16);
    var skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: { top: { value: new THREE.Color(0x7ec0ee) }, bot: { value: new THREE.Color(0xeaf6ff) } },
      vertexShader: 'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: 'varying vec3 p;uniform vec3 top;uniform vec3 bot;void main(){float h=normalize(p).y*0.5+0.5;gl_FragColor=vec4(mix(bot,top,h),1.0);}'
    });
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    scene.add(new THREE.HemisphereLight(0xffffff, 0x88aa77, 0.55));
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    var sun = new THREE.DirectionalLight(0xfff4e0, 0.95);
    sun.position.set(12, 22, 10); sun.castShadow = true;
    sun.shadow.mapSize.width = 1024; sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.left = -15; sun.shadow.camera.right = 15;
    sun.shadow.camera.top = 15; sun.shadow.camera.bottom = -15;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 60;
    scene.add(sun);

    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    var matCache = {};
    var FALLBACK = {
      grass_top: 0x6aa84f, dirt: 0x8b5a2b, planks: 0xb8895a, log: 0x6b4f2a,
      stripped: 0xc8a06a, stone: 0x9a9a9a, cobble: 0x888888, glass: 0xadd8e6,
      door_low: 0x7a5a30, door_up: 0x7a5a30, glow: 0xffd27a, slab: 0xb0b0b0
    };
    function mat(name) {
      if (matCache[name]) return matCache[name];
      var glass = (name === 'glass');
      var m = new THREE.MeshStandardMaterial({
        color: FALLBACK[name] || 0xcccccc, roughness: 0.95, metalness: 0.0,
        transparent: glass, opacity: glass ? 0.55 : 1.0,
        emissive: (name === 'glow') ? new THREE.Color(0xffd27a) : new THREE.Color(0x000000),
        emissiveIntensity: (name === 'glow') ? 0.8 : 0
      });
      matCache[name] = m;
      var dataUri = BUILD3D_DATA[name];
      if (dataUri) {
        loader.load(dataUri, function (t) {
          t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter;
          if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
          m.map = t;
          m.color.set(0xffffff);
          m.needsUpdate = true;
        });
      }
      return m;
    }

    var group = new THREE.Group();
    var geo = new THREE.BoxGeometry(1, 1, 1);
    var modelId = (state.buildProject && state.buildProject.id) || house3dId;

    // Zentrum aus allen Modell-Würfeln für Pivot
    var all = HOUSE_MODELS[modelId] || HOUSE_MODELS.starter;
    var cx = 0, cy = 0, cz = 0;
    all.forEach(function (a) { cx += a[0]; cy += a[1]; cz += a[2]; });
    cx /= all.length; cy /= all.length; cz /= all.length;

    var ghostMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, depthWrite: false });
    var ghostMeshes = []; // aktuelle Schritt-Geisterwürfel (pulsieren)

    // Boden immer fest
    groundVoxels(modelId).forEach(function (bk) {
      var cube = new THREE.Mesh(geo, mat(bk.t));
      cube.position.set(bk.x, bk.y, bk.z);
      cube.receiveShadow = true;
      group.add(cube);
    });

    group.position.set(-cx, -cy, -cz);
    var pivot = new THREE.Group(); pivot.add(group); scene.add(pivot);

    b3d = {
      THREE: THREE, renderer: renderer, scene: scene, camera: camera, pivot: pivot,
      group: group, geo: geo, mat: mat, ghostMat: ghostMat, ghostMeshes: ghostMeshes,
      rotY: 0.7, rotX: 0.42, auto: true, camDist: 32, camTarget: 27, W: W, H: H,
      guided: !!guided, modelId: modelId,
      raycaster: new THREE.Raycaster(), pulse: 0
    };

    if (guided) {
      // Bau-Schritte vorbereiten
      if (!state.buildProject.steps) {
        // pro Projekt fortschreiten; placedSteps = Anzahl gesetzter Schritte
        state.buildProject.placedSteps = state.buildProject.placedSteps || 0;
      }
      b3d.steps = buildSteps(modelId);
      build3dRenderProgress();
    } else {
      // freie Ansicht: ganzes Haus
      houseVoxels().forEach(function (bk) {
        if (bk.y < 1) return;
        var cube = new THREE.Mesh(geo, mat(bk.t));
        cube.position.set(bk.x, bk.y, bk.z);
        cube.castShadow = true; cube.receiveShadow = true;
        group.add(cube);
      });
    }

    setupBuild3dInput(canvas);
    build3dLoop();
  }

  // Setzt platzierte Schritte fest, zeigt aktuellen Schritt als Geister
  function build3dRenderProgress() {
    if (!b3d || !b3d.guided) return;
    var THREE = b3d.THREE;
    // alte Geister entfernen
    b3d.ghostMeshes.forEach(function (gm) { b3d.group.remove(gm); });
    b3d.ghostMeshes = [];
    var placed = state.buildProject.placedSteps || 0;
    // platzierte Schritte als feste Blöcke (nur einmal neu aufbauen ist teuer; wir bauen alles platzierte)
    // markieren bereits hinzugefügte über b3d.builtCount
    if (b3d.builtCount === undefined) b3d.builtCount = 0;
    for (var s = b3d.builtCount; s < placed; s++) {
      b3d.steps[s].forEach(function (bk) {
        var cube = new THREE.Mesh(b3d.geo, b3d.mat(bk.t));
        cube.position.set(bk.x, bk.y, bk.z);
        cube.castShadow = true; cube.receiveShadow = true;
        b3d.group.add(cube);
      });
    }
    b3d.builtCount = placed;
    // aktueller Schritt als Geister
    if (placed < b3d.steps.length) {
      b3d.steps[placed].forEach(function (bk) {
        var gm = new THREE.Mesh(b3d.geo, b3d.ghostMat.clone());
        gm.position.set(bk.x, bk.y, bk.z);
        gm.userData.isGhost = true;
        b3d.group.add(gm);
        b3d.ghostMeshes.push(gm);
      });
      $('build3d-hint').textContent = 'Tippe die leuchtenden Bl\u00f6cke! (' + placed + ' / ' + b3d.steps.length + ')';
    } else {
      $('build3d-hint').textContent = 'Fertig gebaut! Toll gemacht!';
    }
  }

  function build3dPlaceStep() {
    if (!b3d || !b3d.guided) return;
    var placed = state.buildProject.placedSteps || 0;
    if (placed >= b3d.steps.length) return;
    state.buildProject.placedSteps = placed + 1;
    saveState();
    Sound.mine();
    var done = state.buildProject.placedSteps >= b3d.steps.length;
    build3dRenderProgress();
    if (done) {
      state.builtProjects = state.builtProjects || {};
      state.builtProjects[b3d.modelId] = true;
      // Haus auf n\u00e4chsten freien Platz in der Welt stellen
      placeHouseInWorld(b3d.modelId);
      saveState();
      Sound.levelup();
      say('haus_2', 'Super! Du hast das Haus gebaut! Es steht jetzt in deiner Welt!');
    }
  }

  function placeHouseInWorld(houseId) {
    state.worldPlacements = state.worldPlacements || [];
    var slots = myWorldSlots();
    var used = {};
    state.worldPlacements.forEach(function (p) { used[p.sx + ',' + p.sz] = true; });
    var free = null;
    for (var i = 0; i < slots.length; i++) {
      if (!used[slots[i].sx + ',' + slots[i].sz]) { free = slots[i]; break; }
    }
    if (!free) free = slots[0]; // alle belegt: ersten Platz \u00fcberschreiben (selten)
    state.worldPlacements.push({ id: houseId, sx: free.sx, sz: free.sz });
  }

  function setupBuild3dInput(canvas) {
    var dragging = false, moved = false, lx = 0, ly = 0, downX = 0, downY = 0;
    function down(x, y) { dragging = true; moved = false; b3d.auto = false; lx = x; ly = y; downX = x; downY = y; }
    function move(x, y) {
      if (!dragging || !b3d) return;
      if (Math.abs(x - downX) > 6 || Math.abs(y - downY) > 6) moved = true;
      b3d.rotY += (x - lx) * 0.01; b3d.rotX += (y - ly) * 0.01;
      b3d.rotX = Math.max(0.05, Math.min(1.1, b3d.rotX)); lx = x; ly = y;
    }
    function up(x, y) {
      dragging = false;
      // Tippen (nicht gezogen) auf Geisterwürfel -> Schritt setzen
      if (!moved && b3d && b3d.guided) {
        tryTapGhost(x, y);
      }
    }
    canvas.addEventListener('mousedown', function (e) { down(e.clientX, e.clientY); });
    window.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
    window.addEventListener('mouseup', function (e) { up(e.clientX, e.clientY); });
    canvas.addEventListener('touchstart', function (e) { var t = e.touches[0]; down(t.clientX, t.clientY); }, { passive: true });
    canvas.addEventListener('touchmove', function (e) { var t = e.touches[0]; move(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend', function (e) {
      var t = (e.changedTouches && e.changedTouches[0]) || {};
      up(t.clientX, t.clientY);
    });
  }

  function tryTapGhost(clientX, clientY) {
    if (!b3d || !b3d.ghostMeshes.length) return;
    var THREE = b3d.THREE;
    var rect = b3d.renderer.domElement.getBoundingClientRect();
    var nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    var ny = -((clientY - rect.top) / rect.height) * 2 + 1;
    b3d.raycaster.setFromCamera({ x: nx, y: ny }, b3d.camera);
    var hits = b3d.raycaster.intersectObjects(b3d.ghostMeshes, false);
    if (hits.length > 0) {
      build3dPlaceStep();
    }
  }

  function build3dLoop() {
    if (!b3d) return;
    b3d.raf = requestAnimationFrame(build3dLoop);
    if (b3d.auto) b3d.rotY += 0.0035;
    b3d.camDist += (b3d.camTarget - b3d.camDist) * 0.04;
    b3d.pivot.rotation.y = b3d.rotY;
    b3d.pivot.rotation.x = b3d.rotX;
    b3d.camera.position.set(0, 6.5, b3d.camDist);
    b3d.camera.lookAt(0, 1.5, 0);
    // Geister pulsieren
    if (b3d.ghostMeshes.length) {
      b3d.pulse += 0.06;
      var op = 0.32 + Math.sin(b3d.pulse) * 0.22;
      b3d.ghostMeshes.forEach(function (gm) { gm.material.opacity = op; });
    }
    b3d.renderer.render(b3d.scene, b3d.camera);
  }

  // ---------- Meine Welt (3D-Grundst\u00fcck mit gebauten H\u00e4usern) ----------
  var mw3d = null;

  // Baut ein Minecraft-Mob aus Quadern mit korrektem UV-Netz-Mapping
  // UV-Netz eines Quaders (W breit, H hoch, D tief) ab (u,v) in der Textur:
  //   Anordnung (Minecraft Standard):
  //     [D][W][D][W]  obere Reihe: oben/unten-Flächen + ...
  //   Wir setzen pro Würfelseite die korrekten Pixel-Rechtecke.
  function buildMob(THREE, parts, mobMat) {
    var grp = new THREE.Group();
    parts.forEach(function (p) {
      var W = p.box[0], H = p.box[1], D = p.box[2];
      var tw = p.texSize[0], th = p.texSize[1];
      var uo = p.uv[0], vo = p.uv[1];
      var geo = new THREE.BoxGeometry(p.s[0], p.s[1], p.s[2]);
      // Minecraft UV-Netz: Flächen-Rechtecke in Pixeln (x,y,w,h) ab (uo,vo)
      // Reihenfolge der BoxGeometry-Flächen: +x,-x,+y,-y,+z,-z
      // Netz-Layout: 
      //   right(-x): (uo, vo+D, D, H)  ... wir nutzen das klassische Layout:
      var faces = {
        // [px, py, pw, ph]
        east:  [uo,            vo + D,     D, H], // +x
        west:  [uo + D + W,    vo + D,     D, H], // -x
        up:    [uo + D,        vo,         W, D], // +y
        down:  [uo + D + W,    vo,         W, D], // -y
        north: [uo + D + W + D,vo + D,     W, H], // +z (hinten)
        south: [uo + D,        vo + D,     W, H]  // -z (vorne, Gesicht)
      };
      var order = ['east', 'west', 'up', 'down', 'north', 'south'];
      var uvAttr = geo.attributes.uv;
      order.forEach(function (fk, fi) {
        var f = faces[fk];
        var u0 = f[0] / tw, v0 = 1 - f[1] / th;
        var u1 = (f[0] + f[2]) / tw, v1 = 1 - (f[1] + f[3]) / th;
        // 4 UV-Ecken dieser Fläche (BoxGeometry: je Fläche 4 Vertices)
        var base = fi * 4;
        // Reihenfolge der vier UVs in BoxGeometry: (0,1),(1,1),(0,0),(1,0)
        uvAttr.setXY(base + 0, u0, v0);
        uvAttr.setXY(base + 1, u1, v0);
        uvAttr.setXY(base + 2, u0, v1);
        uvAttr.setXY(base + 3, u1, v1);
      });
      uvAttr.needsUpdate = true;
      var mesh = new THREE.Mesh(geo, mobMat[p.tex]);
      mesh.position.set(p.c[0], p.c[1], p.c[2]);
      mesh.castShadow = true;
      grp.add(mesh);
    });
    return grp;
  }

  var MW_PLOT = 13;      // großer Platz pro Haus
  var MW_GRID = 2;       // 2x2 Raster
  var MW_MARGIN = 4;     // Pufferzone zwischen Hausbereich und Baumrand
  function myWorldSlots() {
    var slots = [];
    for (var sz = 0; sz < MW_GRID; sz++) for (var sx = 0; sx < MW_GRID; sx++) slots.push({ sx: sx, sz: sz });
    return slots;
  }

  function myWorldStart() {
    var wrap = $('myworld-wrap');
    var placements = state.worldPlacements || [];
    if (placements.length === 0) {
      wrap.style.display = 'none';
      $('myworld-empty').style.display = 'block';
      return;
    }
    $('myworld-empty').style.display = 'none';
    wrap.style.display = 'block';
    $('myworld-hint').textContent = '3D wird geladen ...';
    loadThree(function () {
      $('myworld-hint').textContent = 'Mit dem Finger drehen';
      myWorldInit();
    });
  }
  function myWorldStop() {
    var wrap = $('myworld-wrap');
    if (wrap) wrap.style.display = 'none';
    if (mw3d && mw3d.raf) cancelAnimationFrame(mw3d.raf);
    if (mw3d && mw3d.renderer && mw3d.renderer.dispose) mw3d.renderer.dispose();
    mw3d = null;
  }

  function myWorldInit() {
    var THREE = window.THREE;
    var canvas = $('myworld-canvas');
    var wrap = $('myworld-wrap');
    var W = wrap.clientWidth || Math.min(window.innerWidth, 760);
    var H = Math.min(window.innerHeight * 0.62, 520);
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xdfeeff, 40, 90);
    var camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 300);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    var skyGeo = new THREE.SphereGeometry(140, 16, 16);
    var skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: { top: { value: new THREE.Color(0x7ec0ee) }, bot: { value: new THREE.Color(0xeaf6ff) } },
      vertexShader: 'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: 'varying vec3 p;uniform vec3 top;uniform vec3 bot;void main(){float h=normalize(p).y*0.5+0.5;gl_FragColor=vec4(mix(bot,top,h),1.0);}'
    });
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    scene.add(new THREE.HemisphereLight(0xffffff, 0x88aa77, 0.55));
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    var sun = new THREE.DirectionalLight(0xfff4e0, 0.95);
    sun.position.set(20, 36, 16); sun.castShadow = true;
    sun.shadow.mapSize.width = 1024; sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.left = -30; sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30; sun.shadow.camera.bottom = -30;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 100;
    scene.add(sun);

    var loader = new THREE.TextureLoader();
    var matCache = {};
    var FALLBACK = {
      grass_top: 0x6aa84f, dirt: 0x8b5a2b, planks: 0xb8895a, log: 0x6b4f2a,
      stripped: 0xc8a06a, stone: 0x9a9a9a, cobble: 0x888888, glass: 0xadd8e6,
      door_low: 0x7a5a30, door_up: 0x7a5a30, glow: 0xffd27a, slab: 0xb0b0b0,
      pig: 0xec9894, pig_snout: 0xe2827d, pig_dark: 0xb46e6c,
      cow: 0x574c43, cow_white: 0xe1ded7, cow_dark: 0x37302a
    };
    function mat(name) {
      if (matCache[name]) return matCache[name];
      var glass = (name === 'glass');
      var m = new THREE.MeshStandardMaterial({
        color: FALLBACK[name] || 0xcccccc, roughness: 0.95, metalness: 0.0,
        transparent: glass, opacity: glass ? 0.55 : 1.0,
        emissive: (name === 'glow') ? new THREE.Color(0xffd27a) : new THREE.Color(0x000000),
        emissiveIntensity: (name === 'glow') ? 0.8 : 0
      });
      matCache[name] = m;
      var uri = BUILD3D_DATA[name];
      if (uri) loader.load(uri, function (t) { t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding; m.map = t; m.color.set(0xffffff); m.needsUpdate = true; });
      return m;
    }

    var group = new THREE.Group();
    var geo = new THREE.BoxGeometry(1, 1, 1);
    var inner = MW_GRID * MW_PLOT;
    var span = inner + 2 * MW_MARGIN;
    var midx = MW_MARGIN + Math.floor(inner / 2);
    // Grasgrundst\u00fcck, Wege NUR im Innenbereich (Kreuz)
    for (var gx = 0; gx < span; gx++) {
      for (var gz = 0; gz < span; gz++) {
        var inInner = (gx >= MW_MARGIN && gx < MW_MARGIN + inner && gz >= MW_MARGIN && gz < MW_MARGIN + inner);
        var isPath = inInner && (gx === midx || gz === midx);
        var gcube = new THREE.Mesh(geo, mat(isPath ? 'path' : 'grass_top'));
        gcube.position.set(gx, 0, gz); gcube.receiveShadow = true;
        group.add(gcube);
      }
    }
    // Baum-Helfer
    function addTree(tx, tz) {
      if (tx < 0 || tx >= span || tz < 0 || tz >= span) return;
      for (var y = 1; y <= 3; y++) {
        var trunk = new THREE.Mesh(geo, mat('log'));
        trunk.position.set(tx, y, tz); trunk.castShadow = true; group.add(trunk);
      }
      var crown = [[4, 2], [5, 1], [6, 0]];
      crown.forEach(function (c) {
        var y = c[0], r = c[1];
        for (var dx = -r; dx <= r; dx++) for (var dz = -r; dz <= r; dz++) {
          if (Math.abs(dx) + Math.abs(dz) > r + (y === 4 ? 1 : 0)) continue;
          var leaf = new THREE.Mesh(geo, mat('leaves'));
          leaf.position.set(tx + dx, y, tz + dz); leaf.castShadow = true; group.add(leaf);
        }
      });
    }
    // Baumrand NUR ganz au\u00dfen (in der Margin-Zone), dicht
    for (var i = 1; i < span - 1; i += 3) {
      [[i, 1], [i, span - 2], [1, i], [span - 2, i]].forEach(function (t) { addTree(t[0], t[1]); });
    }
    // gebaute H\u00e4user im Innenbereich (mit Margin-Versatz)
    (state.worldPlacements || []).forEach(function (p) {
      var model = HOUSE_MODELS[p.id] || HOUSE_MODELS.starter;
      var offx = MW_MARGIN + p.sx * MW_PLOT + 2, offz = MW_MARGIN + p.sz * MW_PLOT + 2;
      model.forEach(function (a) {
        if (a[1] < 1) return;
        var cube = new THREE.Mesh(geo, mat(a[3]));
        cube.position.set(a[0] + offx, a[1], a[2] + offz);
        cube.castShadow = true; cube.receiveShadow = true;
        group.add(cube);
      });
    });
    // Freigeschaltete Begleiter als echte 3D-Tiere in die Welt stellen
    function mobTexMat(name) {
      var mm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0, transparent: true, alphaTest: 0.5 });
      var uri = BUILD3D_DATA[name];
      if (uri) loader.load(uri, function (t) {
        t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter;
        if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
        mm.map = t; mm.needsUpdate = true;
      });
      return mm;
    }
    var skinMatCache = {};
    function mobMatFor(kind) {
      var key = 'skin_' + kind;
      if (!skinMatCache[key]) skinMatCache[key] = mobTexMat(key);
      var obj = {}; obj[key] = skinMatCache[key];
      return obj;
    }
    var animGroups = [];
    // Welche Begleiter platziert? state.worldAnimals = [{kind,x,z}]; Grundausstattung = alle freigeschalteten
    if (!state.worldAnimals) {
      state.worldAnimals = [];
      var spots = [
        [MW_MARGIN + 3, MW_MARGIN + 3], [MW_MARGIN + inner - 4, MW_MARGIN + 3],
        [MW_MARGIN + 3, MW_MARGIN + inner - 4], [MW_MARGIN + inner - 4, MW_MARGIN + inner - 4],
        [MW_MARGIN + Math.floor(inner / 2) - 4, MW_MARGIN + 4], [MW_MARGIN + Math.floor(inner / 2) + 3, MW_MARGIN + inner - 5]
      ];
      var si = 0;
      PETS.forEach(function (pet) {
        if (state.pets && state.pets[pet.id] && MOB_MODELS[pet.id]) {
          var s = spots[si % spots.length]; si++;
          state.worldAnimals.push({ kind: pet.id, x: s[0], z: s[1] });
        }
      });
      saveState();
    }
    (state.worldAnimals || []).forEach(function (an) {
      if (!MOB_MODELS[an.kind]) return;
      var ag = buildMob(THREE, MOB_MODELS[an.kind], mobMatFor(an.kind));
      ag.position.set(an.x, 0, an.z);
      ag.userData.baseX = an.x; ag.userData.baseZ = an.z;
      ag.userData.phase = Math.random() * Math.PI * 2;
      group.add(ag);
      animGroups.push(ag);
    });
    // zentrieren
    group.position.set(-span / 2, -1, -span / 2);
    var pivot = new THREE.Group(); pivot.add(group); scene.add(pivot);

    mw3d = {
      THREE: THREE, renderer: renderer, scene: scene, camera: camera, pivot: pivot,
      animGroups: animGroups, animT: 0,
      rotY: 0.6, rotX: 0.62, auto: true, camDist: span * 1.7, camTarget: span * 1.4
    };
    myWorldInput(canvas);
    myWorldLoop();
  }

  function myWorldInput(canvas) {
    var dragging = false, lx = 0, ly = 0;
    function down(x, y) { dragging = true; if (mw3d) mw3d.auto = false; lx = x; ly = y; }
    function move(x, y) {
      if (!dragging || !mw3d) return;
      mw3d.rotY += (x - lx) * 0.01; mw3d.rotX += (y - ly) * 0.01;
      mw3d.rotX = Math.max(0.15, Math.min(1.2, mw3d.rotX)); lx = x; ly = y;
    }
    function up() { dragging = false; }
    canvas.addEventListener('mousedown', function (e) { down(e.clientX, e.clientY); });
    window.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
    window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', function (e) { var t = e.touches[0]; down(t.clientX, t.clientY); }, { passive: true });
    canvas.addEventListener('touchmove', function (e) { var t = e.touches[0]; move(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend', up);
  }

  function myWorldLoop() {
    if (!mw3d) return;
    mw3d.raf = requestAnimationFrame(myWorldLoop);
    if (mw3d.auto) mw3d.rotY += 0.003;
    mw3d.camDist += (mw3d.camTarget - mw3d.camDist) * 0.04;
    mw3d.pivot.rotation.y = mw3d.rotY;
    mw3d.pivot.rotation.x = mw3d.rotX;
    mw3d.camera.position.set(0, mw3d.camDist * 0.5, mw3d.camDist);
    mw3d.camera.lookAt(0, 0, 0);
    // Tiere wackeln/laufen sanft
    if (mw3d.animGroups && mw3d.animGroups.length) {
      mw3d.animT += 0.02;
      mw3d.animGroups.forEach(function (ag) {
        var ph = mw3d.animT + ag.userData.phase;
        ag.position.x = ag.userData.baseX + Math.sin(ph) * 1.5;
        ag.position.y = Math.abs(Math.sin(ph * 4)) * 0.12; // kleines Hoppeln
        ag.rotation.y = Math.cos(ph) > 0 ? 0 : Math.PI; // Richtung wechseln
      });
    }
    mw3d.renderer.render(mw3d.scene, mw3d.camera);
  }

  // ---------- Bau-Modus: Bauplan wählen, dann geführt setzen ----------
  // state.buildProject = { id, placed: { 'c,r': true } } oder null (= Auswahl zeigen)

  function renderBuild() {
    buildPanorama($('build-panorama'));
    renderBuildCoins();
    if (state.buildProject) {
      // laufendes Projekt: geführtes 3D fortsetzen
      house3dId = state.buildProject.id;
      $('build-picker').style.display = 'none';
      $('build-canvas').style.display = 'none';
      $('build-mode-bar').style.display = 'flex';
      build3dStart(true);
    } else {
      build3dStop();
      renderBuildPicker();
    }
  }

  function renderBuildCoins() {
    var row = $('build-coins');
    clear(row);
    ['holz', 'stein', 'gold'].forEach(function (k) {
      var chip = el('div', 'coin-chip');
      chip.appendChild(img(RES[k].src));
      chip.appendChild(el('span', null, String(state.res[k] || 0)));
      row.appendChild(chip);
    });
  }

  // --- Auswahl der Baupläne ---
  var bpPreviewCache = {};
  function renderBuildPicker() {
    $('build-mode-bar').style.display = 'none';
    $('build-canvas').style.display = 'none';
    var hint = $('build-shop-hint');
    hint.textContent = 'Welches m\u00f6chtest du bauen?';
    var picker = $('build-picker');
    picker.style.display = 'flex';
    clear(picker);
    BLUEPRINTS.forEach(function (bp) {
      var card = el('div', 'bp-card');
      var done = state.builtProjects && state.builtProjects[bp.id];
      var prev = el('div', 'bp-preview');
      var pim = el('img', 'bp-preview-img');
      pim.alt = bp.name;
      if (bpPreviewCache[bp.id]) pim.src = bpPreviewCache[bp.id];
      prev.appendChild(pim);
      card.appendChild(prev);
      var label = el('div', 'bp-name', bp.name + (done ? ' \u2713' : ''));
      card.appendChild(label);
      card.appendChild(buildCostRow(bp.cost));
      card.addEventListener('click', function () {
        startBuildProject(bp);
      });
      picker.appendChild(card);
    });
    // 3D-Vorschaubilder erzeugen (einmalig, lazy via three.js)
    generateBuildPreviews();
  }

  function generateBuildPreviews(onDone) {
    var need = BLUEPRINTS.some(function (bp) { return !bpPreviewCache[bp.id]; });
    if (!need) { if (onDone) onDone(); return; }
    loadThree(function () {
      var THREE = window.THREE;
      var SZ = 220;
      var rc = document.createElement('canvas');
      rc.width = SZ; rc.height = SZ;
      var rnd = new THREE.WebGLRenderer({ canvas: rc, antialias: true, alpha: true, preserveDrawingBuffer: true });
      rnd.setSize(SZ, SZ);
      if (THREE.sRGBEncoding) rnd.outputEncoding = THREE.sRGBEncoding;
      rnd.shadowMap.enabled = true; rnd.shadowMap.type = THREE.PCFSoftShadowMap;
      var loader = new THREE.TextureLoader();
      var matCache = {};
      function mat(name) {
        if (matCache[name]) return matCache[name];
        var glass = (name === 'glass');
        var m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0,
          transparent: glass, opacity: glass ? 0.6 : 1,
          emissive: name === 'glow' ? new THREE.Color(0xffd27a) : new THREE.Color(0), emissiveIntensity: name === 'glow' ? 0.7 : 0 });
        matCache[name] = m;
        var uri = BUILD3D_DATA[name];
        if (uri) loader.load(uri, function (t) { t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding; m.map = t; m.color.set(0xffffff); m.needsUpdate = true; });
        return m;
      }
      var geo = new THREE.BoxGeometry(1, 1, 1);

      function renderOne(bp) {
        var scene = new THREE.Scene();
        scene.add(new THREE.HemisphereLight(0xffffff, 0x88aa77, 0.6));
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        var sun = new THREE.DirectionalLight(0xfff4e0, 0.9);
        sun.position.set(10, 18, 8); scene.add(sun);
        var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
        var model = HOUSE_MODELS[bp.id] || HOUSE_MODELS.starter;
        var group = new THREE.Group();
        var cx = 0, cy = 0, cz = 0, n = 0;
        model.forEach(function (a) {
          var cube = new THREE.Mesh(geo, mat(a[3]));
          cube.position.set(a[0], a[1], a[2]);
          group.add(cube); cx += a[0]; cy += a[1]; cz += a[2]; n++;
        });
        cx /= n; cy /= n; cz /= n;
        group.position.set(-cx, -cy, -cz);
        var pivot = new THREE.Group(); pivot.add(group);
        pivot.rotation.y = 0.7; pivot.rotation.x = 0.32;
        scene.add(pivot);
        camera.position.set(0, 1.5, 18); camera.lookAt(0, 0.5, 0);
        // zwei Frames, damit Texturen sicher gezeichnet sind
        rnd.render(scene, camera);
        return rc.toDataURL('image/png');
      }

      // Verzögert rendern, damit Texturen geladen sind
      var tries = 0;
      function pass() {
        tries++;
        BLUEPRINTS.forEach(function (bp) {
          bpPreviewCache[bp.id] = renderOne(bp);
        });
        // In sichtbare Karten einsetzen (falls Picker offen)
        var picker = $('build-picker');
        if (picker && picker.querySelectorAll) {
          var imgs = picker.querySelectorAll('.bp-preview-img');
          var i = 0;
          imgs.forEach(function (im) {
            if (BLUEPRINTS[i]) im.src = bpPreviewCache[BLUEPRINTS[i].id];
            i++;
          });
        }
        if (tries < 3) setTimeout(pass, 180); // Texturen nachladen, neu rendern
        else if (onDone) onDone();
      }
      setTimeout(pass, 120);
    });
  }

  function buildCostRow(cost) {
    var row = el('div', 'bp-cost');
    for (var k in cost) {
      if (!cost[k]) continue;
      var chip = el('div', 'bp-cost-chip');
      chip.appendChild(img(RES[k].src));
      chip.appendChild(el('span', null, String(cost[k])));
      row.appendChild(chip);
    }
    return row;
  }

  function startBuildProject(bp) {
    if (!canAfford(bp.cost)) {
      Sound.deny();
      var k = Object.keys(bp.cost).filter(function (x) { return bp.cost[x]; })[0];
      say('fehlt_rohstoffe', 'Daf\u00fcr brauchst du noch ' + RES[k].name + '. Sammle beim Rechnen!');
      flashMissing(bp.cost);
      return;
    }
    payCost(bp.cost);
    state.buildProject = { id: bp.id, placedSteps: 0 };
    house3dId = bp.id;
    Sound.mine();
    say('bauplan', 'Los geht\u2019s! Dreh das Haus und tippe die leuchtenden Bl\u00f6cke!');
    renderBuildCoins();
    // 2D-Auswahl ausblenden, geführtes 3D starten
    $('build-picker').style.display = 'none';
    $('build-canvas').style.display = 'none';
    $('build-mode-bar').style.display = 'flex';
    build3dStart(true);
  }

  // --- Geführtes Setzen ---
  function buildCellSize() {
    var bp = blueprintById(state.buildProject.id);
    var maxW = Math.min(520, window.innerWidth * 0.92);
    return Math.floor(maxW / bp.grid[0].length);
  }

  function renderBuildProject() {
    $('build-picker').style.display = 'none';
    $('build-mode-bar').style.display = 'flex';
    var bp = blueprintById(state.buildProject.id);
    var cells = buildableCells(bp);
    var placedCount = cells.filter(function (cell) {
      return state.buildProject.placed[cell.c + ',' + cell.r];
    }).length;
    var total = cells.length;
    // nächste zu setzende Zelle (erste unplatzierte in Reihenfolge unten->oben)
    var next = null;
    for (var i = 0; i < cells.length; i++) {
      if (!state.buildProject.placed[cells[i].c + ',' + cells[i].r]) { next = cells[i]; break; }
    }
    var hint = $('build-shop-hint');
    if (next) hint.textContent = 'Tippe das ' + (BUILD_NAMES[next.ch] || 'Feld') + '-Feld! (' + placedCount + ' / ' + total + ')';
    else hint.textContent = 'Fertig! ' + bp.name + ' gebaut!';

    var cv = $('build-canvas');
    cv.style.display = 'grid';
    clear(cv);
    var cs = buildCellSize();
    var cols = bp.grid[0].length;
    cv.style.width = (cs * cols) + 'px';
    cv.style.gridTemplateColumns = 'repeat(' + cols + ', ' + cs + 'px)';
    for (var r = 0; r < bp.grid.length; r++) {
      for (var c = 0; c < cols; c++) {
        var ch = bp.grid[r][c];
        var cell = el('div', 'build-cell');
        cell.style.width = cs + 'px';
        cell.style.height = cs + 'px';
        if (ch === '.' || ch === ' ') {
          cv.appendChild(cell); continue;
        }
        var tex = "url('" + A + 'build/' + BUILD_TEX[ch] + "')";
        if (isGroundChar(ch)) {
          // Untergrund: immer sichtbar, nicht baubar
          cell.style.backgroundImage = tex;
        } else {
          var key = c + ',' + r;
          var isPlaced = state.buildProject.placed[key];
          if (isPlaced) {
            cell.style.backgroundImage = tex;
          } else {
            // Geisterzelle: blass zeigen, was hierhin gehört
            var ghost = img(A + 'build/' + BUILD_TEX[ch], 'bp-ghost');
            cell.appendChild(ghost);
            if (next && next.c === c && next.r === r) cell.classList.add('bp-next');
          }
          (function (cc, rr) {
            cell.addEventListener('click', function () { onBuildPlace(cc, rr); });
          })(c, r);
        }
        cv.appendChild(cell);
      }
    }
  }

  function onBuildPlace(c, r) {
    var bp = blueprintById(state.buildProject.id);
    var cells = buildableCells(bp);
    var next = null;
    for (var i = 0; i < cells.length; i++) {
      if (!state.buildProject.placed[cells[i].c + ',' + cells[i].r]) { next = cells[i]; break; }
    }
    if (!next) return;
    // Muss in Reihenfolge gesetzt werden (von unten nach oben) -> nur die nächste Zelle zählt
    if (next.c !== c || next.r !== r) {
      Sound.deny();
      flashHint('Tippe das blinkende Feld!');
      return;
    }
    state.buildProject.placed[c + ',' + r] = true;
    Sound.mine();
    saveState();
    // fertig?
    var remaining = cells.some(function (cell) {
      return !state.buildProject.placed[cell.c + ',' + cell.r];
    });
    if (!remaining) {
      state.builtProjects = state.builtProjects || {};
      state.builtProjects[bp.id] = true;
      Sound.levelup();
      say('haus_2', 'Super! Du hast das ' + bp.name + ' gebaut!');
      saveState();
      setTimeout(function () {
        renderBuildProject();
      }, 400);
    } else {
      renderBuildProject();
    }
  }

  function flashHint(msg) {
    var hint = $('build-shop-hint');
    hint.textContent = msg;
    hint.classList.remove('hint-flash'); void hint.offsetWidth; hint.classList.add('hint-flash');
  }

  function flashMissing(cost) {
    var chips = $('build-coins').querySelectorAll('.coin-chip');
    chips.forEach(function (chip) { chip.classList.remove('wiggle'); void chip.offsetWidth; chip.classList.add('wiggle'); });
  }

  // Galerie der von Hugo gebauten 3D-Häuser (als Standbilder)
  function renderBuiltGallery() {
    var container = $('home-builds');
    if (!container) return;
    var built = BLUEPRINTS.filter(function (bp) { return state.builtProjects && state.builtProjects[bp.id]; });
    if (built.length === 0) { container.style.display = 'none'; return; }
    container.style.display = 'flex';
    clear(container);
    var title = el('div', 'home-builds-title', 'Meine Bauwerke');
    container.appendChild(title);
    var row = el('div', 'home-builds-row');
    built.forEach(function (bp) {
      var tile = el('div', 'built-tile');
      var im = el('img', 'built-tile-img');
      im.alt = bp.name;
      if (bpPreviewCache[bp.id]) im.src = bpPreviewCache[bp.id];
      tile.appendChild(im);
      tile.appendChild(el('div', 'built-tile-name', bp.name));
      row.appendChild(tile);
    });
    container.appendChild(row);
    // Falls Vorschaubilder noch nicht gerendert: nachholen, dann Bilder setzen
    if (built.some(function (bp) { return !bpPreviewCache[bp.id]; })) {
      generateBuildPreviews(function () {
        var imgs = container.querySelectorAll('.built-tile-img');
        var i = 0;
        built.forEach(function (bp) {
          if (imgs[i] && bpPreviewCache[bp.id]) imgs[i].src = bpPreviewCache[bp.id];
          i++;
        });
      });
    }
  }

  function renderHome(animate) {

    buildPanorama($('panorama-home'));
    renderBuiltGallery();
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
      say('haus', 'Du hast gebaut: ' + stage.name + '!');
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

  // ---------- Panorama 2.0 (Block-Terrain) ----------
  var PAN_BLOCKS = {
    cherry: A + 'blocks/cherry_leaves_opaque.png',
    cherryDark: A + 'blocks/cherry_dark.png',
    oakDark: A + 'blocks/leaves_oak_dark.png',
    snow: A + 'blocks/snow.png',
    tallgrass: A + 'blocks/tallgrass_green.png',
    water: A + 'blocks/water_still_blue.png'
  };

  function panPhase() {
    var h = new Date().getHours();
    if (h >= 6 && h < 11) return 'pan-morning';
    if (h >= 11 && h < 18) return 'pan-day';
    return 'pan-evening';
  }

  // ---------- "Neu!"-Sterne im Menue ----------
  function forgeAttention() {
    var ns = SWORD_TIERS[state.equip.schwert + 1];
    if (ns && canAfford(ns.cost)) return true;
    for (var i = 0; i < ARMOR_SLOTS.length; i++) {
      var sl = ARMOR_SLOTS[i];
      var nt = ARMOR_TIERS[state.equip[sl.id] + 1];
      if (nt) {
        var cost = {}; cost[nt.res] = nt.costs[sl.id];
        if (canAfford(cost)) return true;
      }
    }
    return false;
  }
  function homeAttention() {
    if (state.building) return true;
    var next = HOUSE_STAGES[state.house];
    return !!(next && next.cost && canAfford(next.cost));
  }
  function biomeAttention() {
    return BIOMES.some(function (b) { return state.level >= b.minLevel && !state.seen.biomes[b.id]; });
  }
  function petAttention() {
    return Object.keys(state.pets).some(function (id) { return !state.seen.pets[id]; });
  }
  function trophyAttention() {
    return Object.keys(state.trophies).some(function (id) { return !state.seen.trophies[id]; });
  }
  function applyMenuBadges() {
    var map = {
      'btn-start-home': homeAttention(),
      'btn-start-forge': forgeAttention(),
      'btn-start-pets': petAttention(),
      'btn-start-trophies': trophyAttention(),
      'btn-start-world': biomeAttention()
    };
    Object.keys(map).forEach(function (id) {
      var btn = $(id);
      if (!btn) return;
      var badge = btn.querySelector('.menu-badge');
      if (map[id] && !badge) btn.appendChild(img(A + 'items/nether_star.png', 'menu-badge'));
      else if (!map[id] && badge) btn.removeChild(badge);
    });
  }

  var WALK = A + 'mobs/walk/';
  var WALKERS = {
    pig: {
      w: 40, h: 30,
      legs: { src: WALK + 'pig_leg.png', w: 8, h: 12, near: [3, 21], far: [5, 23], bottom: 0 },
      body: { src: WALK + 'pig_body.png', w: 32, h: 16, left: 0, bottom: 10 },
      head: { src: WALK + 'pig_head.png', w: 16, h: 16, left: 24, bottom: 13 }
    },
    cow: {
      w: 42, h: 48,
      legs: { src: WALK + 'cow_leg.png', w: 8, h: 22, near: [4, 24], far: [6, 26], bottom: 0 },
      body: { src: WALK + 'cow_body.png', w: 36, h: 20, left: 0, bottom: 20 },
      head: { src: WALK + 'cow_head.png', w: 12, h: 16, left: 30, bottom: 30 }
    },
    chicken: {
      w: 26, h: 30,
      body: { src: WALK + 'chicken_body.png', w: 18, h: 14, left: 0, bottom: 2 },
      wing: { src: WALK + 'chicken_wing.png', w: 14, h: 10, left: 2, bottom: 4 },
      head: { src: WALK + 'chicken_head.png', w: 12, h: 17, left: 11, bottom: 12 }
    }
  };

  function walkerPart(spec, cls) {
    var p = img(spec.src, cls);
    p.style.width = spec.w + 'px';
    p.style.height = spec.h + 'px';
    p.style.left = (spec.left || 0) + 'px';
    p.style.bottom = spec.bottom + 'px';
    return p;
  }

  function makeWalker(kind, xPx, groundPx, dist) {
    var def = WALKERS[kind];
    var wk = el('div', 'pan-walker ' + kind);
    wk.style.left = xPx + 'px';
    wk.style.bottom = groundPx + 'px';
    wk.style.setProperty('--walk-dist', Math.max(32, dist) + 'px');
    var dur = Math.max(6, Math.round(Math.max(32, dist) / 13));
    wk.style.animationDuration = dur + 's';
    var flip = el('div', 'walker-flip');
    flip.style.width = def.w + 'px';
    flip.style.height = def.h + 'px';
    flip.style.animationDuration = (dur * 2) + 's';
    if (def.legs) {
      var L = def.legs;
      flip.appendChild(walkerPart({ src: L.src, w: L.w, h: L.h, left: L.far[0], bottom: L.bottom }, 'w-leg far a'));
      flip.appendChild(walkerPart({ src: L.src, w: L.w, h: L.h, left: L.far[1], bottom: L.bottom }, 'w-leg far b'));
    }
    flip.appendChild(walkerPart(def.body, 'w-body'));
    if (def.wing) flip.appendChild(walkerPart(def.wing, 'w-wing'));
    flip.appendChild(walkerPart(def.head, 'w-head'));
    if (def.legs) {
      var L2 = def.legs;
      flip.appendChild(walkerPart({ src: L2.src, w: L2.w, h: L2.h, left: L2.near[0], bottom: L2.bottom }, 'w-leg b'));
      flip.appendChild(walkerPart({ src: L2.src, w: L2.w, h: L2.h, left: L2.near[1], bottom: L2.bottom }, 'w-leg a'));
    }
    wk.appendChild(flip);
    return wk;
  }

  function buildPanorama(container) {
    var stamp = state.house + ':' + (state.activePet || '') + ':' + panPhase();
    if (container.getAttribute('data-stamp') === stamp) return;
    container.setAttribute('data-stamp', stamp);
    clear(container);
    container.classList.remove('pan-morning', 'pan-day', 'pan-evening');
    container.classList.add(panPhase());

    var w = container.clientWidth || Math.min(window.innerWidth, 760);
    var T = 16;
    var cols = Math.ceil(w / T) + 2;

    container.appendChild(el('div', 'pan-sky'));
    container.appendChild(img(ASSETS.blocks.glowstone, 'pan-sun'));
    for (var ci = 0; ci < 3; ci++) {
      var cloud = el('div', 'pan-cloud c' + ci);
      for (var cj = 0; cj < 3; cj++) cloud.appendChild(img(PAN_BLOCKS.snow));
      container.appendChild(cloud);
    }

    // House geometry first (glade depends on it)
    var stage = HOUSE_STAGES[state.house - 1];
    var cell = state.house <= 2 ? 12 : (state.house <= 4 ? 10 : 9);
    var houseW = stage.rows[0].length * cell;
    var hStart = Math.max(1, Math.floor(cols * 0.2));
    var hCols = Math.floor(houseW / T) + 2;

    // Treeline down to the ground, glade behind the house, cherry domes
    var backF = el('div', 'pan-layer back');
    var centers = cols < 40 ? [Math.floor(cols * 0.58)] : [Math.floor(cols * 0.52), Math.floor(cols * 0.84)];
    var th = rnd(5, 6);
    var glA = hStart - 1, glB = hStart + hCols + 1;
    for (var i = 0; i < cols; i++) {
      th += [-1, 0, 0, 0, 1][rnd(0, 4)];
      if (th < 4) th = 4; if (th > 7) th = 7;
      var hCol = (i >= glA && i <= glB) ? Math.min(th, 3) : th;
      var dome = 0;
      for (var k = 0; k < centers.length; k++) {
        if (Math.abs(i - centers[k]) <= 2) dome = Math.max(4, 7 - Math.abs(i - centers[k]));
      }
      var col0 = el('div', 'pan-col');
      col0.style.left = (i * T) + 'px';
      col0.style.height = ((dome || hCol) * T) + 'px';
      col0.style.backgroundImage = "url('" + (dome ? PAN_BLOCKS.cherryDark : PAN_BLOCKS.oakDark) + "')";
      backF.appendChild(col0);
    }
    container.appendChild(backF);

    // Terrain
    var hts = [];
    var h = rnd(1, 2);
    for (var c2i = 0; c2i < cols; c2i++) {
      h += [-1, 0, 0, 1][rnd(0, 3)]; if (h < 1) h = 1; if (h > 3) h = 3;
      hts.push(h);
    }
    var plateau = Math.max(2, hts[hStart]);
    for (var pi = hStart - 1; pi <= hStart + hCols && pi < cols; pi++) hts[pi] = plateau;
    var cliffStart = cols - 4;
    for (var ki = cliffStart; ki < cols; ki++) hts[ki] = 5;
    hts[cliffStart - 1] = 1;
    hts[cliffStart - 2] = 1;
    if (cliffStart - 3 >= 0) hts[cliffStart - 3] = Math.min(hts[cliffStart - 3], 2);

    var terrain = el('div', 'pan-terrain');
    for (var ti = 0; ti < cols; ti++) {
      var tc = el('div', 'pan-tcol');
      tc.style.left = (ti * T) + 'px';
      tc.style.height = (hts[ti] * T) + 'px';
      tc.style.backgroundImage = "url('" + ASSETS.blocks.dirt + "')";
      if (ti === cliffStart - 1 || ti === cliffStart - 2) {
        tc.appendChild(el('div', 'pan-watercap'));
      } else {
        tc.appendChild(img(ASSETS.blocks.grass, 'pan-cap'));
      }
      terrain.appendChild(tc);
    }
    container.appendChild(terrain);

    // Waterfall down the cliff face into the pool dip
    var fall = el('div', 'pan-waterfall');
    fall.style.left = (cliffStart * T - 12) + 'px';
    fall.style.height = (4 * T + 4) + 'px';
    fall.style.bottom = (T - 4) + 'px';
    container.appendChild(fall);

    // Grass tufts (not in the pool)
    for (var gi = 0; gi < 6; gi++) {
      var gx = rnd(0, cols - 1);
      if (gx === cliffStart - 1 || gx === cliffStart - 2) continue;
      var g = img(PAN_BLOCKS.tallgrass, 'pan-grass');
      g.style.left = (gx * T + 1) + 'px';
      g.style.bottom = (hts[gx] * T) + 'px';
      container.appendChild(g);
    }

    // Wandernde Tiere auf flachen Strecken (nicht durchs Haus, nicht im Teich)
    var flats = [];
    var run = 1;
    for (var fi = 1; fi < cols; fi++) {
      var blocked = (fi >= cliffStart - 3) || (fi >= hStart - 1 && fi <= hStart + hCols);
      var prevBlocked = (fi - 1 >= cliffStart - 3) || (fi - 1 >= hStart - 1 && fi - 1 <= hStart + hCols);
      if (!blocked && !prevBlocked && hts[fi] === hts[fi - 1]) run++;
      else {
        if (run >= 6) flats.push({ s: fi - run, len: run, h: hts[fi - 1] });
        run = 1;
      }
    }
    if (run >= 6) flats.push({ s: cols - run, len: run, h: hts[cols - 1] });
    var kinds = shuffle(['pig', 'cow', 'chicken']);
    flats.slice(0, 2).forEach(function (seg, k) {
      container.appendChild(makeWalker(kinds[k % kinds.length], seg.s * T + 4, seg.h * T, (seg.len - 3) * T));
    });

    // The real house on its glade plateau
    var house = el('div', 'pan-house build-grid');
    renderBlueprint(house, stage, cell, false);
    house.style.left = (hStart * T) + 'px';
    house.style.bottom = (plateau * T) + 'px';
    container.appendChild(house);

    if (state.activePet && state.pets[state.activePet]) {
      var pp = img(petById(state.activePet).src, 'pan-pet');
      pp.style.left = (hStart * T - 28) + 'px';
      pp.style.bottom = (plateau * T + 2) + 'px';
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
    applyMenuBadges();
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
    say('hallo', 'Hallo, ich bin ' + state.playerName + '!');
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


  $('btn-start-game').addEventListener('click', startSession);
  $('btn-start-home').addEventListener('click', function () { renderHome(); show('screen-home'); });
  $('btn-start-build').addEventListener('click', function () { renderBuild(); show('screen-build'); });
  $('btn-build-back').addEventListener('click', function () { build3dStop(); renderStart(); show('screen-start'); });
  $('btn-start-myworld').addEventListener('click', function () { show('screen-myworld'); myWorldStart(); });
  $('btn-myworld-back').addEventListener('click', function () { myWorldStop(); renderStart(); show('screen-start'); });

  $('btn-build-choose').addEventListener('click', function () {
    build3dStop();
    state.buildProject = null;
    saveState();
    renderBuild();
  });
  $('btn-start-forge').addEventListener('click', function () { renderForge(); show('screen-forge'); });
  $('btn-start-pets').addEventListener('click', function () { Object.keys(state.pets).forEach(function (id) { state.seen.pets[id] = true; }); saveState(); renderPets(); show('screen-pets'); });
  $('btn-start-trophies').addEventListener('click', function () { Object.keys(state.trophies).forEach(function (id) { state.seen.trophies[id] = true; }); saveState(); renderTrophies(); show('screen-trophies'); });
  $('btn-start-world').addEventListener('click', function () { BIOMES.forEach(function (b) { if (state.level >= b.minLevel) state.seen.biomes[b.id] = true; }); saveState(); renderWorldMap(); show('screen-worldmap'); });
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
    var lim = state.settings.dailyLimit;
    $('tog-limit').querySelector('span').textContent = 'Runden pro Tag: ' + (lim > 0 ? lim : 'Aus');
    $('tog-limit').classList.toggle('selected', lim > 0);
  }

  function diagLine(txt, ok) {
    var d = $('diag-out');
    var line = el('div', 'diag-line ' + (ok === true ? 'ok' : ok === false ? 'bad' : ''));
    line.textContent = txt;
    d.appendChild(line);
  }
  $('btn-diag').addEventListener('click', function () {
    var out = $('diag-out');
    clear(out);
    diagLine('App-Version: ' + APP_V, true);
    // 1) WebAudio-Kontext
    var c = null;
    try { c = Sound.ctx(); } catch (e) {}
    diagLine('WebAudio: ' + (c ? c.state : 'FEHLT'), !!c);
    try { if (c && c.state === 'suspended') c.resume(); } catch (e) {}
    // 2) Beep ueber die Sound-Engine
    try { Sound.levelup(); diagLine('Beep gespielt - hoerst du ihn?', true); }
    catch (e) { diagLine('Beep-Fehler: ' + e.name, false); }
    // 3) Datei laden
    if (typeof fetch === 'undefined') { diagLine('fetch fehlt', false); return; }
    fetch(AUDIO_BASE + 'intro.mp3' + AUDIO_VER, { cache: 'reload' }).then(function (r) {
      diagLine('Datei: HTTP ' + r.status, r.ok);
      if (!r.ok) return null;
      return r.arrayBuffer();
    }).then(function (buf) {
      if (!buf) return;
      diagLine('Geladen: ' + Math.round(buf.byteLength / 1024) + ' KB', true);
      if (!c) return;
      c.decodeAudioData(buf.slice(0), function (dec) {
        diagLine('Dekodiert: ' + Math.round(dec.duration) + 's', true);
        try {
          var g = c.createGain(); g.gain.value = 0.5; g.connect(c.destination);
          var s = c.createBufferSource(); s.buffer = dec; s.connect(g);
          s.start(0);
          setTimeout(function () { try { s.stop(); } catch (e) {} }, 4000);
          diagLine('WebAudio spielt 4s - hoerst du Musik?', true);
        } catch (e) { diagLine('WebAudio-Start-Fehler: ' + e.name, false); }
      }, function (err) {
        diagLine('Dekodier-Fehler: ' + (err && err.message ? err.message : 'unbekannt'), false);
        var h = new Audio(AUDIO_BASE + 'intro.mp3' + AUDIO_VER);
        h.volume = 0.6;
        var p = h.play();
        if (p && p.then) p.then(function () { diagLine('HTML-Audio spielt - hoerst du Musik?', true); setTimeout(function(){ h.pause(); }, 4000); })
                          .catch(function (er) { diagLine('HTML-Audio-Fehler: ' + er.name, false); });
      });
    }).catch(function (e) { diagLine('Lade-Fehler: ' + e.name, false); });
  });

  $('tog-limit').addEventListener('click', function () {
    var seq = [0, 2, 3, 4, 5];
    var i = seq.indexOf(state.settings.dailyLimit);
    state.settings.dailyLimit = seq[(i + 1) % seq.length];
    saveState();
    renderToggles();
  });

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

  $('btn-test-res').addEventListener('click', function () {
    RES_KEYS.forEach(function (k) { state.res[k] = 50; });
    saveState();
    Sound.mine();
    var btn = $('btn-test-res');
    setBtnLabel('btn-test-res', 'Erledigt! Alle auf 50');
    setTimeout(function () { setBtnLabel('btn-test-res', 'Test: +50 Rohstoffe'); }, 1500);
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
