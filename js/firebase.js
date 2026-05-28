
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===== CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyCdK-YRqoqM7fQb23dHp7gF3tggBjKiRiw",
  authDomain: "purpleup-84d78.firebaseapp.com",
  projectId: "purpleup-84d78",
  storageBucket: "purpleup-84d78.firebasestorage.app",
  messagingSenderId: "701924140297",
  appId: "1:701924140297:web:4364ec26e11aa424a2dfd8",
  measurementId: "G-D3W25FJGF6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ===== EMAILS DOS PROFESSORES =====
// Adicione aqui os e-mails dos professores da escola
const TEACHER_EMAILS = [
  "professor@purpleschool.com",
  "admin@purpleschool.com"
];

function isTeacher(email) {
  return TEACHER_EMAILS.includes(email?.toLowerCase());
}

// ===== AUTH =====
window.loginGoogle = async function() {
  try {
    showError('');
    const result = await signInWithPopup(auth, googleProvider);
    // onAuthStateChanged vai cuidar do redirecionamento
  } catch (e) {
    showError('Erro ao entrar com Google. Tente novamente.');
    console.error(e);
  }
};

window.loginEmail = async function() {
  const email = document.getElementById('inp-email').value.trim();
  const senha = document.getElementById('inp-senha').value.trim();
  if (!email || !senha) { showError('Preencha e-mail e senha.'); return; }
  try {
    showError('');
    await signInWithEmailAndPassword(auth, email, senha);
  } catch (e) {
    showError('E-mail ou senha incorretos.');
    console.error(e);
  }
};

window.registerEmail = async function() {
  const email = document.getElementById('inp-email').value.trim();
  const senha = document.getElementById('inp-senha').value.trim();
  if (!email || !senha) { showError('Preencha e-mail e senha.'); return; }
  if (senha.length < 6) { showError('Senha deve ter pelo menos 6 caracteres.'); return; }
  try {
    showError('');
    await createUserWithEmailAndPassword(auth, email, senha);
  } catch (e) {
    if (e.code === 'auth/email-already-in-use') showError('E-mail já cadastrado. Tente entrar.');
    else showError('Erro ao criar conta. Tente novamente.');
    console.error(e);
  }
};

window.doLogout = async function() {
  await signOut(auth);
  goScreen('login');
};

function showError(msg) {
  const el = document.getElementById('login-error');
  if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}

// ===== AUTH STATE =====
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    goScreen('login');
    return;
  }

  // Carregar ou criar perfil no Firestore
  const profileRef = doc(db, 'users', user.uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    // Primeiro acesso — criar perfil
    await setDoc(profileRef, {
      name: user.displayName || user.email.split('@')[0],
      email: user.email,
      photoURL: user.photoURL || null,
      role: isTeacher(user.email) ? 'teacher' : 'student',
      xp: 0,
      streak: 0,
      lastActive: new Date().toISOString().split('T')[0],
      completedLessons: [],
      createdAt: new Date().toISOString()
    });
  }

  const profile = profileSnap.exists() ? profileSnap.data() : { xp: 0, streak: 0, completedLessons: [], role: isTeacher(user.email) ? 'teacher' : 'student' };

  // Atualizar streak
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let streak = profile.streak || 0;
  if (profile.lastActive === yesterday) streak += 1;
  else if (profile.lastActive !== today) streak = 1;
  if (profile.lastActive !== today) {
    await updateDoc(profileRef, { lastActive: today, streak });
  }

  // Salvar no estado global
  window._user = user;
  window._profile = { ...profile, streak, uid: user.uid };
  window._db = db;
  window._profileRef = profileRef;

  if (isTeacher(user.email)) {
    document.getElementById('teacher-email-display').textContent = user.email;
    goScreen('teacher');
    renderAdminList();
  } else {
    goScreen('home');
    renderHome();
  }
});

// ===== SALVAR PROGRESSO =====
window.saveProgress = async function(lessonId, xpGained, accuracy, lang) {
  if (!window._user) return;
  const profile = window._profile;
  const today = new Date().toISOString().split('T')[0];

  const completed = profile.completedLessons || [];
  if (!completed.includes(lessonId)) completed.push(lessonId);

  const newXP = (profile.xp || 0) + xpGained;
  const langXPKey = 'xp_' + lang;
  const newLangXP = (profile[langXPKey] || 0) + xpGained;

  // Calcular precisão média
  const totalAcc = (profile.totalAcc || 0) + accuracy;
  const totalLessons = completed.length;

  const updates = {
    xp: newXP,
    [langXPKey]: newLangXP,
    completedLessons: completed,
    lastActive: today,
    totalAcc,
    totalLessons
  };

  await updateDoc(window._profileRef, updates);
  window._profile = { ...window._profile, ...updates };

  // Salvar histórico da lição
  await addDoc(collection(db, 'users', window._user.uid, 'history'), {
    lessonId, xpGained, accuracy, lang,
    date: today,
    timestamp: new Date().toISOString()
  });
};

// ===== LESSONS NO FIRESTORE =====
window.loadCustomLessons = async function() {
  try {
    const snap = await getDocs(collection(db, 'lessons'));
    if (snap.empty) return null;
    const result = { en: {}, es: {} };
    snap.forEach(doc => {
      const d = doc.data();
      if (!result[d.lang]) result[d.lang] = {};
      if (!result[d.lang][d.day]) result[d.lang][d.day] = [];
      result[d.lang][d.day].push({ ...d, id: doc.id });
    });
    return result;
  } catch (e) { return null; }
};

window.saveLessonToFirestore = async function(lessonData) {
  const ref = await addDoc(collection(db, 'lessons'), lessonData);
  return ref.id;
};

window.deleteLessonFromFirestore = async function(id) {
  await deleteDoc(doc(db, 'lessons', id));
};
