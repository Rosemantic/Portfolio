/* ========================================
   Animations - 动画效果
   定义滚动触发和入场动画
   ======================================== */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
  
  // 检查 GSAP 是否已加载
  if (typeof gsap === 'undefined') {
    console.error('GSAP 未加载，动画将不会生效');
    // 即使 GSAP 未加载，也要显示内容
    document.body.classList.add('js-loaded');
    document.querySelectorAll('.header__logo, .header__menu-btn, .hero h1, .hero p').forEach(el => {
      el.style.opacity = '1';
    });
    return;
  }
  
  // 标记 JS 已加载
  document.body.classList.add('js-loaded');
  
  // ===== 页面加载动画 =====
  
  // 获取需要动画的元素
  const logo = document.querySelector('.header__logo');
  const menuBtn = document.querySelector('.header__menu-btn');
  const heroTitle = document.querySelector('.hero h1');
  const heroText = document.querySelector('.hero p');
  
  // 检查元素是否存在
  if (!logo || !menuBtn || !heroTitle || !heroText) {
    console.warn('某些动画元素未找到');
  }
  
  // 创建动画时间线
  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out'
    },
    onStart: () => {
      console.log('🎬 入场动画开始');
    },
    onComplete: () => {
      console.log('✅ 入场动画完成');
    }
  });
  
  // 设置初始状态（确保元素先隐藏）
  if (logo) gsap.set(logo, { opacity: 0, y: -20 });
  if (menuBtn) gsap.set(menuBtn, { opacity: 0, y: -20 });
  if (heroTitle) gsap.set(heroTitle, { opacity: 0, y: 50 });
  if (heroText) gsap.set(heroText, { opacity: 0, y: 30 });
  
  // 按顺序播放动画
  if (logo) {
    tl.to(logo, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, 0.2);
  }
  
  if (menuBtn) {
    tl.to(menuBtn, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, 0.3);
  }
  
  if (heroTitle) {
    tl.to(heroTitle, {
      opacity: 1,
      y: 0,
      duration: 1
    }, 0.5);
  }
  
  if (heroText) {
    tl.to(heroText, {
      opacity: 1,
      y: 0,
      duration: 1
    }, 0.7);
  }
  
  // ===== 滚动触发动画示例 =====
  
  // 为所有 section 添加淡入动画
  gsap.utils.toArray('section:not(.hero)').forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
        // markers: true, // 开发时可以打开查看触发位置
      },
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out'
    });
  });
  
  // ===== 鼠标跟随效果（可选） =====
  
  // 自定义光标（如果需要）
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);
  
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  // ===== 视差效果示例 =====
  
  // 为特定元素添加视差效果
  // gsap.utils.toArray('.parallax').forEach((element) => {
  //   gsap.to(element, {
  //     scrollTrigger: {
  //       trigger: element,
  //       start: 'top bottom',
  //       end: 'bottom top',
  //       scrub: true
  //     },
  //     y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
  //     ease: 'none'
  //   });
  // });
  
  // ===== 调试信息 =====
  console.log('✅ Animations.js 已初始化');
  
});
