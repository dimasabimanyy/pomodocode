const vscode = require('vscode');
const { startTimer, resetTimer, toggleSession, getFormattedTime, setSessionDuration } = require('./src/timer'); 
const path = require('path');
const player = require('play-sound')();

let isWorking = true;
let sessionDuration = 2 * 1000;  // Set to 30 seconds for testing
let currentTime = sessionDuration;  // Make sure currentTime starts with sessionDuration
let timerStatusBarItem;
let progressStatusBarItem;
let progressBarInterval;

function activate(context) {
	let startCommand = vscode.commands.registerCommand('extension.startPomodoro', () => {
    vscode.window.showInformationMessage('Starting Pomodoro session...');
    setSessionDuration(sessionDuration);  // Set the session duration here for testing
    startPomodoroSession();
  });

  let resetCommand = vscode.commands.registerCommand('extension.resetPomodoro', () => {
    resetTimer();
    setSessionDuration(sessionDuration);  // Reset to sessionDuration on reset
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

    // Show notification and play bell sound when timer ends
    vscode.window.showInformationMessage('Pomodoro session completed!');
    playBellSound();

    toggleSession();  
    setSessionDuration(5 * 60 * 1000);  // For break time (5 minutes)
    startTimer(() => {
      if (timerStatusBarItem) {
        timerStatusBarItem.text = `$(clock) Pomodoro: 00:00`;
        progressStatusBarItem.text = 'Progress: 100%';  // Full progress
      }
      vscode.window.showInformationMessage('Break time is over!');
      playBellSound();
      toggleSession();  
      setSessionDuration(sessionDuration);  // Work session, reset to sessionDuration for the next work period
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
    progress = ((sessionDuration - currentTime) / sessionDuration) * 100;  // Calculate progress in percentage

    // Ensure that the progress doesn't exceed 100%
    if (progress >= 100) {
      progress = 100;
    }
    
    progressStatusBarItem.text = `Progress: ${Math.round(progress)}%`;  // Update progress as percentage
    timerStatusBarItem.text = `$(clock) Pomodoro: ${getFormattedTime(currentTime)}`;
    currentTime -= 1000;
  }, 1000);
}

function playBellSound() {
	console.log("Dir name: ", __dirname);
  const audioPath = path.join(__dirname, 'assets', 'level-up.mp3');  // Set the path to your audio file

	console.log({audioPath})
  
  player.play(audioPath, function(err) {
		if (err) {
      console.log('Error playing sound:', err);
    } else {
      console.log('Sound played successfully');
    }
  });
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
