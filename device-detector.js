// جهاز كاشف وتحسين الأداء للأجهزة المختلفة
class DeviceOptimizer {
    constructor() {
        this.deviceType = this.detectDevice();
        this.orientation = this.getOrientation();
        this.isTouchDevice = this.isTouch();
        this.isLowPerformance = this.isLowPerformanceDevice();
        this.init();
    }
    
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const screenWidth = window.screen.width;
        
        if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
            return screenWidth < 768 ? 'mobile' : 'tablet';
        }
        return 'desktop';
    }
    
    getOrientation() {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }
    
    isTouch() {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               navigator.msMaxTouchPoints > 0;
    }
    
    isLowPerformanceDevice() {
        // كشف الأجهزة الضعيفة بناءً على الذاكرة والمعالج
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const isSlowCPU = /android|iphone|ipad/.test(navigator.userAgent) && 
                         !/chrome|safari|firefox/.test(navigator.userAgent);
        
        return memory < 4 || cores < 4 || isSlowCPU;
    }
    
    init() {
        this.applyDeviceSpecificOptimizations();
        this.setupEventListeners();
        this.logDeviceInfo();
        this.applyPerformanceOptimizations();
    }
    
    applyDeviceSpecificOptimizations() {
        const body = document.body;
        const html = document.documentElement;
        
        // إضافة فئات CSS حسب نوع الجهاز
        body.classList.add(`device-${this.deviceType}`);
        body.classList.add(`orientation-${this.orientation}`);
        body.classList.add(this.isTouchDevice ? 'touch-device' : 'no-touch-device');
        
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
        
        // تحسينات خاصة باللمس
        if (this.isTouchDevice) {
            this.optimizeForTouch();
        }
    }
    
    optimizeForMobile() {
        console.log('📱 تطبيق تحسينات للجوال...');
        
        // تحسينات للجوال
        document.documentElement.style.fontSize = '14px';
        
        // تحسين أزرار اللمس
        const touchElements = document.querySelectorAll('button, .btn, .game-btn, .control-btn, .object-item');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
            el.style.cursor = 'pointer';
            
            // إضافة تأثير اللمس
            el.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
                this.style.opacity = '0.9';
            });
            
            el.addEventListener('touchend', function() {
                this.style.transform = '';
                this.style.opacity = '';
            });
        });
        
        // تحسين التمرير
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // إضافة مساحة آمنة للشاشات ذات الشقوق
        this.addSafeAreaInsets();
    }
    
    optimizeForTablet() {
        console.log('📟 تطبيق تحسينات للتابلت...');
        
        // حجم خط مناسب للتابلت
        document.documentElement.style.fontSize = '16px';
        
        // تحسين التخطيط للألعاب
        const gameAreas = document.querySelectorAll('.game-area, .game-container');
        gameAreas.forEach(area => {
            area.style.maxWidth = '90%';
            area.style.margin = '0 auto';
        });
        
        // تحسين المسافات
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.padding = '0 30px';
        });
    }
    
    optimizeForDesktop() {
        console.log('💻 تطبيق تحسينات للحاسوب...');
        
        // حجم خط للشاشات الكبيرة
        document.documentElement.style.fontSize = '18px';
        
        // إضافة تأثيرات Hover
        this.addHoverEffects();
        
        // تحسين أداء الرسوم المتحركة
        this.enhanceAnimations();
    }
    
    optimizeForTouch() {
        console.log('👆 تطبيق تحسينات للشاشات التي تعمل باللمس...');
        
        // منع التكبير المزدوج
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // تحسين الاستجابة لللمس
        document.documentElement.style.setProperty('--touch-target', '44px');
        
        // إضافة CSS للتحسينات
        const touchCSS = document.createElement('style');
        touchCSS.textContent = `
            * {
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
            }
            
            button, .btn, [role="button"] {
                touch-action: manipulation;
            }
            
            .touch-device .game-card:hover {
                transform: none !important;
            }
            
            @media (hover: none) and (pointer: coarse) {
                .game-card:active {
                    transform: scale(0.98) !important;
                }
            }
        `;
        document.head.appendChild(touchCSS);
    }
    
    addHoverEffects() {
        // تأثيرات hover فقط للحاسوب
        if (!this.isTouchDevice) {
            const interactiveElements = document.querySelectorAll('.game-card:not(.coming-soon), .feature, .contact-item');
            
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    el.style.transition = 'all 0.3s ease';
                });
            });
            
            // تأثير خاص للكروت
            const gameCards = document.querySelectorAll('.game-card:not(.coming-soon)');
            gameCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                });
            });
        }
    }
    
    enhanceAnimations() {
        // تحسين الرسوم المتحركة للحاسوب
        const animationCSS = document.createElement('style');
        animationCSS.textContent = `
            @media (min-width: 1024px) {
                .hero-image {
                    animation: floatDesktop 4s ease-in-out infinite;
                }
                
                @keyframes floatDesktop {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    33% { transform: translateY(-20px) rotate(2deg); }
                    66% { transform: translateY(10px) rotate(-2deg); }
                }
                
                .game-card:hover .game-icon {
                    animation: iconSpin 1s ease;
                }
                
                @keyframes iconSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            }
        `;
        document.head.appendChild(animationCSS);
    }
    
    addSafeAreaInsets() {
        // إضافة مسافة آمنة للهواتف الحديثة
        const safeAreaCSS = document.createElement('style');
        safeAreaCSS.textContent = `
            /* دعم safe-area للحواف المنحنية */
            .navbar {
                padding-top: env(safe-area-inset-top);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
            }
            
            .footer {
                padding-bottom: env(safe-area-inset-bottom);
            }
            
            @supports (padding: max(0px)) {
                .container {
                    padding-left: max(20px, env(safe-area-inset-left));
                    padding-right: max(20px, env(safe-area-inset-right));
                }
            }
        `;
        document.head.appendChild(safeAreaCSS);
    }
    
    applyPerformanceOptimizations() {
        if (this.isLowPerformance) {
            console.log('⚡ تطبيق تحسينات للأداء...');
            
            // تقليل الرسوم المتحركة للأجهزة الضعيفة
            document.documentElement.style.setProperty('--animation-speed', '0.3s');
            
            const performanceCSS = document.createElement('style');
            performanceCSS.textContent = `
                * {
                    animation-duration: 0.3s !important;
                    transition-duration: 0.2s !important;
                    animation-iteration-count: 1 !important;
                }
                
                /* إيقاف بعض الرسوم المتحركة */
                .low-performance .hero-image,
                .low-performance [class*="animation"],
                .low-performance [class*="animate"] {
                    animation: none !important;
                }
                
                /* تحسين الأداء */
                .game-area, .balance-container {
                    will-change: transform;
                    transform: translateZ(0);
                    backface-visibility: hidden;
                }
                
                /* تقليل التأثيرات */
                .low-performance .game-card:hover {
                    transform: translateY(-5px) !important;
                }
                
                /* تقليل الظلال */
                .low-performance .game-card,
                .low-performance .feature {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                }
            `;
            document.head.appendChild(performanceCSS);
            
            document.body.classList.add('low-performance');
        }
    }
    
    setupEventListeners() {
        // كشف تغيير الاتجاه
        window.addEventListener('resize', this.debounce(() => {
            const newOrientation = this.getOrientation();
            if (newOrientation !== this.orientation) {
                this.orientation = newOrientation;
                this.handleOrientationChange();
            }
        }, 250));
        
        // كشف تغيير حجم الشاشة
        window.addEventListener('resize', this.debounce(() => {
            const newDeviceType = this.detectDevice();
            if (newDeviceType !== this.deviceType) {
                this.deviceType = newDeviceType;
                this.applyDeviceSpecificOptimizations();
            }
        }, 500));
        
        // منع التمرير عند لمس العناصر التفاعلية
        document.addEventListener('touchmove', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const interactive = e.target.closest('button, .btn, .game-btn, [role="button"]');
            if (interactive) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    handleOrientationChange() {
        console.log(`🔄 تغيير الاتجاه إلى: ${this.orientation}`);
        
        const body = document.body;
        body.classList.remove('orientation-landscape', 'orientation-portrait');
        body.classList.add(`orientation-${this.orientation}`);
        
        // إشعار عند تغيير الاتجاه على الجوال
        if (this.deviceType === 'mobile' && this.orientation === 'landscape') {
            this.showOrientationMessage('لأفضل تجربة، ننصح باستخدام الوضع الرأسي 📱');
        }
    }
    
    showOrientationMessage(message) {
        // إزالة أي رسالة سابقة
        const existingMsg = document.querySelector('.orientation-message');
        if (existingMsg) existingMsg.remove();
        
        const msg = document.createElement('div');
        msg.className = 'orientation-message';
        msg.innerHTML = `
            <div class="message-content">
                <i class="fas fa-mobile-alt"></i>
                <span>${message}</span>
                <button class="close-btn" aria-label="إغلاق"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // إضافة CSS للرسالة
        if (!document.querySelector('#orientation-message-styles')) {
            const style = document.createElement('style');
            style.id = 'orientation-message-styles';
            style.textContent = `
                .orientation-message {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    padding: 12px 20px;
                    z-index: 10000;
                    animation: slideDown 0.4s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    backdrop-filter: blur(10px);
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-100%); opacity: 0; }
                }
                
                .message-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-size: 14px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .message-content i {
                    font-size: 18px;
                }
                
                .close-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: auto;
                    transition: background 0.3s;
                }
                
                .close-btn:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                @media (max-width: 480px) {
                    .orientation-message {
                        padding: 10px 15px;
                    }
                    
                    .message-content {
                        font-size: 12px;
                        gap: 8px;
                    }
                    
                    .message-content i {
                        font-size: 16px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(msg);
        
        // إغلاق الرسالة
        msg.querySelector('.close-btn').addEventListener('click', () => {
            msg.style.animation = 'slideUp 0.4s ease';
            setTimeout(() => msg.remove(), 400);
        });
        
        // إزالة تلقائية بعد 5 ثوان
        setTimeout(() => {
            if (document.body.contains(msg)) {
                msg.style.animation = 'slideUp 0.4s ease';
                setTimeout(() => msg.remove(), 400);
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
        console.group('📊 معلومات الجهاز');
        console.log(`نوع الجهاز: ${this.deviceType}`);
        console.log(`الاتجاه: ${this.orientation}`);
        console.log(`شاشة لمس: ${this.isTouchDevice ? 'نعم' : 'لا'}`);
        console.log(`عرض الشاشة: ${window.innerWidth}px`);
        console.log(`ارتفاع الشاشة: ${window.innerHeight}px`);
        console.log(`نسبة البكسل: ${window.devicePixelRatio}`);
        console.log(`ذاكرة الجهاز: ${navigator.deviceMemory || 'غير معروف'} GB`);
        console.log(`عدد الأنوية: ${navigator.hardwareConcurrency || 'غير معروف'}`);
        console.groupEnd();
    }
    
    // وظائف مساعدة ثابتة
    static preventZoom() {
        // منع التكبير على حقول الإدخال
        document.addEventListener('touchstart', function(event) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                event.target.style.fontSize = '16px';
            }
        });
        
        // إضافة CSS لمنع التكبير
        const noZoomCSS = document.createElement('style');
        noZoomCSS.textContent = `
            input, select, textarea {
                font-size: 16px !important;
            }
            
            @media screen and (max-width: 768px) {
                input, select, textarea {
                    font-size: 16px !important;
                }
            }
        `;
        document.head.appendChild(noZoomCSS);
    }
    
    static addLoadingOptimizations() {
        // تحسينات تحميل الصفحة
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                console.log('🌐 اتصال بطيء - تطبيق تحسينات التحميل');
                document.body.classList.add('slow-connection');
                
                // إضافة CSS للاتصال البطيء
                const slowCSS = document.createElement('style');
                slowCSS.textContent = `
                    .slow-connection .hero-image,
                    .slow-connection [data-lazy],
                    .slow-connection .science-illustration {
                        display: none;
                    }
                    
                    .slow-connection .game-icon {
                        animation: none;
                    }
                `;
                document.head.appendChild(slowCSS);
            }
        }
    }
}

// تهيئة المحسن عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة كشف الجهاز
    const deviceOptimizer = new DeviceOptimizer();
    
    // تطبيق تحسينات إضافية
    DeviceOptimizer.preventZoom();
    DeviceOptimizer.addLoadingOptimizations();
    
    // إضافة حدث لتحميل الصفحة بالكامل
    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
        
        // إضافة تأثير تحميل
        setTimeout(() => {
            const loader = document.querySelector('.page-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
        }, 500);
    });
    
    // تسجيل معلومات إضافية
    console.log('%c🔬 مختبر العلوم الصغير - محسن للأجهزة', 
        'color: #17bebb; font-size: 16px; font-weight: bold; padding: 5px; background: #f0f8ff; border-radius: 5px;');
});

// تهيئة سريعة للصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeviceDetection);
} else {
    initDeviceDetection();
}

function initDeviceDetection() {
    // كشف سريع وإضافة الفئات الأساسية
    const isTouch = 'ontouchstart' in window;
    document.body.classList.add(isTouch ? 'touch' : 'no-touch');
    
    // إضافة فئة للجوال
    if (window.innerWidth < 768) {
        document.body.classList.add('is-mobile');
    }
}
