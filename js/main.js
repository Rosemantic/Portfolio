/* ========================================
   Main - 主入口文件
   初始化 GSAP 插件和 Lenis 平滑滚动
   ======================================== */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== 注册 GSAP 插件 =====
  gsap.registerPlugin(ScrollTrigger);
  
  // ===== 初始化 Lenis 平滑滚动 =====
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false
  });
  
  // Lenis 滚动事件监听
  lenis.on('scroll', (e) => {
    // 可以在这里添加自定义滚动事件处理
    // console.log('Scroll position:', e.scroll);
  });
  
  // Lenis 动画循环
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  
  requestAnimationFrame(raf);
  
  // ===== 将 Lenis 与 GSAP ScrollTrigger 集成 =====
  lenis.on('scroll', ScrollTrigger.update);
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);
  
  // ===== 当菜单打开时停止滚动 =====
  window.addEventListener('menuOpen', () => {
    lenis.stop();
  });
  
  window.addEventListener('menuClose', () => {
    lenis.start();
  });
  
  // ===== 调试信息 =====
  console.log('✅ GSAP 和 Lenis 已初始化');
  console.log('📦 GSAP 版本:', gsap.version);
  
});

// ===== 页面加载后滚动到顶部 =====
window.addEventListener('load', () => {
  // 确保页面从顶部开始
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
});
