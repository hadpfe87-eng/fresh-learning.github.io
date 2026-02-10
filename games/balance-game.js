// لعبة الميزان الذكي - الإصدار النهائي المصحح
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚖️ لعبة الميزان الذكي - الإصدار النهائي');
    
    // === العناصر الأساسية ===
    const elements = {
        leftDropZone: document.getElementById('left-drop-zone'),
        rightDropZone: document.getElementById('right-drop-zone'),
        leftWeight: document.getElementById('left-weight'),
        rightWeight: document.getElementById('right-weight'),
        weightDiff: document.getElementById('weight-difference'),
        balanceBeam: document.getElementById('balance-beam'),
        balanceArrow: document.getElementById('balance-arrow'),
        objectsGrid: document.getElementById('objects-grid'),
        scoreDisplay: document.getElementById('score'),
        levelDisplay: document.getElementById('level'),
        progressFill: document.getElementById('progress-fill'),
        progressPercent: document.getElementById('progress-percent'),
        checkBtn: document.getElementById('check-btn'),
        resetBtn: document.getElementById('reset-btn'),
        hintBtn: document.getElementById('hint-btn'),
        resultsPanel: document.getElementById('results-panel'),
        resultTitle: document.getElementById('result-title'),
        resultMessage: document.getElementById('result-message'),
        starsContainer: document.getElementById('stars-container'),
        retryBtn: document.getElementById('retry-btn'),
        closeResults: document.getElementById('close-results')
    };
    
    // === حالة اللعبة ===
    let gameState = {
        score: 0,
        level: 1,
        leftWeight: 0,
        rightWeight: 0,
        draggedObject: null,
        isSoundOn: true,
        attempts: 0,
        objectsInPans: {
            left: [],
            right: []
        }
    };
    
    // === تعريف الأجسام ===
    const gameObjects = [
        { id: 1, name: 'تفاحة', weight: 2, icon: '🍎', color: 'red', emoji: '🍎' },
        { id: 2, name: 'كتاب', weight: 5, icon: '📚', color: 'orange', emoji: '📚' },
        { id: 3, name: 'كرة', weight: 1, icon: '⚽', color: 'blue', emoji: '⚽' },
        { id: 4, name: 'قلم', weight: 1, icon: '✏️', color: 'green', emoji: '✏️' },
        { id: 5, name: 'زجاجة', weight: 3, icon: '🧴', color: 'purple', emoji: '🧴' }
    ];
    
    // === تهيئة اللعبة ===
    function initGame() {
        console.log('🎮 بدء اللعبة...');
        
        // إنشاء الأجسام
        createObjects();
        
        // إعداد مناطق الإفلات
        setupDropZones();
        
        // إعداد الأزرار
        setupButtons();
        
        // إعداد الأصوات
        setupAudio();
        
        // تحديث العرض
        updateDisplay();
        
        // توسيط الميزان
        centerBalance();
        
        // رسالة ترحيبية
        setTimeout(() => {
            showMessage('🎮 مرحباً في لعبة الميزان الذكي!<br><br>اسحب الأجسام إلى الكفتين لتحقيق التوازن.', 'info');
        }, 800);
        
        console.log('✅ اللعبة جاهزة!');
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
            objElement.dataset.emoji = obj.emoji;
            
            // تحديد لون الأيقونة
            let iconColor = '#4a6fa5';
            switch(obj.color) {
                case 'red': iconColor = '#ff6b6b'; break;
                case 'orange': iconColor = '#ffa502'; break;
                case 'blue': iconColor = '#1e90ff'; break;
                case 'green': iconColor = '#2ed573'; break;
                case 'purple': iconColor = '#9c88ff'; break;
            }
            
            objElement.innerHTML = `
                <div class="object-icon" style="color: ${iconColor}">${obj.emoji}</div>
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
        // السحب العادي (للحاسوب)
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        
        // السحب باللمس (للجوال)
        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd);
        
        // منع السلوك الافتراضي
        element.addEventListener('drag', (e) => e.preventDefault());
    }
    
    function handleDragStart(e) {
        gameState.draggedObject = this;
        this.classList.add('dragging');
        
        e.dataTransfer.setData('text/plain', JSON.stringify({
            id: this.dataset.id,
            weight: this.dataset.weight,
            name: this.dataset.name,
            color: this.dataset.color,
            emoji: this.dataset.emoji
        }));
        
        playSound('drag');
    }
    
    function handleDragEnd() {
        if (gameState.draggedObject) {
            gameState.draggedObject.classList.remove('dragging');
            gameState.draggedObject = null;
        }
        
        // إزالة تأثير السحب من المناطق
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });
    }
    
    function handleTouchStart(e) {
        if (e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        gameState.draggedObject = this;
        
        this.classList.add('dragging');
        this.style.opacity = '0.7';
        
        // إنشاء نسخة شبحية
        createTouchGhost(this, touch.clientX, touch.clientY);
        
        playSound('drag');
        e.preventDefault();
    }
    
    function handleTouchMove(e) {
        if (!gameState.draggedObject || e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const ghost = document.querySelector('.touch-ghost');
        
        if (ghost) {
            ghost.style.left = (touch.clientX - 60) + 'px';
            ghost.style.top = (touch.clientY - 60) + 'px';
        }
        
        // تحديد المنطقة المستهدفة
        const targetZone = getTouchTargetZone(touch.clientX, touch.clientY);
        highlightTargetZone(targetZone);
        
        e.preventDefault();
    }
    
    function handleTouchEnd(e) {
        if (!gameState.draggedObject) return;
        
        const touch = e.changedTouches[0];
        const targetZone = getTouchTargetZone(touch.clientX, touch.clientY);
        
        // إزالة الشبح
        const ghost = document.querySelector('.touch-ghost');
        if (ghost) ghost.remove();
        
        // إضافة الجسم إذا كان هناك منطقة مستهدفة
        if (targetZone) {
            const objData = {
                id: gameState.draggedObject.dataset.id,
                weight: gameState.draggedObject.dataset.weight,
                name: gameState.draggedObject.dataset.name,
                color: gameState.draggedObject.dataset.color,
                emoji: gameState.draggedObject.dataset.emoji
            };
            
            addObjectToZone(objData, targetZone);
            playSound('drop');
        }
        
        // تنظيف
        gameState.draggedObject.classList.remove('dragging');
        gameState.draggedObject.style.opacity = '';
        gameState.draggedObject = null;
        
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });
    }
    
    function createTouchGhost(element, x, y) {
        const ghost = element.cloneNode(true);
        ghost.classList.add('touch-ghost');
        ghost.style.position = 'fixed';
        ghost.style.zIndex = '9999';
        ghost.style.left = (x - 60) + 'px';
        ghost.style.top = (y - 60) + 'px';
        ghost.style.transform = 'scale(1.1) rotate(5deg)';
        ghost.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
        ghost.style.opacity = '0.8';
        ghost.style.pointerEvents = 'none';
        
        document.body.appendChild(ghost);
    }
    
    function getTouchTargetZone(x, y) {
        const leftRect = elements.leftDropZone.getBoundingClientRect();
        const rightRect = elements.rightDropZone.getBoundingClientRect();
        
        if (x >= leftRect.left && x <= leftRect.right &&
            y >= leftRect.top && y <= leftRect.bottom) {
            return elements.leftDropZone;
        }
        
        if (x >= rightRect.left && x <= rightRect.right &&
            y >= rightRect.top && y <= rightRect.bottom) {
            return elements.rightDropZone;
        }
        
        return null;
    }
    
    function highlightTargetZone(zone) {
        document.querySelectorAll('.drop-zone').forEach(z => {
            z.classList.remove('drag-over');
        });
        
        if (zone) {
            zone.classList.add('drag-over');
        }
    }
    
    // === إعداد مناطق الإفلات ===
    function setupDropZones() {
        const dropZones = [elements.leftDropZone, elements.rightDropZone];
        
        dropZones.forEach(zone => {
            // السماح بالإفلات
            zone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });
            
            // إزالة التأثير
            zone.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });
            
            // الإفلات الفعلي
            zone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                
                try {
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    addObjectToZone(data, this);
                    playSound('drop');
                } catch (error) {
                    console.log('Error parsing dropped data:', error);
                }
            });
        });
    }
    
    function addObjectToZone(data, zone) {
        // إزالة رسالة "فارغ"
        const emptyMsg = zone.querySelector('.drop-message');
        if (emptyMsg) emptyMsg.remove();
        
        // إنشاء عنصر الجسم
        const objElement = document.createElement('div');
        objElement.className = 'object-in-pan';
        objElement.dataset.weight = data.weight;
        objElement.dataset.id = data.id;
        objElement.dataset.name = data.name;
        
        // تحديد اللون
        let iconColor = '#4a6fa5';
        switch(data.color) {
            case 'red': iconColor = '#ff6b6b'; break;
            case 'orange': iconColor = '#ffa502'; break;
            case 'blue': iconColor = '#1e90ff'; break;
            case 'green': iconColor = '#2ed573'; break;
            case 'purple': iconColor = '#9c88ff'; break;
        }
        
        objElement.innerHTML = `
            <div style="font-size: 28px;">${data.emoji}</div>
            <div style="background: ${iconColor}; color: white; padding: 4px 12px; border-radius: 15px; font-size: 13px; margin-top: 8px;">
                ${data.weight} كجم
            </div>
        `;
        
        // CSS مباشر
        objElement.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 3px solid ${iconColor};
            animation: dropIn 0.3s ease;
            margin: 8px;
            display: inline-block;
            position: relative;
            cursor: pointer;
        `;
        
        // إضافة زر الإزالة
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '✕';
        removeBtn.title = 'إزالة الجسم';
        removeBtn.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 14px;
            cursor: pointer;
            display: none;
            z-index: 100;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
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
            
            // إعادة رسالة "فارغ" إذا كانت المنطقة خالية
            if (zone.children.length === 0) {
                zone.innerHTML = `
                    <div class="drop-message">
                        <i class="fas fa-hand-point-up"></i>
                        <p>اسحب الأجسام هنا</p>
                    </div>
                `;
            }
        });
        
        // Click to remove on touch devices
        objElement.addEventListener('touchend', function(e) {
            if (e.touches && e.touches.length === 0) {
                e.preventDefault();
                setTimeout(() => {
                    if (!removeBtn.matches(':hover')) {
                        removeBtn.style.display = removeBtn.style.display === 'block' ? 'none' : 'block';
                    }
                }, 100);
            }
        });
        
        zone.appendChild(objElement);
        updateWeights();
    }
    
    // === تحديث الأوزان ===
    function updateWeights() {
        gameState.leftWeight = calculateWeight(elements.leftDropZone);
        gameState.rightWeight = calculateWeight(elements.rightDropZone);
        
        gameState.attempts++;
        updateDisplay();
        updateBalance();
        updateProgress();
        
        console.log('📊 تحديث الأوزان:', {
            left: gameState.leftWeight,
            right: gameState.rightWeight,
            attempts: gameState.attempts
        });
    }
    
    function calculateWeight(zone) {
        let total = 0;
        const objects = zone.querySelectorAll('.object-in-pan');
        
        objects.forEach(obj => {
            const weight = parseFloat(obj.dataset.weight) || 0;
            total += weight;
        });
        
        return total;
    }
    
    // === تحديث العرض ===
    function updateDisplay() {
        // تحديث الأوزان
        elements.leftWeight.textContent = gameState.leftWeight;
        elements.rightWeight.textContent = gameState.rightWeight;
        
        // تحديث النقاط والمستوى
        elements.scoreDisplay.textContent = gameState.score;
        elements.levelDisplay.textContent = gameState.level;
        
        // حساب الفرق
        const diff = Math.abs(gameState.leftWeight - gameState.rightWeight);
        elements.weightDiff.textContent = diff;
        
        // تحديث لون معلومات التوازن
        const infoElement = document.getElementById('balance-info');
        if (infoElement) {
            if (diff === 0) {
                infoElement.style.borderColor = '#2ed573';
                infoElement.style.background = '#e8f6ef';
                infoElement.style.color = '#155724';
            } else if (diff < 3) {
                infoElement.style.borderColor = '#ffa502';
                infoElement.style.background = '#fff4e6';
                infoElement.style.color = '#856404';
            } else {
                infoElement.style.borderColor = '#ff6b6b';
                infoElement.style.background = '#ffeaea';
                infoElement.style.color = '#721c24';
            }
        }
    }
    
    // === تحديث الميزان ===
    function updateBalance() {
        const difference = gameState.leftWeight - gameState.rightWeight;
        const maxTilt = 25;
        
        // حساب الميلان
        let tilt = 0;
        if (difference !== 0) {
            tilt = Math.min(Math.max(difference * 1.5, -maxTilt), maxTilt);
        }
        
        // تطبيق الميلان على الذراع
        if (elements.balanceBeam) {
            elements.balanceBeam.style.transform = `translateX(-50%) rotate(${tilt}deg)`;
        }
        
        // تحديث السهم المؤشر
        if (elements.balanceArrow) {
            const arrowPos = Math.min(Math.max(difference * 8, -120), 120);
            elements.balanceArrow.style.left = `calc(50% + ${arrowPos}px)`;
            
            // تغيير لون السهم حسب الاتجاه
            if (difference > 5) {
                elements.balanceArrow.style.borderBottomColor = '#ff6b6b';
            } else if (difference < -5) {
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
        const target = 12; // هدف 12 كجم
        const progress = Math.min((currentTotal / target) * 100, 100);
        
        elements.progressFill.style.width = progress + '%';
        elements.progressPercent.textContent = Math.round(progress) + '%';
        
        // تغيير لون شريط التقدم
        if (progress >= 100) {
            elements.progressFill.style.background = 'linear-gradient(90deg, #2ed573, #28a745)';
        } else if (progress >= 50) {
            elements.progressFill.style.background = 'linear-gradient(90deg, #ffa502, #ff9800)';
        } else {
            elements.progressFill.style.background = 'linear-gradient(90deg, #17bebb, #4a6fa5)';
        }
    }
    
    // === توسيط الميزان ===
    function centerBalance() {
        const beam = elements.balanceBeam;
        if (!beam) return;
        
        const screenWidth = window.innerWidth;
        let beamWidth = 600;
        
        if (screenWidth < 768) {
            beamWidth = 320;
        } else if (screenWidth < 992) {
            beamWidth = 500;
        } else if (screenWidth < 1200) {
            beamWidth = 550;
        }
        
        beam.style.width = beamWidth + 'px';
        
        // تحديث موقع الكفات
        const leftPan = document.querySelector('.left-pan');
        const rightPan = document.querySelector('.right-pan');
        
        if (leftPan && rightPan) {
            const panOffset = beamWidth / 2 - 80;
            leftPan.style.right = `calc(50% + ${panOffset}px)`;
            rightPan.style.left = `calc(50% + ${panOffset}px)`;
        }
    }
    
    // === التحقق من التوازن ===
    function checkBalance() {
        const difference = Math.abs(gameState.leftWeight - gameState.rightWeight);
        const totalWeight = gameState.leftWeight + gameState.rightWeight;
        
        // التحقق من وجود أجسام
        if (totalWeight === 0) {
            showMessage('⚠️ لم تضف أي أجسام بعد! ابدأ بسحب جسم إلى إحدى الكفتين.', 'warning');
            playSound('error');
            return;
        }
        
        let stars = 0;
        let title = '';
        let message = '';
        
        // تقييم الأداء
        if (difference === 0 && totalWeight >= 10) {
            stars = 3;
            title = 'ممتاز! 🏆';
            message = 'توازن تام! أنت خبير في الوزن والكتلة!';
            gameState.score += 50;
            playSound('success');
        } 
        else if (difference <= 2 && totalWeight >= 8) {
            stars = 2;
            title = 'جيد جداً! 👍';
            message = 'توازن جيد! حاول تتحسن أكثر في المرة القادمة.';
            gameState.score += 30;
            playSound('success');
        }
        else if (difference <= 4) {
            stars = 1;
            title = 'حسنٌ! ✓';
            message = 'ليس سيئاً! حاول تقليل الفرق بين الكفتين.';
            gameState.score += 15;
            playSound('partial');
        }
        else {
            showMessage(`⚠️ حاول مرة أخرى! الفرق كبير: ${difference} كجم. حاول تحقيق توازن أفضل.`, 'error');
            playSound('error');
            return;
        }
        
        // عرض النتائج
        showResults(stars, title, message);
        updateDisplay();
    }
    
    // === عرض النتائج ===
    function showResults(stars, title, message) {
        elements.resultTitle.textContent = title;
        elements.resultMessage.innerHTML = message;
        
        // تحديث النجوم
        const starIcons = elements.starsContainer.querySelectorAll('i');
        starIcons.forEach((star, index) => {
            if (index < stars) {
                star.className = 'fas fa-star';
                star.style.color = '#ffd700';
                star.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            } else {
                star.className = 'fas fa-star empty';
                star.style.color = '#ddd';
                star.style.textShadow = 'none';
            }
        });
        
        elements.resultsPanel.classList.add('active');
        
        // اهتزاز على الجوال
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100, 50, 100]);
        }
    }
    
    // === التلميح ===
    function showHint() {
        const hint = '💡 نصيحة: حاول وضع نفس الوزن في كل كفة. مثلاً: كتاب (5 كجم) في كفة وتفاحة + قلم + كرة (2+1+1=4 كجم) في الكفة الأخرى، ثم أضف جسمًا خفيفًا للتوازن.';
        showMessage(hint, 'info');
        playSound('hint');
    }
    
    // === إعادة التعيين ===
    function resetGame() {
        console.log('🔄 إعادة تعيين اللعبة...');
        
        // مسح مناطق الإفلات
        elements.leftDropZone.innerHTML = `
            <div class="drop-message">
                <i class="fas fa-hand-point-up"></i>
                <p>اسحب الأجسام هنا</p>
            </div>
        `;
        
        elements.rightDropZone.innerHTML = `
            <div class="drop-message">
                <i class="fas fa-hand-point-up"></i>
                <p>اسحب الأجسام هنا</p>
            </div>
        `;
        
        // إعادة تعيين الأوزان
        gameState.leftWeight = 0;
        gameState.rightWeight = 0;
        gameState.attempts = 0;
        // Note: Not resetting score or level intentionally
        
        // إعادة تعيين الميزان
        if (elements.balanceBeam) {
            elements.balanceBeam.style.transform = 'translateX(-50%) rotate(0deg)';
        }
        
        if (elements.balanceArrow) {
            elements.balanceArrow.style.left = 'calc(50% + 0px)';
            elements.balanceArrow.style.borderBottomColor = '#17bebb';
        }
        
        // إعادة تعيين شريط التقدم
        elements.progressFill.style.width = '0%';
        elements.progressPercent.textContent = '0%';
        elements.progressFill.style.background = 'linear-gradient(90deg, #17bebb, #4a6fa5)';
        
        // تحديث العرض
        updateDisplay();
        
        // إغلاق لوحة النتائج إذا كانت مفتوحة
        elements.resultsPanel.classList.remove('active');
        
        showMessage('🔄 تم إعادة التعيين! يمكنك البدء من جديد.', 'success');
        playSound('reset');
    }
    
    // === إعداد الأزرار ===
    function setupButtons() {
        // زر التحقق
        elements.checkBtn.addEventListener('click', checkBalance);
        
        // زر إعادة المحاولة (الموجود في لوحة التحكم)
        elements.resetBtn.addEventListener('click', function() {
            console.log('🔄 زر إعادة المحاولة الرئيسي تم النقر عليه');
            resetGame();
        });
        
        // زر التلميح
        elements.hintBtn.addEventListener('click', showHint);
        
        // زر إعادة المحاولة (الموجود في لوحة النتائج) - FIXED
        elements.retryBtn.addEventListener('click', function() {
            console.log('🔄 زر إعادة المحاولة في النتائج تم النقر عليه');
            elements.resultsPanel.classList.remove('active');
            resetGame();
        });
        
        // زر إغلاق النتائج
        elements.closeResults.addEventListener('click', function() {
            elements.resultsPanel.classList.remove('active');
        });
        
        // إغلاق النتائج بالنقر خارجها
        document.querySelector('.results-overlay').addEventListener('click', function() {
            elements.resultsPanel.classList.remove('active');
        });
        
        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                checkBalance();
            } else if (e.key === 'r' || e.key === 'R') {
                resetGame();
            } else if (e.key === 'h' || e.key === 'H') {
                showHint();
            }
        });
    }
    
    // === الأصوات ===
    function setupAudio() {
        // إضافة CSS للصوت
        const audioStyle = document.createElement('style');
        audioStyle.textContent = `
            @keyframes dropIn {
                0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            
            .touch-ghost {
                animation: floatGhost 0.3s ease;
            }
            
            @keyframes floatGhost {
                0% { transform: scale(1) rotate(0deg); }
                100% { transform: scale(1.1) rotate(5deg); }
            }
        `;
        document.head.appendChild(audioStyle);
    }
    
    function playSound(type) {
        if (!gameState.isSoundOn) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            switch(type) {
                case 'drag':
                    playBeep(audioContext, 300, 0.1, 0.1);
                    break;
                case 'drop':
                    playBeep(audioContext, 400, 0.15, 0.15);
                    break;
                case 'success':
                    playSuccessSound(audioContext);
                    break;
                case 'error':
                    playBeep(audioContext, 220, 0.15, 0.3);
                    break;
                case 'hint':
                    playBeep(audioContext, 392, 0.1, 0.2);
                    break;
                case 'partial':
                    playBeep(audioContext, 330, 0.12, 0.25);
                    break;
                case 'reset':
                    playBeep(audioContext, 262, 0.1, 0.2);
                    break;
            }
        } catch (e) {
            console.log('تعذر تشغيل الصوت:', e);
        }
    }
    
    function playBeep(audioContext, frequency, volume, duration) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        gainNode.gain.value = volume;
        
        oscillator.start();
        setTimeout(() => oscillator.stop(), duration * 1000);
    }
    
    function playSuccessSound(audioContext) {
        // نغمة نجاح متعددة
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        const duration = 0.15;
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                playBeep(audioContext, freq, 0.2, duration);
            }, index * duration * 1000);
        });
    }
    
    // === عرض الرسائل ===
    function showMessage(text, type = 'info') {
        // إزالة أي رسالة سابقة
        const existingMsg = document.querySelector('.game-message');
        if (existingMsg) existingMsg.remove();
        
        // إنشاء الرسالة
        const message = document.createElement('div');
        message.className = `game-message message-${type}`;
        message.innerHTML = text;
        
        // إضافة CSS
        message.style.cssText = `
            position: fixed;
            top: 100px;
            right: 50%;
            transform: translateX(50%);
            background: ${type === 'error' ? '#ff6b6b' : 
                        type === 'warning' ? '#ffa502' : 
                        type === 'success' ? '#2ed573' : '#4a6fa5'};
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 9999;
            font-size: 18px;
            text-align: center;
            max-width: 90%;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        // إزالة تلقائية بعد 5 ثوان
        setTimeout(() => {
            if (message.parentElement) {
                message.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => message.remove(), 300);
            }
        }, 5000);
        
        // إضافة أنيميشن
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            @keyframes slideDown {
                from { transform: translateX(50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(50%) translateY(0); opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateX(50%) translateY(0); opacity: 1; }
                to { transform: translateX(50%) translateY(-100%); opacity: 0; }
            }
        `;
        document.head.appendChild(animationStyle);
    }
    
    // === بدء اللعبة ===
    initGame();
    
    // إضافة أحداث تغيير الحجم
    window.addEventListener('resize', centerBalance);
    window.addEventListener('orientationchange', function() {
        setTimeout(centerBalance, 100);
    });
    
    // رسالة في الكونسول
    console.log('%c⚖️ لعبة الميزان الذكي - الإصدار النهائي', 
        'color: #4a6fa5; font-size: 20px; font-weight: bold; padding: 15px; background: linear-gradient(135deg, #f0f8ff, #e3f2fd); border-radius: 10px; border: 2px solid #4a6fa5;');
    console.log('✅ جميع المشاكل محلولة:');
    console.log('   - الميزان في المركز');
    console.log('   - قاعدة الميزان ظاهرة');
    console.log('   - لا تداخل مع الأزرار');
    console.log('   - السحب والإفلات يعمل');
    console.log('   - زر إعادة المحاولة يعمل الآن بشكل صحيح');
    console.log('   - النظام كامل وجاهز للعب!');
});
