/**
 * Ceritain App Logic
 * 1. SPA Routing
 * 2. String Matching Algorithm (Negative Keywords)
 * 3. DASS-21 Logic & Scoring
 * 4. Dropdown Menu (logo trigger)
 * 5. About Modal
 */

// ==========================================
// 0. DROPDOWN MENU (triggered by logo)
// ==========================================
const logoMenuBtn = document.getElementById('btn-logo-menu');
const dropdownMenu = document.getElementById('dropdown-menu');
const dropdownBackdrop = document.getElementById('dropdown-backdrop');
const closeDropdownBtn = document.getElementById('btn-close-dropdown');

function openDropdownMenu() {
    dropdownMenu.classList.add('is-open');
    dropdownBackdrop.classList.add('is-open');
    logoMenuBtn && logoMenuBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('no-scroll');
}

function closeDropdownMenu() {
    dropdownMenu.classList.remove('is-open');
    dropdownBackdrop.classList.remove('is-open');
    logoMenuBtn && logoMenuBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('no-scroll');
}

if (logoMenuBtn) logoMenuBtn.addEventListener('click', openDropdownMenu);
if (closeDropdownBtn) closeDropdownBtn.addEventListener('click', closeDropdownMenu);

// ==========================================
// ABOUT MODAL
// ==========================================
const aboutOverlay = document.getElementById('about-modal-overlay');

function openAboutModal() {
    if (aboutOverlay) {
        aboutOverlay.classList.add('show');
        document.documentElement.classList.add('no-scroll');
    }
}

function closeAboutModal() {
    if (aboutOverlay) {
        aboutOverlay.classList.remove('show');
        document.documentElement.classList.remove('no-scroll');
    }
}

// Tutup modal kalau klik backdrop
if (aboutOverlay) {
    aboutOverlay.addEventListener('click', (e) => {
        if (e.target === aboutOverlay) closeAboutModal();
    });
}

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDropdownMenu();
        closeAboutModal();
    }
});

// Sync nav active state
function syncMobileNavActive(currentId) {
    document.querySelectorAll('.dropdown-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
        }
    });
}

// Legacy stubs agar tidak error jika ada referensi lama
function openMobileMenu() { openDropdownMenu(); }
function closeMobileMenu() { closeDropdownMenu(); }

// ==========================================
// QUIZ GUIDE → START QUIZ
// ==========================================
const btnMulaiKuis = document.getElementById('btn-mulai-kuis');
const quizGuide = document.getElementById('quiz-guide');
const quizQuestions = document.getElementById('quiz-questions');

if (btnMulaiKuis) {
    btnMulaiKuis.addEventListener('click', () => {
        if (quizGuide) quizGuide.style.display = 'none';
        if (quizQuestions) quizQuestions.style.display = 'block';
        initDass();
    });
}


// ==========================================
// 1. DATA & KNOWLEDGE BASE
// ==========================================
const keyword_baku = [
    // 100 Kata Formal Psikologis/Emosional
    "depresi", "tekanan", "kecemasan", "insomnia", "apatis", "pesimis", "trauma",
    "fobia", "frustrasi", "kesedihan", "kesepian", "keputusasaan", "ketakutan",
    "kegelisahan", "kewalahan", "kemarahan", "kelelahan", "kehampaan", "kekecewaan",
    "keterasingan", "kematian", "gagal", "menangis", "menyerah", "menyalahkan",
    "mengisolasi", "mengeluh", "mengurung", "menyakiti", "menyiksa", "merana",
    "putus asa", "bunuh diri", "mati rasa", "tak berdaya", "tak berguna", "tak berarti",
    "takut", "cemas", "gelisah", "marah", "benci", "sedih", "sakit", "stres", "lelah",
    "tegang", "terbebani", "tertekan", "terasing", "terpuruk", "tersiksa", "terjebak",
    "bingung", "bingung", "berakhir", "berduka", "bermasalah", "berbeban", "bersalah",
    "hancur", "hampa", "hilang", "khawatir", "lemah", "letih", "lesu", "lunglai",
    "murung", "merana", "nelangsa", "nyeri", "patah", "panik", "pusing", "perih",
    "sengsara", "sesak", "sulit", "sukar", "terluka", "traumatik", "waswas",
    "abnormal", "agresif", "defensif", "delusi", "disosiasi", "halusinasi", "histeris",
    "impulsif", "kompulsif", "neurotik", "obsesif", "paranoid", "patologis", "psikosomatis",
    "represif", "skizofrenia"
];

