const vscode = require('vscode');
const { startTimer, resetTimer, toggleSession, getFormattedTime } = require('./src/timer'); 

let isWorking = true; 
let currentTime = 30 * 1000;  // Start with a 30-second session (for testing)
let timerStatusBarItem;
let progressStatusBarItem;
let progressBarInterval;

function activate(context) {
  let startCommand = vscode.commands.registerCommand('extension.startPomodoro', () => {
    vscode.window.showInformationMessage('Starting Pomodoro session...');
    startPomodoroSession();
  });

  let resetCommand = vscode.commands.registerCommand('extension.resetPomodoro', () => {
    resetTimer();
    currentTime = 30 * 1000;  
    if (timerStatusBarItem) {
      timerStatusBarItem.text = `$(clock) Pomodoro: ${getFormattedTime(currentTime)}`;
      progressStatusBarItem.text = 'Progress: 0%';
    }
    vscode.window.showInformationMessage('Pomodoro session reset!');
    if (progressBarInterval) {
      clearInterval(progressBarInterval);
    }
  });

  context.subscriptions.push(startCommand);
  context.subscriptions.push(resetCommand);

  // Create status bar items
  createStatusBarItems();
}

function createStatusBarItems() {
  // Timer status bar item
  timerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  timerStatusBarItem.command = 'extension.startPomodoro';
  timerStatusBarItem.text = `$(clock) Pomodoro: ${getFormattedTime(currentTime)}`;
  timerStatusBarItem.show();

  // Progress bar status bar item (percentage-based)
  progressStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 90);
  progressStatusBarItem.text = 'Progress: 0%';  // Start with 0% progress
  progressStatusBarItem.show();
}

function startPomodoroSession() {
  // Start the timer and update the progress every second
  startTimer(() => {
    if (timerStatusBarItem) {
      timerStatusBarItem.text = `$(clock) Pomodoro: 00:00`;
      progressStatusBarItem.text = 'Progress: 100%';  // Full progress
    }
    toggleSession();  
    currentTime = 5 * 60 * 1000;  // For break time
    startTimer(() => {
      if (timerStatusBarItem) {
        timerStatusBarItem.text = `$(clock) Pomodoro: 00:00`;
        progressStatusBarItem.text = 'Progress: 100%';  // Full progress
      }
      toggleSession();  
      currentTime = 30 * 1000;  // Work session
      startPomodoroSession();  // Start a new session after break
    });
  });
  
  // Update timer and progress as percentage
  let progress = 0;
  progressBarInterval = setInterval(() => {
    if (currentTime <= 0) {
      clearInterval(progressBarInterval);
      progressStatusBarItem.text = 'Progress: 100%';  // Ensure progress shows 100% at the end
      return;
    }
    progress = ((30 * 1000 - currentTime) / (30 * 1000)) * 100;  // Calculate progress in percentage

    // Ensure that the progress doesn't exceed 100%
    if (progress >= 100) {
      progress = 100;
    }
    
    progressStatusBarItem.text = `Progress: ${Math.round(progress)}%`;  // Update progress as percentage
    timerStatusBarItem.text = `$(clock) Pomodoro: ${getFormattedTime(currentTime)}`;
    currentTime -= 1000;
  }, 1000);
}

function deactivate() {
  resetTimer();
  if (progressBarInterval) {
    clearInterval(progressBarInterval);
  }
  if (timerStatusBarItem) {
    timerStatusBarItem.dispose();
  }
  if (progressStatusBarItem) {
    progressStatusBarItem.dispose();
  }
}

module.exports = {
  activate,
  deactivate
};
