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

// Setup Camera - Positioned for a centered, larger view
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 1.2, 2.8);
camera.lookAt(0, 1, 0);

// Setup Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Controls - Configured for optimal viewing
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.enableZoom = true;
controls.zoomSpeed = 1.2;
controls.enablePan = true;
controls.panSpeed = 0.8;
controls.target.set(0, 1, 0);

// Lighting - Enhanced for better visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xfff5e0, 1.3);
mainLight.position.set(2, 3, 2.5);
mainLight.castShadow = true;
scene.add(mainLight);

const fillLight = new THREE.PointLight(0xccaa77, 0.6);
fillLight.position.set(-1, 1.8, 2);
scene.add(fillLight);

const backLight = new THREE.PointLight(0x88aacc, 0.5);
backLight.position.set(0, 1.2, -2.8);
scene.add(backLight);

const rimLight = new THREE.PointLight(0xffaa66, 0.6);
rimLight.position.set(1.8, 1.5, -1.8);
scene.add(rimLight);

const bottomLight = new THREE.PointLight(0xaa8866, 0.4);
bottomLight.position.set(0, -0.5, 0);
scene.add(bottomLight);

// Add subtle grid for reference (optional - can be removed if distracting)
const gridHelper = new THREE.GridHelper(4, 16, 0x88aa99, 0x446666);
gridHelper.position.y = -0.9;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.4;
scene.add(gridHelper);

// Add a subtle ground shadow catcher
const groundPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(3.5, 3.5),
    new THREE.ShadowMaterial({ opacity: 0.3, color: 0x000000, transparent: true, side: THREE.DoubleSide })
);
groundPlane.rotation.x = -Math.PI / 2;
groundPlane.position.y = -0.85;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

// Load your GLB file
const loader = new GLTFLoader();
let skeletonModel = null;
let modelLoaded = false;

loader.load(
    'lazarosv-skeleton-4068.glb',
    (gltf) => {
        skeletonModel = gltf.scene;
        
        // Calculate bounding box to center the model properly
        const box = new THREE.Box3().setFromObject(skeletonModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Center the model at origin (0,0,0)
        skeletonModel.position.x = -center.x;
        skeletonModel.position.z = -center.z;
        skeletonModel.position.y = -center.y + 0.2; // Adjust vertical position
        
        // Scale the model to fit nicely in the view
        // Calculate scale based on model size to fill the view
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 1.8; // Desired size in world units
        const scale = targetSize / maxDimension;
        skeletonModel.scale.set(scale, scale, scale);
        
        // Enable shadows
        skeletonModel.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        
        scene.add(skeletonModel);
        modelLoaded = true;
        
        // Adjust camera target to the centered model
        controls.target.set(0, 0.8, 0);
        controls.update();
        
        // Remove loading overlay
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        
        console.log('✅ 3D Skeleton model loaded and centered successfully!');
        console.log(`Model size: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`);
        console.log(`Applied scale: ${scale.toFixed(3)}`);
    },
    (xhr) => {
        // Loading progress
        const percent = Math.floor((xhr.loaded / xhr.total) * 100);
        if (loadingOverlay && !modelLoaded) {
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
                <p style="margin-top: 10px; color: #ffefc0;">فشل تحميل النموذج. تأكد من وجود الملف "lazarosv-skeleton-4068.glb" في المسار الصحيح.</p>
                <p style="margin-top: 5px; font-size: 0.8rem;">ملاحظة: تأكد من اسم الملف وتأكد من وجوده في نفس المجلد</p>
            `;
        }
    }
);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
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

console.log('3D Skeleton Viewer with GLB File Ready - Centered and Scaled!');
