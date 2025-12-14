# 💰 .Payments - Task Timer & Payment Tracker

A cross-platform task timer application that evaluates tasks, tracks time worked, and calculates payments including hourly wages, daily rates, monthly salary, and tax/social deductions.

## Features

### ⏱️ Task Timer
- Start, pause, and stop timers for individual tasks
- Real-time display of elapsed time (HH:MM:SS format)
- Track multiple tasks throughout the day
- Maintain complete task history with timestamps

### 💵 Payment Calculation
- **Hourly Rate**: Automatically calculates earnings based on time worked
- **Task Value**: Assign custom values to individual tasks (bonuses, fixed fees)
- **Daily Rate**: Subscription-based model with guaranteed daily payment
- **Monthly Base Salary**: Set base monthly income
- **Tax/Social Deductions**: Configure state-mandated tax rate

### 📊 Payment Summary
- Real-time display of today's earnings
- Monthly earnings tracker (tasks + base salary)
- Total hours worked today
- Tax/social deduction calculations
- Net pay after tax display

### 💾 Data Persistence
- All data stored locally in browser (localStorage)
- Automatic saving of settings, tasks, and payment records
- End-of-day payment processing
- Historical payment records

## Installation & Usage

### Option 1: Direct Browser Access (Recommended)
Simply open `index.html` in any modern web browser:
```bash
# Navigate to the directory
cd /path/to/.payments

# Open in browser (choose one):
open index.html              # macOS
start index.html             # Windows
xdg-open index.html         # Linux
```

### Option 2: Local Web Server
Using Python's built-in server:
```bash
# Navigate to the directory
cd /path/to/.payments

# Start the server
npm start
# or manually:
python -m http.server 8000
# or for Python 3:
python3 -m http.server 8000

# Open browser to:
# http://localhost:8000
```

## How to Use

### 1. Configure Settings
Set your payment rates in the Settings section:
- **Hourly Rate**: Your hourly wage (e.g., $25/hour)
- **Daily Rate**: Guaranteed daily payment for subscription model (e.g., $200/day)
- **Monthly Base Salary**: Fixed monthly salary (e.g., $5000/month)
- **Tax/Social Rate**: State-mandated tax percentage (e.g., 15%)

Settings are automatically saved when changed.

### 2. Track a Task
1. Enter a task name in the "Task Name" field
2. (Optional) Enter a task value for bonus/fixed-fee work
3. Click **▶️ Start** to begin timing
4. Work on your task
5. Click **⏸️ Pause** if you need a break
6. Click **⏹️ Stop** when task is complete

### 3. View Completed Tasks
All completed tasks appear in the "Completed Tasks" section with:
- Task name and duration
- Completion timestamp
- Hourly earnings + task value
- Total earnings for that task

### 4. Monitor Earnings
The Payment Summary section shows:
- **Today's Earnings**: Sum of all tasks completed today
- **This Month**: Monthly base + task earnings
- **Total Hours Today**: Cumulative time worked
- **Tax/Social Deduction**: Calculated from monthly total
- **Net Pay (After Tax)**: Take-home amount

### 5. End of Day Payment
Click **🌙 End Day Payment** to:
- Process daily payment (max of task earnings or daily rate)
- Record payment in history
- View detailed payment breakdown

### 6. Data Management
- **Clear All Data**: Removes all tasks, settings, and payment records
- Data persists between sessions in browser localStorage

## Payment Calculation Details

### Hourly Earnings
```
Hourly Earnings = (Task Duration in Hours) × Hourly Rate
```

### Task Total
```
Task Total = Hourly Earnings + Task Value (if specified)
```

### Daily Payment (Subscription Model)
```
Daily Payment = MAX(Today's Task Earnings, Daily Rate)
```
Guarantees minimum daily payment even if task earnings are lower.

### Monthly Total
```
Monthly Total = Monthly Base Salary + Sum(All Task Earnings This Month)
```

### Tax Deduction
```
Tax Amount = Monthly Total × (Tax Rate %)
Net Pay = Monthly Total - Tax Amount
```

## Cross-Platform Compatibility

This application runs on any platform with a modern web browser:
- ✅ Windows (Chrome, Edge, Firefox)
- ✅ macOS (Safari, Chrome, Firefox)
- ✅ Linux (Chrome, Firefox)
- ✅ Mobile browsers (iOS Safari, Android Chrome)

No installation required - just open `index.html`!

## Technical Details

- **Technology**: Pure HTML5, CSS3, and JavaScript (no frameworks)
- **Storage**: Browser localStorage API
- **Size**: Lightweight (~20KB total)
- **Dependencies**: None
- **Browser Support**: All modern browsers (ES6+)

## Data Storage

All data is stored locally in your browser using localStorage:
- `paymentSettings`: Hourly rate, daily rate, monthly base, tax rate
- `completedTasks`: Array of all completed tasks with earnings
- `paymentRecords`: Historical payment records by date

**Note**: Clearing browser data will delete all stored information. Consider backing up data periodically.

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.
