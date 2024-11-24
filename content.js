// content.js

let timerInterval;

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'PIN_TIMER') {
    injectPinnedTimer();
  }
});

// Function to inject the timer into the page
function injectPinnedTimer() {
  // Remove existing timer if it exists
  const existingTimer = document.getElementById('pinnedTimer');
  if (existingTimer) {
    existingTimer.remove();
    clearInterval(timerInterval);
  }

  // Create the container for the pinned timer
  const timerContainer = document.createElement('div');
  timerContainer.id = 'pinnedTimer';
  timerContainer.style.position = 'fixed';
  timerContainer.style.top = '3rem';
  timerContainer.style.right = '3rem';
  timerContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  timerContainer.style.color = '#fff';
  timerContainer.style.padding = '10px';
  timerContainer.style.borderRadius = '5px';
  timerContainer.style.zIndex = '9999';
  timerContainer.style.fontSize = '16px';
  timerContainer.style.display = 'flex';
  timerContainer.style.alignItems = 'center';

  // Create the timer display
  const timerDisplay = document.createElement('span');
  timerDisplay.id = 'pinnedTimerDisplay';
  timerDisplay.textContent = '00:00:00';
  timerContainer.appendChild(timerDisplay);

  // Create a close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '✕';
  closeButton.style.marginLeft = '10px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = '#fff';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '16px';
  closeButton.addEventListener('click', () => {
    timerContainer.remove();
    clearInterval(timerInterval);
  });
  timerContainer.appendChild(closeButton);

  // Append the timer container to the body
  document.body.appendChild(timerContainer);

  // Start updating the timer
  startPinnedTimer();
}

function startPinnedTimer() {
  // Clear any existing interval
  clearInterval(timerInterval);

  // Update the timer display every second
  timerInterval = setInterval(() => {
    chrome.storage.local.get('watchTime', (data) => {
      const watchTime = data.watchTime || 0;
      const totalSeconds = Math.floor(watchTime / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        '0'
      );
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      const timerDisplay = document.getElementById('pinnedTimerDisplay');
      if (timerDisplay) {
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
      } else {
        // If the timer display is no longer in the DOM, clear the interval
        clearInterval(timerInterval);
      }
    });
  }, 1000);
}
