// 交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 检测是否为移动设备
    const isMobile = window.innerWidth <= 768;
    
    // 导航标签切换
    const navTabs = document.querySelectorAll('.nav-tab:not(.dropdown .nav-tab)');
    navTabs.forEach(tab => {
        tab.addEventListener(isMobile ? 'touchend' : 'click', function(e) {
            if (isMobile) e.preventDefault();
            navTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.dropdown .nav-tab').forEach(dt => dt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 处理下拉菜单
    const dropdownTabs = document.querySelectorAll('.dropdown .nav-tab');
    dropdownTabs.forEach(tab => {
        tab.addEventListener(isMobile ? 'touchend' : 'click', function(e) {
            if (isMobile) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = this.parentElement;
                if (dropdown.classList.contains('dropdown-active')) {
                    dropdown.classList.remove('dropdown-active');
                } else {
                    // 关闭所有其他下拉菜单
                    document.querySelectorAll('.dropdown').forEach(d => {
                        d.classList.remove('dropdown-active');
                    });
                    dropdown.classList.add('dropdown-active');
                }
            }
        });
    });
    
    // 点击页面其他地方关闭下拉菜单
    document.addEventListener(isMobile ? 'touchend' : 'click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('dropdown-active');
            });
        }
    });
    
    // 阅读更多按钮
    const readMoreButtons = document.querySelectorAll('.btn');
    readMoreButtons.forEach(button => {
        button.addEventListener(isMobile ? 'touchend' : 'click', function(e) {
            e.preventDefault();
            alert('展开更多内容');
        });
    });
    
    // 创建lightbox元素
    const createLightbox = () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        const lightboxContent = document.createElement('div');
        lightboxContent.className = 'lightbox-content';
        
        const lightboxImage = document.createElement('img');
        lightboxImage.className = 'lightbox-image';
        
        const closeButton = document.createElement('div');
        closeButton.className = 'close-lightbox';
        closeButton.innerHTML = '×';
        closeButton.addEventListener(isMobile ? 'touchend' : 'click', function(e) {
            e.preventDefault();
            closeLightbox();
        });
        
        lightboxContent.appendChild(lightboxImage);
        lightboxContent.appendChild(closeButton);
        lightbox.appendChild(lightboxContent);
        
        // 点击lightbox背景关闭
        lightbox.addEventListener(isMobile ? 'touchend' : 'click', function(e) {
            if (e.target === lightbox) {
                e.preventDefault();
                closeLightbox();
            }
        });
        
        // 添加键盘事件监听 (仅桌面端)
        if (!isMobile) {
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            });
        }
        
        // 添加手势支持 (移动端)
        if (isMobile) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            lightbox.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, false);
            
            lightbox.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    // 左滑关闭
                    closeLightbox();
                }
            }, false);
        }
        
        document.body.appendChild(lightbox);
        return lightbox;
    };
    
    // 打开lightbox
    const openLightbox = (imgSrc) => {
        const lightbox = document.querySelector('.lightbox') || createLightbox();
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        
        lightboxImage.src = imgSrc;
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // 等待图片加载完成后显示
        lightboxImage.onload = function() {
            lightbox.style.opacity = '1';
        };
    };
    
    // 关闭lightbox
    const closeLightbox = () => {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-open');
            
            // 延迟重置图片src，避免闪烁
            setTimeout(() => {
                const lightboxImage = lightbox.querySelector('.lightbox-image');
                if (lightboxImage) {
                    lightboxImage.src = '';
                }
            }, 300);
        }
    };
    
    // 图片点击放大
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener(isMobile ? 'touchend' : 'click', function(e) {
            if (isMobile) e.preventDefault();
            const imgSrc = this.src;
            openLightbox(imgSrc);
        });
    });
    
    // 统计数字动画
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateNumbers = () => {
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const suffix = finalValue.replace(/[0-9]/g, '');
            const value = parseInt(finalValue.replace(/[^0-9]/g, ''));
            let startValue = 0;
            const duration = isMobile ? 1500 : 2000; // 移动端动画速度更快
            const increment = Math.ceil(value / (duration / 20));
            
            const timer = setInterval(() => {
                startValue += increment;
                if (startValue > value) {
                    startValue = value;
                    clearInterval(timer);
                }
                stat.textContent = startValue + suffix;
            }, 20);
        });
    };
    
    // 监听滚动，当统计部分进入视口时触发动画
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(statsSection);
    }
    
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener(isMobile ? 'touchend' : 'click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 添加返回顶部按钮功能
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener(isMobile ? 'touchend' : 'click', (e) => {
            if (isMobile) e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 处理窗口大小变化
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            // 页面刷新以应用正确的事件监听器
            location.reload();
        }
    });
}); 