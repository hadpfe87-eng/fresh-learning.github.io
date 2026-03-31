const boneData = [
    { id: 'skull', name: 'الجمجمة', fact: 'الجمجمة تحمي دماغك، وهي مكونة من 22 عظمة!' },
    { id: 'ribs', name: 'القفص الصدري', fact: 'القفص الصدري يحمي القلب والرئتين.' },
    { id: 'pelvis', name: 'عظم الحوض', fact: 'عظم الحوض هو الأكبر في جسم الإنسان.' },
    { id: 'arm-l', name: 'الذراع اليسرى', fact: 'عظمة العضد هي العظمة الطويلة في ذراعك.' },
    { id: 'arm-r', name: 'الذراع اليمنى', fact: 'لديك 30 عظمة في كل ذراع!' },
    { id: 'leg-l', name: 'الرجل اليسرى', fact: 'عظمة الفخذ هي أقوى عظمة في جسمك.' },
    { id: 'leg-r', name: 'الرجل اليمنى', fact: 'أصغر عظمة في جسمك موجودة داخل أذنك!' }
];

let score = 0;

// Initialize Game
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-overlay').classList.add('hidden');
    renderBones();
});

function renderBones() {
    const pile = document.getElementById('bones-pile');
    boneData.sort(() => Math.random() - 0.5).forEach(bone => {
        const el = document.createElement('div');
        el.className = 'draggable-bone';
        el.draggable = true;
        el.id = bone.id;
        el.innerText = bone.name;
        
        el.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text', e.target.id);
        });
        
        pile.appendChild(el);
    });
}

// Drop Zone Logic
const zones = document.querySelectorAll('.drop-zone');
zones.forEach(zone => {
    zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('hovered');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('hovered'));

    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('hovered');
        const boneId = e.dataTransfer.getData('text');
        
        if (zone.dataset.bone === boneId) {
            handleCorrectDrop(zone, boneId);
        } else {
            showFact('❌ حاول مرة أخرى! ضع العظمة في مكانها الصحيح.');
        }
    });
});

function handleCorrectDrop(zone, boneId) {
    const boneElement = document.getElementById(boneId);
    boneElement.classList.add('hidden'); // Hide from sidebar
    
    zone.classList.add('correct');
    zone.innerHTML = `<span style="font-size:1.5rem">🦴</span>`;
    
    // Update Score
    score++;
    const progress = (score / boneData.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    // Show Fact
    const fact = boneData.find(b => b.id === boneId).fact;
    showFact(`✅ ${fact}`);
    
    if (score === boneData.length) {
        setTimeout(() => {
            document.getElementById('victory-overlay').classList.remove('hidden');
        }, 1000);
    }
}

function showFact(text) {
    const box = document.getElementById('fact-box');
    const textEl = document.getElementById('fact-text');
    textEl.innerText = text;
    box.classList.remove('hidden');
    
    // Auto hide fact after 4 seconds
    setTimeout(() => box.classList.add('hidden'), 4000);
}
