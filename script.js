import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

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

// ==================== 4. EXPLORATION QUIZ ====================
const exploreQs = [
    { text: "انظر إلى رأس الهيكل العظمي. ما اسم العظم الذي يحمي الدماغ؟", options: ["أ الأضلاع", "ب الجمجمة", "ج العمود الفقري"], correct: 1, feedback: "الجمجمة تحيط بالدماغ وتحميه من الصدمات." },
    { text: "قم بتدوير النموذج وانظر إلى منطقة الصدر. ما اسم العظام التي تحمي القلب والرئتين؟", options: ["أ عظام الساق", "ب القفص الصدري", "ج عظام اليد"], correct: 1, feedback: "القفص الصدري يحمي القلب والرئتين بشكل ممتاز!" },
    { text: "انظر إلى الظهر. ما العظم الذي يدعم الجسم ويساعده على الحركة؟", options: ["أ العمود الفقري", "ب الجمجمة", "ج عظام القدم"], correct: 0, feedback: "العمود الفقري هو عمود الجسم الحقيقي!" },
    { text: "انظر إلى الساق. ما نوع عظم الفخذ؟", options: ["أ عظم طويل", "ب عظم مسطح", "ج عظم قصير"], correct: 0, feedback: "عظم الفخذ هو أطول عظم طويل في الجسم." }
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
        document.getElementById("exploreFeedback").innerHTML = `<div class="wrong-feedback">❌ حاول مجددًا، راقب النموذج ثلاثي الأبعاد جيدًا!</div>`;
    }
}

document.getElementById("exploreNextBtn").addEventListener("click", () => {
    if (!exploreAnswered) return;
    if (exploreIdx + 1 < exploreQs.length) {
        exploreIdx++;
        renderExploreQuestion();
    } else {
        exploreComplete = true;
        document.getElementById("exploreFinalMsg").innerHTML = `<div class="success-message">🎉 أحسنت! استكشاف رائع للهيكل العظمي المتقدم 🎉</div>`;
        document.getElementById("exploreNextBtn").style.display = "none";
        document.getElementById("exploreOptions").innerHTML = "";
        document.getElementById("exploreQuestion").innerHTML = "✨ إتقان علم العظام! ✨";
    }
});

renderExploreQuestion();

// ==================== 5. ADVANCED 3D SKELETON ====================
const container = document.getElementById("advancedSkeletonViewer");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x071a1a);
scene.fog = new THREE.FogExp2(0x071a1a, 0.018);

const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(2.2, 1.6, 3.8);
camera.lookAt(0, 1.0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;
controls.enableZoom = true;
controls.enablePan = true;
controls.target.set(0, 1.1, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0x446666, 0.45);
scene.add(ambientLight);
const mainLight = new THREE.DirectionalLight(0xffeebb, 1.2);
mainLight.position.set(2, 3, 2.5);
mainLight.castShadow = true;
scene.add(mainLight);
const backLight = new THREE.PointLight(0xccaa77, 0.5);
backLight.position.set(-1, 1.2, -2);
scene.add(backLight);
const fillLight = new THREE.PointLight(0x77aacc, 0.4);
fillLight.position.set(1, 1.5, 1.8);
scene.add(fillLight);

// Build Advanced Skeleton
const skeletonGroup = new THREE.Group();
const boneMat = new THREE.MeshStandardMaterial({ color: 0xe8ddb0, roughness: 0.35, metalness: 0.08 });
const jointMat = new THREE.MeshStandardMaterial({ color: 0xcfb87a, roughness: 0.4 });

function addBoneDetailed(parent, p1, p2, radius) {
    const start = new THREE.Vector3(p1.x, p1.y, p1.z);
    const end = new THREE.Vector3(p2.x, p2.y, p2.z);
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const center = start.clone().add(end).multiplyScalar(0.5);
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 12), boneMat);
    cylinder.position.copy(center);
    cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    parent.add(cylinder);
    const cap1 = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.2, 8, 8), jointMat);
    cap1.position.copy(start);
    const cap2 = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.2, 8, 8), jointMat);
    cap2.position.copy(end);
    parent.add(cap1);
    parent.add(cap2);
}

