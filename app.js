// Task Timer and Payment Tracker Application
class PaymentTracker {
    constructor() {
        this.currentTask = null;
        this.timerInterval = null;
        this.startTime = null;
        this.elapsedTime = 0;
        this.isPaused = false;
        
        this.settings = this.loadSettings();
        this.tasks = this.loadTasks();
        this.payments = this.loadPayments();
        
        this.initializeUI();
        this.attachEventListeners();
        this.updateSummary();
        this.renderTasks();
    }

    // Local Storage Management
    loadSettings() {
        const defaults = {
            hourlyRate: 25,
            dailyRate: 200,
            monthlyBase: 5000,
            taxRate: 15
        };
        const saved = localStorage.getItem('paymentSettings');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }

    saveSettings() {
        const settings = {
            hourlyRate: parseFloat(document.getElementById('hourlyRate').value) || 0,
            dailyRate: parseFloat(document.getElementById('dailyRate').value) || 0,
            monthlyBase: parseFloat(document.getElementById('monthlyBase').value) || 0,
            taxRate: parseFloat(document.getElementById('taxRate').value) || 0
        };
        localStorage.setItem('paymentSettings', JSON.stringify(settings));
        this.settings = settings;
        this.updateSummary();
    }

    loadTasks() {
        const saved = localStorage.getItem('completedTasks');
        return saved ? JSON.parse(saved) : [];
    }

    saveTasks() {
        localStorage.setItem('completedTasks', JSON.stringify(this.tasks));
    }

    loadPayments() {
        const saved = localStorage.getItem('paymentRecords');
        return saved ? JSON.parse(saved) : {
            daily: {},
            monthly: {}
        };
    }

    savePayments() {
        localStorage.setItem('paymentRecords', JSON.stringify(this.payments));
    }

    // UI Initialization
    initializeUI() {
        document.getElementById('hourlyRate').value = this.settings.hourlyRate;
        document.getElementById('dailyRate').value = this.settings.dailyRate;
        document.getElementById('monthlyBase').value = this.settings.monthlyBase;
        document.getElementById('taxRate').value = this.settings.taxRate;
    }

