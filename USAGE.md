# Usage Guide

## Getting Started

1. **Open the Application**
   - Simply open `index.html` in any modern web browser
   - Or run `npm start` and navigate to `http://localhost:8000`

2. **Configure Your Settings**
   - Set your **Hourly Rate** (e.g., $25/hour)
   - Set your **Daily Rate** for subscription model (e.g., $200/day)
   - Set your **Monthly Base Salary** (e.g., $5000/month)
   - Set your **Tax/Social Rate** percentage (e.g., 15%)

3. **Track Your Work**
   - Enter a task name (e.g., "Client project wireframes")
   - Optionally add a task value for bonus/fixed-fee work (e.g., $50)
   - Click **▶️ Start** to begin timing
   - Click **⏸️ Pause** if you need a break
   - Click **⏹️ Stop** when complete

4. **Monitor Your Earnings**
   - View real-time earnings in the Payment Summary
   - See today's total hours and earnings
   - Track monthly progress
   - View tax deductions and net pay

5. **End of Day**
   - Click **🌙 End Day Payment** to process daily payment
   - System calculates payment as MAX(task earnings, daily rate)
   - Payment record is saved for your records

## Example Workflow

### Morning Setup
```
Settings:
- Hourly Rate: $25
- Daily Rate: $200
- Monthly Base: $5000
- Tax Rate: 15%
```

### Task 1: Client Meeting Preparation
```
Task Name: "Prepare client presentation"
Task Value: $0
Duration: 1:30:00 (1.5 hours)
Earnings: $37.50 (1.5 × $25)
```

### Task 2: Development Work
```
Task Name: "Implement user authentication"
Task Value: $100 (bonus for completion)
Duration: 3:00:00 (3 hours)
Earnings: $175.00 ($75 hourly + $100 bonus)
```

### End of Day
```
Total Hours: 4.5 hours
Task Earnings: $212.50
Daily Rate Guarantee: $200
Final Payment: $212.50 (higher of the two)
```

## Key Features

### Timer Accuracy
- Tracks time to the second
- Maintains accuracy through pause/resume
- Shows real-time updates

### Payment Models
1. **Hourly**: Time-based earnings
2. **Task Value**: Fixed fees or bonuses
3. **Daily Rate**: Guaranteed minimum (subscription model)
4. **Monthly Base**: Fixed salary component

### Tax Calculation
- Applied to monthly total (base + tasks)
- Configurable percentage
- Shows gross and net pay

### Data Persistence
- All data saved automatically
- Survives browser refresh
- Historical records maintained
- Can clear all data if needed

## Tips

- Set realistic hourly rates
- Use task values for milestone bonuses
- Process end-of-day payment daily
- Review monthly summaries regularly
- Adjust tax rate to match your jurisdiction

## Troubleshooting

**Timer not starting?**
- Ensure you've entered a task name

**Data disappeared?**
- Check if browser data was cleared
- Data is stored in localStorage

**Payment calculations seem wrong?**
- Verify your settings are correct
- Check tax rate percentage
- Ensure hourly rate is entered correctly

**Application not loading?**
- Ensure JavaScript is enabled
- Try a different modern browser
- Check browser console for errors
