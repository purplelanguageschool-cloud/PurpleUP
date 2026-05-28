// ===== STATE =====
let state = {
  user: null, // { name, role: 'student'|'teacher' }
  lang: 'en',
  currentLesson: null,
  currentQ: 0,
  hearts: 3,
  correct: 0,
  answered: false,
  selectedOpt: null,
  completedLessons: JSON.parse(localStorage.getItem('pu_completed') || '[]'),
  xp: parseInt(localStorage.getItem('pu_xp') || '480'),
  streak: parseInt(localStorage.getItem('pu_streak') || '5'),
  customLessons: JSON.parse(localStorage.getItem('pu_custom') || 'null'),
};

function getLessons() {
  return state.customLessons || DEFAULT_LESSONS;
}

// ===== SCREEN ROUTER =====
function goScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  const el = document.getElementById('s-' + id);
  if (el) el.classList.add('on');

  if (id === 'home') renderHome();
  if (id === 'week') renderWeek();
  if (id === 'progress') renderProgress();
  if (id === 'profile') renderProfile();
  if (id === 'teacher') renderAdminList();
}

// ===== AUTH =====
function doLogin() {
  const email = document.getElementById('inp-email').value.trim();
  const senha = document.getElementById('inp-senha').value.trim();
  if (!email || !senha) { alert('Preencha e-mail e senha.'); return; }
  const name = email.split('@')[0].replace(/\./g,' ').replace(/\b\w/g, c => c.toUpperCase());
  state.user = { name, role: 'student' };
  goScreen('home');
}

function demoStudent() {
  state.user = { name: 'Ana Silva', role: 'student' };
  goScreen('home');
}

function demoTeacher() {
  state.user = { name: 'Prof. Carlos', role: 'teacher' };
  goScreen('teacher');
}

function doLogout() {
  state.user = null;
  goScreen('login');
}

// ===== LANG SWITCH =====
function switchLang(lang, context) {
  state.lang = lang;
  const container = document.getElementById('lang-tabs-' + context);
  if (!container) return;
  container.querySelectorAll('.ltab').forEach((t, i) => {
    t.classList.toggle('on', (i === 0 && lang === 'en') || (i === 1 && lang === 'es'));
  });
  if (context === 'home') renderTodayLessons();
  if (context === 'week') renderWeekDays();
}

// ===== HOME =====
function renderHome() {
  document.getElementById('hero-greet').textContent = 'Olá, ' + (state.user?.name?.split(' ')[0] || 'você') + '!';
  document.getElementById('hero-xp').textContent = state.xp;
  document.getElementById('streak-val').textContent = state.streak;
  renderWeekStrip();
  renderTodayLessons();
}

function renderWeekStrip() {
  const strip = document.getElementById('week-strip');
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7; // 0=seg
  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    const dateStr = d.toISOString().split('T')[0];
    const done = state.completedLessons.some(c => c.date === dateStr);
    const isToday = i === todayDow;
    const isPast = i < todayDow;
    let cls = 'day-chip';
    if (isToday) cls += ' active today';
    else if (done || isPast) cls += ' done';
    html += `<div class="${cls}" onclick="goScreen('week')">
      <span class="day-abbr">${DAY_SHORT[i]}</span>
      <span class="day-num">${d.getDate()}</span>
      <div class="day-dot"></div>
    </div>`;
  }
  strip.innerHTML = html;
  const done = state.completedLessons.filter(c => {
    const d = new Date(c.date);
    const mon = new Date(today); mon.setDate(today.getDate() - todayDow);
    return d >= mon && d <= today;
  }).length;
  const uniqueDays = [...new Set(state.completedLessons.map(c => c.date))].length;
  document.getElementById('week-prog-label').textContent = Math.min(uniqueDays, 7) + '/7 dias';
  document.getElementById('week-prog-fill').style.width = Math.min(Math.round(uniqueDays / 7 * 100), 100) + '%';
}

function renderTodayLessons() {
  const container = document.getElementById('today-lessons');
  const today = new Date();
  const dow = (today.getDay() + 6) % 7;
  const lessons = getLessons()[state.lang]?.[dow] || [];
  document.getElementById('today-label').textContent =
    'Atividades de hoje — ' + DAY_SHORT[dow] + ', ' + today.getDate() + '/' + (today.getMonth()+1);

  if (!lessons.length) {
    container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--t3);font-size:14px">Nenhuma atividade para hoje.</div>';
    return;
  }
  container.innerHTML = lessons.map(l => lessonCardHTML(l, true)).join('');
}

