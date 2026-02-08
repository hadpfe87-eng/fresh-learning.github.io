// كود جافاسكريبت للصفحة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    console.log('مرحباً في مختبر العلوم الصغير!');
    
    // تأثيرات التنقل السلس
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if(this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if(targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // تحديث الرابط النشط
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // تحديث الرابط النشط أثناء التمرير
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if(scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // تأثيرات الكروت
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if(!this.classList.contains('coming-soon')) {
                this.style.transform = 'translateY(-10px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if(!this.classList.contains('coming-soon')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // رسالة ترحيبية
    setTimeout(() => {
        console.log('مستعد للعب والتعلم؟ ابدأ بالميزان الذكي!');
    }, 1000);
});
