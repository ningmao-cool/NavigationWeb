document.addEventListener('DOMContentLoaded', () => {
    // 分类切换功能
    const categoryButtons = document.querySelectorAll('.category-nav li');
    const articleCards = document.querySelectorAll('.article-card');

    // 获取初始卡片顶部的间距
    const initialTopMargin = 100; // 设置为与 blog.css 中 .blog-container 的 margin-top 相同

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的 active 类
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // 给当前点击的按钮添加 active 类
            button.classList.add('active');

            const category = button.dataset.category;
            let firstVisibleCard = null;
            
            // 显示/隐藏对应分类的文章
            articleCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                    if (!firstVisibleCard) {
                        firstVisibleCard = card;
                    }
                } else {
                    card.style.display = 'none';
                }
            });

            // 如果找到了可见的卡片，滚动到正确位置
            if (firstVisibleCard) {
                const cardTop = firstVisibleCard.getBoundingClientRect().top + window.pageYOffset;
                const scrollToPosition = cardTop - initialTopMargin; // 使用固定的顶部间距
                
                window.scrollTo({
                    top: scrollToPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 进度条功能
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });

    // 添加搜索功能
    addSearchFeature();
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

// 添加搜索功能
function addSearchFeature() {
    const searchHTML = `
        <div class="search-container">
            <input type="text" id="search-input" placeholder="Search...">
        </div>
    `;
    
    document.querySelector('.category-nav').insertAdjacentHTML('afterbegin', searchHTML);
    
    const searchInput = document.getElementById('search-input');
    const articles = document.querySelectorAll('.article-card');
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        articles.forEach(article => {
            // 移除之前的高亮
            article.querySelectorAll('.highlight').forEach(el => {
                el.outerHTML = el.textContent;
            });
            
            const title = article.querySelector('h3');
            const content = article.querySelector('.article-excerpt');
            const category = article.querySelector('.article-category');
            
            const titleMatch = title.textContent.toLowerCase().includes(searchTerm);
            const contentMatch = content.textContent.toLowerCase().includes(searchTerm);
            const categoryMatch = category.textContent.toLowerCase().includes(searchTerm);
            
            if (titleMatch || contentMatch || categoryMatch) {
                article.style.display = 'block';
                // 添加高亮
                if (titleMatch) highlightText(title, searchTerm);
                if (contentMatch) highlightText(content, searchTerm);
                if (categoryMatch) highlightText(category, searchTerm);
            } else {
                article.style.display = 'none';
            }
        });
    });
}

// 高亮匹配文本
function highlightText(element, searchTerm) {
    if (!searchTerm) return;
    
    const text = element.textContent;
    // 使用正则表达式匹配整个词，而不是单个字符
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
}

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