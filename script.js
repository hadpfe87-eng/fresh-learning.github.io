import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ==================== 3D SKELETON VIEWER WITH GLB FILE ====================
const container = document.getElementById("skeleton3d-container");
const loadingOverlay = document.getElementById("loading-overlay");

// Setup Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1f1f);
scene.fog = new THREE.FogExp2(0x0a1f1f, 0.012);

// Setup Camera
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(2.5, 1.5, 3.5);
camera.lookAt(0, 1, 0);

// Setup Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;
controls.enableZoom = true;
controls.enablePan = true;
controls.target.set(0, 1, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
mainLight.position.set(2, 3, 2.5);
mainLight.castShadow = true;
scene.add(mainLight);

const fillLight = new THREE.PointLight(0xccaa77, 0.5);
fillLight.position.set(-1, 1.5, 2);
scene.add(fillLight);

const backLight = new THREE.PointLight(0x88aacc, 0.4);
backLight.position.set(0, 1.2, -2.5);
scene.add(backLight);

const rimLight = new THREE.PointLight(0xffaa66, 0.5);
rimLight.position.set(1.5, 1.8, -1.5);
scene.add(rimLight);

// Add subtle grid for reference
const gridHelper = new THREE.GridHelper(5, 20, 0x88aa99, 0x446666);
gridHelper.position.y = -0.8;
scene.add(gridHelper);

// Load your GLB file
const loader = new GLTFLoader();
let skeletonModel = null;

loader.load(
    'lazarosv-skeleton-4068.glb',
    (gltf) => {
        skeletonModel = gltf.scene;
        
        // Adjust model scale and position if needed
        skeletonModel.scale.set(1, 1, 1);
        skeletonModel.position.set(0, -0.5, 0);
        
        // Enable shadows
        skeletonModel.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        
        scene.add(skeletonModel);
        
        // Remove loading overlay
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        
        console.log('✅ 3D Skeleton model loaded successfully!');
    },
    (xhr) => {
        // Loading progress
        const percent = Math.floor((xhr.loaded / xhr.total) * 100);
        if (loadingOverlay) {
            const loadingText = loadingOverlay.querySelector('p');
            if (loadingText) {
                loadingText.innerHTML = `جاري تحميل النموذج... ${percent}%`;
            }
        }
        console.log(`Loading: ${percent}%`);
    },
    (error) => {
        console.error('❌ Error loading 3D model:', error);
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ffaa66;"></i>
                <p style="margin-top: 10px; color: #ffefc0;">فشل تحميل النموذج. تأكد من وجود الملف في المسار الصحيح.</p>
            `;
        }
    }
);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // auto-rotate is handled by controls.autoRotate
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// ==================== BUTTON FUNCTIONALITY ====================

// Button 1: Open Hotspots Game (Lumi exported HTML)
const hotspotsBtn = document.getElementById('openHotspotsGameBtn');
if (hotspotsBtn) {
    hotspotsBtn.addEventListener('click', () => {
        window.open('skeleton-hotspots.html', '_blank');
    });
}

// Button 2: Open Quiz Game (placeholder - will be implemented later)
const quizBtn = document.getElementById('openQuizGameBtn');
if (quizBtn) {
    quizBtn.addEventListener('click', () => {
        alert('لعبة الاختبار قيد الإعداد حالياً. سيتم إضافتها قريباً إن شاء الله!');
        // You can replace the alert with window.open('quiz-game.html', '_blank') when ready
    });
}

console.log('3D Skeleton Viewer with GLB File Ready!');