const keyword_tidak_baku = [
    // 100 Kata Non-Formal/Slang/Sehari-hari
    "burnout", "overthinking", "mumet", "capek", "badmood", "males", "bete", "gabut",
    "insecure", "mental breakdown", "down", "drop", "ambyar", "ancur", "bodo amat",
    "buntu", "puyeng", "pusing", "ruwet", "stres", "sumpek", "suntuk", "spaneng",
    "galau", "gegana", "ngenes", "nyesek", "sedih", "suwung", "kosong", "kacau",
    "kelabu", "nangis", "mewek", "baper", "emosi", "kesel", "gedek", "dongkol",
    "mangkel", "muak", "enek", "eneg", "cape", "lemes", "loyo", "mager", "pegel",
    "remuk", "tepar", "tumbang", "tewas", "modar", "modyar", "mati", "kelar",
    "nyerah", "nyesel", "nyiksa", "nyut-nyutan", "berat", "beban", "mentok", "bego",
    "goblok", "tolol", "bloon", "bodoh", "gila", "sinting", "miring", "stres",
    "edan", "gaje", "krik", "jayus", "wagu", "zonk", "amsyong", "buntung", "pesimis",
    "halu", "kepo", "pansos", "salty", "toxic", "red flag", "green flag", "healing",
    "coping", "trigger", "fomo", "jomo", "yolo", "vibes", "mood", "anxious", "depressed",
    "sadboy", "sadgirl", "fakboi", "buaya"
];

const masterKeywords = [...keyword_baku, ...keyword_tidak_baku];

// DASS-21 Questions translated to Bahasa Indonesia.
// Type: 'S' (Stress), 'A' (Anxiety), 'D' (Depression)
const dassQuestions = [
    { id: 1, text: "Saya merasa sulit untuk menenangkan diri", type: "S" },
    { id: 2, text: "Saya menyadari mulut saya terasa kering", type: "A" },
    { id: 3, text: "Saya sama sekali tidak dapat merasakan perasaan positif", type: "D" },
    { id: 4, text: "Saya mengalami kesulitan bernapas (misal: sering terengah-engah atau tidak dapat bernapas padahal tidak melakukan aktivitas fisik sebelumnya)", type: "A" },
    { id: 5, text: "Saya merasa kesulitan untuk berinisiatif melakukan sesuatu", type: "D" },
    { id: 6, text: "Saya cenderung bereaksi berlebihan terhadap suatu situasi", type: "S" },
    { id: 7, text: "Saya merasa gemetar (misal: pada tangan)", type: "A" },
    { id: 8, text: "Saya merasa terlalu banyak menghabiskan energi untuk gelisah", type: "S" },
    { id: 9, text: "Saya mengkhawatirkan situasi dimana saya mungkin menjadi panik dan mempermalukan diri sendiri", type: "A" },
    { id: 10, text: "Saya merasa tidak ada hal yang dapat diharapkan di masa depan", type: "D" },
    { id: 11, text: "Saya menyadari bahwa saya mudah gelisah", type: "S" },
    { id: 12, text: "Saya merasa sulit untuk bersantai", type: "S" },
    { id: 13, text: "Saya merasa sedih dan tertekan", type: "D" },
    { id: 14, text: "Saya tidak dapat mentoleransi hal-hal yang menghalangi saya untuk menyelesaikan apa yang sedang saya lakukan", type: "S" },
    { id: 15, text: "Saya merasa saya hampir panik", type: "A" },
    { id: 16, text: "Saya tidak merasa antusias akan hal apapun", type: "D" },
    { id: 17, text: "Saya merasa tidak berharga sebagai seorang manusia", type: "D" },
    { id: 18, text: "Saya merasa bahwa saya mudah tersinggung", type: "S" },
    { id: 19, text: "Saya menyadari detak jantung saya berubah walau saya tidak melakukan aktivitas fisik (misal: detak jantung bertambah cepat atau melemah)", type: "A" },
    { id: 20, text: "Saya merasa takut tanpa alasan yang jelas", type: "A" },
    { id: 21, text: "Saya merasa hidup ini tidak ada artinya", type: "D" },
];

