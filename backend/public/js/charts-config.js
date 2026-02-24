// Configuration améliorée des graphiques avec Chart.js
const ChartsManager = {
    charts: {},
    
    // Palette de couleurs modernes et vibrantes
    colorPalette: [
        { bg: 'rgba(59, 130, 246, 0.85)', border: 'rgb(59, 130, 246)' },      // Bleu
        { bg: 'rgba(16, 185, 129, 0.85)', border: 'rgb(16, 185, 129)' },      // Vert
        { bg: 'rgba(245, 158, 11, 0.85)', border: 'rgb(245, 158, 11)' },      // Orange
        { bg: 'rgba(239, 68, 68, 0.85)', border: 'rgb(239, 68, 68)' },        // Rouge
        { bg: 'rgba(139, 92, 246, 0.85)', border: 'rgb(139, 92, 246)' },      // Violet
        { bg: 'rgba(236, 72, 153, 0.85)', border: 'rgb(236, 72, 153)' },      // Rose
        { bg: 'rgba(20, 184, 166, 0.85)', border: 'rgb(20, 184, 166)' },      // Teal
        { bg: 'rgba(251, 146, 60, 0.85)', border: 'rgb(251, 146, 60)' }       // Orange clair
    ],
    
    // Options communes pour tous les graphiques
    getCommonOptions() {
        return {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 13,
                            family: "'Inter', 'Segoe UI', sans-serif",
                            weight: '500'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        boxHeight: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    padding: 16,
                    titleFont: {
                        size: 15,
                        weight: 'bold',
                        family: "'Inter', 'Segoe UI', sans-serif"
                    },
                    bodyFont: {
                        size: 14,
                        family: "'Inter', 'Segoe UI', sans-serif"
                    },
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 10,
                    displayColors: true,
                    boxWidth: 12,
                    boxHeight: 12,
                    boxPadding: 6
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        };
    },
    
    async initCharts(apiUrl) {
        if (Object.keys(this.charts).length > 0) return;
        
        try {
            const products = await fetch(`${apiUrl}/products`).then(r => r.json());
            
            this.createCategoryChart(products);
            this.createPriceChart(products);
            this.createStockChart(products);
            this.createStatusChart(products);
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des graphiques:', error);
        }
    },
    
    createCategoryChart(products) {
        const categoryCount = {};
        products.forEach(p => {
            const cat = p.category?.name || 'Sans catégorie';
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
        
        const colors = this.colorPalette.slice(0, Object.keys(categoryCount).length);
        
        this.charts.category = new Chart(document.getElementById('categoryChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryCount),
                datasets: [{
                    data: Object.values(categoryCount),
                    backgroundColor: colors.map(c => c.bg),
                    borderColor: colors.map(c => c.border),
                    borderWidth: 3,
                    hoverOffset: 20,
                    hoverBorderWidth: 4,
                    spacing: 3
                }]
            },
            options: {
                ...this.getCommonOptions(),
                cutout: '60%',
                plugins: {
                    ...this.getCommonOptions().plugins,
                    legend: {
                        ...this.getCommonOptions().plugins.legend,
                        position: 'right'
                    },
                    tooltip: {
                        ...this.getCommonOptions().plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return ` ${label}: ${value} produits (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    createPriceChart(products) {
        const priceRanges = {
            '0-50€': 0,
            '50-100€': 0,
            '100-250€': 0,
            '250-500€': 0,
            '500€+': 0
        };
        
        products.forEach(p => {
            if (p.price < 50) priceRanges['0-50€']++;
            else if (p.price < 100) priceRanges['50-100€']++;
            else if (p.price < 250) priceRanges['100-250€']++;
            else if (p.price < 500) priceRanges['250-500€']++;
            else priceRanges['500€+']++;
        });
        
        this.charts.price = new Chart(document.getElementById('priceChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(priceRanges),
                datasets: [{
                    label: 'Nombre de produits',
                    data: Object.values(priceRanges),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                ...this.getCommonOptions(),
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 12,
                                family: "'Inter', 'Segoe UI', sans-serif"
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 12,
                                weight: '500',
                                family: "'Inter', 'Segoe UI', sans-serif"
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    ...this.getCommonOptions().plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });
    },
    
    createStockChart(products) {
        const stockLevels = {
            'Stock élevé (>10)': 0,
            'Stock faible (1-10)': 0,
            'Épuisé (0)': 0
        };
        
        products.forEach(p => {
            if (p.stock > 10) stockLevels['Stock élevé (>10)']++;
            else if (p.stock > 0) stockLevels['Stock faible (1-10)']++;
            else stockLevels['Épuisé (0)']++;
        });
        
        this.charts.stock = new Chart(document.getElementById('stockChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(stockLevels),
                datasets: [{
                    data: Object.values(stockLevels),
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.85)',
                        'rgba(245, 158, 11, 0.85)',
                        'rgba(239, 68, 68, 0.85)'
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)'
                    ],
                    borderWidth: 3,
                    hoverOffset: 15,
                    hoverBorderWidth: 4
                }]
            },
            options: {
                ...this.getCommonOptions(),
                plugins: {
                    ...this.getCommonOptions().plugins,
                    tooltip: {
                        ...this.getCommonOptions().plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return ` ${label}: ${value} produits (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    createStatusChart(products) {
        const statusData = {
            'Produits actifs': products.filter(p => p.is_active).length,
            'Produits inactifs': products.filter(p => !p.is_active).length
        };
        
        this.charts.status = new Chart(document.getElementById('statusChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusData),
                datasets: [{
                    data: Object.values(statusData),
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.85)',
                        'rgba(107, 114, 128, 0.85)'
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(107, 114, 128)'
                    ],
                    borderWidth: 3,
                    hoverOffset: 20,
                    hoverBorderWidth: 4,
                    spacing: 3
                }]
            },
            options: {
                ...this.getCommonOptions(),
                cutout: '65%',
                plugins: {
                    ...this.getCommonOptions().plugins,
                    tooltip: {
                        ...this.getCommonOptions().plugins.tooltip,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return ` ${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    destroyCharts() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
    }
};
