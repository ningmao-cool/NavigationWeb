export class AnimeStats {
    constructor(data) {
        this.data = data;
    }

    updateStats() {
        this.updateTotalAnime();
        this.updateWatchTime();
        this.updateFavoriteGenre();
    }

    updateTotalAnime() {
        document.getElementById('total-anime').textContent = this.data.length;
    }

    updateWatchTime() {
        const totalEpisodes = this.data.reduce((sum, anime) => sum + parseInt(anime.episodes), 0);
        const totalHours = Math.round(totalEpisodes * 20 / 60);
        document.getElementById('total-time').textContent = `${totalHours}小时`;
    }

    updateFavoriteGenre() {
        const genreCounts = {};
        this.data.forEach(anime => {
            genreCounts[anime.genre] = (genreCounts[anime.genre] || 0) + 1;
        });
        const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
        document.getElementById('favorite-genre').textContent = favoriteGenre ? favoriteGenre[0] : '-';
    }
} 