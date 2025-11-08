/* ========================================
   Navigation - 导航栏交互逻辑
   处理菜单打开/关闭动画和滚动隐藏
   ======================================== */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== 获取 DOM 元素 =====
  const menuBtn = document.querySelector('.header__menu-btn');
  const navFullscreen = document.querySelector('.nav-fullscreen');
  const navLinks = document.querySelectorAll('.nav-fullscreen__link');
  const navFooter = document.querySelector('.nav-fullscreen__footer');
  const header = document.querySelector('.header');
  const menuLines = document.querySelectorAll('.header__menu-line');
  
  // 检查元素是否存在
  if (!menuBtn || !navFullscreen || menuLines.length !== 2) {
    console.warn('导航元素未找到');
    return;
  }
  
  // ===== 菜单状态 =====
  let isMenuOpen = false;
  
  // ===== 初始化 GSAP 设置 =====
  gsap.set(menuLines, {
    transformOrigin: 'center'
  });
  
  gsap.set(navFullscreen, {
    y: '-100%',
    visibility: 'hidden'
  });
  
  gsap.set(navLinks, {
    y: 100,
    opacity: 0
  });
  
  if (navFooter) {
    gsap.set(navFooter, {
      y: 20,
      opacity: 0
    });
  }
  
  // ===== 打开菜单动画 =====
  function openMenu() {
    isMenuOpen = true;
    
    // 保存滚动位置并固定页面
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // 添加状态类
    menuBtn.classList.add('is-active');
    navFullscreen.classList.add('is-open');
    document.body.classList.add('menu-open');
    
    // 更新 aria 属性
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', '关闭导航菜单');
    
    // GSAP 动画：菜单按钮变成 X
    gsap.to(menuLines[0], {
      y: 5,
      rotation: 45,
      duration: 0.6,
      ease: 'power3.inOut'
    });
    
    gsap.to(menuLines[1], {
      y: -5,
      rotation: -45,
      duration: 0.6,
      ease: 'power3.inOut'
    });
    
    // 延迟变白
    gsap.to(menuLines, {
      backgroundColor: '#FFFFFF',
      duration: 0.3,
      delay: 0.3,
      ease: 'none'
    });
    
    // GSAP 动画：菜单滑入
    gsap.to(navFullscreen, {
      y: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      onStart: () => {
        navFullscreen.style.visibility = 'visible';
      }
    });
    
    // GSAP 动画：菜单项依次出现
    gsap.to(navLinks, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.3
    });
    
    // GSAP 动画：底部信息淡入
    if (navFooter) {
      gsap.to(navFooter, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.6
      });
    }
  }
  
  // ===== 关闭菜单动画 =====
  function closeMenu() {
    isMenuOpen = false;
    
    // 更新 aria 属性
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', '打开导航菜单');
    
    // 移除激活状态
    menuBtn.classList.remove('is-active');
    
    // GSAP 动画：菜单按钮变回横线
    gsap.to(menuLines[0], {
      y: 0,
      rotation: 0,
      duration: 0.6,
      ease: 'power3.inOut'
    });
    
    gsap.to(menuLines[1], {
      y: 0,
      rotation: 0,
      duration: 0.6,
      ease: 'power3.inOut'
    });
    
    // GSAP 动画：菜单项淡出
    gsap.to(navLinks, {
      y: -50,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power3.in'
    });
    
    // GSAP 动画：底部信息淡出
    if (navFooter) {
      gsap.to(navFooter, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in'
      });
    }
    
    // GSAP 动画：菜单滑出
    gsap.to(navFullscreen, {
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
      delay: 0.2,
      onComplete: () => {
        // 动画完成后清理
        document.body.classList.remove('menu-open');
        navFullscreen.classList.remove('is-open');
        navFullscreen.style.visibility = 'hidden';
        
        // 恢复页面滚动
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        
        // 重置菜单项位置
        gsap.set(navLinks, { y: 100, opacity: 0 });
        if (navFooter) {
          gsap.set(navFooter, { y: 20, opacity: 0 });
        }
        
        // 变回黑色
        gsap.to(menuLines, {
          backgroundColor: '#272727',
          duration: 0.3,
          ease: 'none'
        });
      }
    });
  }
  
  // ===== 切换菜单 =====
  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  
  // ===== 事件监听器：菜单按钮点击 =====
  menuBtn.addEventListener('click', toggleMenu);
  
  // ===== 事件监听器：点击菜单链接关闭菜单 =====
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // 添加点击动画
      gsap.to(link, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
      
      // 如果是当前页面的链接，阻止默认行为
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const linkPage = link.getAttribute('href');
      
      if (linkPage === currentPage) {
        e.preventDefault();
        closeMenu();
      } else {
        // 页面切换动画
        e.preventDefault();
        
        // 淡出当前内容
        gsap.to('main', {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            window.location.href = linkPage;
          }
        });
        
        setTimeout(() => {
          closeMenu();
        }, 200);
      }
    });
  });
  
  // ===== 事件监听器：按 ESC 键关闭菜单 =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });
  
  // ===== 滚动时隐藏/显示导航栏 =====
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateHeaderVisibility() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMenuOpen) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderVisibility);
      ticking = true;
    }
  });
  
  console.log('✅ Navigation.js 已初始化');
  
});
