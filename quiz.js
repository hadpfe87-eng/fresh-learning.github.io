// ==================== QUIZ GAME ====================
const quizQuestions = [
    {
        text: "ما الوظيفة الأساسية للهيكل العظمي في جسم الإنسان؟",
        options: ["أ - حماية الأعضاء الداخلية", "ب - إنتاج الدم فقط", "ج - مساعدة الجسم على الهضم"],
        correct: 0,
        feedback: "أحسنت! الهيكل العظمي يحمي الأعضاء الحيوية مثل الدماغ والقلب والرئتين."
    },
    {
        text: "أي من هذه العظام يحمي الدماغ؟",
        options: ["أ - الأضلاع", "ب - الجمجمة", "ج - عظم الفخذ"],
        correct: 1,
        feedback: "إجابة صحيحة! الجمجمة تحيط بالدماغ وتحميه من الصدمات."
    },
    {
        text: "إلى أي نوع من العظام ينتمي عظم الفخذ؟",
        options: ["أ - عظم طويل", "ب - عظم مسطح", "ج - عظم قصير"],
        correct: 0,
        feedback: "ممتاز! عظم الفخذ هو أطول وأقوى عظمة في جسم الإنسان."
    },
    {
        text: "ما وظيفة القفص الصدري؟",
        options: ["أ - حماية القلب والرئتين", "ب - حماية المعدة", "ج - حماية الدماغ"],
        correct: 0,
        feedback: "صحيح! القفص الصدري يشكل درعاً واقياً للقلب والرئتين."
    },
    {
        text: "أي العظام التالية تساعد الجسم على الحركة؟",
        options: ["أ - العظام الطويلة", "ب - العظام المسطحة", "ج - الأسنان"],
        correct: 0,
        feedback: "رائع! العظام الطويلة مثل عظم الفخذ والعضد تساعد في حركة الجسم."
    },
    {
        text: "كم نوعًا رئيسيًا من العظام درسنا؟",
        options: ["أ - نوعان", "ب - ثلاثة أنواع", "ج - أربعة أنواع"],
        correct: 1,
        feedback: "صحيح! ثلاثة أنواع: العظام الطويلة، العظام المسطحة، والعظام القصيرة."
    },
    {
        text: "أي من هذه العظام تعتبر عظمة مسطحة؟",
        options: ["أ - الجمجمة", "ب - عظم الفخذ", "ج - عظام الرسغ"],
        correct: 0,
        feedback: "الجمجمة هي عظم مسطح! العظام المسطحة تحمي الأعضاء الحيوية."
    },
    {
        text: "ما وظيفة العمود الفقري؟",
        options: ["أ - حماية الدماغ", "ب - دعم الجسم ومساعدته على الحركة", "ج - حماية القلب فقط"],
        correct: 1,
        feedback: "العمود الفقري يدعم الجسم ويساعد على الحركة، ويحمي الحبل الشوكي."
    }
];

let currentQuestionIndex = 0;
let userScore = 0;
let quizActive = true;
let answered = false;

