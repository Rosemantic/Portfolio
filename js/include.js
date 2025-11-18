/* ========================================
   Include - 动态加载组件
   自动加载导航栏等公共组件，确保所有页面同步
   ======================================== */

/**
 * 动态加载 HTML 组件
 * @param {string} selector - 目标容器选择器
 * @param {string} url - 要加载的 HTML 文件路径
 * @returns {Promise}
 */
function loadComponent(selector, url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`加载失败: ${url}`);
      }
      return response.text();
    })
    .then((html) => {
      const container = document.querySelector(selector);
      if (container) {
        container.innerHTML = html;
        console.log(`✅ 组件加载成功: ${url}`);
      } else {
        console.warn(`⚠️ 未找到容器: ${selector}`);
      }
    })
    .catch((error) => {
      console.error(`❌ 组件加载失败: ${url}`, error);
    });
}

/**
 * 自动加载所有标记的组件
 * 使用方法：在 HTML 中添加 data-include 属性
 * 例如：<div data-include="sections/header.html"></div>
 */
function autoLoadComponents() {
  const components = document.querySelectorAll("[data-include]");
  const promises = [];

  components.forEach((element) => {
    const url = element.getAttribute("data-include");
    if (url) {
      const promise = fetch(url)
        .then((response) => response.text())
        .then((html) => {
          element.innerHTML = html;
          element.removeAttribute("data-include"); // 移除属性避免重复加载
          console.log(`✅ 自动加载组件: ${url}`);
        })
        .catch((error) => {
          console.error(`❌ 自动加载失败: ${url}`, error);
        });
      promises.push(promise);
    }
  });

  return Promise.all(promises);
}

// ===== 页面加载完成后自动加载组件 =====
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    autoLoadComponents().then(() => {
      console.log("✅ 所有组件已加载完成");
      // 触发自定义事件，通知其他脚本组件已加载
      document.dispatchEvent(new CustomEvent("componentsLoaded"));
    });
  });
} else {
  // DOM 已加载，立即执行
  autoLoadComponents().then(() => {
    console.log("✅ 所有组件已加载完成");
    document.dispatchEvent(new CustomEvent("componentsLoaded"));
  });
}

console.log("✅ Include.js 已加载");
