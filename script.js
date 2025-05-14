let timer;
let seconds = 0;
let isRunning = false;
let lapCount = 0;
let startTime = 0;
let lapTimes = [];

// DOM elements
const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const lapSection = document.getElementById("lapSection");
const lapsList = document.getElementById("laps");

function updateDisplay() {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  display.textContent = `${hrs}:${mins}:${secs}`;
}

function start() {
  if (isRunning) return;
  
  isRunning = true;
  startTime = Date.now() - (seconds * 1000);
  
  timer = setInterval(() => {
    seconds = Math.floor((Date.now() - startTime) / 1000);
    updateDisplay();
  }, 1000);
  
  // Update button states
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  lapBtn.disabled = false;
}

function pause() {
  if (!isRunning) return;
  
  clearInterval(timer);
  isRunning = false;
  
  // Update button states
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function reset() {
  clearInterval(timer);
  isRunning = false;
  seconds = 0;
  lapCount = 0;
  lapTimes = [];
  updateDisplay();
  lapsList.innerHTML = '';
  lapSection.style.display = 'none';
  
  // Update button states
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;
}

function lap() {
  if (!isRunning && seconds === 0) return;
  
  if (lapSection.style.display !== 'block') {
    lapSection.style.display = 'block';
  }
  
  lapCount++;
  const currentTime = seconds;
  lapTimes.push({
    lap: lapCount,
    time: currentTime
  });
  
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="lap-time">Lap ${lapCount}: ${formatTime(currentTime)}</span>
    <button class="delete-lap" onclick="deleteLap(this)"><i class="fas fa-times"></i></button>
  `;
  lapsList.prepend(li);
  
  li.style.animation = 'fadeIn 0.5s ease-out';
  setTimeout(() => {
    li.style.animation = '';
  }, 500);
}

function formatTime(totalSeconds) {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function deleteLap(button) {
  const li = button.parentElement;
  const lapNumber = parseInt(li.textContent.match(/Lap (\d+):/)[1]);
  
  // Remove from lapTimes array
  lapTimes = lapTimes.filter(item => item.lap !== lapNumber);
  
  li.style.animation = 'fadeIn 0.5s ease-out reverse';
  setTimeout(() => {
    li.remove();
    
    if (lapsList.children.length === 0) {
      lapSection.style.display = 'none';
    }
  }, 300);
}

// Event listeners
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

// Initialize
window.addEventListener('load', () => {
  updateDisplay();
  
  // Set initial button states
  pauseBtn.disabled = true;
  lapBtn.disabled = true;
});