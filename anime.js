import { animeList, STATUS_MAP, GENRE_COLORS } from './animeData.js';
import { AnimeChart } from './animeChart.js';
import { AnimeStats } from './animeStats.js';
import { AnimeList } from './animeList.js';

document.addEventListener('DOMContentLoaded', () => {
    const chart = new AnimeChart(animeList);
    const stats = new AnimeStats(animeList);
    const list = new AnimeList(animeList);

    // 初始化
    chart.initializeChart();
    stats.updateStats();
    list.render();
});

// 初始化图表
function initializeCharts(animeData) {
    // 类型分布图表
    const genreData = {};
    animeData.forEach(anime => {
        genreData[anime.genre] = (genreData[anime.genre] || 0) + 1;
    });

    const genreChart = new Chart(document.getElementById('genre-chart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(genreData),
            datasets: [{
                data: Object.values(genreData),
                backgroundColor: [
                    'rgba(255, 182, 193, 0.8)',  // 恋爱 - 粉色
                    'rgba(135, 206, 235, 0.8)',  // 热血 - 蓝色
                    'rgba(255, 218, 121, 0.8)',  // 搞笑 - 黄色
                    'rgba(152, 251, 152, 0.8)',  // 日常 - 绿色
                    'rgba(216, 191, 216, 0.8)',  // 其他类型 - 紫色
                    'rgba(250, 128, 114, 0.8)'   // 备用色
                ],
                borderColor: 'white',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    align: 'center',
                    labels: {
                        padding: 10,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 11,
                            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                        },
                        boxWidth: 8,
                        boxHeight: 8,
                        color: '#666'
                    }
                },
                title: {
                    display: false
                }
            },
            layout: {
                padding: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5
                }
            },
            cutout: '70%'
        }
    });
}

// 更新统计信息
function updateStats(animeData) {
    // 更新总数
    document.getElementById('total-anime').textContent = animeData.length;

    // 更新观看时长（假设每集20分钟）
    const totalEpisodes = animeData.reduce((sum, anime) => sum + parseInt(anime.episodes), 0);
    const totalHours = Math.round(totalEpisodes * 20 / 60);
    document.getElementById('total-time').textContent = `${totalHours}小时`;

    // 更新最爱类型
    const genreCounts = {};
    animeData.forEach(anime => {
        genreCounts[anime.genre] = (genreCounts[anime.genre] || 0) + 1;
    });
    const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('favorite-genre').textContent = favoriteGenre ? favoriteGenre[0] : '-';
}

// 渲染番剧列表
function renderAnimeList(animeData) {
    const animeGrid = document.getElementById('anime-grid');
    
    animeGrid.innerHTML = animeData.map(anime => `
        <div class="anime-card">
            <img src="${anime.cover}" alt="${anime.title}" class="anime-cover">
            <div class="anime-info">
                <h3 class="anime-title">${anime.title}</h3>
                <div class="anime-meta">
                    <span>${anime.genre}</span>
                    <span>⭐ ${anime.rating}</span>
                </div>
                <div class="anime-meta">
                    <span>${anime.episodes}集</span>
                    <span>${getStatusText(anime.status)}</span>
                </div>
                <div class="anime-quote">
                    <p>"${anime.quote}"</p>
                </div>
            </div>
        </div>
    `).join('');
}

// 获取观看状态文本
function getStatusText(status) {
    const statusMap = {
        'watching': '观看中',
        'completed': '已完成',
        'planned': '计划中'
    };
    return statusMap[status] || status;
}

// 添加一个简单的通知功能
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 9999;
    `;

    // 显示通知
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });

    // 3秒后移除通知
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 搜索过滤函数
function filterAnimeData(data, searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    return data.filter(anime => 
        anime.title.toLowerCase().includes(searchTerm) ||
        anime.genre.toLowerCase().includes(searchTerm) ||
        anime.quote.toLowerCase().includes(searchTerm)
    );
}

// 排序函数
function sortAnimeData(data, sortType) {
    const sortedData = [...data]; // 创建数据副本
    
    sortedData.sort((a, b) => {
        switch(sortType) {
            case 'date-desc':
                return new Date(b.addedDate) - new Date(a.addedDate);
            case 'date-asc':
                return new Date(a.addedDate) - new Date(b.addedDate);
            case 'rating-desc':
                return b.rating - a.rating;
            case 'rating-asc':
                return a.rating - b.rating;
            default:
                return 0;
        }
    });
    
    return sortedData;
} 