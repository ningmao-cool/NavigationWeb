/**
 * js部分
 * @author 宁猫
 * 音乐部分全ai
 */


// 初始化加载动画
let animLoader = lottie.loadAnimation({
  container: document.getElementById("loading-animation"),
  renderer: "svg", // 渲染器，用SVG渲染
  loop: true, // 循环播放
  autoplay: true, // 自动播放
  path: "assert/loader/Animation - 1736650972957.json", // 动画文件路径
});
// 等待页面加载完成后隐藏加载动画
window.addEventListener("load", function () {
  setTimeout(function () {
    // 保持连贯

    // 1. 隐藏加载动画
    document.getElementById("loading-animation").classList.add("hidden");

    // 2. 设置display
    setTimeout(function () {
      document.getElementById("loading-animation").style.display = "none";
    }, 400);
  }, 200);
});

// 获取轮播的图片
const images = document.querySelectorAll(".background-carousel img");
const toggleSlideshowButton = document.getElementById("toggle-slideshow");
const toggleParticlesButton = document.getElementById("toggle-particles");

let currentIndex = 0;
let interval;

// 切换图片
function nextSlide() {
  images[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add("active");
}

// 设置轮播定时执行
function startSlideshow() {
  interval = setInterval(nextSlide, 4000);
}

// 停止轮播
function stopSlideshow() {
  clearInterval(interval);
}


// 初始启动轮播
startSlideshow();


// 禁止用户右键操作
// document.addEventListener("contextmenu", (e) => {
//   e.preventDefault();
// });

// 禁止用户拖拽图片
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });
});

// 获取头像元素和模拟框元素
const avatar = document.getElementById("avatar");
const avatarModal = document.getElementById("avatar-modal");
const avatarCloseBtn = document.getElementById("avatar-close-btn");


// 鼠标移入头像触发动画
avatar.addEventListener("mouseenter", () => {
    avatar.classList.add("jump");
  
    //  动画结束后移除类
    avatar.addEventListener(
      "animationend",
      () => {
        avatar.classList.remove("jump");
      },
      { once: true }
    );
  });

// 点击头像打开模态框
avatar.addEventListener("click", () => {
  avatarModal.style.display = "flex";
  // 添加一个小延时确保display:flex生效后再添加show类
  setTimeout(() => {
      avatarModal.classList.add('show');
  }, 10);
});

// 点击关闭按钮关闭模态框
avatarCloseBtn.addEventListener("click", () => {
  avatarModal.classList.remove('show');
  // 等待过渡效果完成后再隐藏
  setTimeout(() => {
      avatarModal.style.display = "none";
  }, 300);
});

// 点击模态框外部关闭模态框
avatarModal.addEventListener("click", (event) => {
  if (event.target === avatarModal) {
      avatarModal.classList.remove('show');
      // 等待过渡效果完成后再隐藏
      setTimeout(() => {
          avatarModal.style.display = "none";
      }, 300);
  }
});

// 获取隐藏和显示头像的按钮
const toggleProfileButton = document.querySelector(".toggle-profile-button");
const profileContainer = document.querySelector(".profile-container");

// 定义初始状态
let isProfileVisible = true;

// 隐藏和显示头像
toggleProfileButton.addEventListener("click", (event) => {
  event.preventDefault(); // 阻止默认的链接行为

  if (isProfileVisible) {
    toggleProfileButton.textContent = "Show Profile"; // 改变按钮文字
    profileContainer.classList.add("hidden"); // 隐藏Profile
  } else {
    toggleProfileButton.textContent = "Hide Profile"; // 改变按钮文字
    profileContainer.classList.remove("hidden"); // 显示Profile
  }
  isProfileVisible = !isProfileVisible;
});

// 获取控制面板和按钮元素
const controlsPanel = document.querySelector('.controls-panel');
const toggleButton = document.querySelector('.toggle-btn');

toggleButton.addEventListener('click', () => {
  controlsPanel.classList.toggle('open');
  toggleButton.classList.toggle('open');
});

