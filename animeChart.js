import { GENRE_COLORS } from './animeData.js';

export class AnimeChart {
    constructor(data) {
        this.data = data;
        this.chartInstance = null;
    }

    getGenreData() {
        const genreData = {};
        this.data.forEach(anime => {
            genreData[anime.genre] = (genreData[anime.genre] || 0) + 1;
        });
        return genreData;
    }

    initializeChart() {
        const genreData = this.getGenreData();
        const ctx = document.getElementById('genre-chart');

        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(genreData),
                datasets: [{
                    data: Object.values(genreData),
                    backgroundColor: Object.keys(genreData).map(genre => GENRE_COLORS[genre] || GENRE_COLORS['其他']),
                    borderRadius: 8,
                    maxBarThickness: 30,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#FF1493',
                        bodyColor: '#FF69B4',
                        bodyFont: {
                            size: 13
                        },
                        padding: 12,
                        borderColor: 'rgba(255, 105, 180, 0.1)',
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.x} 部作品`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 12,
                                family: "'Helvetica Neue', 'Arial', sans-serif"
                            },
                            color: '#FF69B4',
                            padding: 8
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 13,
                                weight: '500',
                                family: "'Helvetica Neue', 'Arial', sans-serif"
                            },
                            color: '#FF69B4',
                            padding: 12
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 15,
                        right: 25,
                        top: 15,
                        bottom: 15
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                }
            }
        });
    }

    updateChart(newData) {
        this.data = newData;
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        this.initializeChart();
    }
} 