const scoringRules = {
    depression: {
        normal: [0, 9],
        ringan: [10, 13],
        sedang: [14, 20],
        berat: [21, 27],
        sangatBerat: [28, Infinity]
    },
    anxiety: {
        normal: [0, 7],
        ringan: [8, 9],
        sedang: [10, 14],
        berat: [15, 19],
        sangatBerat: [20, Infinity]
    },
    stress: {
        normal: [0, 14],
        ringan: [15, 18],
        sedang: [19, 25],
        berat: [26, 33],
        sangatBerat: [34, Infinity]
    }
};

const severityColors = {
    "Normal": "var(--color-normal)",
    "Ringan": "var(--color-ringan)",
    "Sedang": "var(--color-sedang)",
    "Berat": "var(--color-berat)",
    "Sangat Berat": "var(--color-sangatberat)"
};

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================
let currentScreen = "hero-section";
let screenHistory = []; // Track navigation history
let currentQuestionIndex = 0;
let dassScores = { D: 0, A: 0, S: 0 }; // Raw scores
let userAnswers = [];

// ==========================================
// 3. UI ELEMENTS
// ==========================================
const topNav = document.getElementById('top-nav');
const btnBack = document.getElementById('btn-back');

const screens = document.querySelectorAll('.screen');
const btnMulai = document.getElementById('btn-mulai');
const storyInput = document.getElementById('story-input');
const btnSelesaiCerita = document.getElementById('btn-selesai-cerita');

const analysisResultContainer = document.getElementById('analysis-result');
const analysisModalOverlay = document.getElementById('analysis-modal-overlay');
const btnCloseAnalysis = document.getElementById('btn-close-analysis');
const analysisMessage = document.getElementById('analysis-message');
const btnLanjutKuis = document.getElementById('btn-lanjut-kuis');
const keywordCountDisplay = document.getElementById('keyword-count');
const keywordTagsContainer = document.getElementById('keyword-tags-text');
const dassQuestionText = document.getElementById('dass-question-text');
const currentQSpan = document.getElementById('current-q');
const progressBarFill = document.getElementById('progress-bar-fill');
const btnAnswers = document.querySelectorAll('.btn-answer');
const questionContainer = document.querySelector('.question-container');

const btnUlangi = document.getElementById('btn-ulangi');
const btnKembaliMulai = document.getElementById('btn-kembali-mulai');

const btnThemeToggle = document.getElementById('btn-theme-toggle');
const themeIconLight = document.getElementById('theme-icon-light');
const themeIconDark = document.getElementById('theme-icon-dark');
const themeText = document.getElementById('theme-text');

// Baca dari localStorage — default light jika belum ada
const savedTheme = localStorage.getItem('ceritain-theme');
let isLightMode = savedTheme !== 'dark';

function applyTheme(light) {
    if (light) {
        document.documentElement.removeAttribute('data-theme');
        themeIconLight.style.display = 'block';
        themeIconDark.style.display = 'none';
        localStorage.setItem('ceritain-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIconLight.style.display = 'none';
        themeIconDark.style.display = 'block';
        localStorage.setItem('ceritain-theme', 'dark');
    }
    if (themeText) themeText.textContent = null;
}

// Apply saat load
applyTheme(isLightMode);

btnThemeToggle.addEventListener('click', () => {
    isLightMode = !isLightMode;
    applyTheme(isLightMode);
});

// ==========================================
// 3.5 NAVBAR SHRINK ON SCROLL
// ==========================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        topNav.classList.add('scrolled');
    } else {
        topNav.classList.remove('scrolled');
    }
}, { passive: true });

