// ==================== 1. MAZE GAME ====================
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
        document.getElementById("mazeFinalMsg").innerHTML = `<div class="success-message">🎉 رائع! لقد تمكنت من الخروج من متاهة الهيكل العظمي! 🎉</div>`;
        document.getElementById("mazeNextBtn").style.display = "none";
        document.getElementById("mazeOptions").innerHTML = "";
        document.getElementById("mazeQuestion").innerHTML = "<strong>✨ أكملت المتاهة بنجاح ✨</strong>";
    }
});

renderMaze();

// ==================== 2. PUZZLE GAME ====================
const puzzleData = [
    { name: "🦴 الجمجمة", target: "الرأس", placed: false, id: 0 },
    { name: "🦴 الأضلاع", target: "الصدر", placed: false, id: 1 },
    { name: "🦴 العمود الفقري", target: "الظهر", placed: false, id: 2 },
    { name: "🦴 عظم الفخذ", target: "الساق", placed: false, id: 3 }
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
        document.getElementById("puzzleSuccessMsg").innerHTML = `<div class="success-message">🎉 أحسنت! لقد تمكنت من إعادة بناء الهيكل العظمي بالكامل! 🎉</div>`;
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

// ==================== 3. SPEED CHALLENGE ====================
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

// ==================== 4. DRAG & DROP SKELETON GAME ====================
// Track placed bones (with multiple counts for left/right)
let placedCounts = {
    skull: false,
    ribs: false,
    spine: false,
    pelvis: false,
    femur: 0,
    humerus: 0
};

const totalBones = {
    skull: 1,
    ribs: 1,
    spine: 1,
    pelvis: 1,
    femur: 2,
    humerus: 2
};

function updateGameProgress() {
    let completed = 0;
    let total = 0;
    
    for (let bone in totalBones) {
        total += totalBones[bone];
        if (bone === 'femur') completed += placedCounts.femur;
        else if (bone === 'humerus') completed += placedCounts.humerus;
        else completed += placedCounts[bone] ? 1 : 0;
    }
    
    const percentage = (completed / total) * 100;
    document.getElementById('gameProgressBar').style.width = `${percentage}%`;
    
    const feedbackDiv = document.getElementById('gameFeedbackMessage');
    if (completed === total) {
        feedbackDiv.innerHTML = '<div class="success-message">🎉 أحسنت! لقد أكملت بناء الهيكل العظمي بنجاح! 🎉</div>';
    } else {
        feedbackDiv.innerHTML = `<span style="color:#ffd966;">✨ تقدمك: ${completed} من ${total} عظمة تم تركيبها بشكل صحيح ✨</span>`;
    }
}

// Setup drag and drop
const draggableBones = document.querySelectorAll('.bone-card-drag');
const dropZones = document.querySelectorAll('.drop-zone-game');

draggableBones.forEach(bone => {
    bone.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', bone.getAttribute('data-bone'));
        e.dataTransfer.effectAllowed = 'copy';
        bone.classList.add('dragging');
    });
    
    bone.addEventListener('dragend', () => {
        bone.classList.remove('dragging');
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        zone.classList.add('active-drop');
    });
    
    zone.addEventListener('dragleave', () => {
        zone.classList.remove('active-drop');
    });
    
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('active-drop');
        
        // Don't allow dropping if already filled
        if (zone.classList.contains('filled')) {
            const feedbackDiv = document.getElementById('gameFeedbackMessage');
            feedbackDiv.innerHTML = '<div class="wrong-feedback">⚠️ هذا المكان ممتلئ بالفعل!</div>';
            setTimeout(() => updateGameProgress(), 1500);
            return;
        }
        
        const boneType = e.dataTransfer.getData('text/plain');
        const expectedType = zone.getAttribute('data-expected');
        
        let isValid = false;
        
        if (boneType === expectedType) {
            if (boneType === 'femur' && placedCounts.femur < 2) {
                isValid = true;
                placedCounts.femur++;
            } else if (boneType === 'humerus' && placedCounts.humerus < 2) {
                isValid = true;
                placedCounts.humerus++;
            } else if (boneType !== 'femur' && boneType !== 'humerus' && !placedCounts[boneType]) {
                isValid = true;
                placedCounts[boneType] = true;
            } else {
                isValid = false;
            }
        }
        
        if (isValid) {
            zone.classList.add('filled');
            zone.style.background = '#3c8868';
            zone.style.border = '2px solid #ffde9c';
            
            // Remove the bone from palette
            const draggedBone = Array.from(draggableBones).find(b => b.getAttribute('data-bone') === boneType);
            if (draggedBone && (boneType === 'skull' || boneType === 'ribs' || boneType === 'spine' || boneType === 'pelvis')) {
                draggedBone.style.display = 'none';
            }
            
            updateGameProgress();
            
            // Check if game is complete
            let completed = 0;
            let total = 0;
            for (let b in totalBones) {
                total += totalBones[b];
                if (b === 'femur') completed += placedCounts.femur;
                else if (b === 'humerus') completed += placedCounts.humerus;
                else completed += placedCounts[b] ? 1 : 0;
            }
            
            if (completed === total) {
                const feedbackDiv = document.getElementById('gameFeedbackMessage');
                feedbackDiv.innerHTML = '<div class="success-message">🎉 مبروك! لقد أكملت بناء الهيكل العظمي بنجاح! 🎉</div>';
            }
        } else {
            const feedbackDiv = document.getElementById('gameFeedbackMessage');
            feedbackDiv.innerHTML = '<div class="wrong-feedback">❌ مكان خاطئ! حاول وضع العظم في المكان الصحيح.</div>';
            setTimeout(() => updateGameProgress(), 1500);
        }
    });
});

// Reset Game Function
function resetDragDropGame() {
    placedCounts = {
        skull: false,
        ribs: false,
        spine: false,
        pelvis: false,
        femur: 0,
        humerus: 0
    };
    
    // Reset all drop zones
    dropZones.forEach(zone => {
        zone.classList.remove('filled');
        zone.style.background = '';
        zone.style.border = '';
    });
    
    // Show all bone cards again
    draggableBones.forEach(bone => {
        bone.style.display = 'inline-flex';
    });
    
    updateGameProgress();
    
    const feedbackDiv = document.getElementById('gameFeedbackMessage');
    feedbackDiv.innerHTML = '<span style="color:#ffd966;">✨ تم إعادة اللعبة! اسحب العظام إلى أماكنها الصحيحة ✨</span>';
    setTimeout(() => updateGameProgress(), 2000);
}

const resetBtn = document.getElementById('resetDragDropGame');
if (resetBtn) {
    resetBtn.addEventListener('click', resetDragDropGame);
}

// Initialize progress
updateGameProgress();
