// نسخة مبسطة من لعبة الميزان الذكي
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 لعبة الميزان الذكي - جاهزة للتجربة!');
    
    // عناصر أساسية
    const leftPan = document.getElementById('left-objects');
    const rightPan = document.getElementById('right-objects');
    const leftWeightDisplay = document.getElementById('left-weight');
    const rightWeightDisplay = document.getElementById('right-weight');
    const balanceBeam = document.querySelector('.balance-beam');
    const checkBtn = document.getElementById('check-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    let leftWeight = 0;
    let rightWeight = 0;
    let draggedObject = null;
    
    // تعريف الأجسام البسيطة
    const objects = [
        { id: 1, name: 'تفاحة', weight: 2, icon: '🍎', color: '#ff6b6b' },
        { id: 2, name: 'كتاب', weight: 5, icon: '📚', color: '#ffa502' },
        { id: 3, name: 'كرة', weight: 1, icon: '⚽', color: '#1e90ff' }
    ];
    
    // إنشاء الأجسام
    function createObjects() {
        const objectsGrid = document.getElementById('objects-grid');
        objectsGrid.innerHTML = '';
        
        objects.forEach(obj => {
            const div = document.createElement('div');
            div.className = 'object-item';
            div.draggable = true;
            div.innerHTML = `
                <div style="font-size: 36px; color: ${obj.color}">${obj.icon}</div>
                <div style="font-weight: bold; margin: 5px 0">${obj.name}</div>
                <div style="background: ${obj.color}; color: white; padding: 4px 12px; border-radius: 15px">
                    ${obj.weight} كجم
                </div>
            `;
            
            div.addEventListener('dragstart', function(e) {
                draggedObject = this;
                this.style.opacity = '0.5';
                e.dataTransfer.setData('text/plain', JSON.stringify(obj));
            });
            
            div.addEventListener('dragend', function() {
                this.style.opacity = '1';
                draggedObject = null;
            });
            
            objectsGrid.appendChild(div);
        });
    }
    
    // جعل الكفات قابلة للإفلات
    [leftPan, rightPan].forEach(pan => {
        pan.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#17bebb';
            this.style.backgroundColor = 'rgba(23, 190, 187, 0.1)';
        });
        
        pan.addEventListener('dragleave', function() {
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = '';
        });
        
        pan.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = '';
            
            if (draggedObject) {
                // إنشاء نسخة من الجسم
                const newObj = draggedObject.cloneNode(true);
                newObj.style.opacity = '1';
                newObj.style.margin = '5px';
                newObj.style.transform = 'scale(0.9)';
                newObj.style.animation = 'popIn 0.3s ease';
                
                this.appendChild(newObj);
                updateWeights();
                
                // إصدار صوت بسيط
                try {
                    const audio = new AudioContext();
                    const oscillator = audio.createOscillator();
                    oscillator.connect(audio.destination);
                    oscillator.frequency.value = 400;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 100);
                } catch (e) {}
            }
        });
    });
    
    // تحديث الأوزان
    function updateWeights() {
        leftWeight = calculateWeight(leftPan);
        rightWeight = calculateWeight(rightPan);
        
        leftWeightDisplay.textContent = leftWeight;
        rightWeightDisplay.textContent = rightWeight;
        
        updateBalance();
    }
    
    function calculateWeight(pan) {
        let total = 0;
        const items = pan.querySelectorAll('.object-item');
        items.forEach(item => {
            const weightText = item.querySelector('div:nth-child(3)').textContent;
            const weight = parseFloat(weightText) || 0;
            total += weight;
        });
        return total;
    }
    
    // تحديث الميزان
    function updateBalance() {
        const difference = leftWeight - rightWeight;
        const tilt = Math.min(Math.max(difference * 2, -15), 15);
        
        if (balanceBeam) {
            balanceBeam.style.transform = `rotate(${tilt}deg)`;
        }
        
        // تحديث السهم المؤشر
        const arrow = document.getElementById('balance-arrow');
        if (arrow) {
            const position = Math.min(Math.max(difference * 10, -100), 100);
            arrow.style.left = `calc(50% + ${position}px)`;
            
            if (difference > 5) {
                arrow.style.borderBottomColor = '#ff4757';
            } else if (difference < -5) {
                arrow.style.borderBottomColor = '#1e90ff';
            } else {
                arrow.style.borderBottomColor = '#2ed573';
            }
        }
    }
    
    // التحقق من التوازن
    function checkBalance() {
        const difference = Math.abs(leftWeight - rightWeight);
        let message = '';
        
        if (difference === 0) {
            message = '🎉 ممتاز! الميزان متوازن تماماً!';
            alert(message);
        } else if (difference <= 2) {
            message = '👍 جيد! الميزان قريب من التوازن. الفرق: ' + difference + ' كجم';
            alert(message);
        } else {
            message = '⚠️ حاول مرة أخرى! الفرق كبير: ' + difference + ' كجم';
            alert(message);
        }
    }
    
    // إعادة التعيين
    function resetGame() {
        leftPan.innerHTML = '<div>اسحب الأجسام هنا</div>';
        rightPan.innerHTML = '<div>اسحب الأجسام هنا</div>';
        leftWeight = 0;
        rightWeight = 0;
        updateWeights();
    }
    
    // إضافة CSS للحركات
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(0.9); opacity: 1; }
        }
        
        .object-item {
            cursor: grab;
            transition: all 0.3s;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .object-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .object-item:active {
            cursor: grabbing;
        }
    `;
    document.head.appendChild(style);
    
    // تهيئة اللعبة
    createObjects();
    
    // إضافة الأحداث للأزرار
    if (checkBtn) checkBtn.addEventListener('click', checkBalance);
    if (resetBtn) resetBtn.addEventListener('click', resetGame);
    
    // رسالة ترحيبية
    setTimeout(() => {
        alert('مرحباً! اسحب الأجسام إلى إحدى الكفتين وشاهد كيف يتغير الميزان ⚖️');
    }, 1000);
    
    console.log('🎮 اللعبة جاهزة! اسحب وأفلت الأجسام.');
});
