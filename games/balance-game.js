// لعبة الميزان الذكي - إصلاح مشكلة السحب والإفلات
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚖️ لعبة الميزان - الإصدار المصحح');
    
    // العناصر الأساسية
    const leftPan = document.getElementById('left-objects');
    const rightPan = document.getElementById('right-objects');
    const leftWeight = document.getElementById('left-weight');
    const rightWeight = document.getElementById('right-weight');
    const balanceBeam = document.querySelector('.balance-beam');
    
    let currentLeftWeight = 0;
    let currentRightWeight = 0;
    
    // 1. إعداد الأجسام القابلة للسحب
    function setupDraggableObjects() {
        const objects = [
            { name: 'تفاحة', weight: 2, emoji: '🍎', color: '#ff6b6b' },
            { name: 'كتاب', weight: 5, emoji: '📚', color: '#ffa502' },
            { name: 'كرة', weight: 1, emoji: '⚽', color: '#1e90ff' },
            { name: 'قلم', weight: 1, emoji: '✏️', color: '#2ed573' }
        ];
        
        const container = document.getElementById('objects-grid');
        
        objects.forEach((obj, index) => {
            const objElement = document.createElement('div');
            objElement.className = 'draggable-object';
            objElement.id = `obj-${index}`;
            objElement.draggable = true;
            objElement.dataset.weight = obj.weight;
            objElement.dataset.name = obj.name;
            
            objElement.innerHTML = `
                <div style="font-size: 40px; margin-bottom: 10px;">${obj.emoji}</div>
                <div style="font-weight: bold; margin-bottom: 5px;">${obj.name}</div>
                <div style="background: ${obj.color}; color: white; padding: 5px 10px; border-radius: 15px; font-weight: bold;">
                    ${obj.weight} كجم
                </div>
            `;
            
            // إضافة CSS مباشرة
            objElement.style.cssText = `
                background: white;
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                cursor: grab;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                transition: all 0.3s;
                margin: 10px;
                border: 3px solid ${obj.color};
                user-select: none;
            `;
            
            // أحداث السحب
            objElement.addEventListener('dragstart', function(e) {
                this.style.opacity = '0.6';
                this.style.cursor = 'grabbing';
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    id: this.id,
                    weight: obj.weight,
                    name: obj.name,
                    emoji: obj.emoji,
                    color: obj.color
                }));
                console.log('بدء سحب:', obj.name);
            });
            
            objElement.addEventListener('dragend', function() {
                this.style.opacity = '1';
                this.style.cursor = 'grab';
                console.log('انتهى السحب');
            });
            
            container.appendChild(objElement);
        });
    }
    
    // 2. جعل الكفات قابلة للإفلات
    function setupDropZones() {
        const pans = [leftPan, rightPan];
        
        pans.forEach((pan, panIndex) => {
            const side = panIndex === 0 ? 'left' : 'right';
            
            // CSS للكفة
            pan.style.cssText = `
                min-height: 150px;
                border: 3px dashed #ddd;
                border-radius: 15px;
                padding: 20px;
                margin: 10px;
                background: rgba(248,249,250,0.5);
                transition: all 0.3s;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: flex-start;
                justify-content: center;
            `;
            
            // رسالة فارغة
            pan.innerHTML = `
                <div class="empty-message" style="width: 100%; text-align: center; color: #999; padding: 20px;">
                    <i class="fas fa-hand-point-up" style="font-size: 30px; margin-bottom: 10px;"></i>
                    <p style="margin: 0; font-size: 14px;">اسحب الأجسام إلى هنا</p>
                </div>
            `;
            
            // حدث dragover (السماح بالإفلات)
            pan.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.borderColor = '#17bebb';
                this.style.background = 'rgba(23, 190, 187, 0.1)';
            });
            
            // حدث dragleave
            pan.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.style.borderColor = '#ddd';
                this.style.background = 'rgba(248,249,250,0.5)';
            });
            
            // حدث drop (الإفلات الفعلي)
            pan.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.borderColor = '#ddd';
                this.style.background = 'rgba(248,249,250,0.5)';
                
                // الحصول على بيانات الجسم المسحوب
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                console.log('إفلات:', data.name, 'في الكفة', side);
                
                // إزالة رسالة "فارغ" إذا كانت موجودة
                const emptyMsg = this.querySelector('.empty-message');
                if (emptyMsg) emptyMsg.remove();
                
                // إنشاء نسخة من الجسم في الكفة
                const objCopy = createObjectCopy(data);
                this.appendChild(objCopy);
                
                // تحديث الوزن
                updateWeights();
                
                // تأثير بسيط
                objCopy.style.animation = 'popIn 0.3s ease';
                
                // صوت الإفلات
                playDropSound();
            });
        });
    }
    
    // 3. إنشاء نسخة من الجسم
    function createObjectCopy(data) {
        const copy = document.createElement('div');
        copy.className = 'object-in-pan';
        copy.dataset.weight = data.weight;
        
        copy.innerHTML = `
            <div style="font-size: 30px;">${data.emoji}</div>
            <div style="background: ${data.color}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 12px; margin-top: 5px;">
                ${data.weight} كجم
            </div>
        `;
        
        copy.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            border: 2px solid ${data.color};
            animation: popIn 0.3s ease;
        `;
        
        // زر إزالة
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
        
        copy.appendChild(removeBtn);
        
        // إظهار زر الإزالة عند التمرير
        copy.addEventListener('mouseenter', () => {
            removeBtn.style.display = 'block';
        });
        
        copy.addEventListener('mouseleave', () => {
            removeBtn.style.display = 'none';
        });
        
        // إزالة الجسم
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            copy.remove();
            updateWeights();
            
            // إعادة رسالة "فارغ" إذا كانت الكفة خالية
            const pan = copy.parentElement;
            if (pan.children.length === 0) {
                pan.innerHTML = `
                    <div class="empty-message" style="width: 100%; text-align: center; color: #999; padding: 20px;">
                        <i class="fas fa-hand-point-up" style="font-size: 30px; margin-bottom: 10px;"></i>
                        <p style="margin: 0; font-size: 14px;">اسحب الأجسام إلى هنا</p>
                    </div>
                `;
            }
        });
        
        return copy;
    }
    
    // 4. تحديث الأوزان والميزان
    function updateWeights() {
        // حساب وزن كل كفة
        currentLeftWeight = calculatePanWeight(leftPan);
        currentRightWeight = calculatePanWeight(rightPan);
        
        // تحديث العرض
        leftWeight.textContent = currentLeftWeight;
        rightWeight.textContent = currentRightWeight;
        
        // تحديث الميزان
        updateBalance();
        
        console.log('الأوزان:', { left: currentLeftWeight, right: currentRightWeight });
    }
    
    function calculatePanWeight(pan) {
        let total = 0;
        const objects = pan.querySelectorAll('.object-in-pan');
        
        objects.forEach(obj => {
            const weight = parseFloat(obj.dataset.weight) || 0;
            total += weight;
        });
        
        return total;
    }
    
    function updateBalance() {
        const difference = currentLeftWeight - currentRightWeight;
        const tilt = Math.min(Math.max(difference * 0.5, -20), 20);
        
        if (balanceBeam) {
            balanceBeam.style.transform = `rotate(${tilt}deg)`;
            balanceBeam.style.transition = 'transform 0.5s ease';
        }
        
        // تحديث السهم المؤشر
        const arrow = document.getElementById('balance-arrow');
        if (arrow) {
            const position = Math.min(Math.max(difference * 2, -100), 100);
            arrow.style.left = `calc(50% + ${position}px)`;
            arrow.style.transition = 'left 0.5s ease';
            
            // تغيير اللون حسب الاتجاه
            if (difference > 5) {
                arrow.style.borderBottomColor = '#ff4757';
            } else if (difference < -5) {
                arrow.style.borderBottomColor = '#1e90ff';
            } else if (Math.abs(difference) <= 0.5) {
                arrow.style.borderBottomColor = '#2ed573';
            } else {
                arrow.style.borderBottomColor = '#ffa502';
            }
        }
        
        // تحديث الفرق
        const diffElement = document.getElementById('weight-difference');
        if (diffElement) {
            diffElement.textContent = Math.abs(difference).toFixed(1);
        }
    }
    
    // 5. مؤثرات صوتية
    function playDropSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 400;
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            setTimeout(() => oscillator.stop(), 100);
        } catch (e) {
            console.log('لا دعم للأصوات:', e);
        }
    }
    
    // 6. إعداد أزرار التحكم
    function setupControls() {
        const checkBtn = document.getElementById('check-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        if (checkBtn) {
            checkBtn.addEventListener('click', function() {
                const difference = Math.abs(currentLeftWeight - currentRightWeight);
                
                if (difference === 0) {
                    alert('🎉 ممتاز! الميزان متوازن تماماً!');
                } else if (difference <= 2) {
                    alert(`👍 جيد جداً! الفرق صغير: ${difference.toFixed(1)} كجم`);
                } else {
                    alert(`⚠️ حاول مرة أخرى! الفرق كبير: ${difference.toFixed(1)} كجم`);
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                leftPan.innerHTML = `
                    <div class="empty-message" style="width: 100%; text-align: center; color: #999; padding: 20px;">
                        <i class="fas fa-hand-point-up" style="font-size: 30px; margin-bottom: 10px;"></i>
                        <p style="margin: 0; font-size: 14px;">اسحب الأجسام إلى هنا</p>
                    </div>
                `;
                
                rightPan.innerHTML = `
                    <div class="empty-message" style="width: 100%; text-align: center; color: #999; padding: 20px;">
                        <i class="fas fa-hand-point-up" style="font-size: 30px; margin-bottom: 10px;"></i>
                        <p style="margin: 0; font-size: 14px;">اسحب الأجسام إلى هنا</p>
                    </div>
                `;
                
                currentLeftWeight = 0;
                currentRightWeight = 0;
                updateWeights();
                
                alert('تم إعادة التعيين! يمكنك البدء من جديد.');
            });
        }
    }
    
    // 7. إضافة CSS للحركات
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes popIn {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .draggable-object:hover {
                transform: translateY(-5px) scale(1.05);
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            }
            
            .object-in-pan {
                position: relative;
            }
            
            .object-in-pan:hover {
                transform: scale(1.05);
                z-index: 10;
            }
            
            .empty-message {
                animation: float 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 8. التهيئة
    function initGame() {
        console.log('تهيئة اللعبة...');
        setupDraggableObjects();
        setupDropZones();
        setupControls();
        addStyles();
        updateWeights();
        
        console.log('✅ اللعبة جاهزة! جرب سحب تفاحة إلى إحدى الكفتين.');
        
        // رسالة ترحيبية
        setTimeout(() => {
            if (confirm('مرحباً! 🤗\n\nاسحب أي جسم إلى إحدى الكفتين وشاهد كيف يتغير الميزان.\n\nهل تريد رؤية مثال؟')) {
                // مثال توضيحي
                const sampleData = {
                    id: 'obj-0',
                    weight: 2,
                    name: 'تفاحة',
                    emoji: '🍎',
                    color: '#ff6b6b'
                };
                
                const objCopy = createObjectCopy(sampleData);
                leftPan.querySelector('.empty-message')?.remove();
                leftPan.appendChild(objCopy);
                updateWeights();
                
                alert('رائع! لقد وضعت تفاحة في الكفة اليسرى. \n\nلاحظ كيف مال الميزان! ⚖️\n\nجرب الآن وضع كتاب في الكفة اليمنى لتحقيق التوازن.');
            }
        }, 1000);
    }
    
    // بدء اللعبة
    initGame();
});
