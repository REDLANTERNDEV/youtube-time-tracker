let timer;
let seconds = 0;
let running = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['seconds', 'running'], (result) => {
    if (result.seconds !== undefined) {
      seconds = result.seconds;
    }
    if (result.running) {
      running = result.running;
      startTimer();
    }
  });
});

function startTimer() {
  if (!running) {
    running = true;
    timer = setInterval(() => {
      seconds++;
      chrome.storage.local.set({ seconds, running });
    }, 1000);
  }
}

function stopTimer() {
  running = false;
  clearInterval(timer);
  chrome.storage.local.set({ seconds, running });
}

function resetTimer() {
  running = false;
  clearInterval(timer);
  seconds = 0;
  chrome.storage.local.set({ seconds, running });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    startTimer();
  } else if (request.action === 'stop') {
    stopTimer();
  } else if (request.action === 'reset') {
    resetTimer();
  } else if (request.action === 'getTimer') {
    sendResponse({ seconds, running });
    return;
  }
  sendResponse({ seconds, running });
});