// ==========================================
// 4. SPA ROUTER LOGIC & NAVIGATION
// ==========================================
function switchScreen(targetScreenId) {
    const target = document.getElementById(targetScreenId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Intersection Observer for Sticky Nav
const sectionsNav = document.querySelectorAll('.screen');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger exactly when section is at the middle of viewport
    threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sectionsNav.forEach(sec => navObserver.observe(sec));

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        switchScreen(targetId);
    });
});

// ==========================================
// 5. EVENT LISTENERS & WORKFLOW
// ==========================================

// Back Navigation Logic
btnBack.addEventListener('click', () => {
    window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
});

// Hero -> Story
btnMulai.addEventListener('click', () => {
    switchScreen('storytelling');
});

// Storytelling Input Logic
storyInput.addEventListener('input', (e) => {
    const text = e.target.value.trim();
    if (text.length > 10) {
        btnSelesaiCerita.disabled = false;
    } else {
        btnSelesaiCerita.disabled = true;
    }
});

// ==========================================
// NLP ANALISIS NARASI STRES
// ==========================================
function analyzeStory(text) {
    let lowerText = text.toLowerCase();
    let cleanText = lowerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
    cleanText = cleanText.replace(/\s{2,}/g, " ");
    let tokens = cleanText.split(" ");
    let matchedKeywords = [];

    tokens.forEach(token => {
        const word = token.trim();
        if (word.length > 2 && masterKeywords.includes(word)) {
            if (!matchedKeywords.includes(word)) {
                matchedKeywords.push(word);
            }
        }
    });

    masterKeywords.forEach(keyword => {
        if (keyword.includes(" ") && cleanText.includes(keyword)) {
            if (!matchedKeywords.includes(keyword)) {
                matchedKeywords.push(keyword);
            }
        }
    });

    return matchedKeywords;
}

function showAnalysisModal() {
    analysisModalOverlay.classList.add('show');
    document.documentElement.classList.add('no-scroll');
}

function closeAnalysisModal() {
    analysisModalOverlay.classList.remove('show');
    document.documentElement.classList.remove('no-scroll');
}

btnSelesaiCerita.addEventListener('click', () => {
    const text = storyInput.value;
    const matches = analyzeStory(text);

    if (keywordCountDisplay) keywordCountDisplay.textContent = matches.length;
    if (keywordTagsContainer) keywordTagsContainer.textContent = matches.length > 0 ? matches.join(', ') : '-';

    if (matches.length >= 3) {
        analysisMessage.innerHTML = "Terima kasih sudah mau berbagi cerita di sini. Dari apa yang kamu tulis, sistem menangkap ada indikasi kalau kondisi kamu lagi kurang baik-baik saja atau mungkin lagi dalam tekanan yang cukup berat. Untuk memastikan dan melihat gambaran yang lebih jelas tentang kondisi mentalmu saat ini, yuk coba ikut tes validasi lewat kuesioner <button class=\"dass-inline-link\" onclick=\"openAboutModal()\">DASS-21</button> di bawah ini.";
        btnLanjutKuis.style.display = 'inline-block';
    } else {
        analysisMessage.innerHTML = "Terima kasih sudah bercerita. Sejauh ini sistem belum menemukan indikasi tekanan mental yang signifikan dari ceritamu. Tapi kalau kamu tetap merasa butuh bantuan atau ingin iseng mencoba kuesioner medis kami, silakan lanjut ke bawah ya.";
        btnLanjutKuis.style.display = 'none';
    }

    showAnalysisModal();
});

btnCloseAnalysis.addEventListener('click', closeAnalysisModal);
analysisModalOverlay.addEventListener('click', (e) => {
    if (e.target === analysisModalOverlay) closeAnalysisModal();
});

