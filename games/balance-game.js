// لعبة الميزان الذكي - الإصدار الكامل المصحح
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚖️ لعبة الميزان الذكي - جاهزة!');
    
    // === عناصر DOM الأساسية ===
    const elements = {
        leftPan: document.getElementById('left-objects'),
        rightPan: document.getElementById('right-objects'),
        leftWeight: document.getElementById('left-weight'),
        rightWeight: document.getElementById('right-weight'),
        balanceBeam: document.getElementById('balance-beam'),
        balanceArrow: document.getElementById('balance-arrow'),
        weightDiff: document.getElementById('weight-difference'),
        objectsGrid: document.getElementById('objects-grid'),
        scoreDisplay: document.getElementById('score'),
        levelDisplay: document.getElementById('level'),
        progressFill: document.getElementById('progress-fill'),
        progressPercent: document.getElementById('progress-percent'),
        resultsPanel: document.getElementById('results-panel'),
        resultTitle: document.getElementById('result-title'),
        resultMessage: document.getElementById('result-message'),
        starsContainer: document.getElementById('stars-container')
    };
    
    // === الأزرار ===
    const buttons = {
        check: document.getElementById('check-btn'),
        reset: document.getElementById('reset-btn'),
        hint: document.getElementById('hint-btn'),
        retry: document.getElementById('retry-btn'),
        closeResults: document.getElementById('close-results')
    };
    
    // === متغيرات اللعبة ===
    let gameState = {
        score: 0,
        level: 1,
        leftWeight: 0,
        rightWeight: 0,
        draggedObject: null,
        isSoundOn: true,
        attempts: 0
    };
    
    // === تعريف الأجسام ===
    const gameObjects = [
        { id: 1, name: 'تفاحة', weight: 2, icon: '🍎', color: 'red' },
        { id: 2, name: 'كتاب', weight: 5, icon: '📚', color: 'orange' },
        { id: 3, name: 'كرة', weight: 1, icon: '⚽', color: 'blue' },
        { id: 4, name: 'قلم', weight: 1, icon: '✏️', color: 'green' }
    ];
    
    // === تهيئة اللعبة ===
    function initGame() {
        console.log('🎮 تهيئة اللعبة...');
        
        // إنشاء الأجسام
        createObjects();
        
        // إعداد مناطق الإفلات
        setupDropZones();
        
        // إعداد الأزرار
        setupButtons();
        
        // تحديث العرض
        updateDisplay();
        
        // رسالة ترحيبية
        setTimeout(() => {
            alert('🎮 مرحباً في لعبة الميزان الذكي!\n\nاسحب الأجسام إلى الكفتين لتحقيق التوازن.\n\nابدأ بتجربة سحب تفاحة إلى الكفة اليسرى!');
        }, 500);
    }
    
    // === إنشاء الأجسام ===
    function createObjects() {
        elements.objectsGrid.innerHTML = '';
        
        gameObjects.forEach(obj => {
            const objElement = document.createElement('div');
            objElement.className = 'object-item';
            objElement.draggable = true;
            objElement.dataset.id = obj.id;
            objElement.dataset.weight = obj.weight;
            objElement.dataset.name = obj.name;
            objElement.dataset.color = obj.color;
            
            // إضافة أيقونة اللون
            let iconColor = '#4a6fa5';
            switch(obj.color) {
                case 'red': iconColor = '#ff6b6b'; break;
                case 'orange': iconColor = '#ffa502'; break;
                case 'blue': iconColor = '#1e90ff'; break;
                case 'green': iconColor = '#2ed573'; break;
            }
            
            objElement.innerHTML = `
                <div class="object-icon" style="color: ${iconColor}">${obj.icon}</div>
                <div class="object-name">${obj.name}</div>
                <div class="object-weight" style="background: ${iconColor}">${obj.weight} كجم</div>
            `;
            
            // إعداد أحداث السحب
            setupDragEvents(objElement);
            
            elements.objectsGrid.appendChild(objElement);
        });
    }
    
    // === إعداد أحداث السحب ===
    function setupDragEvents(element) {
        // سحب عادي (للكمبيوتر)
        element.addEventListener('dragstart', function(e) {
            gameState.draggedObject = this;
            this.classList.add('dragging');
            this.style.opacity = '0.6';
            
            e.dataTransfer.setData('text/plain', JSON.stringify({
                id: this.dataset.id,
                weight: this.dataset.weight,
                name: this.dataset.name,
                color: this.dataset.color
            }));
            
            playSound('drag');
        });
        
        element.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            this.style.opacity = '1';
            gameState.draggedObject = null;
            
            // إزالة تأثير السحب من الكفات
            document.querySelectorAll('.objects-container').forEach(pan => {
                pan.classList.remove('drag-over');
            });
        });
        
        // سحب باللمس (للجوال)
        let touchStartX = 0;
        let touchStartY = 0;
        
        element.addEventListener('touchstart', function(e) {
            if (e.touches.length !== 1) return;
            
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            gameState.draggedObject = this;
            
            this.classList.add('dragging');
            this.style.opacity = '0.6';
            
            playSound('drag');
            e.preventDefault();
        });
        
        element.addEventListener('touchmove', function(e) {
            if (!gameState.draggedObject || e.touches.length !== 1) return;
            
            const touch = e.touches[0];
            
            // تحديد الكفة المستهدفة
            const targetPan = getTouchTargetPan(touch.clientX, touch.clientY);
            
            // إبراز الكفة
            document.querySelectorAll('.objects-container').forEach(pan => {
                pan.classList.remove('drag-over');
            });
            
            if (targetPan) {
                targetPan.classList.add('drag-over');
            }
            
            e.preventDefault();
        });
        
        element.addEventListener('touchend', function(e) {
            if (!gameState.draggedObject) return;
            
            const touch = e.changedTouches[0];
            const targetPan = getTouchTargetPan(touch.clientX, touch.clientY);
            
            if (targetPan && this.parentElement !== targetPan) {
                // إنشاء نسخة من الجسم في الكفة
                const objData = {
                    id: this.dataset.id,
                    weight: this.dataset.weight,
                    name: this.dataset.name,
                    color: this.dataset.color
                };
                
                createObjectInPan(objData, targetPan);
                playSound('drop');
            }
            
            // تنظيف
            this.classList.remove('dragging');
            this.style.opacity = '1';
            gameState.draggedObject = null;
            
            document.querySelectorAll('.objects-container').forEach(pan => {
                pan.classList.remove('drag-over');
            });
        });
    }
    
    function getTouchTargetPan(x, y) {
        const leftRect = elements.leftPan.getBoundingClientRect();
        const rightRect = elements.rightPan.getBoundingClientRect();
        
        if (x >= leftRect.left && x <= leftRect.right &&
            y >= leftRect.top && y <= leftRect.bottom) {
            return elements.leftPan;
        }
        
        if (x >= rightRect.left && x <= rightRect.right &&
            y >= rightRect.top && y <= leftRect.bottom) {
            return elements.rightPan;
        }
        
        return null;
    }
    
    // === إعداد مناطق الإفلات ===
    function setupDropZones() {
        const pans = [elements.leftPan, elements.rightPan];
        
        pans.forEach(pan => {
            // dragover للسماح بالإفلات
            pan.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });
            
            // dragleave لإزالة التأثير
            pan.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });
            
            // drop للإفلات الفعلي
            pan.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                
                // الحصول على بيانات الجسم المسحوب
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                
                // إنشاء الجسم في الكفة
                createObjectInPan(data, this);
                
                playSound('drop');
            });
        });
    }
    
    // === إنشاء الجسم في الكفة ===
    function createObjectInPan(data, pan) {
        // إزالة رسالة "فارغ" إذا كانت موجودة
        const emptyMsg = pan.querySelector('.empty-message');
        if (emptyMsg) emptyMsg.remove();
        
        // إنشاء العنصر
        const objElement = document.createElement('div');
        objElement.className = 'object-item pan-object';
        objElement.dataset.weight = data.weight;
        objElement.dataset.name = data.name;
        
        // إضافة أيقونة اللون
        let iconColor = '#4a6fa5';
        switch(data.color) {
            case 'red': iconColor = '#ff6b6b'; break;
            case 'orange': iconColor = '#ffa502'; break;
            case 'blue': iconColor = '#1e90ff'; break;
            case 'green': iconColor = '#2ed573'; break;
        }
        
        objElement.innerHTML = `
            <div style="font-size: 30px; color: ${iconColor}">${gameObjects.find(o => o.id == data.id)?.icon || '📦'}</div>
            <div style="background: ${iconColor}; color: white; padding: 3px 10px; border-radius: 15px; font-size: 12px; margin-top: 5px;">
                ${data.weight} كجم
            </div>
        `;
        
        // CSS مباشر
        objElement.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            border: 2px solid ${iconColor};
            animation: dropEffect 0.3s ease;
            margin: 5px;
            display: inline-block;
        `;
        
        // إضافة زر إزالة
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '✕';
        removeBtn.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            cursor: pointer;
            display: none;
        `;
        
        objElement.appendChild(removeBtn);
        
        // إظهار زر الإزالة عند التمرير
        objElement.addEventListener('mouseenter', () => {
            removeBtn.style.display = 'block';
        });
        
        objElement.addEventListener('mouseleave', () => {
            removeBtn.style.display = 'none';
        });
        
        // حدث الإزالة
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            objElement.remove();
            updateWeights();
            
            // إعادة رسالة "فارغ" إذا كانت الكفة خالية
            if (pan.children.length === 1) { // فقط زر الإزالة
                pan.innerHTML = `
                    <div class="empty-message">
                        <i class="fas fa-hand-point-up"></i>
                        <p>اسحب الأجسام هنا</p>
                    </div>
                `;
            }
        });
        
        pan.appendChild(objElement);
        updateWeights();
    }
    
    // === تحديث الأوزان ===
    function updateWeights() {
        gameState.leftWeight = calculateWeight(elements.leftPan);
        gameState.rightWeight = calculateWeight(elements.rightPan);
        
        gameState.attempts++;
        updateDisplay();
        updateBalance();
        updateProgress();
    }
    
    function calculateWeight(pan) {
        let total = 0;
        const objects = pan.querySelectorAll('.pan-object');
        
        objects.forEach(obj => {
            const weight = parseFloat(obj.dataset.weight) || 0;
            total += weight;
        });
        
        return total;
    }
    
    // === تحديث العرض ===
    function updateDisplay() {
        elements.leftWeight.textContent = gameState.leftWeight;
        elements.rightWeight.textContent = gameState.rightWeight;
        elements.scoreDisplay.textContent = gameState.score;
        elements.levelDisplay.textContent = gameState.level;
        
        // حساب الفرق
        const diff = Math.abs(gameState.leftWeight - gameState.rightWeight);
        elements.weightDiff.textContent = diff;
        
        // تغيير لون المعلومات
        const info = document.getElementById('balance-info');
        if (diff === 0) {
            info.style.borderColor = '#2ed573';
            info.style.background = '#e8f6ef';
        } else if (diff < 3) {
            info.style.borderColor = '#ffa502';
            info.style.background = '#fff4e6';
        } else {
            info.style.borderColor = '#ff6b6b';
            info.style.background = '#ffeaea';
        }
    }
    
    // === تحديث الميزان ===
    function updateBalance() {
        const difference = gameState.leftWeight - gameState.rightWeight;
        const maxTilt = 20;
        
        // حساب الميلان
        let tilt = 0;
        if (difference !== 0) {
            const tiltAmount = Math.min(Math.abs(difference) * 2, maxTilt);
            tilt = difference > 0 ? tiltAmount : -tiltAmount;
        }
        
        // تطبيق على الذراع
        if (elements.balanceBeam) {
            elements.balanceBeam.style.transform = `translateX(-50%) rotate(${tilt}deg)`;
        }
        
        // تحديث السهم المؤشر
        if (elements.balanceArrow) {
            const arrowPos = Math.min(Math.max(difference * 10, -150), 150);
            elements.balanceArrow.style.left = `calc(50% + ${arrowPos}px)`;
            
            // تغيير اللون
            if (difference > 3) {
                elements.balanceArrow.style.borderBottomColor = '#ff6b6b';
            } else if (difference < -3) {
                elements.balanceArrow.style.borderBottomColor = '#1e90ff';
            } else if (Math.abs(difference) <= 1) {
                elements.balanceArrow.style.borderBottomColor = '#2ed573';
            } else {
                elements.balanceArrow.style.borderBottomColor = '#ffa502';
            }
        }
    }
    
    // === تحديث التقدم ===
    function updateProgress() {
        const currentTotal = gameState.leftWeight + gameState.rightWeight;
        const target = 10; // هدف 10 كجم للمستوى 1
        const progress = Math.min((currentTotal / target) * 100, 100);
        
        elements.progressFill.style.width = progress + '%';
        elements.progressPercent.textContent = Math.round(progress) + '%';
    }
    
    // === التحقق من التوازن ===
    function checkBalance() {
        const difference = Math.abs(gameState.leftWeight - gameState.rightWeight);
        const totalWeight = gameState.leftWeight + gameState.rightWeight;
        
        let stars = 0;
        let message = '';
        let title = '';
        
        if (totalWeight === 0) {
            message = 'لم تضف أي أجسام بعد! ابدأ بسحب جسم إلى إحدى الكفتين.';
            playSound('error');
            alert(message);
            return;
        }
        
        // معايير التقييم
        if (difference === 0 && totalWeight >= 8) {
            stars = 3;
            title = 'ممتاز! 🏆';
            message = 'توازن تام! أنت خبير في الوزن والكتلة!';
            gameState.score += 30;
            playSound('success');
        } 
        else if (difference <= 2 && totalWeight >= 6) {
            stars = 2;
            title = 'جيد جداً! 👍';
            message = 'توازن جيد! حاول تتحسن أكثر!';
            gameState.score += 20;
            playSound('success');
        }
        else if (difference <= 4) {
            stars = 1;
            title = 'حسنٌ! ✓';
            message = 'ليس سيئاً! حاول تقليل الفرق بين الكفتين.';
            gameState.score += 10;
            playSound('partial');
        }
        else {
            message = 'حاول مرة أخرى! الفرق كبير بين الكفتين.';
            playSound('error');
            alert(message);
            return;
        }
        
        // عرض النتائج
        showResults(stars, title, message);
        updateDisplay();
    }
    
    // === عرض النتائج ===
    function showResults(stars, title, message) {
        elements.resultTitle.textContent = title;
        elements.resultMessage.textContent = message;
        
        // تحديث النجوم
        const starIcons = elements.starsContainer.querySelectorAll('i');
        starIcons.forEach((star, index) => {
            if (index < stars) {
                star.className = 'fas fa-star';
                star.style.color = '#ffd700';
            } else {
                star.className = 'fas fa-star empty';
                star.style.color = '#ddd';
            }
        });
        
        elements.resultsPanel.classList.add('active');
        
        // اهتزاز على الجوال
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    }
    
    // === التلميح ===
    function showHint() {
        const hint = '💡 نصيحة: حاول وضع 5 كجم في كل كفة لتحقيق التوازن!';
        alert(hint);
        playSound('hint');
    }
    
    // === إعادة التعيين ===
    function resetGame() {
        // مسح الكفات
        elements.leftPan.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-hand-point-up"></i>
                <p>اسحب الأجسام هنا</p>
            </div>
        `;
        
        elements.rightPan.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-hand-point-up"></i>
                <p>اسحب الأجسام هنا</p>
            </div>
        `;
        
        // إعادة تعيين الأوزان
        gameState.leftWeight = 0;
        gameState.rightWeight = 0;
        gameState.attempts = 0;
        
        // تحديث العرض
        updateDisplay();
        
        alert('تم إعادة التعيين! يمكنك البدء من جديد.');
        playSound('reset');
    }
    
    // === إعداد الأزرار ===
    function setupButtons() {
        if (buttons.check) {
            buttons.check.addEventListener('click', checkBalance);
        }
        
        if (buttons.reset) {
            buttons.reset.addEventListener('click', resetGame);
        }
        
        if (buttons.hint) {
            buttons.hint.addEventListener('click', showHint);
        }
        
        if (buttons.retry) {
            buttons.retry.addEventListener('click', function() {
                elements.resultsPanel.classList.remove('active');
                resetGame();
            });
        }
        
        if (buttons.closeResults) {
            buttons.closeResults.addEventListener('click', function() {
                elements.resultsPanel.classList.remove('active');
            });
        }
        
        // إغلاق النتائج بالنقر خارجها
        document.querySelector('.results-overlay')?.addEventListener('click', function() {
            elements.resultsPanel.classList.remove('active');
        });
    }
    
    // === الأصوات ===
    function playSound(type) {
        if (!gameState.isSoundOn) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'drag':
                    oscillator.frequency.value = 300;
                    gainNode.gain.value = 0.1;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 100);
                    break;
                    
                case 'drop':
                    oscillator.frequency.value = 400;
                    gainNode.gain.value = 0.15;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 150);
                    break;
                    
                case 'success':
                    oscillator.frequency.value = 523.25;
                    gainNode.gain.value = 0.2;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 500);
                    break;
                    
                case 'error':
                    oscillator.frequency.value = 220;
                    gainNode.gain.value = 0.15;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 300);
                    break;
                    
                case 'hint':
                    oscillator.frequency.value = 392;
                    gainNode.gain.value = 0.1;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 200);
                    break;
                    
                case 'reset':
                    oscillator.frequency.value = 262;
                    gainNode.gain.value = 0.1;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 200);
                    break;
            }
        } catch (e) {
            console.log('تعذر تشغيل الصوت:', e);
        }
    }
    
    // === توسيط الميزان ديناميكياً ===
    function centerBalance() {
        const beam = elements.balanceBeam;
        const area = document.querySelector('.balance-area');
        
        if (!beam || !area) return;
        
        const areaWidth = area.clientWidth;
        const screenWidth = window.innerWidth;
        
        if (areaWidth > 0) {
            // ضبط عرض الذراع حسب الشاشة
            let beamWidth = 500;
            
            if (screenWidth < 768) {
                beamWidth = 320;
            } else if (screenWidth < 992) {
                beamWidth = 400;
            }
            
            beam.style.width = beamWidth + 'px';
            beam.style.left = '50%';
            
            // ضبط موقع الكفات
            const leftPan = document.querySelector('.left-pan');
            const rightPan = document.querySelector('.right-pan');
            
            if (leftPan && rightPan) {
                const panOffset = beamWidth / 2 - 70;
                leftPan.style.right = `calc(50% + ${panOffset}px)`;
                rightPan.style.left = `calc(50% + ${panOffset}px)`;
            }
        }
    }
    
    // === تشغيل اللعبة ===
    initGame();
    
    // تشغيل توسيط الميزان
    window.addEventListener('load', centerBalance);
    window.addEventListener('resize', centerBalance);
    
    // رسالة في الكونسول
    console.log('%c⚖️ لعبة الميزان الذكي - الإصدار المصحح', 
        'color: #4a6fa5; font-size: 18px; font-weight: bold; padding: 10px; background: #f0f8ff; border-radius: 10px;');
    console.log('✅ جميع المشاكل مصححة وجاهزة للعب!');
});

// إضافة CSS للحركات
const gameStyles = document.createElement('style');
gameStyles.textContent = `
    @keyframes dropEffect {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    
    .object-item:hover {
        animation: float 2s ease-in-out infinite;
    }
`;
document.head.appendChild(gameStyles);
