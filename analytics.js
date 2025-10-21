document.addEventListener('DOMContentLoaded', function() {
    
    // Check if ApexCharts is loaded
    if (typeof ApexCharts === 'undefined') {
        console.error('ApexCharts library not loaded');
        return;
    }

    // ===================================
    // DATA STRUCTURE FOR ALL COMBINATIONS
    // ===================================
    const categoryData = {
        all: {
            monthly: {
                metrics: {
                    transactions: '15,234',
                    processed: '8,456',
                    dealers: '2,834',
                    anomalies: '124'
                },
                distribution: [4234, 2456, 1766],
                regional: [1245, 1103, 956, 887, 823],
                dealerActivity: [2134, 523, 177],
                transactionTrends: [3200, 4100, 3800, 5100, 4900, 6200, 5800, 6500, 7200, 6800, 7500, 8200]
            },
            weekly: {
                metrics: {
                    transactions: '3,409',
                    processed: '1,932',
                    dealers: '2,834',
                    anomalies: '28'
                },
                transactionTrends: [450, 520, 480, 550, 580, 510, 620]
            },
            daily: {
                metrics: {
                    transactions: '487',
                    processed: '276',
                    dealers: '2,834',
                    anomalies: '4'
                },
                transactionTrends: [45, 52, 48, 58, 62, 55, 68, 72, 65, 78, 82, 75, 88, 92, 85, 95, 102, 98, 110, 115, 108, 122, 128, 135]
            }
        },
        pig: {
            monthly: {
                metrics: {
                    transactions: '6,789',
                    processed: '4,234',
                    dealers: '1,245',
                    anomalies: '45'
                },
                distribution: [4234, 0, 0],
                regional: [589, 523, 445, 398, 356],
                dealerActivity: [987, 198, 60],
                transactionTrends: [1400, 1800, 1650, 2200, 2100, 2650, 2500, 2800, 3100, 2900, 3200, 3500]
            },
            weekly: {
                metrics: {
                    transactions: '1,520',
                    processed: '967',
                    dealers: '1,245',
                    anomalies: '10'
                },
                transactionTrends: [201, 232, 214, 245, 258, 227, 276]
            },
            daily: {
                metrics: {
                    transactions: '217',
                    processed: '138',
                    dealers: '1,245',
                    anomalies: '2'
                },
                transactionTrends: [20, 23, 21, 26, 28, 25, 30, 32, 29, 35, 37, 34, 39, 41, 38, 42, 45, 43, 49, 51, 48, 54, 57, 60]
            }
        },
        cattle: {
            monthly: {
                metrics: {
                    transactions: '5,234',
                    processed: '2,456',
                    dealers: '987',
                    anomalies: '32'
                },
                distribution: [0, 2456, 0],
                regional: [389, 345, 298, 267, 234],
                dealerActivity: [756, 178, 53],
                transactionTrends: [1100, 1400, 1300, 1750, 1680, 2100, 1950, 2200, 2450, 2300, 2550, 2800]
            },
            weekly: {
                metrics: {
                    transactions: '1,172',
                    processed: '565',
                    dealers: '987',
                    anomalies: '7'
                },
                transactionTrends: [155, 176, 162, 185, 195, 171, 208]
            },
            daily: {
                metrics: {
                    transactions: '167',
                    processed: '81',
                    dealers: '987',
                    anomalies: '1'
                },
                transactionTrends: [15, 17, 16, 19, 20, 18, 22, 23, 21, 25, 26, 24, 28, 29, 27, 30, 33, 31, 35, 37, 34, 39, 41, 43]
            }
        },
        carabao: {
            monthly: {
                metrics: {
                    transactions: '3,211',
                    processed: '1,766',
                    dealers: '602',
                    anomalies: '28'
                },
                distribution: [0, 0, 1766],
                regional: [267, 235, 213, 222, 233],
                dealerActivity: [391, 147, 64],
                transactionTrends: [700, 900, 850, 1150, 1120, 1450, 1350, 1500, 1650, 1600, 1750, 1900]
            },
            weekly: {
                metrics: {
                    transactions: '719',
                    processed: '395',
                    dealers: '602',
                    anomalies: '6'
                },
                transactionTrends: [95, 112, 104, 125, 132, 116, 142]
            },
            daily: {
                metrics: {
                    transactions: '103',
                    processed: '57',
                    dealers: '602',
                    anomalies: '1'
                },
                transactionTrends: [10, 12, 11, 13, 14, 12, 16, 17, 15, 18, 19, 17, 21, 22, 20, 23, 24, 24, 26, 27, 26, 29, 30, 32]
            }
        }
    };

    let currentReportType = 'monthly'; // Default
    let currentCategory = 'all'; // Default

    // ===================================
    // 1. TRANSACTION TRENDS CHART
    // ===================================
    const transactionChartOptions = {
        series: [{
            name: 'Transactions',
            data: [3200, 4100, 3800, 5100, 4900, 6200, 5800, 6500, 7200, 6800, 7500, 8200]
        }],
        chart: {
            type: 'line',
            height: 350,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: ['#3C91E6'],
        dataLabels: { enabled: false },
        markers: {
            size: 5,
            hover: { size: 7 }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: { colors: '#666', fontSize: '12px' }
            }
        },
        yaxis: {
            title: {
                text: 'Number of Transactions',
                style: { color: '#666' }
            },
            labels: {
                style: { colors: '#666' },
                formatter: function(val) {
                    return val.toLocaleString();
                }
            }
        },
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 5
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function(val) {
                    return val.toLocaleString() + ' transactions';
                }
            }
        }
    };
    
    const transactionChart = new ApexCharts(
        document.querySelector("#transaction-chart"),
        transactionChartOptions
    );
    transactionChart.render();

    // ===================================
    // 2. LIVE FOOD DISTRIBUTION CHART
    // ===================================
    const distributionChartOptions = {
        series: [4234, 2456, 1766],
        chart: {
            type: 'donut',
            height: 350
        },
        labels: ['Pig', 'Cattle', 'Carabao'],
        colors: ['#3C91E6', '#FFCE26', '#FD7238'],
        legend: {
            position: 'bottom',
            fontSize: '14px',
            markers: {
                width: 12,
                height: 12,
                radius: 12
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return val.toFixed(1) + '%';
            },
            style: {
                fontSize: '14px',
                fontWeight: 600
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            fontSize: '16px',
                            fontWeight: 600
                        },
                        value: {
                            fontSize: '24px',
                            fontWeight: 700,
                            formatter: function(val) {
                                return parseInt(val).toLocaleString();
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '16px',
                            fontWeight: 600,
                            formatter: function(w) {
                                return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString();
                            }
                        }
                    }
                }
            }
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function(val) {
                    return val.toLocaleString() + ' animals';
                }
            }
        }
    };
    
    const distributionChart = new ApexCharts(
        document.querySelector("#distribution-chart"),
        distributionChartOptions
    );
    distributionChart.render();

    // ===================================
    // 3. REGIONAL PERFORMANCE CHART
    // ===================================
    const regionalChartOptions = {
        series: [{
            name: 'Transactions',
            data: [1245, 1103, 956, 887, 823]
        }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 8,
                dataLabels: { position: 'top' }
            }
        },
        colors: ['#3C91E6'],
        dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ['#666']
            }
        },
        xaxis: {
            categories: ['Cavite', 'Batangas', 'Laguna', 'Manila', 'Rizal'],
            labels: {
                style: { colors: '#666', fontSize: '12px' }
            }
        },
        yaxis: {
            title: {
                text: 'Number of Transactions',
                style: { color: '#666' }
            },
            labels: {
                style: { colors: '#666' },
                formatter: function(val) {
                    return val.toLocaleString();
                }
            }
        },
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 5
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function(val) {
                    return val.toLocaleString() + ' transactions';
                }
            }
        }
    };
    
    const regionalChart = new ApexCharts(
        document.querySelector("#regional-chart"),
        regionalChartOptions
    );
    regionalChart.render();

    // ===================================
    // 4. DEALER ACTIVITY STATUS CHART
    // ===================================
    const dealerActivityOptions = {
        series: [2134, 523, 177],
        chart: {
            type: 'pie',
            height: 350
        },
        labels: ['Active', 'Inactive', 'Suspended'],
        colors: ['#2e7d32', '#FFCE26', '#DB504A'],
        legend: {
            position: 'bottom',
            fontSize: '14px',
            markers: {
                width: 12,
                height: 12,
                radius: 12
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return val.toFixed(1) + '%';
            },
            style: {
                fontSize: '14px',
                fontWeight: 600
            }
        },
        plotOptions: {
            pie: {
                expandOnClick: false
            }
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function(val) {
                    return val.toLocaleString() + ' dealers';
                }
            }
        }
    };
    
    const dealerActivityChart = new ApexCharts(
        document.querySelector("#dealer-activity-chart"),
        dealerActivityOptions
    );
    dealerActivityChart.render();

    // ===================================
    // 5. PROCESSING TIME ANALYSIS CHART
    // ===================================
    const processingTimeOptions = {
        series: [{
            name: 'Hours',
            data: [2.3, 3.1, 2.8, 4.2, 3.5, 2.9]
        }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 8,
                dataLabels: { position: 'top' }
            }
        },
        colors: ['#FD7238'],
        dataLabels: {
            enabled: true,
            offsetX: 30,
            style: {
                fontSize: '12px',
                colors: ['#666']
            },
            formatter: function(val) {
                return val + ' hrs';
            }
        },
        xaxis: {
            categories: ['Pig', 'Cattle', 'Carabao', 'Goat', 'Sheep', 'Buffalo'],
            title: {
                text: 'Average Hours',
                style: { color: '#666' }
            },
            labels: {
                style: { colors: '#666' }
            }
        },
        yaxis: {
            labels: {
                style: { colors: '#666', fontSize: '12px' }
            }
        },
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 5
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function(val) {
                    return val + ' hours';
                }
            }
        }
    };
    
    const processingTimeChart = new ApexCharts(
        document.querySelector("#processing-time-chart"),
        processingTimeOptions
    );
    processingTimeChart.render();

    // ===================================
    // 6. ANOMALY CATEGORIES CHART
    // ===================================
    const anomalyChartOptions = {
        series: [{
            name: 'Count',
            data: [45, 32, 28, 19]
        }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
                borderRadius: 8,
                distributed: true,
                dataLabels: { position: 'top' }
            }
        },
        colors: ['#DB504A', '#FD7238', '#FFCE26', '#3C91E6'],
        dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ['#666']
            }
        },
        legend: { show: false },
        xaxis: {
            categories: ['Documentation', 'Weight Issue', 'Health Cert', 'Late Submit'],
            labels: {
                style: { colors: '#666', fontSize: '11px' }
            }
        },
        yaxis: {
            title: {
                text: 'Number of Cases',
                style: { color: '#666' }
            },
            labels: {
                style: { colors: '#666' }
            }
        },
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 5
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function(val) {
                    return val + ' cases';
                }
            }
        }
    };
    
    const anomalyChart = new ApexCharts(
        document.querySelector("#anomaly-chart"),
        anomalyChartOptions
    );
    anomalyChart.render();

    // ===================================
    // CHART TYPE TOGGLE
    // ===================================
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            chartTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const chartType = this.getAttribute('data-chart');
            
            transactionChart.updateOptions({
                chart: { type: chartType },
                stroke: {
                    curve: chartType === 'line' ? 'smooth' : 'straight',
                    width: chartType === 'line' ? 3 : 0
                }
            });
        });
    });

    // ===================================
    // TIME FILTER CHANGE HANDLER
    // ===================================
    const timeFilter = document.getElementById('time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            const period = this.value;
            let newData, categories;
            
            switch(period) {
                case 'week':
                    newData = [950, 1100, 980, 1050, 1200, 1150, 1300];
                    categories = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    break;
                case 'quarter':
                    newData = [12000, 15000, 18000];
                    categories = ['Q1 2025', 'Q2 2025', 'Q3 2025'];
                    break;
                case 'year':
                    newData = [45000, 52000, 58000];
                    categories = ['2023', '2024', '2025'];
                    break;
                default:
                    newData = [3200, 4100, 3800, 5100, 4900, 6200, 5800, 6500, 7200, 6800, 7500, 8200];
                    categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            }
            
            transactionChart.updateOptions({
                xaxis: { categories: categories }
            });
            
            transactionChart.updateSeries([{
                name: 'Transactions',
                data: newData
            }]);
        });
    }

    // ===================================
    // EXPORT REPORT BUTTON
    // ===================================
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Exporting...';
            this.disabled = true;
            
            setTimeout(() => {
                alert('Analytics Report Export\n\nYour comprehensive report including:\n• All charts and visualizations\n• Transaction data\n• Dealer performance metrics\n• Anomaly reports\n\nWould be generated and downloaded as PDF.');
                
                this.innerHTML = originalText;
                this.disabled = false;
            }, 1500);
        });
    }

    // ===================================
    // VIEW ALL BUTTONS
    // ===================================
    const viewAllBtns = document.querySelectorAll('.view-all-btn');
    viewAllBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tableType = this.closest('.table-container').querySelector('.table-header h3').textContent;
            alert(`Opening detailed view for: ${tableType}\n\nThis would navigate to a full page with complete data and advanced filtering options.`);
        });
    });

    // ===================================
    // CATEGORY FILTER BUTTONS WITH DATA UPDATE
    // ===================================
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            currentCategory = category;
            console.log('Category filter changed to:', category);
            
            // Update metric cards with animation
            updateMetricCards(categoryData[category][currentReportType].metrics);
            
            // Update all charts based on current report type
            updateChartsForCategory(category, currentReportType);
            
            showNotification(`Filtering data for: ${category === 'all' ? 'All Livestock' : category.charAt(0).toUpperCase() + category.slice(1)}`);
        });
    });

    // ===================================
    // UPDATE CHARTS FOR CATEGORY
    // ===================================
    function updateChartsForCategory(category, reportType) {
        const data = categoryData[category][reportType];
        
        // Get the correct categories based on report type
        let categories;
        if (reportType === 'daily') {
            categories = ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];
        } else if (reportType === 'weekly') {
            categories = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        } else {
            categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        }
        
        // Update Transaction Trends Chart
        transactionChart.updateOptions({
            xaxis: {
                categories: categories,
                labels: {
                    style: { colors: '#666', fontSize: '12px' }
                }
            }
        });
        
        transactionChart.updateSeries([{
            name: 'Transactions',
            data: data.transactionTrends
        }]);
        
        // Only update distribution and regional charts if monthly (they don't change for daily/weekly)
        if (reportType === 'monthly') {
            // Update Distribution Chart
            if (category === 'all') {
                distributionChart.updateOptions({
                    labels: ['Pig', 'Cattle', 'Carabao']
                });
                distributionChart.updateSeries(data.distribution);
            } else if (category === 'pig') {
                distributionChart.updateOptions({
                    labels: ['Pig']
                });
                distributionChart.updateSeries([data.distribution[0]]);
            } else if (category === 'cattle') {
                distributionChart.updateOptions({
                    labels: ['Cattle']
                });
                distributionChart.updateSeries([data.distribution[1]]);
            } else if (category === 'carabao') {
                distributionChart.updateOptions({
                    labels: ['Carabao']
                });
                distributionChart.updateSeries([data.distribution[2]]);
            }
            
            // Update Regional Performance Chart
            regionalChart.updateSeries([{
                name: 'Transactions',
                data: data.regional
            }]);
            
            // Update Dealer Activity Chart
            dealerActivityChart.updateSeries(data.dealerActivity);
        }
    }

    // ===================================
    // UPDATE METRIC CARDS FUNCTION
    // ===================================
    function updateMetricCards(data) {
        const cards = document.querySelectorAll('.metric-card');
        
        // Update each card with animation
        cards[0].querySelector('h3').style.opacity = '0';
        setTimeout(() => {
            cards[0].querySelector('h3').textContent = data.transactions;
            cards[0].querySelector('h3').style.transition = 'opacity 0.3s ease';
            cards[0].querySelector('h3').style.opacity = '1';
        }, 150);
        
        cards[1].querySelector('h3').style.opacity = '0';
        setTimeout(() => {
            cards[1].querySelector('h3').textContent = data.processed;
            cards[1].querySelector('h3').style.transition = 'opacity 0.3s ease';
            cards[1].querySelector('h3').style.opacity = '1';
        }, 200);
        
        cards[2].querySelector('h3').style.opacity = '0';
        setTimeout(() => {
            cards[2].querySelector('h3').textContent = data.dealers;
            cards[2].querySelector('h3').style.transition = 'opacity 0.3s ease';
            cards[2].querySelector('h3').style.opacity = '1';
        }, 250);
        
        cards[3].querySelector('h3').style.opacity = '0';
        setTimeout(() => {
            cards[3].querySelector('h3').textContent = data.anomalies;
            cards[3].querySelector('h3').style.transition = 'opacity 0.3s ease';
            cards[3].querySelector('h3').style.opacity = '1';
        }, 300);
    }

    // ===================================
    // REPORT TYPE FILTER BUTTONS WITH DATA UPDATE
    // ===================================
    const reportBtns = document.querySelectorAll('.report-btn');
    reportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            reportBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const reportType = this.getAttribute('data-report');
            currentReportType = reportType;
            console.log('Report type changed to:', reportType);
            
            // Update metric cards and charts for current category and report type
            updateMetricCards(categoryData[currentCategory][reportType].metrics);
            updateChartsForCategory(currentCategory, reportType);
            
            showNotification(`Loading ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`);
        });
    });

    // ===================================
    // NOTIFICATION HELPER FUNCTION
    // ===================================
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'filter-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            background: var(--blue);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: var(--poppins);
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // ===================================
    // ANIMATION STYLES
    // ===================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.metric-card, .chart-container, .table-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // ===================================
    // METRIC CHANGES ANIMATION
    // ===================================
    const metricChanges = document.querySelectorAll('.metric-change');
    metricChanges.forEach((change, index) => {
        setTimeout(() => {
            change.style.opacity = '0';
            change.style.transform = 'scale(0.9)';
            setTimeout(() => {
                change.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                change.style.opacity = '1';
                change.style.transform = 'scale(1)';
            }, 50);
        }, index * 100);
    });

    console.log('Analytics dashboard initialized successfully');
});

// ===================================
// WINDOW RESIZE HANDLER
// ===================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        console.log('Window resized - charts adjusting...');
    }, 250);
});