// Spine
const spinePoints = [
    [0, 1.92, 0], [0, 1.68, 0], [0, 1.44, 0], [0, 1.20, 0],
    [0, 0.96, 0], [0, 0.72, 0], [0, 0.48, 0], [0, 0.24, 0]
];
for (let i = 0; i < spinePoints.length - 1; i++) {
    addBoneDetailed(skeletonGroup, new THREE.Vector3(...spinePoints[i]), new THREE.Vector3(...spinePoints[i + 1]), 0.095);
}

// Skull
const skullGroup = new THREE.Group();
const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.32, 36, 36), boneMat);
cranium.position.y = 0.07;
skullGroup.add(cranium);
const jaw = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 0.18, 10), boneMat);
jaw.position.set(0, -0.14, 0.12);
skullGroup.add(jaw);
skullGroup.position.set(0, 2.15, 0);
skeletonGroup.add(skullGroup);

// Rib Cage
for (let i = 0; i < 8; i++) {
    const yOff = 1.35 - i * 0.11;
    const radiusArc = 0.58;
    const rib = new THREE.Mesh(new THREE.TorusGeometry(radiusArc, 0.06, 12, 42, Math.PI), boneMat);
    rib.rotation.x = 0.25;
    rib.rotation.z = 0.1;
    rib.position.set(0, yOff, 0.08);
    skeletonGroup.add(rib);
    const rib2 = new THREE.Mesh(new THREE.TorusGeometry(radiusArc, 0.06, 12, 42, Math.PI), boneMat);
    rib2.rotation.x = -0.25;
    rib2.rotation.z = 0.1;
    rib2.position.set(0, yOff, 0.08);
    skeletonGroup.add(rib2);
}

// Arms
addBoneDetailed(skeletonGroup, new THREE.Vector3(-0.55, 1.82, 0), new THREE.Vector3(-0.88, 1.22, 0.08), 0.1);
addBoneDetailed(skeletonGroup, new THREE.Vector3(-0.88, 1.22, 0.08), new THREE.Vector3(-0.88, 0.68, 0.04), 0.085);
addBoneDetailed(skeletonGroup, new THREE.Vector3(0.55, 1.82, 0), new THREE.Vector3(0.88, 1.22, 0.08), 0.1);
addBoneDetailed(skeletonGroup, new THREE.Vector3(0.88, 1.22, 0.08), new THREE.Vector3(0.88, 0.68, 0.04), 0.085);

// Legs
addBoneDetailed(skeletonGroup, new THREE.Vector3(-0.38, 0.70, 0), new THREE.Vector3(-0.42, 0.18, 0.05), 0.125);
addBoneDetailed(skeletonGroup, new THREE.Vector3(-0.42, 0.18, 0.05), new THREE.Vector3(-0.42, -0.35, 0.02), 0.1);
addBoneDetailed(skeletonGroup, new THREE.Vector3(0.38, 0.70, 0), new THREE.Vector3(0.42, 0.18, 0.05), 0.125);
addBoneDetailed(skeletonGroup, new THREE.Vector3(0.42, 0.18, 0.05), new THREE.Vector3(0.42, -0.35, 0.02), 0.1);

// Pelvis
const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.28, 8), boneMat);
pelvis.position.set(0, 0.78, -0.06);
skeletonGroup.add(pelvis);

scene.add(skeletonGroup);

// Grid Helper
const grid = new THREE.GridHelper(5, 20, 0x88aa99, 0x446666);
grid.position.y = -0.7;
scene.add(grid);

// CSS2D Label
const labelDiv = document.createElement('div');
labelDiv.textContent = '🦴 الهيكل العظمي البشري 🦴';
labelDiv.style.backgroundColor = 'rgba(0,0,0,0.6)';
labelDiv.style.color = '#ffdd99';
labelDiv.style.padding = '4px 12px';
labelDiv.style.borderRadius = '40px';
labelDiv.style.fontSize = '12px';
labelDiv.style.fontWeight = 'bold';
labelDiv.style.fontFamily = 'Cairo';
const labelObj = new CSS2DObject(labelDiv);
labelObj.position.set(0, 2.55, 0);
scene.add(labelObj);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(container.clientWidth, container.clientHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
});
