/* ========================================
   Navigation - 导航栏交互逻辑
   处理菜单打开/关闭动画和滚动隐藏
   ======================================== */

// ===== 动画配置常量 =====
const ANIMATION_CONFIG = {
  letterSwap: {
    duration: 0.5,
    stagger: 0.035,
    ease: "back.out(1.7)",
  },
  imageSwitch: {
    throttleDelay: 30,
  },
  menuOpen: {
    buttonDuration: 0.6,
    menuDuration: 0.8,
    charDuration: 0.6,
    charStagger: 0.025,
    itemDelay: 0.12,
  },
  menuClose: {
    charDuration: 0.4,
    charStagger: 0.015,
    itemDelay: 0.06,
  },
};

// ===== 获取当前页面路径 =====
function getCurrentPage() {
  let currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (currentPage === "" || currentPage === "/") {
    currentPage = "index.html";
  }
  return currentPage;
}

// ===== 导航栏初始化函数 =====
function initNavigation() {
  // ===== 获取 DOM 元素 =====
  const menuBtn = document.querySelector(".header__menu-btn");
  const navFullscreen = document.querySelector(".nav-fullscreen");
  const navLinks = document.querySelectorAll(".nav-fullscreen__link");
  const navFooter = document.querySelector(".nav-fullscreen__footer");
  const header = document.querySelector(".header");
  const menuLines = document.querySelectorAll(".header__menu-line");
  const socialLinks = document.querySelectorAll(".nav-fullscreen__social-link");
  const navImages = document.querySelectorAll(".nav-fullscreen__image");

  // 检查元素是否存在
  if (!menuBtn || !navFullscreen || menuLines.length !== 2) {
    console.warn("导航元素未找到，等待动态加载...");
    return false;
  }

  // ===== 菜单状态 =====
  let isMenuOpen = false;
  let currentImageIndex = null; // 当前显示的图片索引
  let imagesPreloadPromise = null; // 图片预加载Promise

  // ===== 预加载所有图片（返回Promise） =====
  function preloadImages() {
    // 如果已经在预加载，返回现有Promise
    if (imagesPreloadPromise) return imagesPreloadPromise;

    // 创建预加载Promise数组
    const loadPromises = Array.from(navImages).map((img) => {
      return new Promise((resolve, reject) => {
        // 如果图片已经加载完成
        if (img.complete && img.naturalHeight !== 0) {
          resolve(img);
          return;
        }

        const imgElement = new Image();

        imgElement.onload = () => {
          resolve(img);
        };

        imgElement.onerror = () => {
          console.warn(`图片加载失败: ${img.src}`);
          resolve(img); // 即使失败也resolve，避免阻塞
        };

        imgElement.src = img.src;
      });
    });

    // 保存Promise以避免重复加载
    imagesPreloadPromise = Promise.all(loadPromises);
    return imagesPreloadPromise;
  }

  // ===== 图片切换函数（纯 CSS 版本：极速） =====
  function switchImage(imageId) {
    // 如果是同一张图片，不需要切换
    if (currentImageIndex === imageId) return;

    // 找到目标图片
    const targetImage = document.querySelector(
      `.nav-fullscreen__image[data-image="${imageId}"]`
    );

    if (!targetImage) return;

    // 移除所有激活状态（CSS transition 会自动处理动画）
    navImages.forEach((img) => {
      if (img !== targetImage) {
        img.classList.remove("is-active");
      }
    });

    // 激活目标图片
    targetImage.classList.add("is-active");

    currentImageIndex = imageId;
  }

  // ===== 带节流的图片切换（使用utils.js的节流函数） =====
  const switchImageThrottled = throttle(
    switchImage,
    ANIMATION_CONFIG.imageSwitch.throttleDelay
  );

  // ===== 分割菜单文字为字符（双层结构用于交换动画） =====
  function splitTextToChars(element) {
    const text = element.textContent;
    element.innerHTML = "";

    // 为每个字符创建双层结构
    text.split("").forEach((char) => {
      const charWrapper = document.createElement("span");
      charWrapper.className = "char-wrapper";

      // 第一层：原始字符（初始显示）
      const charOriginal = document.createElement("span");
      charOriginal.className = "char char-original";
      charOriginal.textContent = char === " " ? "\u00A0" : char;

      // 第二层：克隆字符（用于交换动画）
      const charClone = document.createElement("span");
      charClone.className = "char char-clone";
      charClone.textContent = char === " " ? "\u00A0" : char;

      charWrapper.appendChild(charOriginal);
      charWrapper.appendChild(charClone);
      element.appendChild(charWrapper);
    });
  }

  // 对每个菜单链接进行文字分割
  navLinks.forEach((link) => {
    splitTextToChars(link);
  });

  // 对底部社交链接也进行文字分割
  socialLinks.forEach((link) => {
    splitTextToChars(link);
  });

  // ===== 初始化 GSAP 设置 =====
  gsap.set(menuLines, {
    transformOrigin: "center",
  });

  gsap.set(navFullscreen, {
    y: "-100%",
    visibility: "hidden",
  });

  // 设置菜单项字符的初始状态 - 添加水平偏移创建错峰效果
  navLinks.forEach((link, index) => {
    const charsOriginal = link.querySelectorAll(".char-original");
    const charsClone = link.querySelectorAll(".char-clone");

    // 设置原始字符的入场初始状态
    gsap.set(charsOriginal, {
      y: 120,
      x: 50,
      opacity: 0,
      rotationX: -90,
    });

    // 设置克隆字符的初始状态（用于悬停交换）
    gsap.set(charsClone, {
      y: "100%", // 初始在下方，等待悬停时滑入
      opacity: 1,
    });
  });

  // 设置社交链接字符的初始状态
  socialLinks.forEach((link) => {
    const charsOriginal = link.querySelectorAll(".char-original");
    const charsClone = link.querySelectorAll(".char-clone");

    // 社交链接无需入场动画，直接可见
    gsap.set(charsOriginal, {
      y: 0,
      opacity: 1,
    });

    // 克隆字符在下方待命
    gsap.set(charsClone, {
      y: "100%",
      opacity: 1,
    });
  });

  if (navFooter) {
    gsap.set(navFooter, {
      y: 20,
      opacity: 0,
    });
  }

  // 图片初始状态由 CSS 控制，无需 JavaScript 设置

  // ===== 打开菜单动画 =====
  async function openMenu() {
    isMenuOpen = true;

    // 确保图片已预加载完成再开始动画
    await preloadImages().catch(() => {
      console.warn("部分图片加载失败，继续打开菜单");
    });

    // 保存滚动位置并固定页面
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    // 添加状态类
    menuBtn.classList.add("is-active");
    navFullscreen.classList.add("is-open");
    document.body.classList.add("menu-open");

    // 更新 aria 属性
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "关闭导航菜单");

    // 创建打开动画时间线
    const openTimeline = gsap.timeline();

    // 1. 菜单按钮变成 X（立即开始）
    openTimeline.to(
      menuLines[0],
      {
        y: 5,
        rotation: 45,
        duration: 0.6, // 稍微慢一点
        ease: "power3.inOut",
      },
      0
    );

    openTimeline.to(
      menuLines[1],
      {
        y: -5,
        rotation: -45,
        duration: 0.6,
        ease: "power3.inOut",
      },
      0
    );

    // 2. 菜单滑入（同时开始）
    openTimeline.to(
      navFullscreen,
      {
        y: 0,
        duration: 0.8, // 放慢菜单滑入
        ease: "power3.inOut",
        onStart: () => {
          navFullscreen.style.visibility = "visible";
        },
      },
      0
    );

    // 3. 按钮变白（延迟0.3秒）
    openTimeline.to(
      menuLines,
      {
        backgroundColor: "#FFFFFF",
        duration: 0.4,
        ease: "power2.out",
      },
      0.3
    );

    // 4. 菜单项的字符错峰滑入（延迟0.5秒，等菜单滑入一半后）
    navLinks.forEach((link, index) => {
      const charsOriginal = link.querySelectorAll(".char-original");

      openTimeline.to(
        charsOriginal,
        {
          y: 0,
          x: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.6, // 放慢字符动画
          stagger: {
            each: 0.025, // 增加字符间隔，更清晰
            from: "start",
          },
          ease: "power3.out",
        },
        0.5 + index * 0.12
      ); // 增加菜单项间隔，错峰更明显
    });

    // 5. 底部信息淡入（延迟1.3秒，等所有字符都出现后）
    if (navFooter) {
      openTimeline.to(
        navFooter,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        1.3
      );
    }

    // 6. 显示第一张图片（延迟0.5秒，与菜单同步开始显示）
    openTimeline.add(() => {
      switchImage("1");
    }, 0.5);
  }

  // ===== 关闭菜单动画 =====
  function closeMenu() {
    isMenuOpen = false;

    // 更新 aria 属性
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "打开导航菜单");

    // 移除激活状态
    menuBtn.classList.remove("is-active");

    // 创建关闭动画时间线，所有动画协调进行
    const closeTimeline = gsap.timeline({
      onComplete: () => {
        // 所有动画完成后清理
        document.body.classList.remove("menu-open");
        navFullscreen.classList.remove("is-open");
        navFullscreen.style.visibility = "hidden";

        // 恢复页面滚动
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);

        // 重置菜单项字符位置
        navLinks.forEach((link) => {
          const charsOriginal = link.querySelectorAll(".char-original");
          gsap.set(charsOriginal, {
            y: 120,
            x: 50,
            opacity: 0,
            rotationX: -90,
          });
        });
        if (navFooter) {
          gsap.set(navFooter, { y: 20, opacity: 0 });
        }

        // 重置图片状态
        navImages.forEach((img) => {
          img.classList.remove("is-active");
        });
        currentImageIndex = null;
      },
    });

    // 1. 底部信息快速淡出（立即开始）
    if (navFooter) {
      closeTimeline.to(
        navFooter,
        {
          y: 20,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        },
        0
      );
    }

    // 2. 菜单项的字符快速错峰消失（立即开始）
    // 从下往上消失：CONTACT → WORKS → ABOUT → HOME
    navLinks.forEach((link, index) => {
      const charsOriginal = link.querySelectorAll(".char-original");
      const reverseIndex = navLinks.length - 1 - index; // 反转索引

      closeTimeline.to(
        charsOriginal,
        {
          y: 80, // 向下消失
          x: -30, // 向左滑出
          opacity: 0,
          rotationX: 60, // 减少旋转角度
          duration: 0.4, // 加快速度
          stagger: {
            each: 0.015, // 缩短间隔
            from: "end",
          },
          ease: "power2.in",
        },
        0 + reverseIndex * 0.06
      ); // 使用反转索引，HOME最后消失
    });

    // 3. 字符消失的同时，按钮开始变回横线（延迟0.2秒）
    closeTimeline.to(
      menuLines[0],
      {
        y: 0,
        rotation: 0,
        duration: 0.5,
        ease: "power3.inOut",
      },
      0.2
    );

    closeTimeline.to(
      menuLines[1],
      {
        y: 0,
        rotation: 0,
        duration: 0.5,
        ease: "power3.inOut",
      },
      0.2
    );

    // 4. 菜单快速滑出（延迟0.4秒）
    closeTimeline.to(
      navFullscreen,
      {
        y: "-100%",
        duration: 0.6, // 加快滑出速度
        ease: "power3.inOut",
        onUpdate: function () {
          // 当菜单滑出到80%时就移除 menu-open
          if (
            this.progress() > 0.8 &&
            document.body.classList.contains("menu-open")
          ) {
            document.body.classList.remove("menu-open");
          }
        },
      },
      0.4
    );

    // 5. 按钮颜色快速变化（延迟0.6秒）
    closeTimeline.to(
      menuLines,
      {
        backgroundColor: "#272727",
        duration: 0.3,
        ease: "power2.out",
      },
      0.6
    );
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
  menuBtn.addEventListener("click", toggleMenu);

  // ===== 字母交换悬停效果函数 =====
  function addLetterSwapHover(element) {
    const charWrappers = element.querySelectorAll(".char-wrapper");
    const { duration, stagger, ease } = ANIMATION_CONFIG.letterSwap;

    // 缓存字符元素避免重复查询
    const chars = Array.from(charWrappers).map((wrapper) => ({
      original: wrapper.querySelector(".char-original"),
      clone: wrapper.querySelector(".char-clone"),
    }));

    // 创建动画函数
    const animate = (isEnter) => {
      chars.forEach(({ original, clone }, index) => {
        gsap.to(original, {
          y: isEnter ? "-100%" : "0%",
          duration,
          delay: index * stagger,
          ease,
        });

        gsap.to(clone, {
          y: isEnter ? "0%" : "100%",
          duration,
          delay: index * stagger,
          ease,
        });
      });
    };

    element.addEventListener("mouseenter", () => animate(true));
    element.addEventListener("mouseleave", () => animate(false));
  }

  // ===== 事件监听器：为所有菜单项添加悬停效果 =====
  navLinks.forEach((link) => {
    addLetterSwapHover(link);

    // 添加图片切换悬停事件（使用节流版本）
    link.addEventListener("mouseenter", () => {
      const imageId = link.getAttribute("data-image");
      if (imageId && isMenuOpen) {
        switchImageThrottled(imageId);
      }
    });
  });

  // ===== 事件监听器：为社交链接添加悬停效果 =====
  socialLinks.forEach((link) => {
    addLetterSwapHover(link);
  });

  // ===== 事件监听器：点击菜单链接关闭菜单 =====
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // 添加点击动画
      gsap.to(link, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });

      // 如果是当前页面的链接，阻止默认行为
      const currentPage = getCurrentPage();
      const linkPage = link.getAttribute("href");

      if (linkPage === currentPage) {
        e.preventDefault();
        closeMenu();
      } else {
        // 页面切换动画
        e.preventDefault();

        // 淡出当前内容
        gsap.to("main", {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            window.location.href = linkPage;
          },
        });

        setTimeout(() => {
          closeMenu();
        }, 200);
      }
    });
  });

  // ===== 事件监听器：按 ESC 键关闭菜单 =====
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) {
      closeMenu();
    }
  });

  // ===== 滚动时隐藏/显示导航栏 =====
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeaderVisibility() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMenuOpen) {
      header.classList.add("is-hidden");
    } else {
      header.classList.remove("is-hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderVisibility);
      ticking = true;
    }
  });

  // ===== 标记当前页面的菜单项为激活状态 =====
  function setActiveMenuItem() {
    const currentPage = getCurrentPage();

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      link.classList.toggle("is-active", linkHref === currentPage);
    });
  }

  // 初始化时设置激活状态
  setActiveMenuItem();

  console.log("✅ Navigation.js 已初始化");

  // ===== 立即开始预加载图片（优先级最高） =====
  // 不等待空闲时间，立即开始预加载以避免打开菜单时卡顿
  preloadImages()
    .then(() => {
      console.log("✅ 导航图片已全部预加载完成");
    })
    .catch(() => {
      console.warn("⚠️ 部分导航图片加载失败");
    });

  return true;
}

// ===== 等待 DOM 加载完成或组件加载完成 =====
document.addEventListener("DOMContentLoaded", function () {
  // 尝试初始化导航栏
  if (!initNavigation()) {
    // 如果导航栏元素不存在，监听组件加载完成事件
    console.log("🔄 等待导航栏组件动态加载...");
    document.addEventListener(
      "componentsLoaded",
      () => {
        console.log("🎯 组件加载完成，初始化导航栏");
        initNavigation();
      },
      { once: true }
    );
  }
});