// 点击其他地方关闭控制面板
document.addEventListener('click', (event) => {
  if (!event.target.closest('.controls-panel-container')) {
    controlsPanel.classList.remove('open');
    toggleButton.classList.remove('open');
  }
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



// 切换粒子开关
let isParticlesEnabled = false;


toggleParticlesButton.addEventListener("click", () => {
  isParticlesEnabled = !isParticlesEnabled;
  toggleParticlesButton.textContent = isParticlesEnabled
    ? "Disable Particles"
    : "Enable Particles";
});
// 粒子拖尾效果
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

  // 判断当前模式，动态调整粒子的颜色
  if (isNightMode) {
    // 夜晚模式：黑白色
    const grayValue = Math.floor(Math.random() * 30 + 50); // 随机生成灰度值（100~200之间）
    particle.style.backgroundColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`; // 黑白色
  } else {
    // 白天模式：蓝色
    particle.style.backgroundColor = "rgb(163, 243, 255)";
  }
  particle.style.animation = isNightMode
    ? `fadeAndExpandNight ${Math.random() * 2 + 3}s ease-out forwards`
    : `particleAnimation ${Math.random() * 2 + 3}s ease-out forwards`;

  // 采用模糊和透明渐变色来模拟水墨效果
  particle.style.borderRadius = "50%";
  particle.style.opacity = Math.random() * 0.5 + 0.3;
  particle.style.filter = `blur(${Math.random() * 5 + 2}px)`;
  particle.style.pointerEvents = "none";

  // 设置粒子的扩散动画
  particle.style.animation = `particleAnimation ${
    Math.random() * 2 + 3
  }s ease-out forwards`;

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 5000); // 延长粒子的生命周期
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



// 切换轮播开关
let isSlideshowPlaying = true;

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
  ).textContent = `${timeString}`;
}
setInterval(updateTime, 1000);
updateTime(); 

// 统计访问次数
let visits = localStorage.getItem("visits") || 0;
visits++;
localStorage.setItem("visits", visits);

document.getElementById(
"visit-count"
).textContent = `visited: ${visits} times.`;


// 获取元素
const listLink = document.getElementById("list-link");
const todoListModal = document.getElementById("todoListModal");
const modalListCloseBtn = document.querySelector(".modalListCloseBtn");

// 点击List显示弹窗
listLink.addEventListener("click", (event) => {
  event.preventDefault();
  todoListModal.style.display = "block";
  todoListModal.style.animation = "modalFadeIn 0.3s forwards"; // 应用淡入动画
});

// 点击关闭按钮隐藏弹窗
modalListCloseBtn.addEventListener("click", closeModal);

// 点击弹窗外区域隐藏弹窗
window.addEventListener("click", (event) => {
  if (event.target === todoListModal) {
    closeModal();
  }
});

// 关闭模态框的函数
function closeModal() {
  todoListModal.style.animation = "modalFadeOut 0.3s forwards"; // 应用淡出动画
  todoListModal.addEventListener("animationend", () => {
    todoListModal.style.display = "none"; // 在动画结束后隐藏模态框
  }, { once: true });
}




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

// 打开学习模式
studyModeBtn?.addEventListener("click", () => {
  studyModeContainer.style.display = "flex"; 
  setTimeout(() => {
    studyModeContainer.classList.add("open");
  }, 10); 
  renderHistory();
});

// 关闭学习模式
closeBtn.addEventListener("click", () => {
  studyModeContainer.classList.remove("open");
  studyModeContainer.addEventListener(
    "transitionend",
    () => {
      studyModeContainer.style.display = "none";
    },
    { once: true }
  ); 
});

// 点击学习模式背景关闭模态框
studyModeContainer.addEventListener("click", (event) => {
  if (event.target === studyModeContainer) {
    studyModeContainer.classList.remove("open");
    studyModeContainer.addEventListener(
      "transitionend",
      () => {
        studyModeContainer.style.display = "none";
      },
      { once: true }
    ); 
  }
});

// 获取当前日期
function getCurrentDate() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// 计算时间的毫秒数
function calculateDurationMs(duration) {
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000;
}

// 格式化毫秒数为时:分:秒
function formatTimeFromMs(ms) {
  const hours = Math.floor(ms / (3600 * 1000));
  const minutes = Math.floor((ms % (3600 * 1000)) / (60 * 1000));
  const seconds = Math.floor((ms % (60 * 1000)) / 1000);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// 补零函数
function pad(num) {
  return num < 10 ? "0" + num : num;
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
    timerDisplay.textContent = formatTimeFromMs(elapsedTime);
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



// 更新总时间显示
function updateTotalTimeDisplay(history) {
  const totalTimeMs = history.reduce((total, record) => {
    const [h, m, s] = record.duration.split(":").map(Number);
    return total + h * 3600 * 1000 + m * 60 * 1000 + s * 1000;
  }, 0);

  const totalTimeFormatted = formatTimeFromMs(totalTimeMs);
  const totalTimeDisplay = document.getElementById("total-time");  // 假设总时间显示在这个ID元素中
  totalTimeDisplay.textContent = `Total Time: ${totalTimeFormatted}`;
}


// 保存记录
saveRecordBtn.addEventListener("click", () => {
  if (!subjectInput.value.trim()) {
    alert("请输入学习科目！");
    return;
  }

  // 从 localStorage 中获取现有历史记录
  let history = JSON.parse(localStorage.getItem("studyHistory")) || [];

  // 计算当前记录的时间
  const [hours, minutes, seconds] = formatTime(elapsedTime).split(":").map(Number);
  const currentDurationMs = hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000;

  // 获取日期并计算该日期的总学习时间
  const currentDate = getCurrentDate();
  let dateTotalTime = history.reduce((total, rec) => {
    if (rec.date === currentDate) {
      const [h, m, s] = rec.duration.split(":").map(Number);
      return total + h * 3600 * 1000 + m * 60 * 1000 + s * 1000;
    }
    return total;
  }, 0);

  // 加上当前记录的时间
  dateTotalTime += currentDurationMs;

  // 计算当前记录的比例
  const percentage = ((currentDurationMs / dateTotalTime) * 100).toFixed(2);

  // 创建记录对象
  const record = {
    subject: subjectInput.value,
    duration: formatTime(elapsedTime),
    date: currentDate,
    percentage: percentage
  };

  // 更新同一天其他记录的百分比
  history = history.map(rec => {
    if (rec.date === currentDate) {
      const [h, m, s] = rec.duration.split(":").map(Number);
      const recDurationMs = h * 3600 * 1000 + m * 60 * 1000 + s * 1000;
      rec.percentage = ((recDurationMs / dateTotalTime) * 100).toFixed(2);
    }
    return rec;
  });

  // 将新记录添加到历史记录中
  history.unshift(record);

  // 保存到localStorage
  localStorage.setItem("studyHistory", JSON.stringify(history));

  renderHistory();
  
  // 重置输入和计时器
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

// 更新今天的总学习时间
function updateTodayTotalTime(history) {
  const today = getCurrentDate();
  const todayRecords = history.filter(record => record.date === today);
  const totalTodayMs = todayRecords.reduce((total, record) => {
    const [h, m, s] = record.duration.split(":").map(Number);
    return total + h * 3600 * 1000 + m * 60 * 1000 + s * 1000;
  }, 0);
  
  const totalTodayFormatted = formatTimeFromMs(totalTodayMs);
  const todayTotalTimeDisplay = document.getElementById("today-total-time");
  todayTotalTimeDisplay.textContent = totalTodayFormatted;
}

// 渲染历史记录并计算今日学习时长
function renderHistory() {
  let history = JSON.parse(localStorage.getItem("studyHistory")) || [];
  historyContainer.innerHTML = "";

  // 按日期分组记录
  const groupedHistory = history.reduce((groups, record) => {
    if (!groups[record.date]) {
      groups[record.date] = [];
    }
    groups[record.date].push(record);
    return groups;
  }, {});

  // 为每个日期组重新计算百分比
  Object.entries(groupedHistory).forEach(([date, records]) => {
    // 计算该日期的总时间
    const dateTotalTime = records.reduce((total, rec) => {
      const [h, m, s] = rec.duration.split(":").map(Number);
      return total + h * 3600 * 1000 + m * 60 * 1000 + s * 1000;
    }, 0);

    // 更新每条记录的百分比
    records.forEach(record => {
      const [h, m, s] = record.duration.split(":").map(Number);
      const recordDurationMs = h * 3600 * 1000 + m * 60 * 1000 + s * 1000;
      record.percentage = ((recordDurationMs / dateTotalTime) * 100).toFixed(2);
    });
  });

  // 渲染记录
  history.forEach((record, index) => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.style.position = "relative";

    card.innerHTML = `
      <span class="percentage-text">${record.percentage}%</span>
      <button class="delete-btn" data-index="${index}"></button>
      <h4>Date: ${record.date}</h4>
      <p>Subject: ${record.subject}</p>
      <p>Duration: ${record.duration}</p>
    `;

    // 删除按钮功能
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      history.splice(index, 1);
      localStorage.setItem("studyHistory", JSON.stringify(history));
      renderHistory();
    });

    historyContainer.appendChild(card);
  });

  // 更新总时间显示
  updateTotalTimeDisplay(history);
  
  // 更新今天的总学习时间
  updateTodayTotalTime(history);
}



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

  // 计算新记录的时间
  const [hours, minutes, seconds] = newRecord.duration.split(":").map(Number);
  const currentDurationMs = hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000;

  // 计算同一天的总学习时间
  let dateTotalTime = history.reduce((total, rec) => {
    if (rec.date === newRecord.date) {
      const [h, m, s] = rec.duration.split(":").map(Number);
      return total + h * 3600 * 1000 + m * 60 * 1000 + s * 1000;
    }
    return total;
  }, 0);

  // 加上新记录的时间
  dateTotalTime += currentDurationMs;

  // 计算新记录的百分比
  newRecord.percentage = ((currentDurationMs / dateTotalTime) * 100).toFixed(2);

  // 更新同一天其他记录的百分比
  history = history.map(rec => {
    if (rec.date === newRecord.date) {
      const [h, m, s] = rec.duration.split(":").map(Number);
      const recDurationMs = h * 3600 * 1000 + m * 60 * 1000 + s * 1000;
      rec.percentage = ((recDurationMs / dateTotalTime) * 100).toFixed(2);
    }
    return rec;
  });

  // 将新记录添加到历史记录中
  history.unshift(newRecord);

  // 保存到localStorage
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
  contactModeContainer.addEventListener(
    "transitionend",
    () => {
      contactModeContainer.style.display = "none";
    },
    { once: true }
  ); // 监听过渡结束事件
});

// 点击联系方式模式背景关闭模态框
contactModeContainer.addEventListener("click", (event) => {
  if (event.target === contactModeContainer) {
    contactModeContainer.classList.remove("open");
    contactModeContainer.addEventListener(
      "transitionend",
      () => {
        contactModeContainer.style.display = "none";
      },
      { once: true }
    ); // 监听过渡结束事件
  }
});


// 获取"About"按钮和容器元素
const aboutModeBtn = document.getElementById("about-link");
const aboutModeContainer = document.getElementById("about-mode");
const closeAboutBtn = document.querySelector(
  ".about-mode-container .about-close-btn"
);

// 打开"About"页面
aboutModeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  aboutModeContainer.style.display = "flex"; // 确保容器可见
  setTimeout(() => {
    aboutModeContainer.classList.add("open");
  }, 10); 
});

// 关闭"About"页面
closeAboutBtn.addEventListener("click", () => {
  aboutModeContainer.classList.remove("open");
  aboutModeContainer.addEventListener(
    "transitionend",
    () => {
      aboutModeContainer.style.display = "none";
    },
    { once: true }
  ); 
});

// 点击"About"页面背景关闭模态框
aboutModeContainer.addEventListener("click", (event) => {
  if (event.target === aboutModeContainer) {
    aboutModeContainer.classList.remove("open");
    aboutModeContainer.addEventListener(
      "transitionend",
      () => {
        aboutModeContainer.style.display = "none";
      },
      { once: true }
    ); 
  }
});

// 获取图片放大弹窗元素
const imageModal = document.getElementById("image-modal");
const modalImg = document.getElementById("img01");
const closeImageModalBtn = document.querySelector(".close-image-modal-btn");

// 打开图片放大弹窗
document.querySelectorAll(".about-card img").forEach((img) => {
  img.addEventListener("click", () => {
    imageModal.style.display = "block";
    // 首先隐藏图片和背景
    modalImg.style.opacity = 0;
    modalImg.src = img.src;
    // 使用延时动画让图片和背景渐变
    setTimeout(() => {
      modalImg.style.opacity = 1;
      modalImg.style.transform = "scale(1)";
      imageModal.style.opacity = 1; 
    }, 10);
  });
});

// 关闭图片放大弹窗
closeImageModalBtn.addEventListener("click", () => {
  // 让图片缩小并逐渐透明，同时让背景渐变
  modalImg.style.opacity = 0;
  modalImg.style.transform = "scale(0)";
  imageModal.style.opacity = 0; 

  imageModal.addEventListener(
    "transitionend",
    () => {
      imageModal.style.display = "none";
    },
    { once: true }
  );
});

// 点击图片放大弹窗背景关闭模态框
imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    // 让图片缩小并逐渐透明，同时让背景渐变
    modalImg.style.opacity = 0;
    modalImg.style.transform = "scale(0)";
    imageModal.style.opacity = 0; 

    imageModal.addEventListener(
      "transitionend",
      () => {
        imageModal.style.display = "none";
      },
      { once: true }
    );
  }
});








class MusicPlayer {
  constructor() {
    this.musicList = [
      {
        title: "好きだから。",
        cover: "assert/满意壁纸/【哲风壁纸】二次元-初音-动漫.png",
        src: "assert/music/好きだから。.mp3"
      },
      {
        title: "不得不爱",
        cover: "assert/img/初音未来 (1).png",
        src: "assert/music/不得不爱-Lambert.320.mp3"
      },
      {
        title: "Darling",
        cover: "assert/满意壁纸/【哲风壁纸】02-动漫 (1).png",
        src: "assert/music/Darling.mp3"
      },
      {
        title: "罗生门",
        cover: "assert/满意壁纸/【哲风壁纸】eva-明日香.png",
        src: "assert/music/罗生门.mp3"
      },
      {
        title: "Where Is Your Love",
        cover: "assert/img/【哲风壁纸】好看-粉色-迷惑 (1).png",
        src: "assert/music/Where Is Your Love.mp3"
      },
      {
        title: "小孩",
        cover: "assert/img/【哲风壁纸】插画-秋-出水芙蓉 (1).png",
        src: "assert/music/小孩.mp3"
      },

      {
        title: "trust me",
        cover: "assert/满意壁纸/圣杯战争.png",
        src: "assert/music/trust me.mp3"
      },
      {
        title: "rain",
        cover: "assert/img/【哲风壁纸】剑客-水墨.png",
        src: "assert/music/rain.mp3"
      }


    ];
    this.currentIndex = 0;
    this.playMode = 'list'; // 默认为列表模式
    this.lastVolume = 0.5;
    this.initElements();
    this.initAudioControls();
    this.loadMusic(this.currentIndex, false); // 添加 false 参数表示不自动播放
    this.renderPlaylist();
  }

  initElements() {
    this.player = document.querySelector('.music-player');
    this.audio = document.getElementById('audio-player');
    this.playBtn = document.querySelector('.play-btn');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.volumeSlider = document.querySelector('.volume-slider');
    this.volumeIcon = document.querySelector('.volume-icon');
    this.title = document.querySelector('.music-title');
    this.cover = document.querySelector('.music-cover img');
    this.progressBar = document.querySelector('.progress-bar');
    this.progress = document.querySelector('.progress-current');
    this.currentTime = document.querySelector('.current-time');
    this.totalTime = document.querySelector('.total-time');
    this.modeBtn = document.querySelector('.mode-btn');
    this.playlist = document.querySelector('.playlist');

    // 更新音量滑块的背景颜色
    this.volumeSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      this.audio.volume = value / 100;
      this.updateVolumeIcon();
      
      // 添加渐变背景效果
      this.volumeSlider.style.background = `linear-gradient(to right, 
        #6ab1f7 0%, 
        #6ab1f7 ${value}%, 
        rgba(106, 177, 247, 0.2) ${value}%, 
        rgba(106, 177, 247, 0.2) 100%)`;
    });

    // 初始化音量滑块背景
    this.volumeSlider.style.background = `linear-gradient(to right, 
      #6ab1f7 0%, 
      #6ab1f7 50%, 
      rgba(106, 177, 247, 0.2) 50%, 
      rgba(106, 177, 247, 0.2) 100%)`;

    // 创建滑块容器
    const volumeControl = document.querySelector('.volume-control');
    const volumeSliderContainer = document.createElement('div');
    volumeSliderContainer.className = 'volume-slider-container';
    
    // 将滑块移动到新容器中
    const volumeSlider = this.volumeSlider;
    volumeSliderContainer.appendChild(volumeSlider);
    volumeControl.appendChild(volumeSliderContainer);
  }

  initAudioControls() {
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.prevBtn.addEventListener('click', () => this.playPrev());
    this.nextBtn.addEventListener('click', () => this.playNext());
    this.volumeSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      this.audio.volume = value / 100;
      if (value > 0) {
        this.lastVolume = this.audio.volume;
      }
      this.updateVolumeIcon();
      this.updateVolumeSlider();
    });
    this.volumeIcon.addEventListener('click', () => {
      if (this.audio.volume > 0) {
        // 如果当前有声音，存储当前音量并静音
        this.lastVolume = this.audio.volume;
        this.audio.volume = 0;
        this.volumeSlider.value = 0;
      } else {
        // 如果当前是静音，恢复到上一次的音量
        this.audio.volume = this.lastVolume;
        this.volumeSlider.value = this.lastVolume * 100;
      }
      
      // 更新音量图标和滑块背景
      this.updateVolumeIcon();
      this.updateVolumeSlider();
    });
    this.audio.addEventListener('ended', () => this.playNext());
    
    // 进度条控制
    this.progressBar.addEventListener('click', (e) => {
      const percent = e.offsetX / this.progressBar.offsetWidth;
      this.audio.currentTime = percent * this.audio.duration;
    });

    // 播放模式切换
    this.modeBtn.addEventListener('click', () => this.togglePlayMode());

    // 更新进度
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    
    // 音频加载完成
    this.audio.addEventListener('loadedmetadata', () => {
      this.totalTime.textContent = this.formatTime(this.audio.duration);
    });
  }

  loadMusic(index, autoplay = false) {
    const music = this.musicList[index];
    this.audio.src = music.src;
    this.title.textContent = music.title;
    this.cover.src = music.cover;
    
    // 只有在 autoplay 为 true 时才自动播放
    if (autoplay) {
      this.audio.play().then(() => {
        this.updatePlayButton();
      }).catch(console.error);
    } else {
      this.updatePlayButton();
    }
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
    this.updatePlayButton();
  }

  updatePlayButton() {
    const playIcon = '<path d="M8 5v14l11-7z"/>';
    const pauseIcon = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    this.playBtn.querySelector('svg').innerHTML = this.audio.paused ? playIcon : pauseIcon;
  }

  playPrev() {
    this.currentIndex = (this.currentIndex - 1 + this.musicList.length) % this.musicList.length;
    this.loadMusic(this.currentIndex, true); // 切换歌曲时自动播放
  }

  playNext() {
    if (this.playMode === 'single') {
      this.audio.currentTime = 0;
      this.audio.play();
      return;
    }

    if (this.playMode === 'random') {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * this.musicList.length);
      } while (nextIndex === this.currentIndex && this.musicList.length > 1);
      this.currentIndex = nextIndex;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.musicList.length;
    }
    
    this.loadMusic(this.currentIndex, true); // 切换歌曲时自动播放
  }

  updateVolumeIcon() {
    const volumeOffIcon = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    const volumeOnIcon = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';
    this.volumeIcon.innerHTML = this.audio.volume === 0 ? volumeOffIcon : volumeOnIcon;
  }

  updateProgress() {
    const { currentTime, duration } = this.audio;
    const percent = (currentTime / duration) * 100;
    this.progress.style.width = `${percent}%`;
    this.currentTime.textContent = this.formatTime(currentTime);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  togglePlayMode() {
    const modes = ['list', 'single', 'random'];
    const currentIndex = modes.indexOf(this.playMode);
    this.playMode = modes[(currentIndex + 1) % modes.length];
    this.updateModeButton();
  }

  updateModeButton() {
    const modeIcons = {
      list: '<path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"/>',
      single: '<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>',
      random: '<path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>'
    };
    this.modeBtn.querySelector('svg').innerHTML = modeIcons[this.playMode];
    this.modeBtn.title = `${this.playMode}模式`;
  }

  renderPlaylist() {
    this.playlist.innerHTML = this.musicList.map((music, index) => `
      <div class="playlist-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        ${music.title}
      </div>
    `).join('');

    // 添加点击事件
    this.playlist.querySelectorAll('.playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        if (index !== this.currentIndex) {
          this.currentIndex = index;
          this.loadMusic(index);
        }
      });
    });
  }

  // 添加更新音量滑块背景的方法
  updateVolumeSlider() {
    const value = this.audio.volume * 100;
    this.volumeSlider.style.background = `linear-gradient(to right, 
      #6ab1f7 0%, 
      #6ab1f7 ${value}%, 
      rgba(106, 177, 247, 0.2) ${value}%, 
      rgba(106, 177, 247, 0.2) 100%)`;
  }
}

// 初始化音乐播放器
document.addEventListener('DOMContentLoaded', () => {
  new MusicPlayer();
});