btnLanjutKuis.addEventListener('click', () => {
    switchScreen('survey');
});

const linkSkipToQuiz = document.getElementById('link-skip-to-quiz');
if (linkSkipToQuiz) {
    linkSkipToQuiz.addEventListener('click', (e) => {
        e.preventDefault();
        switchScreen('survey');
    });
}

btnUlangi.addEventListener('click', () => {
    switchScreen('thankyou-section');
});

btnKembaliMulai.addEventListener('click', resetApp);

function resetApp() {
    storyInput.value = '';
    btnSelesaiCerita.disabled = true;
    closeAnalysisModal();
    currentQuestionIndex = 0;
    dassScores = { D: 0, A: 0, S: 0 };
    progressBarFill.style.width = '0%';

    // Reset tampilan panduan kuis
    if (quizGuide) quizGuide.style.display = '';
    if (quizQuestions) quizQuestions.style.display = 'none';
    userAnswers = new Array(dassQuestions.length).fill(null);

    if (dassQuestions.length > 0) {
        dassQuestionText.textContent = dassQuestions[0].text;
        currentQSpan.textContent = "1";
    }

    const defaultZeroKeys = ['depression', 'anxiety', 'stress'];
    defaultZeroKeys.forEach(key => {
        document.getElementById(`score-${key}`).textContent = '0';
        const severityElem = document.getElementById(`severity-${key}`);
        severityElem.textContent = 'Normal';
        severityElem.style.color = severityColors["Normal"];
        document.querySelector(`#card-${key} .score-circle`).style.borderColor = severityColors["Normal"];
    });

    document.getElementById('recommendation-list').innerHTML = '';
    switchScreen('home');
}

// ==========================================
// 6. DASS-21 LOGIC
// ==========================================
function initDass() {
    currentQuestionIndex = 0;
    dassScores = { D: 0, A: 0, S: 0 };
    userAnswers = new Array(dassQuestions.length).fill(null);
    renderQuestion();
}

function renderQuestion() {
    const questionContainer = document.querySelector('.question-container');
    questionContainer.style.opacity = '0';
    questionContainer.style.transform = 'translateY(10px)';

    setTimeout(() => {
        const q = dassQuestions[currentQuestionIndex];
        dassQuestionText.textContent = q.text;
        currentQSpan.textContent = currentQuestionIndex + 1;

        // Update nomor dekoratif
        const decoBig = document.getElementById('question-number-deco');
        if (decoBig) decoBig.textContent = String(currentQuestionIndex + 1).padStart(2, '0');

        const progressPercent = ((currentQuestionIndex) / dassQuestions.length) * 100;
        progressBarFill.style.width = `${progressPercent}%`;

        // Highlight jawaban yang sudah dipilih sebelumnya
        btnAnswers.forEach(btn => {
            btn.classList.remove('selected');
            if (userAnswers[currentQuestionIndex] !== null &&
                parseInt(btn.getAttribute('data-value')) === userAnswers[currentQuestionIndex]) {
                btn.classList.add('selected');
            }
        });

        // Update tombol navigasi
        const btnBack = document.getElementById('btn-quiz-back');
        const btnNext = document.getElementById('btn-quiz-next');
        if (btnBack) btnBack.disabled = currentQuestionIndex === 0;
        if (btnNext) {
            const hasAnswer = userAnswers[currentQuestionIndex] != null;
            btnNext.disabled = !hasAnswer;
            btnNext.textContent = '';
            btnNext.innerHTML = currentQuestionIndex === dassQuestions.length - 1
                ? 'Lihat Hasil <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
                : 'Lanjut <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
        }

        questionContainer.style.opacity = '1';
        questionContainer.style.transform = 'translateY(0)';
    }, 250);
}