    attachEventListeners() {
        // Settings change listeners
        ['hourlyRate', 'dailyRate', 'monthlyBase', 'taxRate'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.saveSettings());
        });

        // Timer controls
        document.getElementById('startBtn').addEventListener('click', () => this.startTimer());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseTimer());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopTimer());

        // Actions
        document.getElementById('endDayBtn').addEventListener('click', () => this.endDayPayment());
        document.getElementById('clearDataBtn').addEventListener('click', () => this.clearAllData());
    }

    // Timer Functions
    startTimer() {
        const taskName = document.getElementById('taskName').value.trim();
        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        if (this.isPaused) {
            // Resume from pause
            this.isPaused = false;
            this.startTime = Date.now() - this.elapsedTime;
        } else {
            // Start new task
            this.elapsedTime = 0;
            this.startTime = Date.now();
            this.currentTask = {
                name: taskName,
                value: parseFloat(document.getElementById('taskValue').value) || 0,
                startTime: new Date().toISOString()
            };
        }

        this.timerInterval = setInterval(() => this.updateTimer(), 100);

        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('taskName').disabled = true;
        document.getElementById('taskValue').disabled = true;
    }

    pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.isPaused = true;
            this.elapsedTime = Date.now() - this.startTime;

            document.getElementById('startBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = true;
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        this.elapsedTime = Date.now() - this.startTime;
        const durationSeconds = Math.floor(this.elapsedTime / 1000);
        const durationHours = durationSeconds / 3600;

        // Calculate earnings
        const hourlyEarnings = durationHours * this.settings.hourlyRate;
        const taskValueEarnings = this.currentTask ? this.currentTask.value : 0;
        const totalEarnings = hourlyEarnings + taskValueEarnings;

        // Save completed task
        const task = {
            name: this.currentTask ? this.currentTask.name : 'Untitled Task',
            duration: durationSeconds,
            durationDisplay: this.formatDuration(durationSeconds),
            hourlyEarnings: hourlyEarnings,
            taskValue: taskValueEarnings,
            totalEarnings: totalEarnings,
            completedAt: new Date().toISOString(),
            date: this.getTodayKey()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateSummary();

        // Reset timer
        this.resetTimer();
    }

    resetTimer() {
        this.currentTask = null;
        this.elapsedTime = 0;
        this.isPaused = false;
        
        document.getElementById('timerDisplay').textContent = '00:00:00';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('taskName').disabled = false;
        document.getElementById('taskValue').disabled = false;
        document.getElementById('taskName').value = '';
        document.getElementById('taskValue').value = '';
    }

    updateTimer() {
        this.elapsedTime = Date.now() - this.startTime;
        const seconds = Math.floor(this.elapsedTime / 1000);
        document.getElementById('timerDisplay').textContent = this.formatDuration(seconds);
    }

    formatDuration(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Task Rendering
    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        
        if (this.tasks.length === 0) {
            tasksList.innerHTML = '<div class="empty-state">No completed tasks yet. Start working on a task!</div>';
            return;
        }

        tasksList.innerHTML = this.tasks.map(task => `
            <div class="task-item">
                <div class="task-info">
                    <h4>${this.escapeHtml(task.name)}</h4>
                    <div class="task-details">
                        <span>⏱️ ${task.durationDisplay}</span>
                        <span>📅 ${new Date(task.completedAt).toLocaleString()}</span>
                        ${task.taskValue > 0 ? `<span>💎 Task Value: $${task.taskValue.toFixed(2)}</span>` : ''}
                    </div>
                </div>
                <div class="task-earnings">
                    <div class="amount">$${task.totalEarnings.toFixed(2)}</div>
                    <div class="duration">${(task.duration / 3600).toFixed(2)}h</div>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Payment Calculations
    getTodayKey() {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    getMonthKey() {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    }

    updateSummary() {
        const todayKey = this.getTodayKey();
        const monthKey = this.getMonthKey();

        // Calculate today's earnings
        const todayTasks = this.tasks.filter(task => task.date === todayKey);
        const todayEarnings = todayTasks.reduce((sum, task) => sum + task.totalEarnings, 0);
        const todayHours = todayTasks.reduce((sum, task) => sum + task.duration, 0) / 3600;

        // Calculate this month's earnings
        const monthTasks = this.tasks.filter(task => task.date.startsWith(monthKey));
        const monthEarnings = monthTasks.reduce((sum, task) => sum + task.totalEarnings, 0);
        
        // Add monthly base salary
        const totalMonthEarnings = monthEarnings + this.settings.monthlyBase;

        // Calculate tax deductions
        const taxAmount = totalMonthEarnings * (this.settings.taxRate / 100);
        const netPay = totalMonthEarnings - taxAmount;

        // Update UI
        document.getElementById('todayEarnings').textContent = `$${todayEarnings.toFixed(2)}`;
        document.getElementById('monthEarnings').textContent = `$${totalMonthEarnings.toFixed(2)}`;
        document.getElementById('todayHours').textContent = `${todayHours.toFixed(2)}h`;
        document.getElementById('taxDeduction').textContent = `$${taxAmount.toFixed(2)}`;
        document.getElementById('netPay').textContent = `$${netPay.toFixed(2)}`;
    }

    // End of Day Payment
    endDayPayment() {
        const todayKey = this.getTodayKey();
        const todayTasks = this.tasks.filter(task => task.date === todayKey);
        
        if (todayTasks.length === 0) {
            alert('No tasks completed today!');
            return;
        }

        const todayEarnings = todayTasks.reduce((sum, task) => sum + task.totalEarnings, 0);
        const todayHours = todayTasks.reduce((sum, task) => sum + task.duration, 0) / 3600;

        // Apply daily rate if subscription model
        const dailyPayment = Math.max(todayEarnings, this.settings.dailyRate);

        // Record payment
        if (!this.payments.daily) {
            this.payments.daily = {};
        }
        
        this.payments.daily[todayKey] = {
            earnings: todayEarnings,
            hours: todayHours,
            payment: dailyPayment,
            processedAt: new Date().toISOString()
        };

        this.savePayments();

        alert(`End of Day Payment Processed!\n\n` +
              `Date: ${todayKey}\n` +
              `Hours Worked: ${todayHours.toFixed(2)}h\n` +
              `Task Earnings: $${todayEarnings.toFixed(2)}\n` +
              `Daily Rate Guarantee: $${this.settings.dailyRate.toFixed(2)}\n` +
              `Payment Amount: $${dailyPayment.toFixed(2)}\n\n` +
              `This represents your subscription-based daily payment.`);
    }

    // Clear All Data
    clearAllData() {
        if (!confirm('Are you sure you want to clear all data? This cannot be undone!')) {
            return;
        }

        this.tasks = [];
        this.payments = { daily: {}, monthly: {} };
        
        localStorage.removeItem('completedTasks');
        localStorage.removeItem('paymentRecords');

        this.saveTasks();
        this.savePayments();
        this.renderTasks();
        this.updateSummary();

        alert('All data has been cleared!');
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PaymentTracker();
});
