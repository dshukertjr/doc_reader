const read = document.getElementById('read');
const cancel = document.getElementById('cancel');

const initial = document.getElementById('initial');
const playing = document.getElementById('playing');

const readBackwardsCheckBox = document.getElementById('readBackwards');
const speed = document.getElementById('speed');
const speedUp = document.getElementById('speedUp');
const speedDown = document.getElementById('speedDown');

var speedValue;
var readBackwards;

chrome.storage.sync.get('speed', (data) => {
  console.log('speed', data.speed);
  speedValue = Number.isNaN(Number.parseFloat(data.speed)) ? 1 : data.speed;
  setSpeedText();
});

chrome.storage.sync.get('readBackwards', (data) => {
  console.log('readBackwards', data.readBackwards);
  readBackwards = data.readBackwards || false;
  readBackwardsCheckBox.checked = true;
});

const showInitial = () => {
  initial.style.display = 'flex';
  playing.style.display = 'none';
};

const showPlaying = () => {
  initial.style.display = 'none';
  playing.style.display = 'flex';
};

read.onclick = function (element) {
  const reverseTextContentCode = `textContent = textContent.split('.').reverse().map(ele => ele + '. ').join();`;
  showPlaying();
  const code = `
  var googleDocument = getGoogleDocument();
  var doc = document.querySelector('.kix-page-content-wrapper');
  var synth = window.speechSynthesis;
  var textContent = googleDocument.selectedText || doc.textContent;
  ${readBackwards ? reverseTextContentCode : ''}
  var utter = new SpeechSynthesisUtterance(textContent);
  utter.rate = ${speedValue}
  synth.speak(utter);
  `;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: code });
  });
};

cancel.onclick = function (element) {
  showInitial();
  const code = `
  synth.cancel();
  `;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: code });
  });
};

// readBackwards.onclick = function (element) {
//   const code = `
//     var doc = document.querySelector('.kix-page-content-wrapper');
//     var synth = window.speechSynthesis;
//     var textContent = doc.textContent;
//     textContent = textContent.split('.').reverse().map(ele => ele + '. ').join();
//     var utter = new SpeechSynthesisUtterance(textContent);
//     synth.speak(utter);
//     `;
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.executeScript(tabs[0].id, { code: code });
//   });
// };

speedUp.onclick = function (element) {
  speedValue += 0.1;
  setSpeedText();
};

speedDown.onclick = (element) => {
  speedValue -= 0.1;
  setSpeedText();
};

const setSpeedText = () => {
  speedValue = speedValue.clamp(0.5, 2.0);
  chrome.storage.sync.set({ speed: speedValue }, () => {});
  speed.textContent = `×${
    speedValue == 1 || speedValue == 2 ? `${speedValue}.0` : speedValue
  }`.substr(0, 4);
};

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('inside dom content loaded');
  readBackwardsCheckBox.addEventListener('change', checkBoxChangeHandler);
});

function checkBoxChangeHandler() {
  console.log('inside checkbox change handler');
  readBackwards = readBackwardsCheckBox.checked;
  chrome.storage.sync.set({ readBackwards: readBackwards }, () => {});
}
