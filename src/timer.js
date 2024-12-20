let workDuration = 25 * 60 * 1000;  // Default to 25 minutes
let breakDuration = 5 * 60 * 1000;  // Default to 5 minutes
let timer;
let isWorking = true;
let currentTime = workDuration;  // Initialize with workDuration by default

// Set the session duration dynamically
function setSessionDuration(duration) {
  currentTime = duration;
}

// Start the timer, callback is called when time is up
function startTimer(callback) {
  timer = setInterval(() => {
    currentTime -= 1000;
    if (currentTime <= 0) {
      clearInterval(timer);
      callback();
    }
  }, 1000);
}

// Reset the timer
function resetTimer() {
  clearInterval(timer);
  currentTime = isWorking ? workDuration : breakDuration;  // Set to work or break duration
}

// Toggle between work and break sessions
function toggleSession() {
  isWorking = !isWorking;
  currentTime = isWorking ? workDuration : breakDuration;  // Set to work or break duration
}

// Format the time as MM:SS
function getFormattedTime() {
  let minutes = Math.floor(currentTime / 60000);
  let seconds = Math.floor((currentTime % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

module.exports = {
  startTimer,
  resetTimer,
  toggleSession,
  getFormattedTime,
  setSessionDuration,  // Expose the function to set session duration
};
