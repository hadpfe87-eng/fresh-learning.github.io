// كود جافاسكريبت للصفحة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 مختبر العلوم الصغير - جاهز للتعلم!');
    
    // === عناصر DOM ===
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const contactForm = document.getElementById('contactForm');
    
    // === قائمة الجوال ===
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // === التنقل السلس ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // إغلاق قائمة الجوال إذا كانت مفتوحة
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // التمرير السلس
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // تحديث الرابط النشط
                updateActiveLink(targetId);
            }
        });
    });
    
    // تحديث الرابط النشط أثناء التمرير
    window.addEventListener('scroll', debounce(function() {
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        updateActiveLink('#' + currentSection);
    }, 100));
    
    function updateActiveLink(targetId) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
    
    // === نموذج الاتصال ===
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                message: this.querySelector('textarea').value
            };
            
            // محاكاة إرسال النموذج
            showNotification('📧 شكراً لك! تم استلام رسالتك وسنرد عليك قريباً.', 'success');
            this.reset();
            
            // هنا يمكنك إضافة كود إرسال حقيقي
            console.log('بيانات الاتصال:', formData);
        });
    }
    
    // === تأثيرات الكروت ===
    const gameCards = document.querySelectorAll('.game-card:not(.coming-soon)');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // تأثير النقر على الجوال
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // === تأثيرات التمرير ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر لإضافة تأثيرات
    document.querySelectorAll('.game-card, .feature, .fact').forEach(el => {
        observer.observe(el);
    });
    
    // === رسائل الإشعارات ===
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // إضافة CSS للإشعار
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    right: 20px;
                    background: white;
                    color: #333;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                .notification-success {
                    border-right: 4px solid var(--success-color);
                }
                
                .notification i {
                    font-size: 20px;
                }
                
                .notification-success i {
                    color: var(--success-color);
                }
                
                .notification-close {
                    margin-right: auto;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #666;
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    .notification {
                        top: 10px;
                        left: 10px;
                        right: 10px;
                        font-size: 14px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // إغلاق الإشعار
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // إزالة تلقائية بعد 5 ثوان
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // === وظائف مساعدة ===
    function debounce(func, wait) {
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
    
    // === تهيئة الصفحة ===
    function initPage() {
        // رسالة ترحيبية في الكونسول
        console.log('%cمختبر العلوم الصغير 🧪', 'color: #4a6fa5; font-size: 20px; font-weight: bold;');
        console.log('%cجاهز للمغامرة العلمية!', 'color: #17bebb; font-size: 16px;');
        
        // تحميل الصفحة الأولى
        window.scrollTo(0, 0);
        
        // إضافة CSS للحركات
        const animationCSS = document.createElement('style');
        animationCSS.textContent = `
            .game-card.animate {
                animation: fadeInUp 0.6s ease;
            }
            
            .feature.animate {
                animation: fadeInUp 0.6s ease 0.2s both;
            }
            
            .fact.animate {
                animation: fadeInLeft 0.6s ease both;
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
            
            @keyframes fadeInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(animationCSS);
    }
    
    // تشغيل التهيئة
    initPage();
});

// تحميل الصفحة بسلاسة
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // إخفاء شاشة التحميل لو كانت موجودة
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }, 500);
    }
});
