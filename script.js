// ==================== 1. MAZE GAME (5 Scientific Questions) ====================
const mazeQuestions = [
    { text: "ما الوظيفة الأساسية للهيكل العظمي في جسم الإنسان؟", options: ["أ حماية الأعضاء الداخلية", "ب إنتاج الدم فقط", "ج مساعدة الجسم على الهضم"], correct: 0, feedback: "أحسنت! الهيكل العظمي يحمي الأعضاء مثل الدماغ والقلب." },
    { text: "أي من هذه العظام يحمي الدماغ؟", options: ["أ الأضلاع", "ب الجمجمة", "ج عظم الفخذ"], correct: 1, feedback: "إجابة صحيحة! الجمجمة تحيط بالدماغ وتحميه من الصدمات." },
    { text: "إلى أي نوع من العظام ينتمي عظم الفخذ؟", options: ["أ عظم طويل", "ب عظم مسطح", "ج عظم قصير"], correct: 0, feedback: "ممتاز! عظم الفخذ من أطول عظام جسم الإنسان." },
    { text: "ما وظيفة القفص الصدري؟", options: ["أ حماية القلب والرئتين", "ب حماية المعدة", "ج حماية الدماغ"], correct: 0, feedback: "صحيح! القفص الصدري يحمي القلب والرئتين." },
    { text: "أي العظام التالية تساعد الجسم على الحركة؟", options: ["أ العظام الطويلة", "ب العظام المسطحة", "ج الأسنان"], correct: 0, feedback: "رائع! العظام الطويلة مثل الفخذ تساعد على الحركة." }
];

let mazeIdx = 0, mazeAnswered = false;

function renderMaze() {
    const q = mazeQuestions[mazeIdx];
    document.getElementById("mazeQuestion").innerHTML = `<strong>❓ ${q.text}</strong>`;
    const optsDiv = document.getElementById("mazeOptions");
    optsDiv.innerHTML = "";
    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.className = "btn-option";
        btn.innerText = opt;
        btn.onclick = () => handleMazeAnswer(i);
        optsDiv.appendChild(btn);
    });
    document.getElementById("mazeFeedback").innerHTML = "";
    document.getElementById("mazeNextBtn").style.display = "none";
    mazeAnswered = false;
}

function handleMazeAnswer(selected) {
    if (mazeAnswered) return;
    const q = mazeQuestions[mazeIdx];
    const fbDiv = document.getElementById("mazeFeedback");
    if (selected === q.correct) {
        fbDiv.innerHTML = `<div class="correct-feedback"><i class="fas fa-star"></i> ${q.feedback}</div>`;
        mazeAnswered = true;
        if (mazeIdx + 1 < mazeQuestions.length) {
            document.getElementById("mazeNextBtn").style.display = "inline-block";
        } else {
            document.getElementById("mazeNextBtn").style.display = "inline-block";
            document.getElementById("mazeNextBtn").innerText = "🏆 إنهاء المتاهة 🏆";
        }
    } else {
        fbDiv.innerHTML = `<div class="wrong-feedback"><i class="fas fa-times-circle"></i> إجابة خاطئة، حاول مجددًا!</div>`;
    }
}

document.getElementById("mazeNextBtn").addEventListener("click", () => {
    if (!mazeAnswered) return;
    if (mazeIdx + 1 < mazeQuestions.length) {
        mazeIdx++;
        renderMaze();
    } else {
        document.getElementById("mazeFinalMsg").innerHTML = `<div class="success-message">🎉 رائع! لقد تمكنت من الخروج من متاهة الهيكل العظمي لأنك عرفت أنواع العظام ووظائفها. 🎉</div>`;
        document.getElementById("mazeNextBtn").style.display = "none";
        document.getElementById("mazeOptions").innerHTML = "";
        document.getElementById("mazeQuestion").innerHTML = "<strong>✨ أكملت المتاهة بنجاح ✨</strong>";
    }
});

renderMaze();

// ==================== 2. PUZZLE GAME (Bone Assembly) ====================
const puzzleData = [
    { name: "🦴 الجمجمة (Skull)", target: "الرأس", placed: false, id: 0 },
    { name: "🦴 الأضلاع (Ribs)", target: "الصدر", placed: false, id: 1 },
    { name: "🦴 العمود الفقري (Spine)", target: "الظهر", placed: false, id: 2 },
    { name: "🦴 عظم الفخذ (Femur)", target: "الساق", placed: false, id: 3 }
];

let puzzleCompleted = false;

