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
window.goScreen = goScreen;

// ===== STATE =====
let currentLang = 'en';
let currentLesson = null;
let currentQ = 0;
let hearts = 3;
let correct = 0;
let answered = false;
let selectedOpt = null;
let _correctFlag = false;
let customLessons = null;

function getProfile() { return window._profile || { xp: 0, streak: 0, completedLessons: [] }; }
function getLessons() { return customLessons || DEFAULT_LESSONS; }

// ===== HOME =====
function renderHome() {
  const p = getProfile();
  const name = (window._user?.displayName || window._user?.email || 'você').split(' ')[0];
  document.getElementById('hero-greet').textContent = 'Olá, ' + name + '!';
  document.getElementById('hero-xp').textContent = p.xp || 0;
  document.getElementById('hero-level').textContent = Math.floor((p.xp || 0) / 200) + 1;
  document.getElementById('streak-val').textContent = p.streak || 0;

  const todayXP = 0; // Poderia calcular do histórico
  document.getElementById('hero-today-xp').textContent = '+' + todayXP + ' XP hoje';

  if ((p.streak || 0) >= 2) {
    const banner = document.getElementById('streak-banner');
    banner.style.display = 'flex';
    document.getElementById('streak-title').textContent = p.streak + ' dias seguidos!';
  }

  renderWeekStrip();
  renderTodayLessons();

  // Carregar lições do Firestore
  if (window.loadCustomLessons) {
    window.loadCustomLessons().then(l => {
      if (l) { customLessons = l; renderTodayLessons(); }
    });
  }
}

function renderWeekStrip() {
  const p = getProfile();
  const completed = p.completedLessons || [];
  const strip = document.getElementById('week-strip');
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7;
  let html = '';
  let doneCount = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    const dateStr = d.toISOString().split('T')[0];
    const isPast = i < todayDow;
    const isToday = i === todayDow;
    const hasDone = isPast; // simplificado
    if (hasDone) doneCount++;
    let cls = 'day-chip';
    if (isToday) cls += ' active today';
    else if (hasDone) cls += ' done';
    html += `<div class="${cls}" onclick="goScreen('week')">
      <span class="day-abbr">${DAY_SHORT[i]}</span>
      <span class="day-num">${d.getDate()}</span>
      <div class="day-dot"></div>
    </div>`;
  }
  strip.innerHTML = html;
  document.getElementById('week-prog-label').textContent = doneCount + '/7 dias';
  document.getElementById('week-prog-fill').style.width = Math.round(doneCount / 7 * 100) + '%';
}

function renderTodayLessons() {
  const container = document.getElementById('today-lessons');
  const today = new Date();
  const dow = (today.getDay() + 6) % 7;
  const lessons = getLessons()[currentLang]?.[dow] || [];
  document.getElementById('today-label').textContent =
    'Atividades de hoje — ' + DAY_SHORT[dow] + ', ' + today.getDate() + '/' + (today.getMonth() + 1);
  if (!lessons.length) {
    container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--t3);font-size:14px">Nenhuma atividade para hoje.</div>';
    return;
  }
  container.innerHTML = lessons.map(l => lessonCardHTML(l, true)).join('');
}

function lessonCardHTML(lesson, clickable) {
  const s = TYPE_STYLES[lesson.type] || TYPE_STYLES.grammar;
  const p = getProfile();
  const done = (p.completedLessons || []).includes(lesson.id);
  const badge = done ? '<span class="lc-badge badge-done">feito</span>' : '<span class="lc-badge badge-new">novo</span>';
  const onclick = clickable ? `onclick="startLesson('${lesson.id}')"` : '';
  return `<div class="lesson-card" ${onclick}>
    <div class="lc-icon" style="background:${s.bg}"><i class="ti ${lesson.icon || s.icon}" style="color:${s.color};font-size:19px"></i></div>
    <div class="lc-body"><div class="lc-title">${lesson.title}</div><div class="lc-meta">${lesson.meta}</div></div>
    <div class="lc-right">${badge}</div>
  </div>`;
}

// ===== LANG SWITCH =====
function switchLang(lang, context) {
  currentLang = lang;
  const container = document.getElementById('lang-tabs-' + context);
  if (container) container.querySelectorAll('.ltab').forEach((t, i) => {
    t.classList.toggle('on', (i === 0 && lang === 'en') || (i === 1 && lang === 'es'));
  });
  if (context === 'home') renderTodayLessons();
  if (context === 'week') renderWeekDays();
}
window.switchLang = switchLang;

