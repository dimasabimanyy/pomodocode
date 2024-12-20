let workDuration = 25 * 60 * 1000;  // 25 minutes
let breakDuration = 5 * 60 * 1000;  // 5 minutes
let timer;
let isWorking = true;
let currentTime = workDuration;

function startTimer(callback) {
  timer = setInterval(() => {
    currentTime -= 1000;
    if (currentTime <= 0) {
      clearInterval(timer);
      callback();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  currentTime = isWorking ? workDuration : breakDuration;
}

function toggleSession() {
  isWorking = !isWorking;
  currentTime = isWorking ? workDuration : breakDuration;
}

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
};