function renderPuzzle() {
    const bonesDiv = document.getElementById("bonesList");
    bonesDiv.innerHTML = "";
    puzzleData.forEach(bone => {
        if (!bone.placed) {
            const dragEl = document.createElement("div");
            dragEl.className = "drag-bone";
            dragEl.innerHTML = `<i class="fas fa-hand-pointer"></i> ${bone.name}`;
            dragEl.onclick = () => tryPlaceBone(bone.id);
            bonesDiv.appendChild(dragEl);
        }
    });
    
    const slotsDiv = document.getElementById("slotsContainer");
    slotsDiv.innerHTML = "";
    const targets = ["الرأس", "الصدر", "الظهر", "الساق"];
    targets.forEach(target => {
        const placedBone = puzzleData.find(b => b.target === target && b.placed);
        const slotDiv = document.createElement("div");
        slotDiv.className = "slot";
        if (placedBone) slotDiv.classList.add("correct-placed");
        slotDiv.innerHTML = `<i class="fas fa-map-pin"></i> ${target} : ${placedBone ? placedBone.name : "⬜ فارغ"}`;
        slotsDiv.appendChild(slotDiv);
    });
    
    const allPlaced = puzzleData.every(b => b.placed);
    if (allPlaced && !puzzleCompleted) {
        puzzleCompleted = true;
        document.getElementById("puzzleSuccessMsg").innerHTML = `<div class="success-message">🎉 أحسنت! لقد تمكنت من إعادة بناء الهيكل العظمي بالكامل. 🎉</div>`;
    } else if (!allPlaced) {
        document.getElementById("puzzleSuccessMsg").innerHTML = "";
    }
}

function tryPlaceBone(id) {
    if (puzzleCompleted) return;
    const bone = puzzleData.find(b => b.id === id);
    if (!bone || bone.placed) return;
    
    let expected = "";
    if (bone.id === 0) expected = "الرأس";
    if (bone.id === 1) expected = "الصدر";
    if (bone.id === 2) expected = "الظهر";
    if (bone.id === 3) expected = "الساق";
    
    if (bone.target === expected) {
        bone.placed = true;
        renderPuzzle();
    } else {
        alert(`❌ المكان الخطأ! العظم ${bone.name} يجب أن يوضع في ${bone.target}.`);
    }
}

document.getElementById("resetPuzzleBtn").addEventListener("click", () => {
    puzzleData.forEach(b => { b.placed = false; });
    puzzleCompleted = false;
    renderPuzzle();
});

renderPuzzle();

// ==================== 3. SPEED CHALLENGE GAME ====================
const challengeQs = [
    { text: "كم نوعًا رئيسيًا من العظام درسنا؟", options: ["أ نوعان", "ب ثلاثة أنواع", "ج أربعة أنواع"], correct: 1, feedback: "صحيح! ثلاثة أنواع: طويلة، مسطحة، قصيرة." },
    { text: "أي من هذه العظام مسطح؟", options: ["أ الجمجمة", "ب عظم الفخذ", "ج عظام الرسغ"], correct: 0, feedback: "الجمجمة هي عظم مسطح! ممتاز." },
    { text: "ما وظيفة العمود الفقري؟", options: ["أ حماية الدماغ", "ب دعم الجسم ومساعدته على الحركة", "ج حماية القلب فقط"], correct: 1, feedback: "العمود الفقري يدعم الجسم ويساعد على الحركة." }
];

let challengeIndex = 0, challengeScore = 0, challengeAnsweredFlag = false, challengeFinished = false;

function renderChallenge() {
    if (challengeFinished) return;
    const q = challengeQs[challengeIndex];
    document.getElementById("challengeQText").innerHTML = `<strong>${q.text}</strong>`;
    const optsDiv = document.getElementById("challengeOptionsDiv");
    optsDiv.innerHTML = "";
    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.className = "btn-option";
        btn.innerText = opt;
        btn.onclick = () => handleChallengeAnswer(i);
        optsDiv.appendChild(btn);
    });
    document.getElementById("challengeFeedback").innerHTML = "";
    challengeAnsweredFlag = false;
    document.getElementById("challengeScore").innerHTML = `⭐ ${challengeScore}/${challengeQs.length}`;
}

function handleChallengeAnswer(selected) {
    if (challengeFinished || challengeAnsweredFlag) return;
    const q = challengeQs[challengeIndex];
    if (selected === q.correct) {
        challengeScore++;
        document.getElementById("challengeFeedback").innerHTML = `<div class="correct-feedback">✅ ${q.feedback}</div>`;
        challengeAnsweredFlag = true;
        if (challengeIndex + 1 < challengeQs.length) {
            challengeIndex++;
            renderChallenge();
        } else {
            challengeFinished = true;
            document.getElementById("challengeFinalMsg").innerHTML = `<div class="success-message">🏆 أحسنت! التحدي السريع بنتيجة ${challengeScore}/${challengeQs.length} 🏆</div>`;
            document.getElementById("challengeOptionsDiv").innerHTML = "";
            document.getElementById("challengeQText").innerHTML = "🎉 نهاية التحدي السريع! 🎉";
        }
    } else {
        document.getElementById("challengeFeedback").innerHTML = `<div class="wrong-feedback">❌ إجابة خاطئة! حاول مرة أخرى.</div>`;
    }
}