// ===== WEEK =====
function renderWeek() {
  if (window.loadCustomLessons) {
    window.loadCustomLessons().then(l => { if (l) customLessons = l; renderWeekDays(); });
  } else renderWeekDays();
}

function renderWeekDays() {
  const container = document.getElementById('week-days-list');
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7;
  const lessons = getLessons()[currentLang] || {};
  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + i);
    const dayLessons = lessons[i] || [];
    const isToday = i === todayDow;
    const isFuture = i > todayDow;
    html += `<div class="day-group">
      <div class="day-group-head">
        <div class="dg-day${isToday ? ' today-label' : ''}">${DAY_NAMES[i]}, ${d.getDate()}/${d.getMonth()+1}</div>
        <div class="dg-status">${dayLessons.length} ${dayLessons.length === 1 ? 'lição' : 'lições'}</div>
      </div>`;
    if (!dayLessons.length) {
      html += `<div class="lesson-card locked"><div class="lc-icon" style="background:var(--bg3)"><i class="ti ti-moon" style="color:var(--t3)"></i></div><div class="lc-body"><div class="lc-title">Sem atividade</div><div class="lc-meta">Dia de descanso</div></div></div>`;
    } else {
      dayLessons.forEach(l => {
        if (isFuture) {
          const s = TYPE_STYLES[l.type] || TYPE_STYLES.grammar;
          html += `<div class="lesson-card locked"><div class="lc-icon" style="background:${s.bg}"><i class="ti ${l.icon||s.icon}" style="color:${s.color}"></i></div><div class="lc-body"><div class="lc-title">${l.title}</div><div class="lc-meta">${l.meta}</div></div><div class="lc-right"><span class="lc-badge badge-lock">em breve</span></div></div>`;
        } else html += lessonCardHTML(l, true);
      });
    }
    html += '</div>';
  }
  container.innerHTML = html;
  document.getElementById('week-screen-title').textContent = 'Semana — ' + (currentLang === 'en' ? 'Inglês' : 'Espanhol');
}

// ===== LESSON =====
function startLesson(lessonId) {
  const all = getLessons();
  let found = null;
  for (const lang of Object.keys(all)) {
    for (const day of Object.keys(all[lang])) {
      const l = all[lang][day].find(x => x.id === lessonId);
      if (l) { found = l; break; }
    }
    if (found) break;
  }
  if (!found) return;
  currentLesson = found;
  currentQ = 0; hearts = 3; correct = 0; answered = false; selectedOpt = null;
  document.getElementById('lesson-title').textContent = found.title;
  goScreen('lesson');
  renderQuestion();
}
window.startLesson = startLesson;

function renderQuestion() {
  answered = false; selectedOpt = null;
  const pct = Math.round((currentQ / currentLesson.questions.length) * 100);
  document.getElementById('ex-prog-fill').style.width = pct + '%';
  updateHearts();
  const q = currentLesson.questions[currentQ];
  const letters = ['A','B','C','D'];
  const opts = q.opts.map((o, i) => ({ text: o, correct: i === q.ans }));
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  document.getElementById('ex-wrap').innerHTML = `
    <div class="ex-badge">${getLabelForType(currentLesson.type)}</div>
    <div class="ex-q">${q.q}</div>
    <div class="ex-opts">${opts.map((o, i) => `<button class="ex-opt" id="opt${i}" onclick="pickOpt(${i},${o.correct})"><span class="opt-letter">${letters[i]}</span>${o.text}</button>`).join('')}</div>
    <div class="ex-fb" id="fb"></div>
    <button class="ex-chk off" id="chk" onclick="checkOpt()">Verificar</button>`;
}

function getLabelForType(type) {
  return { grammar:'Gramática', vocabulary:'Vocabulário', listening:'Listening', writing:'Redação', reading:'Leitura' }[type] || 'Exercício';
}

function updateHearts() {
  document.getElementById('lives-display').innerHTML = '❤️'.repeat(hearts) + (hearts < 3 ? '🖤'.repeat(3 - hearts) : '');
}

