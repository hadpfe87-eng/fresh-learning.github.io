// جهاز كاشف وتحسين الأداء للأجهزة المختلفة
class DeviceOptimizer {
    constructor() {
        this.deviceType = this.detectDevice();
        this.orientation = this.getOrientation();
        this.init();
    }
    
    detectDevice() {
        const userAgent = navigator.userAgent;
        const screenWidth = window.screen.width;
        
        if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
            return screenWidth < 768 ? 'mobile' : 'tablet';
        }
        return 'desktop';
    }
    
    getOrientation() {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }
    
    init() {
        this.applyDeviceSpecificOptimizations();
        this.setupEventListeners();
        this.logDeviceInfo();
    }
    
    applyDeviceSpecificOptimizations() {
        const body = document.body;
        
        // إضافة فئة حسب نوع الجهاز
        body.classList.add(`device-${this.deviceType}`);
        body.classList.add(`orientation-${this.orientation}`);
        
        // تحسينات خاصة بكل جهاز
        switch(this.deviceType) {
            case 'mobile':
                this.optimizeForMobile();
                break;
            case 'tablet':
                this.optimizeForTablet();
                break;
            case 'desktop':
                this.optimizeForDesktop();
                break;
        }
    }
    
    optimizeForMobile() {
        console.log('تطبيق تحسينات للجوال...');
        
        // تقليل أحجام الخطوط
        document.documentElement.style.fontSize = '14px';
        
        // تحسين عناصر اللمس
        const buttons = document.querySelectorAll('button, .btn, .control-btn');
        buttons.forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
        });
        
        // تحسين التمرير
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // إضافة نافذة الرسائل للجوال
        this.setupMobileMessaging();
    }
    
    optimizeForTablet() {
        console.log('تطبيق تحسينات للتابلت...');
        
        // تحسين حجم الخط
        document.documentElement.style.fontSize = '16px';
        
        // تحسين تخطيط الألعاب
        const gameAreas = document.querySelectorAll('.game-area');
        gameAreas.forEach(area => {
            area.style.maxWidth = '90%';
            area.style.margin = '0 auto';
        });
    }
    
    optimizeForDesktop() {
        console.log('تطبيق تحسينات للحاسوب...');
        
        // تحسين الخطوط للشاشات الكبيرة
        document.documentElement.style.fontSize = '18px';
        
        // إضافة تأثيرات Hover
        this.addHoverEffects();
    }
    
    setupMobileMessaging() {
        // رسالة ترحيبية للجوال
        if (this.deviceType === 'mobile') {
            setTimeout(() => {
                if (confirm('مرحباً! للعب اسحب الأجسام بإصبعك إلى إحدى كفتي الميزان. هل تريد رؤية التعليمات؟')) {
                    document.querySelector('.instructions-panel').scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }, 1000);
        }
    }
    
    addHoverEffects() {
        // إضافة تأثيرات hover فقط على الحاسوب
        if (this.deviceType === 'desktop') {
            const gameCards = document.querySelectorAll('.game-card');
            
            gameCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
        }
    }
    
    setupEventListeners() {
        // كشف تغيير الاتجاه
        window.addEventListener('resize', () => {
            const newOrientation = this.getOrientation();
            if (newOrientation !== this.orientation) {
                this.orientation = newOrientation;
                this.handleOrientationChange();
            }
        });
        
        // كشف تغيير حجم الشاشة
        window.addEventListener('resize', this.debounce(() => {
            const newDeviceType = this.detectDevice();
            if (newDeviceType !== this.deviceType) {
                this.deviceType = newDeviceType;
                this.applyDeviceSpecificOptimizations();
            }
        }, 250));
    }
    
    handleOrientationChange() {
        console.log(`تغيير الاتجاه إلى: ${this.orientation}`);
        
        const body = document.body;
        body.classList.remove('orientation-landscape', 'orientation-portrait');
        body.classList.add(`orientation-${this.orientation}`);
        
        // إشعار عند تغيير الاتجاه على الجوال
        if (this.deviceType === 'mobile' && this.orientation === 'landscape') {
            this.showOrientationMessage('لأفضل تجربة، ننصح باستخدام الوضع الرأسي');
        }
    }
    
    showOrientationMessage(message) {
        const msg = document.createElement('div');
        msg.className = 'orientation-message';
        msg.innerHTML = `
            <div class="message-content">
                <i class="fas fa-mobile-alt"></i>
                <span>${message}</span>
                <button class="close-btn">✕</button>
            </div>
        `;
        
        // إضافة CSS للرسالة
        const style = document.createElement('style');
        style.textContent = `
            .orientation-message {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #4a6fa5, #166088);
                color: white;
                padding: 10px 15px;
                z-index: 10000;
                animation: slideDown 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            @keyframes slideDown {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
            
            .message-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                font-size: 14px;
            }
            
            .message-content i {
                font-size: 18px;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-right: auto;
            }
            
            @media (max-width: 480px) {
                .message-content {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // إضافة الرسالة وإزالتها عند النقر
        document.body.appendChild(msg);
        
        msg.querySelector('.close-btn').addEventListener('click', () => {
            msg.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        });
        
        // إزالة تلقائية بعد 5 ثوان
        setTimeout(() => {
            if (document.body.contains(msg)) {
                msg.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => msg.remove(), 300);
            }
        }, 5000);
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    logDeviceInfo() {
        console.log(`نوع الجهاز: ${this.deviceType}`);
        console.log(`الاتجاه: ${this.orientation}`);
        console.log(`عرض الشاشة: ${window.innerWidth}px`);
        console.log(`ارتفاع الشاشة: ${window.innerHeight}px`);
        console.log(`نسبة البكسل: ${window.devicePixelRatio}`);
    }
    
    // وظائف مساعدة
    static isTouchDevice() {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               navigator.msMaxTouchPoints > 0;
    }
    
    static isLowPerformanceDevice() {
        const memory = navigator.deviceMemory;
        const cores = navigator.hardwareConcurrency;
        
        return memory < 4 || cores < 4;
    }
}

// تهيئة المحسن عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const optimizer = new DeviceOptimizer();
    
    // إضافة تحسينات للأجهزة الضعيفة
    if (DeviceOptimizer.isLowPerformanceDevice()) {
        console.log('تطبيق تحسينات للأداء...');
        
        // تقليل الرسوم المتحركة
        document.documentElement.style.setProperty('--animation-speed', '0.5s');
        
        // إضافة CSS للأداء
        const performanceCSS = document.createElement('style');
        performanceCSS.textContent = `
            * {
                animation-duration: 0.5s !important;
                transition-duration: 0.3s !important;
            }
            
            .game-area {
                will-change: transform;
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(performanceCSS);
    }
    
    // كشف إذا كان الجهاز يعمل باللمس
    if (DeviceOptimizer.isTouchDevice()) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch-device');
    }
});
