document.addEventListener('DOMContentLoaded', () => {
    // 分类切换功能
    const categoryButtons = document.querySelectorAll('.category-nav li');
    const articleCards = document.querySelectorAll('.article-card');
    const searchInput = document.getElementById('search-input');
    let currentCategory = 'all';

    // 获取初始卡片顶部的间距
    const initialTopMargin = 100; // 设置为与 blog.css 中 .blog-container 的 margin-top 相同

    // 搜索功能
    function filterArticles() {
        const searchTerm = searchInput.value.toLowerCase();
        
        articleCards.forEach(card => {
            // 移除之前的高亮
            card.querySelectorAll('.highlight').forEach(el => {
                el.outerHTML = el.textContent;
            });
            
            const title = card.querySelector('h3');
            const excerpt = card.querySelector('.article-excerpt');
            const category = card.querySelector('.article-category');
            
            // 检查是否匹配搜索词和当前分类
            const titleMatch = title.textContent.toLowerCase().includes(searchTerm);
            const excerptMatch = excerpt.textContent.toLowerCase().includes(searchTerm);
            const categoryMatch = category.textContent.toLowerCase().includes(searchTerm);
            const matchesCategory = currentCategory === 'all' || card.dataset.category === currentCategory;
            
            if ((titleMatch || excerptMatch || categoryMatch) && matchesCategory) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
                
                // 添加高亮
                if (searchTerm) {
                    if (titleMatch) highlightText(title, searchTerm);
                    if (excerptMatch) highlightText(excerpt, searchTerm);
                    if (categoryMatch) highlightText(category, searchTerm);
                }
            } else {
                card.style.display = 'none';
            }
        });
    }

    // 高亮匹配文本
    function highlightText(element, searchTerm) {
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
    }

    // 分类切换功能
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新按钮状态
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新当前分类
            currentCategory = button.dataset.category;
            
            // 重新过滤文章
            filterArticles();
        });
    });

    // 搜索输入事件
    searchInput.addEventListener('input', filterArticles);

    // 初始化显示所有文章
    filterArticles();

    // 进度条功能
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
});

// 添加淡入动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// 生成文章卡片的函数
function createArticleCard(articleId, articleInfo) {
    return `
        <div class="article-card" data-category="${articleInfo.category}">
            <div class="article-cover">
                <img src="assert/${articleInfo.cover}" alt="${articleInfo.title} Cover">
            </div>
            <div class="article-content">
                <span class="article-category">${blogConfig.categories[articleInfo.category]}</span>
                <h3>${articleInfo.title}</h3>
                <p class="article-excerpt">${articleInfo.excerpt}</p>
                <div class="article-meta">
                    <span class="article-date">${articleInfo.date}</span>
                    <a href="articles/${articleInfo.category}/${articleId}.html" class="read-more">Read More</a>
                </div>
            </div>
        </div>
    `;
}

// 初始化文章列表
function initArticles() {
    const articleList = document.querySelector('.article-list');
    let html = '';
    
    for (const [id, info] of Object.entries(blogConfig.articles)) {
        html += createArticleCard(id, info);
    }
    
    articleList.innerHTML = html;
} 