/* ============================================================
   Hugos Block-Abenteuer — App-Logik (Stufe 1)
   Vanilla JS, keine Abhängigkeiten, localStorage.
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
      planks: A + 'blocks/planks_oak.png',
      diamondOre: A + 'blocks/diamond_ore.png'
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
    mobs: { steve: A + 'mobs/steve_face.png' },
    ui: {
      heart: A + 'ui/heart.png',
      heartHalf: A + 'ui/heart_half.png',
      heartBg: A + 'ui/heart_background.png',
      xpEmpty: A + 'ui/xp_bar_empty.png',
      xpFull: A + 'ui/xp_bar_full.png'
    }
  };

  // German names: [singular, plural]
  var ITEM_NAMES = {
    diamond: ['Diamant', 'Diamanten'],
    emerald: ['Smaragd', 'Smaragde'],
    gold_ingot: ['Goldbarren', 'Goldbarren'],
    iron_ingot: ['Eisenbarren', 'Eisenbarren'],
    apple: ['Apfel', 'Äpfel'],
    apple_golden: ['Goldener Apfel', 'Goldene Äpfel']
  };

  var COUNT_ITEMS = ['diamond', 'emerald', 'apple', 'gold_ingot'];
  var REWARD_POOL = [
    { id: 'apple', w: 30 }, { id: 'iron_ingot', w: 25 },
    { id: 'gold_ingot', w: 20 }, { id: 'emerald', w: 15 },
    { id: 'diamond', w: 10 }
  ];

  var SESSION_LENGTH = 8;
  var XP_PER_LEVEL = 100;

  // ---------- State (localStorage) ----------
  var STORAGE_KEY = 'hugos-block-abenteuer-v1';

  function defaultState() {
    return {
      xp: 0,
      inventory: {},
      stats: { answered: 0, correct: 0, byType: {} },
      mistakes: []
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var s = JSON.parse(raw);
      return Object.assign(defaultState(), s);
    } catch (e) { return defaultState(); }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = loadState();

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
    var el = document.createElement('img');
    el.src = src;
    el.alt = '';
    if (cls) el.className = cls;
    return el;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function pickReward() {
    var total = 0, i;
    for (i = 0; i < REWARD_POOL.length; i++) total += REWARD_POOL[i].w;
    var r = Math.random() * total;
    for (i = 0; i < REWARD_POOL.length; i++) {
      r -= REWARD_POOL[i].w;
      if (r <= 0) return REWARD_POOL[i].id;
    }
    return 'apple';
  }

  // Distinct numeric options around the correct answer
  function numericOptions(correct, min, max) {
    var opts = [correct];
    var candidates = shuffle([correct - 2, correct - 1, correct + 1, correct + 2, correct + 3]);
    for (var i = 0; i < candidates.length && opts.length < 3; i++) {
      var c = candidates[i];
      if (c >= min && c <= max && opts.indexOf(c) === -1) opts.push(c);
    }
    // Fallback (edges)
    var f = min;
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
      correct: n,
      options: numericOptions(n, 1, 10),
      kind: 'number'
    };
  }

  function genAdd() {
    var a = rnd(1, 9);
    var b = rnd(1, Math.min(9, 10 - a));
    var item = pick(COUNT_ITEMS);
    return {
      type: 'add', a: a, b: b, item: item,
      question: 'Rechne aus:',
      speak: 'Was ist ' + a + ' plus ' + b + '?',
      equation: a + ' + ' + b + ' = ?',
      correct: a + b,
      options: numericOptions(a + b, 0, 12),
      kind: 'number'
    };
  }

  function genSub() {
    var a = rnd(3, 10);
    var b = rnd(1, a - 1);
    var item = pick(COUNT_ITEMS);
    return {
      type: 'sub', a: a, b: b, item: item,
      question: 'Rechne aus:',
      speak: 'Was ist ' + a + ' minus ' + b + '?',
      equation: a + ' \u2212 ' + b + ' = ?',
      correct: a - b,
      options: numericOptions(a - b, 0, 10),
      kind: 'number'
    };
  }

  function genCompare() {
    var item = pick(COUNT_ITEMS);
    var left = rnd(1, 9);
    var right;
    if (Math.random() < 0.2) {
      right = left;
    } else {
      right = rnd(1, 9);
      if (right === left) right = (left < 9) ? left + 1 : left - 1;
    }
    var correct = left > right ? 'links' : (right > left ? 'rechts' : 'gleich');
    return {
      type: 'compare', item: item, left: left, right: right,
      question: 'Wo sind mehr ' + ITEM_NAMES[item][1] + '?',
      speak: 'Wo sind mehr ' + ITEM_NAMES[item][1] + '? Links, rechts, oder sind es gleich viele?',
      correct: correct,
      options: ['links', 'rechts', 'gleich'],
      labels: { links: 'Links', rechts: 'Rechts', gleich: 'Gleich viele' },
      kind: 'word'
    };
  }

  function genSession() {
    var plan = shuffle(['count', 'count', 'add', 'add', 'add', 'sub', 'sub', 'compare']);
    return plan.map(function (t) {
      if (t === 'count') return genCount();
      if (t === 'add') return genAdd();
      if (t === 'sub') return genSub();
      return genCompare();
    });
  }

  // Expose for automated testing (node / console)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { genCount: genCount, genAdd: genAdd, genSub: genSub, genCompare: genCompare, genSession: genSession, numericOptions: numericOptions };
    return;
  }

  // ---------- Screen management ----------
  var screens = ['screen-start', 'screen-practice', 'screen-inventory', 'screen-parent'];
  function show(id) {
    screens.forEach(function (s) { $(s).classList.toggle('active', s === id); });
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
      tasks: genSession(),
      index: 0,
      halfHearts: 10,
      earned: {},
      xpGained: 0,
      firstTry: true,
      locked: false
    };
    show('screen-practice');
    renderHUD();
    renderTask();
  }

  function currentTask() { return session.tasks[session.index]; }

  // ---------- Rendering: HUD ----------
  function renderHUD() {
    // Hearts
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
    // Progress
    $('hud-progress').textContent = 'Aufgabe ' + (session.index + 1) + ' / ' + session.tasks.length;
    // XP
    renderXpBar();
  }

  function renderXpBar() {
    $('hud-level-label').textContent = 'Level ' + levelOf(state.xp);
    var pct = xpInLevel(state.xp) / XP_PER_LEVEL;
    $('xp-fill-clip').style.width = Math.round(240 * pct) + 'px';
  }

  // ---------- Rendering: task ----------
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

    $('task-question').textContent = t.question;
    var vis = $('task-visual');
    var eq = $('task-equation');
    clear(vis);
    eq.textContent = '';

    if (t.type === 'count') {
      renderItemRow(vis, t.item, t.n);
    } else if (t.type === 'add') {
      var gA = el('div', 'group'); renderItemRow(gA, t.item, t.a);
      var gB = el('div', 'group'); renderItemRow(gB, t.item, t.b);
      vis.appendChild(gA);
      vis.appendChild(el('div', 'op', '+'));
      vis.appendChild(gB);
      eq.textContent = t.equation;
    } else if (t.type === 'sub') {
      var g = el('div', 'group');
      renderItemRow(g, t.item, t.a, t.a - t.b);
      vis.appendChild(g);
      eq.textContent = t.equation;
    } else if (t.type === 'compare') {
      var sides = [['Links', t.left], ['Rechts', t.right]];
      sides.forEach(function (s) {
        var side = el('div', 'compare-side');
        side.appendChild(el('div', 'side-name', s[0]));
        var gg = el('div', 'group');
        renderItemRow(gg, t.item, s[1]);
        side.appendChild(gg);
        vis.appendChild(side);
      });
    }

    // Answers
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
      var xp = session.firstTry ? 10 : 5;
      state.xp += xp;
      session.xpGained += xp;

      var rewardId = pickReward();
      state.inventory[rewardId] = (state.inventory[rewardId] || 0) + 1;
      session.earned[rewardId] = (session.earned[rewardId] || 0) + 1;
      saveState();

      setTimeout(function () { showReward(rewardId, xp); }, 450);
    } else {
      btn.classList.add('wrong');
      btn.disabled = true;
      session.firstTry = false;
      if (session.halfHearts > 0) session.halfHearts--;
      state.mistakes.push({ type: t.type, task: taskSignature(t), ts: Date.now() });
      if (state.mistakes.length > 200) state.mistakes = state.mistakes.slice(-200);
      saveState();
      renderHUD();
      setTimeout(function () { showExplanation(t); }, 600);
    }
  }

  function taskSignature(t) {
    if (t.type === 'count') return 'count:' + t.n;
    if (t.type === 'add') return t.a + '+' + t.b;
    if (t.type === 'sub') return t.a + '-' + t.b;
    return 'compare:' + t.left + ':' + t.right;
  }

  // ---------- Reward overlay ----------
  function showReward(rewardId, xp) {
    var item = $('reward-item');
    item.classList.remove('pop');
    item.src = ASSETS.items[rewardId];
    void item.offsetWidth; // restart animation
    item.classList.add('pop');
    $('reward-text').textContent = '+1 ' + ITEM_NAMES[rewardId][0] + '!';
    $('reward-xp').textContent = '+' + xp + ' XP';
    renderXpBar();
    showOverlay('overlay-reward', true);
  }

  $('btn-reward-next').addEventListener('click', function () {
    showOverlay('overlay-reward', false);
    nextTask();
  });

  function nextTask() {
    session.index++;
    if (session.index >= session.tasks.length) {
      showSummary();
    } else {
      renderTask();
    }
  }

  // ---------- Explanation overlay ----------
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
      txt.textContent = 'Zähle langsam mit: Es sind ' + t.n + ' ' + ITEM_NAMES[t.item][t.n === 1 ? 0 : 1] + '.';
    } else if (t.type === 'add') {
      var gA = el('div', 'group'); renderItemRow(gA, t.item, t.a);
      gA.appendChild(el('div', 'num-label', String(t.a)));
      var gB = el('div', 'group'); renderItemRow(gB, t.item, t.b);
      gB.appendChild(el('div', 'num-label', String(t.b)));
      vis.appendChild(gA);
      vis.appendChild(el('div', 'op', '+'));
      vis.appendChild(gB);
      txt.textContent = t.a + ' und noch ' + t.b + ' dazu — zusammen sind das ' + (t.a + t.b) + '.';
    } else if (t.type === 'sub') {
      var g = el('div', 'group');
      renderItemRow(g, t.item, t.a, t.a - t.b);
      g.appendChild(el('div', 'num-label', t.a + ' \u2212 ' + t.b + ' = ' + (t.a - t.b)));
      vis.appendChild(g);
      txt.textContent = 'Von ' + t.a + ' nimmst du ' + t.b + ' weg (die blassen) — es bleiben ' + (t.a - t.b) + '.';
    } else if (t.type === 'compare') {
      var sides = [['Links', t.left], ['Rechts', t.right]];
      sides.forEach(function (s) {
        var side = el('div', 'compare-side');
        side.appendChild(el('div', 'side-name', s[0]));
        var gg = el('div', 'group');
        renderItemRow(gg, t.item, s[1]);
        side.appendChild(gg);
        side.appendChild(el('div', 'num-label', String(s[1])));
        vis.appendChild(side);
      });
      var msg;
      if (t.correct === 'gleich') msg = 'Beide Seiten haben ' + t.left + ' — gleich viele!';
      else msg = (t.correct === 'links' ? 'Links' : 'Rechts') + ' sind ' + Math.max(t.left, t.right) + ', das ist mehr als ' + Math.min(t.left, t.right) + '.';
      txt.textContent = msg;
    }

    showOverlay('overlay-explain', true);
  }

  $('btn-explain-retry').addEventListener('click', function () {
    showOverlay('overlay-explain', false);
    // Re-enable remaining answers, same task
    var btns = $('answers').querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      if (!btns[i].classList.contains('wrong')) btns[i].disabled = false;
    }
  });

  // ---------- Summary ----------
  function showSummary() {
    var items = $('summary-items');
    clear(items);
    var any = false;
    Object.keys(session.earned).forEach(function (id) {
      any = true;
      var s = el('div', 'summary-item');
      s.appendChild(img(ASSETS.items[id]));
      s.appendChild(el('div', null, '\u00d7 ' + session.earned[id]));
      items.appendChild(s);
    });
    if (!any) items.appendChild(el('div', null, 'Diesmal keine Items — gleich nochmal!'));

    var total = session.tasks.length;
    $('summary-stats').textContent = '+' + session.xpGained + ' XP  \u00b7  Level ' + levelOf(state.xp);
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

  // ---------- Vorlesen ----------
  $('btn-speak').addEventListener('click', function () {
    speak(currentTask().speak);
  });

  // ---------- Start screen ----------
  function renderStart() {
    $('start-level').textContent = 'Level ' + levelOf(state.xp) + '  \u00b7  ' + state.xp + ' XP';
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
  $('btn-start-inventory').addEventListener('click', function () { renderInventory(); show('screen-inventory'); });
  $('btn-start-parent').addEventListener('click', function () { resetGate(); show('screen-parent'); });

  // ---------- Inventory ----------
  var INV_ORDER = ['diamond', 'emerald', 'gold_ingot', 'iron_ingot', 'apple', 'apple_golden'];

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

  var TYPE_NAMES = { count: 'Zählen', add: 'Plus', sub: 'Minus', compare: 'Vergleichen' };

  function openParent() {
    var s = state.stats;
    var acc = s.answered > 0 ? Math.round((s.correct / s.answered) * 100) : 0;
    var lines = [
      'Beantwortete Aufgaben: ' + s.answered,
      'Richtig: ' + s.correct + ' (' + acc + ' %)',
      'XP gesamt: ' + state.xp + '  \u00b7  Level ' + levelOf(state.xp)
    ];
    Object.keys(s.byType).forEach(function (t) {
      var bt = s.byType[t];
      var a = bt.answered > 0 ? Math.round((bt.correct / bt.answered) * 100) : 0;
      lines.push(TYPE_NAMES[t] + ': ' + bt.correct + ' / ' + bt.answered + ' (' + a + ' %)');
    });
    var list = $('parent-stats');
    clear(list);
    lines.forEach(function (l) { list.appendChild(el('div', null, l)); });

    $('parent-gate-panel').style.display = 'none';
    $('parent-stats-panel').style.display = 'flex';
  }

  $('btn-parent-reset').addEventListener('click', function () {
    if (window.confirm('Wirklich den gesamten Fortschritt löschen?')) {
      state = defaultState();
      saveState();
      openParent();
    }
  });

  $('btn-parent-back').addEventListener('click', function () { renderStart(); show('screen-start'); });

  // ---------- Init ----------
  renderStart();
  show('screen-start');
})();
