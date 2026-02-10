// لعبة الميزان الذكي - الجافاسكريبت الكامل
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚖️ لعبة الميزان الذكي - جاهزة!');
    
    // === متغيرات اللعبة ===
    let score = 0;
    let level = 1;
    let currentChallenge = null;
    let leftWeight = 0;
    let rightWeight = 0;
    let draggedObject = null;
    let gameTime = 0;
    let timerInterval = null;
    let isSoundEnabled = true;
    let attempts = 0;
    let hintsUsed = 0;
    
    // === عناصر DOM ===
    const elements = {
        leftPan: document.getElementById('left-pan'),
        rightPan: document.getElementById('right-pan'),
        leftPanContainer: document.getElementById('left-objects'),
        rightPanContainer: document.getElementById('right-objects'),
        leftWeightDisplay: document.getElementById('left-weight'),
        rightWeightDisplay: document.getElementById('right-weight'),
        balanceBeam: document.getElementById('balance-beam'),
        balanceArrow: document.getElementById('balance-arrow'),
        weightDifference: document.getElementById('weight-difference'),
        balanceInfo: document.getElementById('balance-info'),
        objectsGrid: document.getElementById('objects-grid'),
        scoreDisplay: document.getElementById('score'),
        levelDisplay: document.getElementById('level'),
        progressFill: document.getElementById('progress-fill'),
        progressPercent: document.getElementById('progress-percent'),
        resultsPanel: document.getElementById('results-panel'),
        resultTitle: document.getElementById('result-title'),
        resultMessage: document.getElementById('result-message'),
        resultStars: document.getElementById('result-stars'),
        resultTime: document.getElementById('result-time'),
        resultAccuracy: document.getElementById('result-accuracy'),
        starsContainer: document.getElementById('stars-container'),
        hintToast: document.getElementById('hint-toast'),
        hintText: document.getElementById('hint-text')
    };
    
    // === الأزرار ===
    const buttons = {
        check: document.getElementById('check-btn'),
        reset: document.getElementById('reset-btn'),
        hint: document.getElementById('hint-btn'),
        next: document.getElementById('next-btn'),
        auto: document.getElementById('auto-btn'),
        sound: document.getElementById('sound-btn'),
        retry: document.getElementById('retry-btn'),
        continue: document.getElementById('continue-btn'),
        closeResults: document.getElementById('close-results'),
        share: document.getElementById('share-btn')
    };
    
    // === تعريف الأجسام ===
    const objects = [
        { id: 1, name: 'تفاحة', weight: 0.2, icon: '🍎', color: '#ff6b6b', category: 'فاكهة' },
        { id: 2, name: 'كتاب', weight: 1.0, icon: '📚', color: '#ffa502', category: 'أدوات' },
        { id: 3, name: 'كرة', weight: 0.5, icon: '⚽', color: '#1e90ff', category: 'ألعاب' },
        { id: 4, name: 'قلم', weight: 0.1, icon: '✏️', color: '#2ed573', category: 'أدوات' },
        { id: 5, name: 'زجاجة', weight: 0.8, icon: '🧴', color: '#9c88ff', category: 'أواني' },
        { id: 6, name: 'ممحاة', weight: 0.05, icon: '🧽', color: '#fbc531', category: 'أدوات' },
        { id: 7, name: 'سيارة', weight: 2.0, icon: '🚗', color: '#e84118', category: 'ألعاب' },
        { id: 8, name: 'مكعب', weight: 0.3, icon: '🧊', color: '#00cec9', category: 'ألعاب' },
        { id: 9, name: 'برتقالة', weight: 0.25, icon: '🍊', color: '#ff9f43', category: 'فاكهة' },
        { id: 10, name: 'ساعة', weight: 0.15, icon: '⌚', color: '#54a0ff', category: 'أدوات' }
    ];
    
    // === المستويات والتحديات ===
    const challenges = [
        {
            level: 1,
            target: 1.0,
            objects: [1, 2, 3, 4],
            title: "المستوى 1: البداية",
            message: "اجعل مجموع الأوزان في الكفتين يساوي 1 كجم",
            hint: "جرب وضع الكتاب (1 كجم) في كفة واحدة",
            timeLimit: 120,
            stars: [30, 60, 90] // النقاط الدنيا لكل نجمة
        },
        {
            level: 2,
            target: 2.5,
            objects: [1, 2, 3, 4, 5, 6],
            title: "المستوى 2: التحدي",
            message: "حقق التوازن بحمل 2.5 كجم",
            hint: "الكتاب + السيارة = 3 كجم، حاول تقليل الفرق",
            timeLimit: 180,
            stars: [40, 80, 120]
        },
        {
            level: 3,
            target: 3.0,
            objects: [1, 2, 3, 4, 5, 6, 7, 8],
            title: "المستوى 3: المحترف",
            message: "التوازن الدقيق عند 3 كجم",
            hint: "استخدم مجموعة من الأجسام الخفيفة والثقيلة",
            timeLimit: 240,
            stars: [50, 100, 150]
        },
        {
            level: 4,
            target: 4.0,
            objects: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            title: "المستوى 4: الخبير",
            message: "تحدي الوزن الثقيل - 4 كجم",
            hint: "سيارتان = 4 كجم، أو مجموعة من الأجسام الأخرى",
            timeLimit: 300,
            stars: [60, 120, 180]
        },
        {
            level: 5,
            target: 5.0,
            objects: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            title: "المستوى 5: الأسطورة",
            message: "التوازن النهائي عند 5 كجم",
            hint: "جرب تركيبات مختلفة لتحقيق الدقة القصوى",
            timeLimit: 360,
            stars: [70, 140, 210]
        }
    ];
    
    // === تهيئة اللعبة ===
    function initGame() {
        score = 0;
        level = 1;
        gameTime = 0;
        attempts = 0;
        hintsUsed = 0;
        
        updateDisplay();
        startLevel(level);
        setupEventListeners();
        startTimer();
        
        console.log('🎮 اللعبة مهيأة وجاهزة!');
        showHintMessage('مرحباً! اسحب الأجسام إلى الكفات لتحقيق التوازن. 💡');
    }
    
    // === بدء مستوى جديد ===
    function startLevel(levelNum) {
        level = levelNum;
        currentChallenge = challenges.find(c => c.level === level) || challenges[0];
        
        // إعادة تعيين
        clearPans();
        leftWeight = 0;
        rightWeight = 0;
        attempts = 0;
        
        // تحديث العرض
        updateDisplay();
        updateProgressBar();
        
        // إنشاء الأجسام
        createObjects();
        
        // تحديث العنوان
        document.title = `الميزان الذكي - ${currentChallenge.title}`;
        
        // إظهار رسالة المستوى
        showHintMessage(currentChallenge.message);
        
        console.log(`🚀 بدء المستوى ${level}: ${currentChallenge.title}`);
    }
    
    // === إنشاء الأجسام ===
    function createObjects() {
        elements.objectsGrid.innerHTML = '';
        
        currentChallenge.objects.forEach(objId => {
            const obj = objects.find(o => o.id === objId);
            if (obj) {
                createObjectElement(obj);
            }
        });
    }
    
    function createObjectElement(obj) {
        const objectElement = document.createElement('div');
        objectElement.className = 'object-item';
        objectElement.draggable = true;
        objectElement.dataset.id = obj.id;
        objectElement.dataset.weight = obj.weight;
        objectElement.dataset.name = obj.name;
        objectElement.style.setProperty('--object-color', obj.color);
        
        objectElement.innerHTML = `
            <div class="object-icon" style="color: ${obj.color}">${obj.icon}</div>
            <div class="object-name">${obj.name}</div>
            <div class="object-weight" style="background: ${obj.color}">${obj.weight} كجم</div>
            <div class="object-category">${obj.category}</div>
        `;
        
        // إضافة أحداث السحب
        setupDragEvents(objectElement);
        
        elements.objectsGrid.appendChild(objectElement);
    }
    
    // === إعداد أحداث السحب ===
    function setupDragEvents(element) {
        // سحب عادي
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        
        // سحب باللمس
        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchmove', handleTouchMove);
        element.addEventListener('touchend', handleTouchEnd);
        
        // النقر لنقل الجسم بين الكفات
        element.addEventListener('click', function(e) {
            if (e.target.closest('.object-item')) {
                const currentPan = this.parentElement;
                if (currentPan === elements.leftPanContainer || currentPan === elements.rightPanContainer) {
                    moveObjectToOtherPan(this);
                }
            }
        });
    }
    
    function handleDragStart(e) {
        draggedObject = this;
        this.classList.add('dragging');
        
        e.dataTransfer.setData('text/plain', JSON.stringify({
            id: this.dataset.id,
            weight: this.dataset.weight,
            name: this.dataset.name
        }));
        
        playSound('drag');
    }
    
    function handleDragEnd() {
        if (draggedObject) {
            draggedObject.classList.remove('dragging');
            draggedObject = null;
        }
        
        // إزالة تأثير السحب من الكفات
        [elements.leftPanContainer, elements.rightPanContainer].forEach(pan => {
            pan.classList.remove('drag-over');
        });
    }
    
    function handleTouchStart(e) {
        if (e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        draggedObject = this;
        
        // إنشاء نسخة شبحية
        createTouchGhost(this, touch.clientX, touch.clientY);
        
        this.style.opacity = '0.7';
        this.classList.add('dragging');
        
        playSound('drag');
        e.preventDefault();
    }
    
    function handleTouchMove(e) {
        if (!draggedObject || e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const ghost = document.querySelector('.touch-ghost');
        
        if (ghost) {
            ghost.style.left = (touch.clientX - 60) + 'px';
            ghost.style.top = (touch.clientY - 60) + 'px';
        }
        
        // تحديد الكفة المستهدفة
        const targetPan = getTouchTargetPan(touch.clientX, touch.clientY);
        highlightTargetPan(targetPan);
        
        e.preventDefault();
    }
    
    function handleTouchEnd(e) {
        if (!draggedObject) return;
        
        const touch = e.changedTouches[0];
        const targetPan = getTouchTargetPan(touch.clientX, touch.clientY);
        
        // إزالة الشبح
        const ghost = document.querySelector('.touch-ghost');
        if (ghost) ghost.remove();
        
        // نقل الجسم إذا كان هناك هدف
        if (targetPan && draggedObject.parentElement !== targetPan) {
            targetPan.appendChild(draggedObject);
            updateWeights();
            playSound('drop');
        }
        
        // تنظيف
        draggedObject.style.opacity = '';
        draggedObject.classList.remove('dragging');
        draggedObject = null;
        
        [elements.leftPanContainer, elements.rightPanContainer].forEach(pan => {
            pan.classList.remove('drag-over');
        });
    }
    
    function createTouchGhost(element, x, y) {
        const ghost = element.cloneNode(true);
        ghost.classList.add('touch-ghost');
        ghost.style.position = 'fixed';
        ghost.style.zIndex = '10000';
        ghost.style.left = (x - 60) + 'px';
        ghost.style.top = (y - 60) + 'px';
        ghost.style.transform = 'scale(1.1) rotate(5deg)';
        ghost.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
        ghost.style.opacity = '0.9';
        ghost.style.pointerEvents = 'none';
        
        document.body.appendChild(ghost);
    }
    
    function getTouchTargetPan(x, y) {
        const leftRect = elements.leftPanContainer.getBoundingClientRect();
        const rightRect = elements.rightPanContainer.getBoundingClientRect();
        
        if (x >= leftRect.left && x <= leftRect.right &&
            y >= leftRect.top && y <= leftRect.bottom) {
            return elements.leftPanContainer;
        }
        
        if (x >= rightRect.left && x <= rightRect.right &&
            y >= rightRect.top && y <= rightRect.bottom) {
            return elements.rightPanContainer;
        }
        
        return null;
    }
    
    function highlightTargetPan(pan) {
        [elements.leftPanContainer, elements.rightPanContainer].forEach(p => {
            p.classList.remove('drag-over');
        });
        
        if (pan) {
            pan.classList.add('drag-over');
        }
    }
    
    // === جعل الكفات قابلة للإفلات ===
    function setupDropZones() {
        [elements.leftPanContainer, elements.rightPanContainer].forEach(container => {
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
                
                if (!draggedObject) {
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    const obj = objects.find(o => o.id == data.id);
                    if (obj) {
                        createObjectInPan(obj, this);
                    }
                } else if (this !== draggedObject.parentElement) {
                    this.appendChild(draggedObject);
                    updateWeights();
                    playSound('drop');
                }
                
                draggedObject = null;
            });
        });
    }
    
    function createObjectInPan(obj, pan) {
        const objectElement = document.createElement('div');
        objectElement.className = 'object-item pan-object';
        objectElement.dataset.id = obj.id;
        objectElement.dataset.weight = obj.weight;
        objectElement.style.setProperty('--object-color', obj.color);
        
        objectElement.innerHTML = `
            <div class="object-icon" style="color: ${obj.color}">${obj.icon}</div>
            <div class="object-weight" style="background: ${obj.color}">${obj.weight} كجم</div>
        `;
        
        pan.appendChild(objectElement);
        updateWeights();
        playSound('drop');
    }
    
    // === نقل الجسم بين الكفات ===
    function moveObjectToOtherPan(objectElement) {
        const currentPan = objectElement.parentElement;
        const targetPan = currentPan === elements.leftPanContainer ? 
                         elements.rightPanContainer : elements.leftPanContainer;
        
        targetPan.appendChild(objectElement);
        updateWeights();
        playSound('switch');
    }
    
    // === تحديث الأوزان ===
    function updateWeights() {
        leftWeight = calculatePanWeight(elements.leftPanContainer);
        rightWeight = calculatePanWeight(elements.rightPanContainer);
        
        updateDisplay();
        updateBalance();
        updateProgressBar();
        
        attempts++;
    }
    
    function calculatePanWeight(pan) {
        let total = 0;
        const objects = pan.querySelectorAll('.object-item');
        
        objects.forEach(obj => {
            const weight = parseFloat(obj.dataset.weight) || 0;
            total += weight;
        });
        
        return parseFloat(total.toFixed(2));
    }
    
    // === تحديث العرض ===
    function updateDisplay() {
        elements.leftWeightDisplay.textContent = leftWeight.toFixed(2);
        elements.rightWeightDisplay.textContent = rightWeight.toFixed(2);
        elements.scoreDisplay.textContent = score;
        elements.levelDisplay.textContent = level;
        
        // حساب الفرق
        const difference = Math.abs(leftWeight - rightWeight);
        elements.weightDifference.textContent = difference.toFixed(2);
        
        // تحديث لون معلومات التوازن
        if (difference === 0) {
            elements.balanceInfo.style.borderColor = '#2ed573';
            elements.balanceInfo.style.background = '#e8f6ef';
        } else if (difference < 0.5) {
            elements.balanceInfo.style.borderColor = '#ffa502';
            elements.balanceInfo.style.background = '#fff4e6';
        } else {
            elements.balanceInfo.style.borderColor = '#ff6b6b';
            elements.balanceInfo.style.background = '#ffeaea';
        }
    }
    
    // === تحديث توازن الميزان ===
    function updateBalance() {
        const weightDifference = leftWeight - rightWeight;
        const maxTilt = 20;
        
        // حساب الميلان
        let tilt = 0;
        if (weightDifference !== 0) {
            // حساب أكثر دقة مع تسريع
            const acceleration = Math.min(Math.abs(weightDifference) * 3, maxTilt);
            tilt = weightDifference > 0 ? acceleration : -acceleration;
        }
        
        // تطبيق على ذراع الميزان
        elements.balanceBeam.style.transform = `rotate(${tilt}deg)`;
        
        // تحديث المؤشر
        const arrowPosition = Math.min(Math.max(weightDifference * 25, -150), 150);
        elements.balanceArrow.style.left = `calc(50% + ${arrowPosition}px)`;
        
        // تغيير لون السهم
        if (weightDifference > 1) {
            elements.balanceArrow.style.borderBottomColor = '#ff6b6b';
        } else if (weightDifference < -1) {
            elements.balanceArrow.style.borderBottomColor = '#1e90ff';
        } else if (Math.abs(weightDifference) <= 0.1) {
            elements.balanceArrow.style.borderBottomColor = '#2ed573';
        } else {
            elements.balanceArrow.style.borderBottomColor = '#ffa502';
        }
    }
    
    // === شريط التقدم ===
    function updateProgressBar() {
        const currentTotal = leftWeight + rightWeight;
        const target = currentChallenge.target;
        const progress = Math.min((currentTotal / target) * 100, 100);
        
        elements.progressFill.style.width = progress + '%';
        elements.progressPercent.textContent = Math.round(progress) + '%';
        
        // تغيير اللون حسب التقدم
        if (progress >= 100) {
            elements.progressFill.style.background = 'linear-gradient(90deg, #2ed573, #28a745)';
        } else if (progress >= 50) {
            elements.progressFill.style.background = 'linear-gradient(90deg, #ffa502, #ff9800)';
        } else {
            elements.progressFill.style.background = 'linear-gradient(90deg, #17bebb, #4a6fa5)';
        }
    }
    
    // === التحقق من التوازن ===
    function checkBalance() {
        const weightDifference = Math.abs(leftWeight - rightWeight);
        const totalWeight = leftWeight + rightWeight;
        const target = currentChallenge.target;
        
        let stars = 0;
        let message = '';
        let isSuccess = false;
        
        // حساب الدقة
        const weightAccuracy = 100 - Math.min((Math.abs(totalWeight - target) / target) * 100, 100);
        const balanceAccuracy = 100 - Math.min((weightDifference / target) * 100, 100);
        const totalAccuracy = Math.round((weightAccuracy + balanceAccuracy) / 2);
        
        // معايير التقييم
        if (totalWeight === 0) {
            message = 'لم تضف أي أجسام بعد! ابدأ بسحب جسم إلى إحدى الكفتين.';
            playSound('error');
        } 
        else if (weightDifference <= 0.1 && Math.abs(totalWeight - target) <= 0.2) {
            // نجاح ممتاز
            isSuccess = true;
            stars = 3;
            message = 'ممتاز! 👏 توازن دقيق جداً. أنت خبير في الوزن والكتلة!';
            score += currentChallenge.stars[2];
            playSound('success');
        }
        else if (weightDifference <= 0.5 && Math.abs(totalWeight - target) <= 0.5) {
            // نجاح جيد
            isSuccess = true;
            stars = 2;
            message = 'جيد جداً! ✓ الميزان متوازن تقريباً. حاول تتحسن أكثر!';
            score += currentChallenge.stars[1];
            playSound('success');
        }
        else if (Math.abs(totalWeight - target) <= 1.0) {
            // نجاح مقبول
            isSuccess = true;
            stars = 1;
            message = 'ليس سيئاً! ✓ الوزن الكلي صحيح ولكن الميزان غير متوازن تماماً.';
            score += currentChallenge.stars[0];
            playSound('partial');
        }
        else {
            // فشل
            message = 'حاول مرة أخرى! ❌ الوزن غير صحيح. راجع حساباتك.';
            playSound('error');
        }
        
        // عرض النتائج
        if (isSuccess) {
            showResults(stars, message, totalAccuracy);
        } else {
            showHintMessage(message, 'error');
        }
        
        updateDisplay();
    }
    
    // === عرض النتائج ===
    function showResults(stars, message, accuracy) {
        // تحديث البيانات
        elements.resultTitle.textContent = stars === 3 ? 'ممتاز! 🏆' : 
                                         stars === 2 ? 'جيد جداً! 👍' : 'حسنٌ! ✓';
        elements.resultMessage.textContent = message;
        elements.resultStars.textContent = `${stars}/3`;
        elements.resultAccuracy.textContent = `${accuracy}%`;
        elements.resultTime.textContent = formatTime(gameTime);
        
        // تحديث النجوم
        updateStarsDisplay(stars);
        
        // تمكين زر المستوى التالي
        buttons.next.disabled = false;
        
        // إظهار لوحة النتائج
        elements.resultsPanel.classList.add('active');
        
        // اهتزاز على الجوال
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
        
        // تحديث أعلى درجة
        updateHighScore();
    }
    
    function updateStarsDisplay(count) {
        const stars = elements.starsContainer.querySelectorAll('i');
        stars.forEach((star, index) => {
            if (index < count) {
                star.className = 'fas fa-star';
                star.style.color = '#ffd700';
                star.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
            } else {
                star.className = 'fas fa-star empty';
                star.style.color = '#ddd';
                star.style.textShadow = 'none';
            }
        });
    }
    
    // === التلميحات ===
    function showHint() {
        if (hintsUsed >= 3) {
            showHintMessage('لقد استخدمت كل التلميحات المتاحة! 💡', 'warning');
            return;
        }
        
        hintsUsed++;
        showHintMessage(currentChallenge.hint, 'info');
        playSound('hint');
        
        // إبراز الأجسام المناسبة
        highlightRecommendedObjects();
    }
    
    function showHintMessage(text, type = 'info') {
        elements.hintText.textContent = text;
        elements.hintToast.classList.add('show');
        
        // تغيير اللون حسب النوع
        if (type === 'error') {
            elements.hintToast.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
        } else if (type === 'warning') {
            elements.hintToast.style.background = 'linear-gradient(135deg, #ffa502, #ff9800)';
        } else {
            elements.hintToast.style.background = 'linear-gradient(135deg, #17bebb, #149c9a)';
        }
        
        // إخفاء تلقائي
        setTimeout(() => {
            elements.hintToast.classList.remove('show');
        }, 5000);
    }
    
    function highlightRecommendedObjects() {
        const target = currentChallenge.target;
        const objectsInGrid = elements.objectsGrid.querySelectorAll('.object-item');
        
        objectsInGrid.forEach(obj => {
            const weight = parseFloat(obj.dataset.weight);
            obj.style.animation = 'pulse 1s ease-in-out';
            
            // إزالة التأثير بعد ثانية
            setTimeout(() => {
                obj.style.animation = '';
            }, 1000);
        });
    }
    
    // === التوازن التلقائي ===
    function autoBalance() {
        const target = currentChallenge.target;
        const availableObjects = getAvailableObjects();
        
        // خوارزمية بسيطة للتوازن
        let left = [];
        let right = [];
        let leftSum = 0;
        let rightSum = 0;
        
        // فرز الأجسام من الأثقل إلى الأخف
        availableObjects.sort((a, b) => b.weight - a.weight);
        
        // توزيع الأجسام
        availableObjects.forEach(obj => {
            if (Math.abs((leftSum + obj.weight) - rightSum) <= Math.abs(leftSum - (rightSum + obj.weight))) {
                left.push(obj);
                leftSum += obj.weight;
            } else {
                right.push(obj);
                rightSum += obj.weight;
            }
        });
        
        // تطبيق التوزيع
        clearPans();
        left.forEach(obj => addObjectToPan(obj, elements.leftPanContainer));
        right.forEach(obj => addObjectToPan(obj, elements.rightPanContainer));
        
        updateWeights();
        showHintMessage('تم التوازن تلقائياً! لاحظ كيف تم توزيع الأجسام. 🤖', 'info');
        playSound('auto');
    }
    
    function getAvailableObjects() {
        const objectsInGrid = elements.objectsGrid.querySelectorAll('.object-item');
        return Array.from(objectsInGrid).map(obj => ({
            id: obj.dataset.id,
            weight: parseFloat(obj.dataset.weight),
            name: obj.dataset.name,
            element: obj
        }));
    }
    
    function addObjectToPan(obj, pan) {
        pan.appendChild(obj.element);
    }
    
    // === مسح الكفات ===
    function clearPans() {
        elements.leftPanContainer.innerHTML = '<div class="empty-message"><i class="fas fa-hand-point-up"></i><p>اسحب الأجسام هنا</p></div>';
        elements.rightPanContainer.innerHTML = '<div class="empty-message"><i class="fas fa-hand-point-up"></i><p>اسحب الأجسام هنا</p></div>';
    }
    
    // === المؤقت ===
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            gameTime++;
            
            // تحذير إذا اقترب الوقت
            const timeLeft = currentChallenge.timeLimit - gameTime;
            if (timeLeft === 60) {
                showHintMessage('دقيقة واحدة متبقية! ⏰', 'warning');
            } else if (timeLeft === 30) {
                showHintMessage('30 ثانية متبقية! أسرع! 🏃', 'warning');
            } else if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showHintMessage('انتهى الوقت! ⏰ حاول مرة أخرى.', 'error');
            }
        }, 1000);
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // === الأصوات ===
    function playSound(type) {
        if (!isSoundEnabled) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'drag':
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
                
            case 'drop':
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.15);
                break;
                
            case 'success':
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
                
            case 'error':
                oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
                
            case 'hint':
                oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
                
            case 'switch':
                oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
                
            case 'auto':
                // نغمة خاصة
                [262, 330, 392].forEach((freq, i) => {
                    setTimeout(() => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                        gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                        osc.start();
                        osc.stop(audioContext.currentTime + 0.1);
                    }, i * 100);
                });
                break;
        }
    }
    
    function toggleSound() {
        isSoundEnabled = !isSoundEnabled;
        buttons.sound.classList.toggle('active');
        
        const icon = buttons.sound.querySelector('i');
        const text = buttons.sound.querySelector('span');
        
        if (isSoundEnabled) {
            icon.className = 'fas fa-volume-up';
            text.textContent = 'الصوت: تشغيل';
            showHintMessage('تم تشغيل الصوت 🔊', 'info');
        } else {
            icon.className = 'fas fa-volume-mute';
            text.textContent = 'الصوت: إيقاف';
            showHintMessage('تم إيقاف الصوت 🔇', 'info');
        }
    }
    
    // === أعلى الدرجات ===
    function updateHighScore() {
        const highScore = localStorage.getItem('balanceGameHighScore') || 0;
        if (score > highScore) {
            localStorage.setItem('balanceGameHighScore', score);
            showHintMessage(`🎉 رقم قياسي جديد! ${score} نقطة`, 'success');
        }
    }
    
    // === المشاركة ===
    function shareGame() {
        const shareText = `حصلت على ${score} نقطة في لعبة الميزان الذكي! 🔬`;
        const shareUrl = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: 'الميزان الذكي',
                text: shareText,
                url: shareUrl
            });
        } else {
            // نسخ للنظام القديم
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
                .then(() => showHintMessage('تم نسخ الرابط! شاركه مع أصدقائك 📋', 'success'))
                .catch(() => showHintMessage('تعذر النسخ. حاول يدوياً.', 'error'));
        }
    }
    
    // === إعداد الأحداث ===
    function setupEventListeners() {
        // أزرار التحكم
        buttons.check.addEventListener('click', checkBalance);
        buttons.reset.addEventListener('click', () => startLevel(level));
        buttons.hint.addEventListener('click', showHint);
        buttons.next.addEventListener('click', nextLevel);
        buttons.auto.addEventListener('click', autoBalance);
        buttons.sound.addEventListener('click', toggleSound);
        buttons.retry.addEventListener('click', () => {
            elements.resultsPanel.classList.remove('active');
            startLevel(level);
        });
        buttons.continue.addEventListener('click', nextLevel);
        buttons.closeResults.addEventListener('click', () => {
            elements.resultsPanel.classList.remove('active');
        });
        buttons.share.addEventListener('click', shareGame);
        
        // منطقة الإفلات
        setupDropZones();
        
        // إغلاق رسائل التلميح بالنقر
        elements.hintToast.addEventListener('click', () => {
            elements.hintToast.classList.remove('show');
        });
        
        // إغلاق لوحة النتائج بالنقر خارجها
        elements.resultsPanel.addEventListener('click', (e) => {
            if (e.target === elements.resultsPanel || e.target.classList.contains('results-overlay')) {
                elements.resultsPanel.classList.remove('active');
            }
        });
        
        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                checkBalance();
            } else if (e.key === 'r' || e.key === 'R') {
                startLevel(level);
            } else if (e.key === 'h' || e.key === 'H') {
                showHint();
            } else if (e.key === 'n' || e.key === 'N') {
                if (!buttons.next.disabled) nextLevel();
            }
        });
    }
    
    // === الانتقال للمستوى التالي ===
    function nextLevel() {
        elements.resultsPanel.classList.remove('active');
        
        if (level < challenges.length) {
            startLevel(level + 1);
        } else {
            // نهاية اللعبة
            showHintMessage('🎊 مبروك! لقد أكملت جميع المستويات! أنت الآن خبير في الوزن والكتلة! 🏆', 'success');
            
            // عرض شاشة النهاية
            setTimeout(() => {
                elements.resultTitle.textContent = 'إكمال اللعبة! 🎉';
                elements.resultMessage.textContent = `تهانينا! لقد أكملت جميع المستويات بنجاح وحصلت على ${score} نقطة. أنت الآن خبير في الوزن والكتلة!`;
                elements.resultStars.textContent = '5/5';
                elements.resultAccuracy.textContent = '100%';
                elements.resultTime.textContent = formatTime(gameTime);
                updateStarsDisplay(3);
                elements.resultsPanel.classList.add('active');
                buttons.next.disabled = true;
            }, 1000);
        }
    }
    
    // === بدء اللعبة ===
    initGame();
    
    // رسالة في الكونسول
    console.log('%c⚖️ الميزان الذكي - جاهز للعب!', 
        'color: #4a6fa5; font-size: 18px; font-weight: bold; padding: 10px; background: #f0f8ff; border-radius: 10px;');
    console.log('🎮 اختصارات لوحة المفاتيح:');
    console.log('   Enter/Space: التحقق من التوازن');
    console.log('   R: إعادة المحاولة');
    console.log('   H: تلميح');
    console.log('   N: المستوى التالي (عند التمكين)');
});

// تحميل الصفحة بسلاسة
window.addEventListener('load', function() {
    document.body.classList.add('game-loaded');
    
    // إضافة CSS للحركات
    const animationCSS = document.createElement('style');
    animationCSS.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes floatObject {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        .object-item:hover {
            animation: floatObject 2s ease-in-out infinite;
        }
        
        .game-loaded .balance-container {
            animation: fadeInUp 0.8s ease;
        }
        
        .game-loaded .objects-panel {
            animation: fadeInUp 0.8s ease 0.2s both;
        }
        
        .game-loaded .controls-panel {
            animation: fadeInUp 0.8s ease 0.4s both;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(animationCSS);
});
