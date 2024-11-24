// popup.js

const toggleButton = document.getElementById('toggleButton');
const resetButton = document.getElementById('resetButton');
const pinButton = document.getElementById('pinButton');
const timerDisplay = document.getElementById('timer');

// Update the button text based on the tracking status when the popup loads
chrome.storage.local.get('isTracking', (data) => {
  if (data.isTracking) {
    toggleButton.textContent = 'Stop Tracking';
  } else {
    toggleButton.textContent = 'Start Tracking';
  }
});

// Event listener for the toggle button
toggleButton.addEventListener('click', () => {
  chrome.storage.local.get('isTracking', (data) => {
    if (!data.isTracking) {
      // Start the timer
      chrome.runtime.sendMessage({ cmd: 'START_TIMER' });
      toggleButton.textContent = 'Stop Tracking';
    } else {
      // Stop the timer
      chrome.runtime.sendMessage({ cmd: 'STOP_TIMER' });
      toggleButton.textContent = 'Start Tracking';
    }
  });
});

// Event listener for the reset button
resetButton.addEventListener('click', () => {
  chrome.storage.local.set({ watchTime: 0 });
  timerDisplay.textContent = '00:00:00';
});

// Update the timer display every second
setInterval(() => {
  chrome.storage.local.get('watchTime', (data) => {
    const watchTime = data.watchTime || 0;
    const totalSeconds = Math.floor(watchTime / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0'
    );
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  });
}, 1000);

// Inside init function in popup.js

pinButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { cmd: 'PIN_TIMER' });
  });
});