window.pickOpt = function(i, isCorrect) {
  if (answered) return;
  document.querySelectorAll('.ex-opt').forEach(b => b.classList.remove('sel'));
  document.getElementById('opt' + i).classList.add('sel');
  selectedOpt = i; _correctFlag = isCorrect;
  document.getElementById('chk').className = 'ex-chk on';
};

window.checkOpt = function() {
  if (answered || selectedOpt === null) return;
  answered = true;
  const ok = _correctFlag;
  document.querySelectorAll('.ex-opt').forEach(b => {
    if (b.onclick?.toString().includes('true')) b.classList.add('ok');
    if (b.id === 'opt' + selectedOpt && !ok) b.classList.add('bad');
    b.classList.add('off');
  });
  const fb = document.getElementById('fb');
  fb.className = 'ex-fb on ' + (ok ? 'ok' : 'bad');
  if (ok) { correct++; fb.innerHTML = '<div class="fb-t ok">Correto!</div>'; }
  else {
    hearts = Math.max(0, hearts - 1); updateHearts();
    const correctBtn = [...document.querySelectorAll('.ex-opt')].find(b => b.classList.contains('ok'));
    const correctText = correctBtn ? correctBtn.textContent.slice(1).trim() : '';
    fb.innerHTML = `<div class="fb-t bad">Incorreto</div><div class="fb-s">Resposta correta: <strong>${correctText}</strong></div>`;
  }
  const chk = document.getElementById('chk');
  chk.className = 'ex-chk on'; chk.textContent = 'Continuar'; chk.onclick = nextQuestion;
};

function nextQuestion() {
  currentQ++;
  if (currentQ >= currentLesson.questions.length) finishLesson();
  else renderQuestion();
}

async function finishLesson() {
  const acc = Math.round((correct / currentLesson.questions.length) * 100);
  const xpGained = Math.round(10 + acc / 10);
  // Salvar no Firebase
  if (window.saveProgress) await window.saveProgress(currentLesson.id, xpGained, acc, currentLang);
  const p = getProfile();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('r-xp').textContent = '+' + xpGained + ' XP';
  document.getElementById('r-acc').textContent = acc + '%';
  document.getElementById('r-streak').textContent = '🔥' + (p.streak || 0);
  document.getElementById('r-lessons').textContent = (p.completedLessons?.length || 0) + ' feitas';
  if (acc >= 80) { document.getElementById('res-icon').innerHTML = '<i class="ti ti-trophy"></i>'; document.getElementById('res-title').textContent = 'Excelente!'; document.getElementById('res-sub').textContent = 'Você arrasou! Continue assim.'; }
  else if (acc >= 50) { document.getElementById('res-icon').innerHTML = '<i class="ti ti-star"></i>'; document.getElementById('res-title').textContent = 'Lição completa!'; document.getElementById('res-sub').textContent = 'Bom trabalho! Pratique mais para melhorar.'; }
  else { document.getElementById('res-icon').innerHTML = '<i class="ti ti-refresh"></i>'; document.getElementById('res-title').textContent = 'Continue tentando!'; document.getElementById('res-sub').textContent = 'Revise o conteúdo e tente novamente.'; }
  goScreen('result');
}

// ===== PROGRESS =====
function renderProgress() {
  const p = getProfile();
  document.getElementById('kpi-streak').textContent = p.streak || 0;
  document.getElementById('kpi-xp').textContent = p.xp || 0;
  document.getElementById('kpi-lessons').textContent = (p.completedLessons || []).length;
  const avgAcc = p.totalLessons > 0 ? Math.round((p.totalAcc || 0) / p.totalLessons) : 0;
  document.getElementById('kpi-acc').textContent = avgAcc + '%';
  const enXP = p.xp_en || 0; const esXP = p.xp_es || 0; const totalXP = Math.max(enXP + esXP, 1);
  document.getElementById('en-xp').textContent = enXP + ' XP';
  document.getElementById('es-xp').textContent = esXP + ' XP';
  document.getElementById('en-prog').style.width = Math.round(enXP / totalXP * 100) + '%';
  document.getElementById('es-prog').style.width = Math.round(esXP / totalXP * 100) + '%';
  const today = new Date(); const todayDow = (today.getDay() + 6) % 7;
  document.getElementById('bar-chart').innerHTML = DAY_SHORT.map((d, i) => {
    const isToday = i === todayDow; const isPast = i < todayDow;
    const h = isPast ? Math.floor(Math.random() * 60) + 10 : isToday ? 20 : 4;
    const bg = isPast ? 'var(--ok)' : isToday ? 'var(--p)' : 'var(--bg3)';
    const tc = isToday ? 'var(--p-text)' : 'var(--t3)';
    return `<div class="bar-col"><div class="bar" style="height:${h}px;background:${bg}"></div><span style="color:${tc};font-weight:${isToday?'600':'400'}">${d}</span></div>`;
  }).join('');
}

