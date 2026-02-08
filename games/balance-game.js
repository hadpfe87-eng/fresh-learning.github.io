// لعبة الميزان الذكي - الجافاسكريبت

document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const leftPan = document.getElementById('left-pan');
    const rightPan = document.getElementById('right-pan');
    const leftPanContainer = leftPan.querySelector('.objects-container');
    const rightPanContainer = rightPan.querySelector('.objects-container');
    const leftWeightDisplay = document.getElementById('left-weight');
    const rightWeightDisplay = document.getElementById('right-weight');
    const balanceBeam = document.querySelector('.balance-beam');
    const balanceArrow = document.getElementById('balance-arrow');
    const objectsGrid = document.getElementById('objects-grid');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const checkBtn = document.getElementById('check-btn');
    const resetBtn = document.getElementById('reset-btn');
    const hintBtn = document.getElementById('hint-btn');
    const nextBtn = document.getElementById('next-btn');
    const resultsPanel = document.getElementById('results-panel');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const resultStars = document.getElementById('result-stars');
    const closeResultsBtn = document.getElementById('close-results');
    
    // متغيرات اللعبة
    let score = 0;
    let level = 1;
    let currentChallenge = null;
    let leftWeight = 0;
    let rightWeight = 0;
    let draggedObject = null;
    
    // تحديث الشاشة
    function updateDisplay() {
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        leftWeightDisplay.textContent = leftWeight;
        rightWeightDisplay.textContent = rightWeight;
        
        updateBalance();
    }
    
    // تحديث توازن الميزان
    function updateBalance() {
        const weightDifference = leftWeight - rightWeight;
        const maxTilt = 15; // أقصى ميلان بالدرجات
        
        // حساب الميلان
        let tilt = 0;
        if (weightDifference !== 0) {
            tilt = Math.min(Math.max(weightDifference * 0.5, -maxTilt), maxTilt);
        }
        
        // تطبيق الدوران على ذراع الميزان
        balanceBeam.style.transform = `rotate(${tilt}deg)`;
        
        // تحديث المؤشر
        const arrowPosition = Math.min(Math.max(weightDifference * 2, -100), 100);
        balanceArrow.style.left = `calc(50% + ${arrowPosition}px)`;
        
        // تغيير لون السهم حسب الاتجاه
        if (weightDifference > 5) {
            balanceArrow.style.borderBottomColor = '#ff4757'; // أحمر
        } else if (weightDifference < -5) {
            balanceArrow.style.borderBottomColor = '#1e90ff'; // أزرق
        } else {
            balanceArrow.style.borderBottomColor = '#2ed573'; // أخضر (متوازن)
        }
    }
    
    // إنشاء الأجسام
    const objects = [
        { id: 1, name: 'تفاحة', weight: 2, icon: '🍎', color: '#ff6b6b' },
        { id: 2, name: 'كتاب', weight: 5, icon: '📚', color: '#ffa502' },
        { id: 3, name: 'كرة', weight: 1, icon: '⚽', color: '#1e90ff' },
        { id: 4, name: 'قلم', weight: 0.5, icon: '✏️', color: '#2ed573' },
        { id: 5, name: 'زجاجة', weight: 3, icon: '🧴', color: '#9c88ff' },
        { id: 6, name: 'ممحاة', weight: 0.2, icon: '🧽', color: '#fbc531' },
        { id: 7, name: 'سيارة', weight: 8, icon: '🚗', color: '#e84118' },
        { id: 8, name: 'مكعب', weight: 4, icon: '🧊', color: '#00cec9' }
    ];
    
    // إنشاء تحديات (مستويات)
    const challenges = [
        {
            level: 1,
            target: 5,
            objects: [1, 2, 3],
            message: "اجعل مجموع الأوزان في الكفتين يساوي 5 كجم"
        },
        {
            level: 2,
            target: 8,
            objects: [1, 2, 3, 4],
            message: "اجعل مجموع الأوزان في الكفتين يساوي 8 كجم"
        },
        {
            level: 3,
            target: 10,
            objects: [1, 2, 3, 4, 5],
            message: "اجعل مجموع الأوزان في الكفتين يساوي 10 كجم"
        },
        {
            level: 4,
            target: 12,
            objects: [1, 2, 3, 4, 5, 6],
            message: "اجعل مجموع الأوزان في الكفتين يساوي 12 كجم"
        },
        {
            level: 5,
            target: 15,
            objects: [1, 2, 3, 4, 5, 6, 7],
            message: "اجعل مجموع الأوزان في الكفتين يساوي 15 كجم"
        }
    ];
    
    // بدء مستوى جديد
    function startLevel(levelNum) {
        level = levelNum;
        currentChallenge = challenges.find(c => c.level === level) || challenges[0];
        
        // مسح الأجسام السابقة
        clearPans();
        leftWeight = 0;
        rightWeight = 0;
        
        // إنشاء الأجسام المتاحة
        objectsGrid.innerHTML = '';
        currentChallenge.objects.forEach(objId => {
            const obj = objects.find(o => o.id === objId);
            if (obj) {
                createObjectElement(obj);
            }
        });
        
        updateDisplay();
    }
    
    // إنشاء عنصر جسم قابل للسحب
    function createObjectElement(obj) {
        const objectElement = document.createElement('div');
        objectElement.className = 'object-item';
        objectElement.draggable = true;
        objectElement.dataset.id = obj.id;
        objectElement.dataset.weight = obj.weight;
        
        objectElement.innerHTML = `
            <div class="object-icon" style="color: ${obj.color}">${obj.icon}</div>
            <div class="object-name">${obj.name}</div>
            <div class="object-weight">${obj.weight} كجم</div>
        `;
        
        // إضافة أحداث السحب
        objectElement.addEventListener('dragstart', handleDragStart);
        objectElement.addEventListener('dragend', handleDragEnd);
        
        objectsGrid.appendChild(objectElement);
    }
    
    // مسح الكفتين
    function clearPans() {
        leftPanContainer.innerHTML = '';
        rightPanContainer.innerHTML = '';
        leftWeight = 0;
        rightWeight = 0;
    }
    
    // معالجة بدء السحب
    function handleDragStart(e) {
        draggedObject = this;
        this.classList.add('dragging');
        
        // تعيين بيانات السحب
        e.dataTransfer.setData('text/plain', JSON.stringify({
            id: this.dataset.id,
            weight: parseFloat(this.dataset.weight),
            name: this.querySelector('.object-name').textContent,
            icon: this.querySelector('.object-icon').textContent,
            color: this.querySelector('.object-icon').style.color
        }));
    }
    
    // معالجة انتهاء السحب
    function handleDragEnd() {
        this.classList.remove('dragging');
        draggedObject = null;
    }
    
    // جعل الكفتين قابلة للإفلات
    [leftPanContainer, rightPanContainer].forEach(container => {
        container.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        container.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        container.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            // التأكد من وجود جسم مسحوب
            if (!draggedObject) return;
            
            // منع إضافة نفس الجسم مرتين
            if (this.contains(draggedObject)) return;
            
            // نقل الجسم إلى الكفة
            this.appendChild(draggedObject);
            
            // تحديث الوزن
            const weight = parseFloat(draggedObject.dataset.weight);
            
            if (this === leftPanContainer) {
                leftWeight += weight;
            } else {
                rightWeight += weight;
            }
            
            updateDisplay();
            
            // إصدار صوت الإفلات
            playSound('drop');
        });
    });
    
    // التحقق من التوازن
    function checkBalance() {
        const weightDifference = Math.abs(leftWeight - rightWeight);
        const totalWeight = leftWeight + rightWeight;
        
        let isBalanced = false;
        let message = '';
        let stars = 0;
        
        // معايير النجاح
        if (totalWeight === 0) {
            message = 'لم تضف أي أجسام بعد!';
        } else if (weightDifference <= 0.5) {
            // متوازن تماماً
            isBalanced = true;
            message = 'ممتاز! الميزان متوازن تماماً';
            stars = 3;
            score += 100;
            playSound('success');
        } else if (weightDifference <= 2) {
            // قريب من التوازن
            isBalanced = true;
            message = 'جيد جداً! الميزان قريب من التوازن';
            stars = 2;
            score += 50;
            playSound('success');
        } else if (Math.abs(totalWeight - currentChallenge.target) <= 2) {
            // الوزن الكلي صحيح
            message = 'جيد! الوزن الكلي صحيح ولكن الميزان غير متوازن';
            stars = 1;
            score += 20;
            playSound('partial');
        } else {
            // غير متوازن
            message = 'حاول مرة أخرى! الميزان غير متوازن';
            playSound('error');
        }
        
        // عرض النتائج
        if (isBalanced || stars > 0) {
            showResults(isBalanced, message, stars);
        } else {
            alert(message);
        }
        
        updateDisplay();
    }
    
    // عرض نتائج المستوى
    function showResults(isSuccess, message, stars) {
        resultTitle.textContent = isSuccess ? '🎉 أحسنت!' : '🔧 حاول مرة أخرى';
        resultTitle.style.color = isSuccess ? '#2ed573' : '#ffa502';
        
        resultMessage.textContent = message;
        
        // تحديث النجوم
        const starIcons = resultStars.querySelectorAll('i');
        starIcons.forEach((star, index) => {
            if (index < stars) {
                star.className = 'fas fa-star';
                star.style.color = '#ffc107';
            } else {
                star.className = 'far fa-star';
                star.style.color = '#ddd';
            }
        });
        
        resultsPanel.style.display = 'flex';
    }
    
    // إظهار تلميح
    function showHint() {
        const target = currentChallenge.target;
        const currentTotal = leftWeight + rightWeight;
        const difference = target - currentTotal;
        
        let hint = '';
        
        if (difference > 0) {
            hint = `أنت بحاجة إلى إضافة ${difference} كجم أخرى لتحقيق الوزن المطلوب.`;
        } else if (difference < 0) {
            hint = `أنت بحاجة إلى إزالة ${Math.abs(difference)} كجم لتحقيق الوزن المطلوب.`;
        } else {
            hint = 'الوزن الكلي صحيح! حاول تحقيق التوازن بين الكفتين.';
        }
        
        alert(`💡 تلميح: ${hint}`);
        playSound('hint');
    }
    
    // الانتقال للمستوى التالي
    function nextLevel() {
        if (level < challenges.length) {
            startLevel(level + 1);
        } else {
            alert('🎊 مبروك! لقد أكملت جميع المستويات!');
            startLevel(1);
            score = 0;
        }
        
        resultsPanel.style.display = 'none';
        updateDisplay();
    }
    
    // تشغيل الأصوات
    function playSound(type) {
        // يمكن إضافة أصوات حقيقية هنا
        console.log(`تشغيل صوت: ${type}`);
        
        // محاكاة صوتية بسيطة باستخدام Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // ترددات مختلفة لأنواع الأصوات
            if (type === 'success') {
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            } else if (type === 'error') {
                oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            } else if (type === 'drop') {
                oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            }
        } catch (e) {
            console.log('تعذر تشغيل الصوت');
        }
    }
    
    // إضافة الأحداث
    checkBtn.addEventListener('click', checkBalance);
    resetBtn.addEventListener('click', () => startLevel(level));
    hintBtn.addEventListener('click', showHint);
    nextBtn.addEventListener('click', nextLevel);
    closeResultsBtn.addEventListener('click', () => {
        resultsPanel.style.display = 'none';
    });
    
    // بدء اللعبة
    startLevel(1);
    
    // رسالة ترحيبية
    console.log('مرحباً في لعبة الميزان الذكي! استمتع بتعلم مفاهيم الوزن والكتلة.');
});
