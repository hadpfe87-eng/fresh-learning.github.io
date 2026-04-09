const quizParts = {
    skull: {
        label: 'الجمجمة',
        question: 'ما اسم هذا الجزء الذي يحمي الدماغ؟',
        options: ['العظام الطويلة', 'الجمجمة', 'عظمة القص'],
        answer: 'الجمجمة',
        info: 'الجمجمة تحمي الدماغ وتدعم عظام الوجه. هي الجزء العلوي من الهيكل العظمي وتحتوي على فك علوي وسفلي.'
    },
    ribs: {
        label: 'الأضلاع',
        question: 'ما اسم هذا الجزء الذي يحمي القلب والرئتين؟',
        options: ['الفقرات', 'عظام الرسغ', 'الأضلاع'],
        answer: 'الأضلاع',
        info: 'الأضلاع تحيط بالقلب والرئتين وتساعد في التنفس. توجد 12 زوجاً من الأضلاع في الجسم البشري.'
    },
    pelvis: {
        label: 'الحوض',
        question: 'ما اسم هذا الجزء الذي يدعم الجزء السفلي من الجسم؟',
        options: ['الحوض', 'القص', 'الظنبوب'],
        answer: 'الحوض',
        info: 'الحوض يدعم وزن الجسم أثناء الوقوف والمشي، ويربط العمود الفقري بالأطراف السفلية.'
    },
    femur: {
        label: 'عظمة الفخذ',
        question: 'ما اسم العظمة الكبيرة في الساق العليا؟',
        options: ['القصبة', 'عظمة الساق', 'عظمة الفخذ'],
        answer: 'عظمة الفخذ',
        info: 'عظمة الفخذ هي أطول وأقوى عظمة في الجسم. تمتد من الحوض إلى الركبة وتساعد على الحركة والدعم.'
    },
    hand: {
        label: 'عظام اليد',
        question: 'ما اسم هذا الجزء الذي يساعد في الإمساك بالأشياء؟',
        options: ['عظام اليد', 'الجمجمة', 'الحوض'],
        answer: 'عظام اليد',
        info: 'عظام اليد تتكون من عدة عظام صغيرة مرنة تمكّن اليد من الإمساك والتحكم بالأشياء بدقة.'
    }
};

const markers = document.querySelectorAll('.skeleton-marker');
const popup = document.getElementById('skeletonPopup');
const popupTitle = document.getElementById('popupTitle');
const popupQuestion = document.getElementById('popupQuestion');
const optionsContainer = document.getElementById('optionsContainer');
const quizFeedback = document.getElementById('quizFeedback');
const popupCloseBtn = document.getElementById('popupCloseBtn');
const closeQuizPopup = document.getElementById('closeQuizPopup');
const quizScoreEl = document.getElementById('quizScore');
const quizTotalEl = document.getElementById('quizTotal');
const resetQuizBtn = document.getElementById('resetQuizBtn');
const backHomeBtn = document.getElementById('backHomeBtn');

let currentPartKey = null;
let score = 0;
let totalAnswered = 0;
let hasAnswered = false;

function updateScoreDisplay() {
    quizScoreEl.textContent = score;
    quizTotalEl.textContent = totalAnswered;
}

function openPopup(partKey) {
    const part = quizParts[partKey];
    if (!part) return;
    currentPartKey = partKey;
    hasAnswered = false;
    popupTitle.textContent = `سؤال عن ${part.label}`;
    popupQuestion.textContent = part.question;
    optionsContainer.innerHTML = '';
    quizFeedback.classList.add('hidden');
    popupCloseBtn.classList.add('hidden');

    part.options.forEach(option => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-game quiz-option-btn';
        btn.textContent = option;
        btn.dataset.value = option;
        btn.addEventListener('click', () => selectOption(option));
        optionsContainer.appendChild(btn);
    });

    popup.classList.remove('hidden');
}

function selectOption(option) {
    if (hasAnswered || !currentPartKey) return;
    const part = quizParts[currentPartKey];
    if (!part) return;
    hasAnswered = true;
    totalAnswered += 1;
    const isCorrect = option === part.answer;
    if (isCorrect) {
        score += 1;
    }

    const title = isCorrect ? 'ممتاز! إجابة صحيحة.' : `خطأ. الإجابة الصحيحة هي: ${part.answer}`;
    quizFeedback.innerHTML = `
        <p class="feedback ${isCorrect ? 'correct' : 'wrong'}">${title}</p>
        <p class="part-info"><strong>معلومة عن ${part.label}:</strong> ${part.info}</p>
    `;
    quizFeedback.classList.remove('hidden');
    popupCloseBtn.classList.remove('hidden');
    updateScoreDisplay();
}

function closePopup() {
    popup.classList.add('hidden');
}

function resetQuiz() {
    score = 0;
    totalAnswered = 0;
    updateScoreDisplay();
}

markers.forEach(marker => {
    marker.addEventListener('click', () => {
        const partKey = marker.dataset.part;
        openPopup(partKey);
    });
});

if (closeQuizPopup) {
    closeQuizPopup.addEventListener('click', closePopup);
}

if (popupCloseBtn) {
    popupCloseBtn.addEventListener('click', closePopup);
}

if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', resetQuiz);
}

if (backHomeBtn) {
    backHomeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

updateScoreDisplay();
