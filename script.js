import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==================== 3D SKELETON VIEWER ====================
const container = document.getElementById("skeleton3dViewer");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1f1f);
scene.fog = new THREE.FogExp2(0x0a1f1f, 0.012);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(2.5, 1.8, 4);
camera.lookAt(0, 1.2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.enableZoom = true;
controls.enablePan = true;
controls.target.set(0, 1.2, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0x446666, 0.5);
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

// Build Detailed 3D Skeleton
const skeletonGroup = new THREE.Group();
const boneMat = new THREE.MeshStandardMaterial({ color: 0xe8ddb0, roughness: 0.35, metalness: 0.08 });
const jointMat = new THREE.MeshStandardMaterial({ color: 0xcfb87a, roughness: 0.4 });

function addBone(parent, p1, p2, radius) {
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
    [0, 1.95, 0], [0, 1.72, 0], [0, 1.49, 0], [0, 1.26, 0],
    [0, 1.03, 0], [0, 0.80, 0], [0, 0.57, 0], [0, 0.34, 0]
];
for (let i = 0; i < spinePoints.length - 1; i++) {
    addBone(skeletonGroup, new THREE.Vector3(...spinePoints[i]), new THREE.Vector3(...spinePoints[i + 1]), 0.09);
}

// Skull
const skullGroup = new THREE.Group();
const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.32, 36, 36), boneMat);
cranium.position.y = 0.07;
skullGroup.add(cranium);
const jaw = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 0.18, 10), boneMat);
jaw.position.set(0, -0.14, 0.12);
skullGroup.add(jaw);
skullGroup.position.set(0, 2.18, 0);
skeletonGroup.add(skullGroup);

// Rib Cage
for (let i = 0; i < 7; i++) {
    const yOff = 1.45 - i * 0.12;
    const radiusArc = 0.55;
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
addBone(skeletonGroup, new THREE.Vector3(-0.52, 1.85, 0), new THREE.Vector3(-0.85, 1.25, 0.08), 0.095);
addBone(skeletonGroup, new THREE.Vector3(-0.85, 1.25, 0.08), new THREE.Vector3(-0.85, 0.72, 0.04), 0.08);
addBone(skeletonGroup, new THREE.Vector3(0.52, 1.85, 0), new THREE.Vector3(0.85, 1.25, 0.08), 0.095);
addBone(skeletonGroup, new THREE.Vector3(0.85, 1.25, 0.08), new THREE.Vector3(0.85, 0.72, 0.04), 0.08);

// Legs
addBone(skeletonGroup, new THREE.Vector3(-0.36, 0.72, 0), new THREE.Vector3(-0.40, 0.20, 0.05), 0.12);
addBone(skeletonGroup, new THREE.Vector3(-0.40, 0.20, 0.05), new THREE.Vector3(-0.40, -0.32, 0.02), 0.095);
addBone(skeletonGroup, new THREE.Vector3(0.36, 0.72, 0), new THREE.Vector3(0.40, 0.20, 0.05), 0.12);
addBone(skeletonGroup, new THREE.Vector3(0.40, 0.20, 0.05), new THREE.Vector3(0.40, -0.32, 0.02), 0.095);

// Pelvis
const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.48, 0.28, 8), boneMat);
pelvis.position.set(0, 0.82, -0.05);
skeletonGroup.add(pelvis);

scene.add(skeletonGroup);

// Grid Helper
const grid = new THREE.GridHelper(5, 20, 0x88aa99, 0x446666);
grid.position.y = -0.65;
scene.add(grid);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});

// ==================== DRAG & DROP SKELETON GAME ====================
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
    const progressBar = document.getElementById('gameProgressBar');
    if (progressBar) progressBar.style.width = `${percentage}%`;
    
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
            
            // Remove bone from palette only for single-use bones
            const draggedBone = Array.from(draggableBones).find(b => b.getAttribute('data-bone') === boneType);
            if (draggedBone && (boneType === 'skull' || boneType === 'ribs' || boneType === 'spine' || boneType === 'pelvis')) {
                draggedBone.style.display = 'none';
            }
            
            updateGameProgress();
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
    
    dropZones.forEach(zone => {
        zone.classList.remove('filled');
        zone.style.background = '';
        zone.style.border = '';
    });
    
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
