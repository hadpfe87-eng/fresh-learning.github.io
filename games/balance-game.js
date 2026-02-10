// إضافة دعم اللمس الكامل للعبة الميزان

document.addEventListener('DOMContentLoaded', function() {
    // ... الكود السابق يبقى كما هو ...
    
    // إضافة دعم السحب باللمس
    function setupTouchEvents() {
        const objectItems = document.querySelectorAll('.object-item');
        const panContainers = [leftPanContainer, rightPanContainer];
        
        objectItems.forEach(item => {
            // بدء السحب باللمس
            item.addEventListener('touchstart', handleTouchStart, { passive: true });
            
            // منع سلوك المتصفح الافتراضي
            item.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, { passive: false });
            
            // إنهاء السحب باللمس
            item.addEventListener('touchend', handleTouchEnd);
        });
        
        panContainers.forEach(container => {
            container.addEventListener('touchmove', handleTouchMove, { passive: false });
            container.addEventListener('touchend', handleTouchDrop);
        });
    }
    
    // متغيرات لتتبع اللمس
    let touchStartX = 0;
    let touchStartY = 0;
    let currentTouchItem = null;
    let touchGhost = null;
    
    function handleTouchStart(e) {
        if (e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        currentTouchItem = this;
        
        // إنشاء نسخة شبحية للجسم
        createTouchGhost(this);
        
        // إضافة تأثير اللمس
        this.style.opacity = '0.7';
        this.classList.add('dragging');
        
        e.preventDefault();
    }
    
    function handleTouchMove(e) {
        if (!currentTouchItem || e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        // تحريك الشبح
        if (touchGhost) {
            touchGhost.style.left = (touch.clientX - 50) + 'px';
            touchGhost.style.top = (touch.clientY - 50) + 'px';
        }
        
        // تحديد الكفة التي فوقها المستخدم
        const targetPan = getTouchTargetPan(touch.clientX, touch.clientY);
        
        // إبراز الكفة المستهدفة
        panContainers.forEach(container => {
            container.classList.remove('drag-over');
        });
        
        if (targetPan) {
            targetPan.classList.add('drag-over');
        }
        
        e.preventDefault();
    }
    
    function handleTouchEnd(e) {
        if (!currentTouchItem) return;
        
        // إزالة الشبح
        if (touchGhost) {
            touchGhost.remove();
            touchGhost = null;
        }
        
        // تحديد موقع الإفلات
        const touch = e.changedTouches[0];
        const targetPan = getTouchTargetPan(touch.clientX, touch.clientY);
        
        if (targetPan && currentTouchItem.parentNode !== targetPan) {
            // نقل الجسم إلى الكفة الجديدة
            targetPan.appendChild(currentTouchItem);
            
            // تحديث الوزن
            const weight = parseFloat(currentTouchItem.dataset.weight);
            
            if (targetPan === leftPanContainer) {
                leftWeight += weight;
            } else {
                rightWeight += weight;
            }
            
            updateDisplay();
            playSound('drop');
        }
        
        // إعادة العنصر لحالته الطبيعية
        currentTouchItem.style.opacity = '';
        currentTouchItem.classList.remove('dragging');
        
        // إزالة الإبراز من الكفات
        panContainers.forEach(container => {
            container.classList.remove('drag-over');
        });
        
        currentTouchItem = null;
    }
    
    function handleTouchDrop(e) {
        // معالجة الإفلات في الكفة
        if (currentTouchItem && this.classList.contains('drag-over')) {
            if (this !== currentTouchItem.parentNode) {
                this.appendChild(currentTouchItem);
                
                const weight = parseFloat(currentTouchItem.dataset.weight);
                
                if (this === leftPanContainer) {
                    leftWeight += weight;
                } else {
                    rightWeight += weight;
                }
                
                updateDisplay();
                playSound('drop');
            }
        }
        
        this.classList.remove('drag-over');
    }
    
    function createTouchGhost(item) {
        touchGhost = item.cloneNode(true);
        touchGhost.classList.add('touch-ghost');
        touchGhost.style.position = 'fixed';
        touchGhost.style.zIndex = '10000';
        touchGhost.style.pointerEvents = 'none';
        touchGhost.style.transform = 'scale(1.1)';
        touchGhost.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        touchGhost.style.opacity = '0.9';
        
        document.body.appendChild(touchGhost);
    }
    
    function getTouchTargetPan(x, y) {
        const leftRect = leftPanContainer.getBoundingClientRect();
        const rightRect = rightPanContainer.getBoundingClientRect();
        
        // التحقق من الاصطدام مع الكفة اليسرى
        if (x >= leftRect.left && x <= leftRect.right &&
            y >= leftRect.top && y <= leftRect.bottom) {
            return leftPanContainer;
        }
        
        // التحقق من الاصطدام مع الكفة اليمنى
        if (x >= rightRect.left && x <= rightRect.right &&
            y >= rightRect.top && y <= rightRect.bottom) {
            return rightPanContainer;
        }
        
        return null;
    }
    
    // إضافة CSS للشبح
    const style = document.createElement('style');
    style.textContent = `
        .touch-ghost {
            animation: ghostFloat 0.3s ease;
        }
        
        @keyframes ghostFloat {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
        
        /* تحسينات للجوال */
        @media (max-width: 768px) {
            .object-item {
                -webkit-tap-highlight-color: transparent;
            }
            
            .object-item:active {
                animation: touchFeedback 0.2s ease;
            }
            
            @keyframes touchFeedback {
                0% { transform: scale(1); }
                50% { transform: scale(0.95); }
                100% { transform: scale(1); }
            }
        }
    `;
    document.head.appendChild(style);
    
    // تحسين دعم اللمس في نافذة النتائج
    resultsPanel.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    });
    
    // إضافة تأثير الاهتزاز على الجوال عند النجاح
    function vibrateOnSuccess() {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    }
    
    // تحديث دالة checkBalance
    const originalCheckBalance = checkBalance;
    checkBalance = function() {
        originalCheckBalance();
        
        // اهتزاز على الجوال عند النجاح
        const weightDifference = Math.abs(leftWeight - rightWeight);
        if (weightDifference <= 2) {
            vibrateOnSuccess();
        }
    };
    
    // تهيئة أحداث اللمس بعد تحميل الصفحة
    setTimeout(() => {
        setupTouchEvents();
    }, 500);
    
    // ... بقية الكود السابق ...
});