// Klik jawaban: highlight, aktifkan Next, lanjut otomatis
btnAnswers.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const value = parseInt(e.currentTarget.getAttribute('data-value'), 10);
        userAnswers[currentQuestionIndex] = value;

        btnAnswers.forEach(b => b.classList.remove('selected'));
        e.currentTarget.classList.add('selected');

        const btnNext = document.getElementById('btn-quiz-next');
        if (btnNext) btnNext.disabled = false;

        // Auto-advance ke soal berikutnya setelah delay singkat
        setTimeout(() => {
            if (currentQuestionIndex < dassQuestions.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
            } else {
                // Soal terakhir — tunggu user klik "Lihat Hasil"
            }
        }, 400);
    });
});

// Tombol Next
const btnQuizNext = document.getElementById('btn-quiz-next');
if (btnQuizNext) {
    btnQuizNext.addEventListener('click', () => {
        if (userAnswers[currentQuestionIndex] === null) return;

        if (currentQuestionIndex < dassQuestions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        } else {
            // Hitung skor dari userAnswers
            dassScores = { D: 0, A: 0, S: 0 };
            dassQuestions.forEach((q, i) => {
                if (userAnswers[i] !== null) dassScores[q.type] += userAnswers[i];
            });
            progressBarFill.style.width = '100%';
            setTimeout(() => {
                calculateResults();
                switchScreen('result');
            }, 600);
        }
    });
}

// Tombol Back
const btnQuizBack = document.getElementById('btn-quiz-back');
if (btnQuizBack) {
    btnQuizBack.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    });
}


// ==========================================
// 7. RESULTS CALCULATOR
// ==========================================
function evaluateSeverity(score, type) {
    const rules = scoringRules[type];
    if (score <= rules.normal[1]) return "Normal";
    if (score <= rules.ringan[1]) return "Ringan";
    if (score <= rules.sedang[1]) return "Sedang";
    if (score <= rules.berat[1]) return "Berat";
    return "Sangat Berat";
}

function calculateResults() {
    const finalScores = {
        depression: dassScores.D * 2,
        anxiety: dassScores.A * 2,
        stress: dassScores.S * 2
    };

    const severities = {
        depression: evaluateSeverity(finalScores.depression, 'depression'),
        anxiety: evaluateSeverity(finalScores.anxiety, 'anxiety'),
        stress: evaluateSeverity(finalScores.stress, 'stress')
    };

    updateCard('depression', finalScores.depression, severities.depression);
    updateCard('anxiety', finalScores.anxiety, severities.anxiety);
    updateCard('stress', finalScores.stress, severities.stress);

    generateRecommendations(severities);
}

function updateCard(type, score, severity) {
    document.getElementById(`score-${type}`).textContent = score;
    const severityElem = document.getElementById(`severity-${type}`);
    severityElem.textContent = severity;

    const color = severityColors[severity];
    severityElem.style.color = color;

    // SVG ring: circumference = 2 * PI * r = 2 * 3.14159 * 34 ≈ 213.6
    const circumference = 2 * Math.PI * 34;
    const maxScore = 42;
    const pct = Math.min(score / maxScore, 1);
    const filled = pct * circumference;

    const ring = document.getElementById(`ring-${type}`);
    if (ring) {
        ring.style.stroke = color;
        ring.style.strokeDasharray = `${filled} ${circumference}`;
        ring.style.filter = `drop-shadow(0 0 6px ${color})`;
    }

    // Reset background border
    const circle = document.querySelector(`#card-${type} .score-circle`);
    if (circle) {
        circle.style.background = '';
        circle.style.borderColor = 'transparent';
        circle.style.boxShadow = `0 0 20px ${color}30`;
    }
}