function lessonCardHTML(lesson, clickable) {
  const s = TYPE_STYLES[lesson.type] || TYPE_STYLES.grammar;
  const done = state.completedLessons.some(c => c.id === lesson.id);
  const badge = done
    ? '<span class="lc-badge badge-done">feito</span>'
    : '<span class="lc-badge badge-new">novo</span>';
  const onclick = clickable ? `onclick="startLesson('${lesson.id}')"` : '';
  return `<div class="lesson-card" ${onclick}>
    <div class="lc-icon" style="background:${s.bg}">
      <i class="ti ${lesson.icon || s.icon}" style="color:${s.color};font-size:19px"></i>
    </div>
    <div class="lc-body">
      <div class="lc-title">${lesson.title}</div>
      <div class="lc-meta">${lesson.meta}</div>
    </div>
    <div class="lc-right">${badge}</div>
  </div>`;
}

// ===== WEEK SCREEN =====
function renderWeek() {
  renderWeekDays();
}

function renderWeekDays() {
  const container = document.getElementById('week-days-list');
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7;
  const lessons = getLessons()[state.lang] || {};
  let html = '';

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    const dayLessons = lessons[i] || [];
    const isToday = i === todayDow;
    const isFuture = i > todayDow;

    let headCls = 'dg-day' + (isToday ? ' today-label' : '');
    let statusText = isToday ? 'hoje' : isFuture ? 'em breve' : DAY_SHORT[i];
    const dateLabel = d.getDate() + '/' + (d.getMonth()+1);

    html += `<div class="day-group">
      <div class="day-group-head">
        <div class="${headCls}">${DAY_NAMES[i]}, ${dateLabel}</div>
        <div class="dg-status">${dayLessons.length} ${dayLessons.length === 1 ? 'lição' : 'lições'}</div>
      </div>`;

    if (!dayLessons.length) {
      html += `<div class="lesson-card locked">
        <div class="lc-icon" style="background:var(--bg3)"><i class="ti ti-moon" style="color:var(--t3)"></i></div>
        <div class="lc-body"><div class="lc-title">Sem atividade</div><div class="lc-meta">Dia de descanso</div></div>
      </div>`;
    } else {
      dayLessons.forEach(l => {
        if (isFuture) {
          const s = TYPE_STYLES[l.type] || TYPE_STYLES.grammar;
          html += `<div class="lesson-card locked">
            <div class="lc-icon" style="background:${s.bg}"><i class="ti ${l.icon || s.icon}" style="color:${s.color}"></i></div>
            <div class="lc-body"><div class="lc-title">${l.title}</div><div class="lc-meta">${l.meta}</div></div>
            <div class="lc-right"><span class="lc-badge badge-lock">em breve</span></div>
          </div>`;
        } else {
          html += lessonCardHTML(l, true);
        }
      });
    }
    html += '</div>';
  }
  container.innerHTML = html;
  document.getElementById('week-screen-title').textContent =
    'Semana — ' + (state.lang === 'en' ? 'Inglês' : 'Espanhol');
}

// ===== LESSON / EXERCISE =====
function startLesson(lessonId) {
  const allLessons = getLessons();
  let found = null;
  for (const lang of Object.keys(allLessons)) {
    for (const day of Object.keys(allLessons[lang])) {
      const l = allLessons[lang][day].find(x => x.id === lessonId);
      if (l) { found = l; break; }
    }
    if (found) break;
  }
  if (!found) return;

  state.currentLesson = found;
  state.currentQ = 0;
  state.hearts = 3;
  state.correct = 0;
  state.answered = false;
  state.selectedOpt = null;

  document.getElementById('lesson-title').textContent = found.title;
  goScreen('lesson');
  renderQuestion();
}

function renderQuestion() {
  const lesson = state.currentLesson;
  state.answered = false;
  state.selectedOpt = null;

  const pct = Math.round((state.currentQ / lesson.questions.length) * 100);
  document.getElementById('ex-prog-fill').style.width = pct + '%';
  updateHearts();

  const q = lesson.questions[state.currentQ];
  const letters = ['A','B','C','D'];

  // Shuffle options keeping track of correct answer
  const opts = q.opts.map((o, i) => ({ text: o, correct: i === q.ans }));
  // Shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }

  const optsHTML = opts.map((o, i) =>
    `<button class="ex-opt" id="opt${i}" onclick="pickOpt(${i}, ${o.correct})">
      <span class="opt-letter">${letters[i]}</span>${o.text}
    </button>`
  ).join('');

  document.getElementById('ex-wrap').innerHTML = `
    <div class="ex-badge">${getLabelForType(lesson.type)}</div>
    <div class="ex-q">${q.q}</div>
    <div class="ex-opts">${optsHTML}</div>
    <div class="ex-fb" id="fb"></div>
    <button class="ex-chk off" id="chk" onclick="checkOpt()">Verificar</button>
  `;
}

function getLabelForType(type) {
  const map = { grammar:'Gramática', vocabulary:'Vocabulário', listening:'Listening', writing:'Redação', reading:'Leitura' };
  return map[type] || 'Exercício';
}