// ===== PROFILE =====
function renderProfile() {
  const p = getProfile();
  const user = window._user;
  document.getElementById('prof-name').textContent = user?.displayName || user?.email?.split('@')[0] || '—';
  document.getElementById('prof-email').textContent = user?.email || '—';
  document.getElementById('prof-level').textContent = 'Nível ' + (Math.floor((p.xp || 0) / 200) + 1) + ' · Purple Learner';
  document.getElementById('ps-xp').textContent = p.xp || 0;
  document.getElementById('ps-streak').textContent = p.streak || 0;
  document.getElementById('ps-lessons').textContent = (p.completedLessons || []).length;
  if (user?.photoURL) {
    document.getElementById('prof-photo-wrap').innerHTML = `<img src="${user.photoURL}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
  }
}

// ===== ADMIN =====
window.saveLesson = async function() {
  const lang = document.getElementById('adm-lang').value;
  const day = parseInt(document.getElementById('adm-day').value);
  const title = document.getElementById('adm-title').value.trim();
  const type = document.getElementById('adm-type').value;
  const q = document.getElementById('adm-q').value.trim();
  const a = document.getElementById('adm-a').value.trim();
  const b = document.getElementById('adm-b').value.trim();
  const c = document.getElementById('adm-c').value.trim();
  const d = document.getElementById('adm-d').value.trim();
  if (!title || !q || !a || !b) { alert('Preencha título, pergunta e pelo menos as opções A e B.'); return; }
  const s = TYPE_STYLES[type];
  const opts = [a, b, c, d].filter(Boolean);
  const lessonData = { lang, day, title, type, meta: type.charAt(0).toUpperCase() + type.slice(1) + ' · 1 exercício', icon: s.icon, questions: [{ q, opts, ans: 0 }] };
  try {
    if (window.saveLessonToFirestore) await window.saveLessonToFirestore(lessonData);
    ['adm-title','adm-q','adm-a','adm-b','adm-c','adm-d'].forEach(id => document.getElementById(id).value = '');
    renderAdminList();
    alert('✅ Atividade salva com sucesso!');
  } catch (e) { alert('Erro ao salvar. Tente novamente.'); }
};

window.clearLessons = async function() {
  if (!confirm('Remover todas as atividades personalizadas?')) return;
  customLessons = null;
  renderAdminList();
};

window.deleteLessonItem = async function(id) {
  if (!confirm('Remover esta atividade?')) return;
  if (window.deleteLessonFromFirestore) await window.deleteLessonFromFirestore(id);
  renderAdminList();
};

window.renderAdminList = async function() {
  const container = document.getElementById('adm-list');
  if (!container) return;
  let lessons = null;
  if (window.loadCustomLessons) lessons = await window.loadCustomLessons();
  if (!lessons) { container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--t3);font-size:14px">Nenhuma atividade cadastrada.</div>'; return; }
  let html = '';
  for (const lang of ['en','es']) {
    for (let d = 0; d < 7; d++) {
      const list = lessons[lang]?.[d] || [];
      list.forEach(l => {
        const s = TYPE_STYLES[l.type] || TYPE_STYLES.grammar;
        html += `<div class="admin-lesson-item">
          <div class="lc-icon" style="background:${s.bg};width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ti ${l.icon||s.icon}" style="color:${s.color};font-size:17px"></i></div>
          <div class="ali-body"><div class="ali-title">${l.title}</div><div class="ali-meta">${lang==='en'?'Inglês':'Espanhol'} · ${DAY_NAMES[d]}</div></div>
          <button class="ali-del" onclick="deleteLessonItem('${l.id}')"><i class="ti ti-trash"></i></button>
        </div>`;
      });
    }
  }
  container.innerHTML = html || '<div style="text-align:center;padding:20px;color:var(--t3);font-size:14px">Nenhuma atividade cadastrada.</div>';
};