function renderQuiz() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    
    if (currentQuestionIndex >= quizQuestions.length) {
        // Quiz completed
        const totalQuestions = quizQuestions.length;
        const percentage = Math.round((userScore / totalQuestions) * 100);
        let message = "";
        let title = "";
        
        if (userScore === totalQuestions) {
            title = "🏆 خبير العظام! 🏆";
            message = "ممتاز! لقد حصلت على الدرجة الكاملة. أنت خبير حقيقي في علم العظام!";
        } else if (userScore >= totalQuestions - 2) {
            title = "🎉 ممتاز! 🎉";
            message = `أحسنت! لقد أجبت على ${userScore} من ${totalQuestions} إجابة صحيحة. معرفتك بالعظام رائعة!`;
        } else if (userScore >= totalQuestions / 2) {
            title = "👍 جيد جداً! 👍";
            message = `لقد أجبت على ${userScore} من ${totalQuestions} إجابة صحيحة. واصل التعلم وستصبح خبيراً قريباً!`;
        } else {
            title = "📚 واصل التعلم! 📚";
            message = `لقد أجبت على ${userScore} من ${totalQuestions} إجابة صحيحة. لا تيأس، استخدم النموذج ثلاثي الأبعاد على اليسار للمساعدة في التعلم!`;
        }
        
        container.innerHTML = `
            <div class="quiz-result">
                <h3>${title}</h3>
                <p>النتيجة النهائية:</p>
                <div class="score-highlight">${userScore} / ${totalQuestions}</div>
                <p>${message}</p>
                <div class="quiz-buttons" style="margin-top: 1.5rem;">
                    <button id="retryQuizBtn" class="quiz-btn quiz-btn-primary"><i class="fas fa-redo-alt"></i> إعادة الاختبار</button>
                    <button id="closeQuizResultBtn" class="quiz-btn quiz-btn-secondary"><i class="fas fa-times"></i> إغلاق</button>
                </div>
            </div>
        `;
        
        document.getElementById('retryQuizBtn')?.addEventListener('click', resetQuiz);
        document.getElementById('closeQuizResultBtn')?.addEventListener('click', () => {
            document.getElementById('quizModal')?.classList.add('hidden');
        });
        return;
    }
    
    const q = quizQuestions[currentQuestionIndex];
    
    container.innerHTML = `
        <div class="quiz-stats-bar">
            <span class="quiz-score"><i class="fas fa-star"></i> النقاط: ${userScore}</span>
            <span class="quiz-question-counter">السؤال ${currentQuestionIndex + 1} من ${quizQuestions.length}</span>
        </div>
        <div class="quiz-question">❓ ${q.text}</div>
        <div class="quiz-options" id="quizOptions">
            ${q.options.map((opt, i) => `
                <button class="quiz-option-btn" data-index="${i}">${opt}</button>
            `).join('')}
        </div>
        <div id="quizFeedback" class="quiz-feedback"></div>
        <div class="quiz-buttons">
            <button id="nextQuizBtn" class="quiz-btn quiz-btn-primary" style="display: none;"><i class="fas fa-arrow-left"></i> السؤال التالي</button>
            <button id="helpQuizBtn" class="quiz-btn quiz-btn-secondary"><i class="fas fa-lightbulb"></i> مساعدة</button>
            <button id="retryQuizBtn" class="quiz-btn quiz-btn-secondary"><i class="fas fa-redo-alt"></i> إعادة المحاولة</button>
        </div>
    `;
    
    // Add event listeners to options
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
    });
    
    document.getElementById('helpQuizBtn')?.addEventListener('click', showHelp);
    document.getElementById('retryQuizBtn')?.addEventListener('click', resetQuiz);
    
    answered = false;
}

function handleAnswer(selectedIndex) {
    if (!quizActive || answered) return;
    
    const q = quizQuestions[currentQuestionIndex];
    const isCorrect = (selectedIndex === q.correct);
    const feedbackDiv = document.getElementById('quizFeedback');
    
    if (isCorrect) {
        userScore++;
        feedbackDiv.className = 'quiz-feedback correct';
        feedbackDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${q.feedback}`;
    } else {
        const correctAnswer = q.options[q.correct];
        feedbackDiv.className = 'quiz-feedback wrong';
        feedbackDiv.innerHTML = `<i class="fas fa-times-circle"></i> إجابة خاطئة! الإجابة الصحيحة هي: ${correctAnswer}<br>${q.feedback}`;
    }
    
    answered = true;
    
    // Disable all option buttons
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.style.opacity = '0.6';
        btn.style.cursor = 'default';
        btn.disabled = true;
    });
    
    // Show next button
    const nextBtn = document.getElementById('nextQuizBtn');
    if (nextBtn) {
        nextBtn.style.display = 'inline-block';
        nextBtn.addEventListener('click', nextQuestion);
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    answered = false;
    renderQuiz();
}

function showHelp() {
    const helpText = `
        <div class="help-tip">
            <i class="fas fa-lightbulb"></i> نصيحة: 
            يمكنك استخدام النموذج ثلاثي الأبعاد على اليسار لتدويره وتكبير العظام!
            تأكد من قراءة كل سؤال بعناية قبل الإجابة.
        </div>
    `;
    const feedbackDiv = document.getElementById('quizFeedback');
    if (feedbackDiv && !answered) {
        feedbackDiv.innerHTML = helpText;
        feedbackDiv.style.background = 'rgba(244, 185, 66, 0.2)';
        feedbackDiv.style.borderRadius = '40px';
        setTimeout(() => {
            if (feedbackDiv.innerHTML === helpText && !answered) {
                feedbackDiv.innerHTML = '';
                feedbackDiv.style.background = '';
            }
        }, 3000);
    }
}

function resetQuiz() {
    currentQuestionIndex = 0;
    userScore = 0;
    quizActive = true;
    answered = false;
    renderQuiz();
}

// Initialize quiz when modal opens
const openQuizBtn = document.getElementById('openQuizGameBtn');
if (openQuizBtn) {
    openQuizBtn.addEventListener('click', () => {
        resetQuiz();
    });
}

// Also reset when modal is opened via any other method
const quizModal = document.getElementById('quizModal');
if (quizModal) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (!quizModal.classList.contains('hidden')) {
                    resetQuiz();
                }
            }
        });
    });
    observer.observe(quizModal, { attributes: true });
}
