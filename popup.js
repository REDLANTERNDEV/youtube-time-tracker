function updateTimerDisplay(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  document.getElementById('timer').textContent = `${hrs
    .toString()
    .padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

document.getElementById('start').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'start' }, (response) => {
    updateTimerDisplay(response.seconds);
  });
});

document.getElementById('stop').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' }, (response) => {
    updateTimerDisplay(response.seconds);
  });
});

document.getElementById('reset').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'reset' }, (response) => {
    updateTimerDisplay(response.seconds);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['seconds', 'running'], (result) => {
    if (result.seconds !== undefined) {
      updateTimerDisplay(result.seconds);
    }
  });

  // Periodically fetch the timer value from the background script
  setInterval(() => {
    chrome.runtime.sendMessage({ action: 'getTimer' }, (response) => {
      updateTimerDisplay(response.seconds);
    });
  }, 1000); // Fetch every second
});