document.getElementById("resetChallengeBtn").addEventListener("click", () => {
    challengeIndex = 0;
    challengeScore = 0;
    challengeFinished = false;
    challengeAnsweredFlag = false;
    renderChallenge();
    document.getElementById("challengeFinalMsg").innerHTML = "";
});

renderChallenge();

// ==================== 4. EXPLORATION QUESTIONS (with Open 3D Model) ====================
const exploreQs = [
    { text: "انظر إلى رأس الهيكل العظمي في النموذج ثلاثي الأبعاد. ما اسم العظم الذي يحمي الدماغ؟", options: ["أ الأضلاع", "ب الجمجمة", "ج العمود الفقري"], correct: 1, feedback: "الجمجمة تحيط بالدماغ وتحميه من الصدمات. يمكنك تدوير النموذج لرؤيتها من جميع الزوايا!" },
    { text: "قم بتدوير النموذج وانظر إلى منطقة الصدر. ما اسم العظام التي تحمي القلب والرئتين؟", options: ["أ عظام الساق", "ب القفص الصدري", "ج عظام اليد"], correct: 1, feedback: "القفص الصدري يحمي القلب والرئتين بشكل ممتاز! استخدم زر الفأرة لتدوير النموذج." },
    { text: "انظر إلى الظهر في النموذج. ما العظم الذي يدعم الجسم ويساعده على الحركة؟", options: ["أ العمود الفقري", "ب الجمجمة", "ج عظام القدم"], correct: 0, feedback: "العمود الفقري هو عمود الجسم الحقيقي! يتكون من العديد من الفقرات." },
    { text: "انظر إلى الساق في النموذج. ما نوع عظم الفخذ؟", options: ["أ عظم طويل", "ب عظم مسطح", "ج عظم قصير"], correct: 0, feedback: "عظم الفخذ هو أطول عظم طويل في الجسم. يمكنك رؤيته بوضوح في النموذج." }
];

let exploreIdx = 0, exploreAnswered = false, exploreComplete = false;

function renderExploreQuestion() {
    if (exploreComplete) return;
    const q = exploreQs[exploreIdx];
    document.getElementById("exploreQuestion").innerHTML = `<strong>🔍 ${q.text}</strong>`;
    const optsDiv = document.getElementById("exploreOptions");
    optsDiv.innerHTML = "";
    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.className = "btn-option";
        btn.innerText = opt;
        btn.onclick = () => handleExploreAnswer(i);
        optsDiv.appendChild(btn);
    });
    document.getElementById("exploreFeedback").innerHTML = "";
    document.getElementById("exploreNextBtn").style.display = "none";
    exploreAnswered = false;
}

function handleExploreAnswer(selected) {
    if (exploreComplete || exploreAnswered) return;
    const q = exploreQs[exploreIdx];
    if (selected === q.correct) {
        document.getElementById("exploreFeedback").innerHTML = `<div class="correct-feedback">🎉 ${q.feedback}</div>`;
        exploreAnswered = true;
        if (exploreIdx + 1 < exploreQs.length) {
            document.getElementById("exploreNextBtn").style.display = "inline-block";
        } else {
            document.getElementById("exploreNextBtn").style.display = "inline-block";
            document.getElementById("exploreNextBtn").innerText = "🎁 إنهاء الاستكشاف";
        }
    } else {
        document.getElementById("exploreFeedback").innerHTML = `<div class="wrong-feedback">❌ حاول مجددًا، راقب النموذج ثلاثي الأبعاد جيدًا واستخدم خاصية التدوير!</div>`;
    }
}

document.getElementById("exploreNextBtn").addEventListener("click", () => {
    if (!exploreAnswered) return;
    if (exploreIdx + 1 < exploreQs.length) {
        exploreIdx++;
        renderExploreQuestion();
    } else {
        exploreComplete = true;
        document.getElementById("exploreFinalMsg").innerHTML = `<div class="success-message">🎉 أحسنت! لقد تمكنت من استكشاف الهيكل العظمي والتعرف على العظام ووظائفها باستخدام النموذج ثلاثي الأبعاد. 🎉</div>`;
        document.getElementById("exploreNextBtn").style.display = "none";
        document.getElementById("exploreOptions").innerHTML = "";
        document.getElementById("exploreQuestion").innerHTML = "✨ إتقان علم العظام! ✨";
    }
});

renderExploreQuestion();