function generateRecommendations(severities) {
    const list = document.getElementById('recommendation-list');
    list.innerHTML = '';

    let hasSevere = false;
    let hasMild = false;

    Object.values(severities).forEach(sev => {
        if (sev === "Berat" || sev === "Sangat Berat") hasSevere = true;
        if (sev === "Ringan" || sev === "Sedang") hasMild = true;
    });

    const recommendations = [];

    if (hasSevere) {
        recommendations.push("<b>Penting:</b> Skor Anda menunjukkan tingkat tekanan psikologis yang tinggi. Kami sangat menyarankan Anda untuk berkonsultasi dengan profesional kesehatan mental (psikolog/psikiater) untuk mendapatkan bantuan yang tepat.");
        recommendations.push("Jangan ragu untuk bercerita kepada orang terdekat yang Anda percayai. Anda tidak harus menghadapi ini sendirian.");
    } else if (hasMild) {
        recommendations.push("Ambil waktu untuk beristirahat. Lakukan teknik relaksasi seperti latihan pernapasan dalam (deep breathing) atau meditasi ringan.");
        recommendations.push("Pertimbangkan untuk mengurangi pemicu stres harian Anda. Lakukan aktivitas yang Anda senangi.");
        recommendations.push("Jika perasaan ini bertahan lama atau mengganggu aktivitas Anda, berkonsultasi dengan profesional bisa menjadi pilihan yang baik.");
    } else {
        recommendations.push("Kondisi Anda saat ini terpantau dalam batas normal yang sehat. Terus pertahankan pola hidup sehat dan manajemen stres yang baik!");
        recommendations.push("Tetap biasakan untuk mengenali, menerima, dan meluapkan emosi Anda dengan cara yang positif setiap hari.");
    }

    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.innerHTML = rec;
        list.appendChild(li);
    });
}

// ==========================================
// 8. ANIMATIONS (AOS & GSAP)
// ==========================================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true,
    offset: 50
});

const observer = new MutationObserver(() => {
    AOS.refresh();
});
observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener('load', () => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".top-nav",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, backdropFilter: "blur(12px)" }
    )
        .fromTo(".logo-text, .nav-link, .btn-icon",
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
            "-=0.5"
        )
        .fromTo(".blob-1",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 0.35, duration: 2, ease: "elastic.out(1, 0.5)" },
            "-=1"
        )
        .fromTo(".blob-2",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 0.35, duration: 2, ease: "elastic.out(1, 0.5)" },
            "-=1.5"
        );

    const btnMulaiSesiBaru = document.getElementById('btn-kembali-mulai');
    if (btnMulaiSesiBaru) {
        gsap.to(btnMulaiSesiBaru, {
            boxShadow: '0 0 28px 6px var(--accent-glow), 0 8px 25px var(--accent-glow)',
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        function shakeCTA() {
            gsap.timeline()
                .to(btnMulaiSesiBaru, { x: -4, duration: 0.07, ease: 'power1.inOut' })
                .to(btnMulaiSesiBaru, { x: 4, duration: 0.07, ease: 'power1.inOut' })
                .to(btnMulaiSesiBaru, { x: -3, duration: 0.07, ease: 'power1.inOut' })
                .to(btnMulaiSesiBaru, { x: 3, duration: 0.07, ease: 'power1.inOut' })
                .to(btnMulaiSesiBaru, { x: 0, duration: 0.07, ease: 'power1.out' })
                .then(() => setTimeout(shakeCTA, 6000));
        }
        setTimeout(shakeCTA, 3000);
    }

    if (dassQuestions && dassQuestions.length > 0) {
        dassQuestionText.textContent = dassQuestions[0].text;
        currentQSpan.textContent = "1";
    }

    // ── Star cursor follow (magnetic) ──
    const heroStar = document.querySelector('.hero-star-icon');
    const heroRight = document.querySelector('.hero-right');
    const homeSection = document.getElementById('home');

    if (heroStar && homeSection) {
        homeSection.addEventListener('mousemove', (e) => {
            const rect = homeSection.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(heroStar, {
                x: nx * 60,
                y: ny * 60,
                duration: 0.6,
                ease: 'power2.out'
            });

            gsap.to(heroRight, {
                x: nx * 18,
                y: ny * 18,
                duration: 1.2,
                ease: 'power2.out'
            });
        });

        homeSection.addEventListener('mouseleave', () => {
            gsap.to(heroStar, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)' });
            gsap.to(heroRight, { x: 0, y: 0, duration: 1.5, ease: 'power2.out' });
        });
    }
});