function updateHearts() {
  const h = state.hearts;
  document.getElementById('lives-display').innerHTML =
    '❤️'.repeat(h) + (h < 3 ? '🖤'.repeat(3 - h) : '');
}

let _correctFlag = false;
function pickOpt(i, isCorrect) {
  if (state.answered) return;
  document.querySelectorAll('.ex-opt').forEach(b => b.classList.remove('sel'));
  document.getElementById('opt' + i).classList.add('sel');
  state.selectedOpt = i;
  _correctFlag = isCorrect;
  document.getElementById('chk').className = 'ex-chk on';
}

function checkOpt() {
  if (state.answered || state.selectedOpt === null) return;
  state.answered = true;
  const ok = _correctFlag;

  document.querySelectorAll('.ex-opt').forEach(b => {
    const wasSelected = b.id === 'opt' + state.selectedOpt;
    if (b.onclick?.toString().includes('true')) b.classList.add('ok');
    if (wasSelected && !ok) b.classList.add('bad');
    b.classList.add('off');
  });

  const fb = document.getElementById('fb');
  fb.className = 'ex-fb on ' + (ok ? 'ok' : 'bad');
  if (ok) {
    state.correct++;
    fb.innerHTML = '<div class="fb-t ok">Correto!</div>';
  } else {
    state.hearts = Math.max(0, state.hearts - 1);
    updateHearts();
    const correctBtn = [...document.querySelectorAll('.ex-opt')].find(b => b.classList.contains('ok'));
    const correctText = correctBtn ? correctBtn.textContent.slice(1).trim() : '';
    fb.innerHTML = `<div class="fb-t bad">Incorreto</div><div class="fb-s">Resposta correta: <strong>${correctText}</strong></div>`;
  }

  const chk = document.getElementById('chk');
  chk.className = 'ex-chk on';
  chk.textContent = 'Continuar';
  chk.onclick = nextQuestion;
}

function nextQuestion() {
  state.currentQ++;
  if (state.currentQ >= state.currentLesson.questions.length) {
    finishLesson();
  } else {
    renderQuestion();
  }
}

function finishLesson() {
  const lesson = state.currentLesson;
  const acc = Math.round((state.correct / lesson.questions.length) * 100);
  const xpGained = Math.round(10 + acc / 10);

  // Save completion
  const today = new Date().toISOString().split('T')[0];
  if (!state.completedLessons.some(c => c.id === lesson.id)) {
    state.completedLessons.push({ id: lesson.id, date: today });
    localStorage.setItem('pu_completed', JSON.stringify(state.completedLessons));
  }

  state.xp += xpGained;
  localStorage.setItem('pu_xp', state.xp);

  // Result screen
  const todayDone = state.completedLessons.filter(c => c.date === today).length;
  const totalToday = Object.values(getLessons()[state.lang] || {}).flat().length;

  document.getElementById('r-xp').textContent = '+' + xpGained + ' XP';
  document.getElementById('r-acc').textContent = acc + '%';
  document.getElementById('r-streak').textContent = '🔥' + state.streak;
  document.getElementById('r-lessons').textContent = todayDone + '/' + Math.max(totalToday, 1);

  if (acc >= 80) {
    document.getElementById('res-icon').innerHTML = '<i class="ti ti-trophy"></i>';
    document.getElementById('res-title').textContent = 'Excelente, ' + (state.user?.name?.split(' ')[0] || '') + '!';
    document.getElementById('res-sub').textContent = 'Você arrasou! Continue assim.';
  } else if (acc >= 50) {
    document.getElementById('res-icon').innerHTML = '<i class="ti ti-star"></i>';
    document.getElementById('res-title').textContent = 'Lição completa!';
    document.getElementById('res-sub').textContent = 'Bom trabalho! Pratique mais para melhorar.';
  } else {
    document.getElementById('res-icon').innerHTML = '<i class="ti ti-refresh"></i>';
    document.getElementById('res-title').textContent = 'Continue tentando!';
    document.getElementById('res-sub').textContent = 'Revise o conteúdo e tente novamente.';
  }

  goScreen('result');
}

