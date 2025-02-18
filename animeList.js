import { STATUS_MAP } from './animeData.js';

export class AnimeList {
    constructor(data) {
        this.data = data;
        this.filteredData = data;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const searchInput = document.getElementById('search-anime');
        const sortSelect = document.getElementById('sort-anime');

        searchInput.addEventListener('input', () => this.handleSearch(searchInput.value));
        sortSelect.addEventListener('change', () => this.handleSort(sortSelect.value));
    }

    handleSearch(searchTerm) {
        this.filteredData = this.filterData(searchTerm);
        this.render();
    }

    handleSort(sortType) {
        this.filteredData = this.sortData(sortType);
        this.render();
    }

    filterData(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        return this.data.filter(anime => 
            anime.title.toLowerCase().includes(searchTerm) ||
            anime.genre.toLowerCase().includes(searchTerm) ||
            anime.quote.toLowerCase().includes(searchTerm)
        );
    }

    sortData(sortType) {
        return [...this.filteredData].sort((a, b) => {
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
    }

    render() {
        const animeGrid = document.getElementById('anime-grid');
        animeGrid.innerHTML = this.filteredData.map(anime => this.createAnimeCard(anime)).join('');
    }

    createAnimeCard(anime) {
        return `
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
                        <span>${STATUS_MAP[anime.status] || anime.status}</span>
                    </div>
                    <div class="anime-quote">
                        <p>"${anime.quote}"</p>
                    </div>
                </div>
            </div>
        `;
    }
} 