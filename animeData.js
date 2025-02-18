export const animeList = [
    {
        id: 1,
        title: "龙与虎",
        cover: "anime/逢坂大和015.jpg",
        genre: "恋爱",
        episodes: 26,
        rating: 10.0,
        status: "completed",
        quote: "天空是连着的，如果我们也能各自发光的话，无论距离有多远，都能看到彼此努力的身影。",
        addedDate: "2025-02-01"
    },
    {
        id: 2,
        title: "国家队",
        cover: "anime/【哲风壁纸】02-不屑.png",
        genre: "恋爱",
        episodes: 24,
        rating: 9.8,
        status: "completed",
        quote: "一个人无法胜利的话，两个人一定能赢的啊。",
        addedDate: "2024-01-15"
    },
    {
        id: 3,
        title: "间谍过家家",
        cover: "anime/【哲风壁纸】云-债券伪造者.png",
        genre: "日常",
        episodes: 62,
        rating: 9.3,
        status: "watching",
        quote: "哇酷哇酷",
        addedDate: "2024-02-01"
    },
    {
        id: 4,
        title: "不愉快的怪物庵",
        cover: "anime/affbc778c62952bd5a31e9a551e9fb5.jpg",
        genre: "日常",
        episodes: 26,
        rating: 9.9,
        status: "completed",
        quote: "可爱的毛茸茸！",
        addedDate: "2024-02-01"
    },
    {
        id: 5,
        title: "你的名字",
        cover: "anime/【哲风壁纸】你的名字-宫水三叶 (1).png",
        genre: "恋爱",
        episodes: 1,
        rating: 9.7,
        status: "completed",
        quote: "想和你重新认识一次，从你叫什么名字开始",
        addedDate: "2024-02-01"
    },
    {
        id: 6,
        title: "中二病也要谈恋爱",
        cover: "anime/六花_141147.png",
        genre: "恋爱",
        episodes: 27,
        rating: 9.6,
        status: "watching",
        quote: "你也被现实世界污染了吗？ 勇太！",
        addedDate: "2024-02-01"
    }
];

export const STATUS_MAP = {
    'watching': '观看中',
    'completed': '已完成',
    'planned': '计划中'
};

export const GENRE_COLORS = {
    '恋爱': 'rgba(255, 105, 180, 0.8)',  // 粉红
    '热血': 'rgba(255, 182, 193, 0.8)',  // 浅粉红
    '搞笑': 'rgba(255, 192, 203, 0.8)',  // 粉色
    '日常': 'rgba(255, 228, 225, 0.8)',  // 浅玫瑰色
    '其他': 'rgba(255, 218, 185, 0.8)'   // 桃色
}; 