// ===== PROGRESS =====
function renderProgress() {
  document.getElementById('kpi-streak').textContent = state.streak;
  document.getElementById('kpi-xp').textContent = state.xp;
  const total = state.completedLessons.length;
  document.getElementById('kpi-lessons').textContent = total;

  // Bar chart
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7;
  const bars = DAY_SHORT.map((d, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - todayDow + i);
    const ds = date.toISOString().split('T')[0];
    const count = state.completedLessons.filter(c => c.date === ds).length;
    return { d, count, isToday: i === todayDow };
  });
  const max = Math.max(...bars.map(b => b.count), 1);
  document.getElementById('bar-chart').innerHTML = bars.map(b => {
    const h = Math.max(Math.round((b.count / max) * 70), b.count > 0 ? 8 : 4);
    const bg = b.isToday ? 'var(--p)' : b.count > 0 ? 'var(--ok)' : 'var(--bg3)';
    const textColor = b.isToday ? 'var(--p-text)' : 'var(--t3)';
    return `<div class="bar-col">
      <div class="bar" style="height:${h}px;background:${bg}"></div>
      <span style="color:${textColor};font-weight:${b.isToday?'600':'400'}">${b.d}</span>
    </div>`;
  }).join('');
}

// ===== PROFILE =====
function renderProfile() {
  const name = state.user?.name || 'Aluno';
  document.getElementById('prof-name').textContent = name;
  document.getElementById('ps-xp').textContent = state.xp;
  document.getElementById('ps-streak').textContent = state.streak;
  document.getElementById('ps-lessons').textContent = state.completedLessons.length;
}

// ===== TEACHER / ADMIN =====
function saveLesson() {
  const lang = document.getElementById('adm-lang').value;
  const day = parseInt(document.getElementById('adm-day').value);
  const title = document.getElementById('adm-title').value.trim();
  const type = document.getElementById('adm-type').value;
  const q = document.getElementById('adm-q').value.trim();
  const a = document.getElementById('adm-a').value.trim();
  const b = document.getElementById('adm-b').value.trim();
  const c = document.getElementById('adm-c').value.trim();
  const d = document.getElementById('adm-d').value.trim();

  if (!title || !q || !a || !b) { alert('Preencha pelo menos o título, a pergunta e as opções A e B.'); return; }

  const lessons = state.customLessons ? JSON.parse(JSON.stringify(state.customLessons)) : JSON.parse(JSON.stringify(DEFAULT_LESSONS));
  if (!lessons[lang][day]) lessons[lang][day] = [];

  const id = lang + '-' + day + '-' + Date.now();
  const s = TYPE_STYLES[type];
  const opts = [a, b, c, d].filter(Boolean);

  lessons[lang][day].push({
    id, title, type,
    meta: type.charAt(0).toUpperCase() + type.slice(1) + ' · 1 exercício',
    icon: s.icon,
    questions: [{ q, opts, ans: 0 }]
  });

  state.customLessons = lessons;
  localStorage.setItem('pu_custom', JSON.stringify(lessons));

  // Clear form
  ['adm-title','adm-q','adm-a','adm-b','adm-c','adm-d'].forEach(id => document.getElementById(id).value = '');
  renderAdminList();
  alert('Atividade salva com sucesso!');
}

function clearLessons() {
  if (!confirm('Remover todas as atividades personalizadas e voltar ao padrão?')) return;
  state.customLessons = null;
  localStorage.removeItem('pu_custom');
  renderAdminList();
}

function deleteLesson(lang, day, id) {
  if (!state.customLessons) return;
  const lessons = JSON.parse(JSON.stringify(state.customLessons));
  lessons[lang][day] = lessons[lang][day].filter(l => l.id !== id);
  state.customLessons = lessons;
  localStorage.setItem('pu_custom', JSON.stringify(lessons));
  renderAdminList();
}

function renderAdminList() {
  const container = document.getElementById('adm-list');
  const lessons = getLessons();
  let html = '';
  let total = 0;
  for (const lang of ['en','es']) {
    for (let d = 0; d < 7; d++) {
      const list = lessons[lang]?.[d] || [];
      list.forEach(l => {
        total++;
        const s = TYPE_STYLES[l.type] || TYPE_STYLES.grammar;
        html += `<div class="admin-lesson-item">
          <div class="lc-icon" style="background:${s.bg};width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="ti ${l.icon||s.icon}" style="color:${s.color};font-size:17px"></i>
          </div>
          <div class="ali-body">
            <div class="ali-title">${l.title}</div>
            <div class="ali-meta">${lang === 'en' ? '🇬🇧 Inglês' : '🇪🇸 Espanhol'} · ${DAY_NAMES[d]}</div>
          </div>
          ${state.customLessons ? `<button class="ali-del" onclick="deleteLesson('${lang}',${d},'${l.id}')"><i class="ti ti-trash"></i></button>` : ''}
        </div>`;
      });
    }
  }
  if (!total) html = '<div style="text-align:center;padding:20px;color:var(--t3);font-size:14px">Nenhuma atividade cadastrada.</div>';
  container.innerHTML = html;
}

// ===== INIT =====
window.addEventListener('load', () => {
  // Hide splash after animation
  setTimeout(() => {
    document.getElementById('s-splash').classList.remove('on');
    document.getElementById('s-login').classList.add('on');
  }, 2600);
});
