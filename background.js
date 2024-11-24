let isTracking = false;
let isYouTubeActive = false;
let startTime = 0;
let elapsedTime = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ watchTime: 0, isTracking: false });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'START_TIMER') {
    if (!isTracking) {
      isTracking = true;
      startTiming();
      chrome.storage.local.set({ isTracking: true });
    }
  } else if (request.cmd === 'STOP_TIMER') {
    if (isTracking) {
      isTracking = false;
      stopTiming();
      chrome.storage.local.set({ isTracking: false });
    }
  }
});

// Monitor tab changes to check if the active tab is a YouTube page
chrome.tabs.onUpdated.addListener(checkYouTubeActivity);
chrome.tabs.onActivated.addListener(checkYouTubeActivity);
chrome.windows.onFocusChanged.addListener(checkYouTubeActivity);

function checkYouTubeActivity() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = tabs[0].url;
      if (url && url.includes('youtube.com/watch')) {
        isYouTubeActive = true;
      } else {
        isYouTubeActive = false;
      }
    } else {
      isYouTubeActive = false;
    }
  });
}

let timerInterval;

function startTiming() {
  startTime = Date.now();
  chrome.storage.local.get('watchTime', (data) => {
    elapsedTime = data.watchTime || 0;
  });

  timerInterval = setInterval(() => {
    if (isYouTubeActive) {
      const currentTime = Date.now();
      const totalTime = elapsedTime + (currentTime - startTime);
      chrome.storage.local.set({ watchTime: totalTime });
      elapsedTime = totalTime;
    }
    startTime = Date.now();
  }, 1000);
}

function stopTiming() {
  clearInterval(timerInterval);
}
