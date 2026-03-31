const bones = [
    { id: 'skull', name: 'الجمجمة 💀', fact: 'الجمجمة تحمي الدماغ، وهي مكونة من عظام ملتحمة معاً!' },
    { id: 'ribs', name: 'القفص الصدري 🫁', fact: 'يعمل القفص الصدري كدرع لحماية القلب والرئتين.' },
    { id: 'spine', name: 'العمود الفقري 🦴', fact: 'يتكون من فقرات تسمح لك بالانحناء والوقوف بشكل مستقيم.' },
    { id: 'pelvis', name: 'عظم الحوض 🩻', fact: 'يربط الجزء العلوي من جسمك بالأرجل.' },
    { id: 'arm-l', name: 'عظام الذراع 🦾', fact: 'تحتوي اليد والذراع على أكبر عدد من العظام في الجسم.' },
    { id: 'arm-r', name: 'عظام الذراع 🦾', fact: 'عظمة العضد هي الأطول في ذراعك.' },
    { id: 'legs', name: 'عظام الأرجل 🦵', fact: 'عظمة الفخذ هي أقوى وأطول عظمة في جسم الإنسان!' }
];

let score = 0;

// Start Game Logic
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    initGame();
});

function initGame() {
    const inventory = document.getElementById('bone-inventory');
    // Shuffle bones
    [...bones].sort(() => Math.random() - 0.5).forEach(bone => {
        const div = document.createElement('div');
        div.className = 'bone-item';
        div.draggable = true;
        div.id = bone.id;
        div.innerText = bone.name;

        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', e.target.id);
            e.target.style.opacity = "0.4";
        });

        div.addEventListener('dragend', (e) => {
            e.target.style.opacity = "1";
        });

        inventory.appendChild(div);
    });
}

// Drop Logic
const zones = document.querySelectorAll('.drop-zone');
zones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('hovered');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('hovered');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('hovered');
        const draggedId = e.dataTransfer.getData('text');

        if (zone.dataset.bone === draggedId) {
            handleSuccess(zone, draggedId);
        } else {
            showFact("❌ المكان غير صحيح، حاول مرة أخرى!");
        }
    });
});

function handleSuccess(zone, id) {
    const boneData = bones.find(b => b.id === id);
    const boneEl = document.getElementById(id);
    
    // Snap effect
    boneEl.remove();
    zone.classList.add('filled');
    zone.innerHTML = `<i class="fas fa-check-circle"></i>`;
    
    // Update Stats
    score++;
    document.getElementById('score').innerText = score;
    const percent = (score / bones.length) * 100;
    document.getElementById('progress-fill').style.width = percent + "%";
    
    showFact(boneData.fact);

    if (score === bones.length) {
        setTimeout(() => {
            alert("🎊 مبروك! لقد أعدت بناء الهيكل العظمي بنجاح!");
            location.reload();
        }, 1500);
    }
}

function showFact(text) {
    const popup = document.getElementById('fact-overlay');
    document.getElementById('fact-text').innerText = text;
    popup.classList.remove('hidden');
    
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 4000);
}
