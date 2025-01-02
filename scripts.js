const images = document.querySelectorAll(".background-carousel img");
const toggleSlideshowButton = document.getElementById("toggle-slideshow");
const toggleParticlesButton = document.getElementById("toggle-particles");

let isSlideshowPlaying = true;
let isParticlesEnabled = false;
let currentIndex = 0;
let interval;

// 切换到下一张图片
function nextSlide() {
  images[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add("active");
}

// 启动轮播
function startSlideshow() {
  interval = setInterval(nextSlide, 4000);
}

// 停止轮播
function stopSlideshow() {
  clearInterval(interval);
}

// 初始启动轮播
startSlideshow();

// 切换轮播开关
toggleSlideshowButton.addEventListener("click", () => {
  if (isSlideshowPlaying) {
    stopSlideshow();
    toggleSlideshowButton.textContent = "Start Slideshow";
  } else {
    startSlideshow();
    toggleSlideshowButton.textContent = "Pause Slideshow";
  }
  isSlideshowPlaying = !isSlideshowPlaying;
});
// 禁止用户右键操作
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// 禁止用户拖拽图片
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });
});
// 生成粒子
function createParticle(x, y) {
  if (!isParticlesEnabled) return;

  const particle = document.createElement("div");
  const size = Math.random() * 10 + 10; // 调整粒子大小
  const offsetX = (Math.random() - 0.5) * 30; // 更大随机偏移
  const offsetY = (Math.random() - 0.5) * 30; // 更大随机偏移

  particle.className = "particle";
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${x + offsetX}px`;
  particle.style.top = `${y + offsetY}px`;
  particle.style.position = "absolute";

  // 采用模糊和透明渐变色来模拟水墨效果
  particle.style.borderRadius = "50%"; // 默认圆形，可以通过 clip-path 添加变化
  particle.style.opacity = Math.random() * 0.5 + 0.3; // 增加透明度变化，模拟水墨效果
  particle.style.filter = `blur(${Math.random() * 5 + 2}px)`; // 添加模糊效果，模拟水墨流动
  particle.style.pointerEvents = "none"; // 防止影响其他元素点击

  // 设置粒子的扩散动画
  particle.style.animation = `particleAnimation ${
    Math.random() * 2 + 3
  }s ease-out forwards`;

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 5000); // 延长粒子的生命周期，适应水墨效果
}

// 添加水墨粒子扩散的动画
const style = document.createElement("style");
style.innerHTML = `
@keyframes particleAnimation {
0% {
transform: scale(0);
opacity: 1;
}
100% {
transform: scale(3);
opacity: 0;
}
}
`;
document.head.appendChild(style);

// 鼠标移动事件
document.addEventListener("mousemove", (e) => {
  createParticle(e.clientX, e.clientY);
});

// 切换粒子开关
toggleParticlesButton.addEventListener("click", () => {
  isParticlesEnabled = !isParticlesEnabled;
  toggleParticlesButton.textContent = isParticlesEnabled
    ? "Disable Particles"
    : "Enable Particles";
});

// 模式切换按钮
const toggleModeButton = document.getElementById("toggle-mode");
let isNightMode = false;

// 切换白天和夜晚模式
toggleModeButton.addEventListener("click", () => {
  isNightMode = !isNightMode;
  document.body.className = isNightMode ? "night-mode" : "day-mode";
  toggleModeButton.textContent = isNightMode
    ? "Switch to Day Mode"
    : "Switch to Night Mode";
});

// 初始化为白天模式
document.body.className = "day-mode";

const backgroundMusic = document.getElementById("background-music");
const toggleMusicButton = document.getElementById("toggle-music");

let isMusicPlaying = false;

// 控制音乐播放和暂停
toggleMusicButton.addEventListener("click", () => {
  if (isMusicPlaying) {
    backgroundMusic.pause();
    toggleMusicButton.textContent = "Play Music";
  } else {
    backgroundMusic.play();
    toggleMusicButton.textContent = "Pause Music";
  }
  isMusicPlaying = !isMusicPlaying;
});

// 动态更新时间
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  document.getElementById(
    "current-time"
  ).textContent = `Current Time: ${timeString}`;
}
setInterval(updateTime, 1000);
updateTime(); // 页面加载时调用

// 统计访问次数
let visits = localStorage.getItem("visits") || 0;
visits++;
localStorage.setItem("visits", visits);

document.getElementById(
  "visit-count"
).textContent = `You have visited this page ${visits} times.`;

window.addEventListener("load", () => {
  const loadingAnimation = document.getElementById("loading-animation");
  loadingAnimation.style.opacity = "0"; // 逐渐透明
  setTimeout(() => {
    loadingAnimation.style.display = "none"; // 完全隐藏
  }, 500); // 等待动画完成再隐藏
});

// 获取头像和模态框元素
const avatar = document.getElementById("avatar");
const modal = document.getElementById("modal");
const closeBtnAvatar = document.querySelector(".close-btnAvatar");

// 显示模态框
avatar.addEventListener("click", () => {
  modal.style.display = "flex";
});

// 关闭模态框
closeBtnAvatar.addEventListener("click", () => {
  modal.style.display = "none";
});

// 点击模态框背景关闭模态框
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

const avatarContainer = document.getElementById("avatar");

// 鼠标移入时触发跳跃动画
avatarContainer.addEventListener("mouseenter", () => {
  avatarContainer.classList.add("jump");

  // 动画结束后移除类，以便可以再次触发动画
  avatarContainer.addEventListener(
    "animationend",
    () => {
      avatarContainer.classList.remove("jump");
    },
    { once: true }
  );
});

// 鼠标移开时，利用 CSS 的 transition 实现平滑回落
avatarContainer.addEventListener("mouseleave", () => {
  avatarContainer.style.transform = "translateY(0)";
});
// 元素选择
const studyModeBtn = document.getElementById("study-mode-btn");
const studyModeContainer = document.getElementById("study-mode");
const closeBtn = document.querySelector(".close-btn");
const startTimerBtn = document.getElementById("start-timer");
const pauseTimerBtn = document.getElementById("pause-timer");
const resetTimerBtn = document.getElementById("reset-timer");
const saveRecordBtn = document.getElementById("save-record");
const timerDisplay = document.getElementById("timer-display");
const historyContainer = document.getElementById("history-container");
const subjectInput = document.getElementById("subject-input");

let timerInterval;
let isTimerRunning = false;
let startTime = 0;
let elapsedTime = 0;
let history = [];
// 获取侧边栏和按钮元素
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");

// 切换侧边栏显示状态
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// 点击侧边栏之外的地方关闭侧边栏
document.addEventListener('click', (event) => {
  if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target !== toggleBtn) {
    sidebar.classList.remove('open');
  }
});
// 打开学习模式
studyModeBtn?.addEventListener("click", () => {
studyModeContainer.style.display = "flex"; // 确保容器可见
setTimeout(() => {
studyModeContainer.classList.add("open");
}, 10); // 延迟添加 open 类以触发过渡效果
renderHistory();
});

// 关闭学习模式
closeBtn.addEventListener("click", () => {
studyModeContainer.classList.remove("open");
studyModeContainer.addEventListener("transitionend", () => {
studyModeContainer.style.display = "none";
}, { once: true }); // 监听过渡结束事件
});

// 点击学习模式背景关闭模态框
studyModeContainer.addEventListener("click", (event) => {
if (event.target === studyModeContainer) {
studyModeContainer.classList.remove("open");
studyModeContainer.addEventListener("transitionend", () => {
studyModeContainer.style.display = "none";
}, { once: true }); // 监听过渡结束事件
}
});

// 格式化时间
function formatTime(ms) {
const totalSeconds = Math.floor(ms / 1000);
const hours = Math.floor(totalSeconds / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;
return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
return num.toString().padStart(2, "0");
}

// 获取当前日期
function getCurrentDate() {
const now = new Date();
return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// 开始计时
startTimerBtn.addEventListener("click", () => {
if (!subjectInput.value.trim()) {
alert("请输入学习科目！");
return;
}
if (isTimerRunning) return;

startTime = Date.now() - elapsedTime;
timerInterval = setInterval(() => {
elapsedTime = Date.now() - startTime;
timerDisplay.textContent = formatTime(elapsedTime);
}, 1000);
isTimerRunning = true;
});

// 暂停计时
pauseTimerBtn.addEventListener("click", () => {
if (isTimerRunning) {
clearInterval(timerInterval);
isTimerRunning = false;
}
});

// 保存记录
saveRecordBtn.addEventListener("click", () => {
if (!subjectInput.value.trim()) {
alert("请输入学习科目！");
return;
}

const record = {
subject: subjectInput.value,
duration: formatTime(elapsedTime),
date: getCurrentDate(),
};

// 从 localStorage 中获取现有历史记录
let history = JSON.parse(localStorage.getItem("studyHistory")) || [];

// 将新记录添加到历史记录中
history.unshift(record);

// 将更新后的历史记录保存到 localStorage
localStorage.setItem("studyHistory", JSON.stringify(history));

renderHistory();

subjectInput.value = "";
elapsedTime = 0;
timerDisplay.textContent = "00:00:00";
});

// 重置计时器
resetTimerBtn.addEventListener("click", () => {
clearInterval(timerInterval);
isTimerRunning = false;
elapsedTime = 0;
timerDisplay.textContent = "00:00:00";
});

// 渲染历史记录
function renderHistory() {
// 从 localStorage 中获取历史记录
let history = JSON.parse(localStorage.getItem("studyHistory")) || [];

historyContainer.innerHTML = ""; // 清空历史记录容器
history.forEach((record, index) => {
const card = document.createElement("div");
card.className = "history-card";
card.style.position = "relative"; // 保证删除按钮正确定位

// 卡片内容
card.innerHTML = `
<button class="delete-btn" data-index="${index}"></button>
<h4>date：${record.date}</h4>
<p>subject：${record.subject}</p>
<p>duartion：${record.duration}</p>
`;

// 删除按钮功能
const deleteBtn = card.querySelector(".delete-btn");
deleteBtn.addEventListener("click", () => {
// 根据索引删除记录
history.splice(index, 1);

// 更新 localStorage 中的历史记录
localStorage.setItem("studyHistory", JSON.stringify(history));

renderHistory(); // 重新渲染历史记录
});

// 将卡片添加到容器中
historyContainer.appendChild(card);
});
}
// 获取新增卡片按钮和时间输入字段
const addCardBtn = document.getElementById("add-card-btn");
const durationInput = document.getElementById("duration-input");

// 新增卡片按钮点击事件
addCardBtn.addEventListener("click", () => {
  const newRecord = {
    subject: subjectInput.value.trim() || "New Subject",
    duration: durationInput.value.trim() || "00:00:00",
    date: getCurrentDate(),
  };

  // 验证时间格式
  if (!validateTimeFormat(newRecord.duration)) {
    alert("请输入正确的时间格式（HH:MM:SS）！");
    return;
  }

  // 从 localStorage 中获取现有历史记录
  let history = JSON.parse(localStorage.getItem("studyHistory")) || [];

  // 将新记录添加到历史记录中
  history.unshift(newRecord);

  // 将更新后的历史记录保存到 localStorage
  localStorage.setItem("studyHistory", JSON.stringify(history));

  renderHistory();

  // 清空输入字段
  subjectInput.value = "";
  durationInput.value = "";
});

// 验证时间格式的函数
function validateTimeFormat(time) {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return timePattern.test(time);
}

// 元素选择
const contactModeBtn = document.getElementById("contact-mode-btn");
const contactModeContainer = document.getElementById("contact-mode");
const closeContactBtn = document.querySelector(".contact-close-btn");

// 打开联系方式模式
contactModeBtn?.addEventListener("click", () => {
  contactModeContainer.style.display = "flex"; // 确保容器可见
  setTimeout(() => {
    contactModeContainer.classList.add("open");
  }, 10); // 延迟添加 open 类以触发过渡效果
});

// 关闭联系方式模式
closeContactBtn.addEventListener("click", () => {
  contactModeContainer.classList.remove("open");
  contactModeContainer.addEventListener("transitionend", () => {
    contactModeContainer.style.display = "none";
  }, { once: true }); // 监听过渡结束事件
});

// 点击联系方式模式背景关闭模态框
contactModeContainer.addEventListener("click", (event) => {
  if (event.target === contactModeContainer) {
    contactModeContainer.classList.remove("open");
    contactModeContainer.addEventListener("transitionend", () => {
      contactModeContainer.style.display = "none";
    }, { once: true }); // 监听过渡结束事件
  }
});
  // 获取“About”按钮和容器元素
  const aboutModeBtn = document.getElementById("about-link");
  const aboutModeContainer = document.getElementById("about-mode");
  const closeAboutBtn = document.querySelector(".about-mode-container .close-btn");

  // 打开“About”页面
  aboutModeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    aboutModeContainer.style.display = "flex"; // 确保容器可见
    setTimeout(() => {
      aboutModeContainer.classList.add("open");
    }, 10); // 延迟添加 open 类以触发过渡效果
  });

  // 关闭“About”页面
  closeAboutBtn.addEventListener("click", () => {
    aboutModeContainer.classList.remove("open");
    aboutModeContainer.addEventListener("transitionend", () => {
      aboutModeContainer.style.display = "none";
    }, { once: true }); // 监听过渡结束事件
  });

  // 点击“About”页面背景关闭模态框
  aboutModeContainer.addEventListener("click", (event) => {
    if (event.target === aboutModeContainer) {
      aboutModeContainer.classList.remove("open");
      aboutModeContainer.addEventListener("transitionend", () => {
        aboutModeContainer.style.display = "none";
      }, { once: true }); // 监听过渡结束事件
    }
  });

// 获取图片放大弹窗元素
const imageModal = document.getElementById("image-modal");
const modalImg = document.getElementById("img01");
const closeImageModalBtn = document.querySelector(".close-image-modal-btn");

// 打开图片放大弹窗
document.querySelectorAll('.about-card img').forEach(img => {
  img.addEventListener('click', () => {
    imageModal.style.display = "block";
    // 首先隐藏图片和背景
    modalImg.style.opacity = 0;
    modalImg.src = img.src;
    // 使用延时动画让图片和背景渐变
    setTimeout(() => {
      modalImg.style.opacity = 1;
      modalImg.style.transform = "scale(1)";
      imageModal.style.opacity = 1; // 渐变背景
    }, 10);
  });
});

// 关闭图片放大弹窗
closeImageModalBtn.addEventListener('click', () => {
  // 让图片缩小并逐渐透明，同时让背景渐变
  modalImg.style.opacity = 0;
  modalImg.style.transform = "scale(0)";
  imageModal.style.opacity = 0; // 背景渐变

  imageModal.addEventListener('transitionend', () => {
    imageModal.style.display = "none";
  }, { once: true });
});

// 点击图片放大弹窗背景关闭模态框
imageModal.addEventListener('click', (event) => {
  if (event.target === imageModal) {
    // 让图片缩小并逐渐透明，同时让背景渐变
    modalImg.style.opacity = 0;
    modalImg.style.transform = "scale(0)";
    imageModal.style.opacity = 0; // 背景渐变

    imageModal.addEventListener('transitionend', () => {
      imageModal.style.display = "none";
    }, { once: true });
  }
});
