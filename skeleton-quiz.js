const quizParts = {
    skull: {
        label: 'الجمجمة',
        question: 'ما اسم هذا الجزء الذي يحمي الدماغ؟',
        options: ['العظام الطويلة', 'الجمجمة', 'عظمة القص'],
        answer: 'الجمجمة',
        info: 'الجمجمة تحمي الدماغ وتدعم عظام الوجه. هي الجزء العلوي من الهيكل العظمي وتحتوي على فك علوي وسفلي.'
    },
    ribs: {
        label: 'القفص الصدري',
        question: 'ما اسم هذا الجزء الذي يحمي القلب والرئتين؟',
        options: ['الفقرات', 'عظام الرسغ', 'القفص الصدري'],
        answer: 'القفص الصدري',
        info: 'القفص الصدري يحمي القلب والرئتين ويساعد في التنفس. يتكون من الأضلاع والقص ويشكل بنية داعمة للجزء العلوي من الجسم.'
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

const questionOrder = ['skull', 'ribs', 'pelvis', 'femur', 'hand'];
let currentPartKey = null;
let currentMarker = null;
let score = 0;
let totalAnswered = 0;
let hasAnswered = false;

function updateScoreDisplay() {
    quizScoreEl.textContent = score;
    quizTotalEl.textContent = totalAnswered;
}

function openPopup(partKey, marker) {
    const part = quizParts[partKey];
    if (!part) return;
    currentPartKey = partKey;
    currentMarker = marker;
    hasAnswered = false;
    const questionNumber = questionOrder.indexOf(partKey) + 1;
    popupTitle.textContent = `السؤال رقم ${questionNumber}`;
    popupQuestion.textContent = part.question;
    optionsContainer.innerHTML = '';
    quizFeedback.classList.add('hidden');
    popupCloseBtn.classList.add('hidden');

    if (currentMarker) {
        markers.forEach(m => m.classList.remove('active'));
        currentMarker.classList.add('active');

        const markerRect = currentMarker.getBoundingClientRect();
        const containerRect = document.querySelector('.skeleton-image-panel').getBoundingClientRect();
        const side = markerRect.left < containerRect.left + containerRect.width / 2 ? 'slide-right' : 'slide-left';
        popup.classList.remove('slide-left', 'slide-right');
        popup.classList.add(side);

        const markerCenter = markerRect.top + markerRect.height / 2;
        const top = Math.min(Math.max(markerCenter, 140), window.innerHeight - 140);
        popup.style.setProperty('--dialog-top', `${top}px`);
    }

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
    if (currentMarker) {
        currentMarker.classList.remove('active');
        currentMarker = null;
    }
    popup.classList.remove('slide-left', 'slide-right');
    popup.style.removeProperty('--dialog-top');
}

function resetQuiz() {
    score = 0;
    totalAnswered = 0;
    updateScoreDisplay();
}

markers.forEach(marker => {
    marker.addEventListener('click', () => {
        const partKey = marker.dataset.part;
        openPopup(partKey, marker);
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
