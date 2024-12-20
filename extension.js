const vscode = require('vscode');
const { startTimer, resetTimer, toggleSession, getFormattedTime } = require('./src/timer');

let sessionStatusBarItem;

function activate(context) {
  sessionStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  sessionStatusBarItem.text = `Pomodoro: ${getFormattedTime()}`;
  sessionStatusBarItem.show();

  let startCommand = vscode.commands.registerCommand('extension.startPomodoro', () => {
    vscode.window.showInformationMessage('Starting Pomodoro session...');
    startTimer(() => {
      vscode.window.showInformationMessage('Work session ended! Time for a break.');
      toggleSession();  // Switch to break
      startTimer(() => {
        vscode.window.showInformationMessage('Break ended! Time to get back to work!');
        toggleSession();  // Switch to work
        startTimer(() => {});  // Start a new work session after the break
      });
    });
  });

  let resetCommand = vscode.commands.registerCommand('extension.resetPomodoro', () => {
    resetTimer();
    sessionStatusBarItem.text = `Pomodoro: ${getFormattedTime()}`;
    vscode.window.showInformationMessage('Pomodoro session reset!');
  });

  context.subscriptions.push(startCommand);
  context.subscriptions.push(resetCommand);

  setInterval(() => {
    sessionStatusBarItem.text = `Pomodoro: ${getFormattedTime()}`;
  }, 1000);  // Update the timer display every second
}

function deactivate() {
  resetTimer();
}

module.exports = {
  activate,
  deactivate
};
