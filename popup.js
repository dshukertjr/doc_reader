const read = document.getElementById('read');
const cancel = document.getElementById('cancel');

const initial = document.getElementById('initial');
const playing = document.getElementById('playing');

const readBackwards = document.getElementById('readBackwards');
const speed = document.getElementById('speed');
const speedUp = document.getElementById('speedUp');
const speedDown = document.getElementById('speedDown');

chrome.storage.sync.get('speed', (data) => {
  const speedValue = Number.isNaN(Number.parseFloat(data)) ? '1.0' : data;
  speed.textContent = speedValue;
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
  showPlaying();
  const code = `
  var googleDocument = getGoogleDocument();
  var doc = document.querySelector('.kix-page-content-wrapper');
  var synth = window.speechSynthesis;
  var textContent = googleDocument.selectedText || doc.textContent;
  var utter = new SpeechSynthesisUtterance(textContent);
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

// speedUp.onclick = function (element) {
//   const code = `
//   synth.cancel();
//    // utter.rate = 2;
// //    synth.resume();
//     `;
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.executeScript(tabs[0].id, { code: code });
//   });
// };

// speedDown.onclick = (element) => {
//   const code = `
//   utter.rate = 2;
//     synth.speak(utter);
//     `;
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.executeScript(tabs[0].id, { code: code });
//   });
// };
