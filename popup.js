const read = document.getElementById('read');
const readBackwards = document.getElementById('readBackwards');
const speedUp = document.getElementById('speedUp');
const speedDown = document.getElementById('speedDown');

chrome.storage.sync.get('color', function (data) {
  // read.style.backgroundColor = data.color;
  // read.setAttribute('value', data.color);
});

read.onclick = function (element) {
  const code = `
  var doc = document.querySelector('.kix-page-content-wrapper');
  var synth = window.speechSynthesis;
  var textContent = doc.textContent;
  var utter = new SpeechSynthesisUtterance(textContent);
  synth.speak(utter);
  `;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: code });
  });
};

readBackwards.onclick = function (element) {
  const code = `
    var doc = document.querySelector('.kix-page-content-wrapper');
    var synth = window.speechSynthesis;
    var textContent = doc.textContent;
    textContent = textContent.split('.').reverse().map(ele => ele + '. ').join();
    var utter = new SpeechSynthesisUtterance(textContent);
    synth.speak(utter);
    `;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: code });
  });
};

speedUp.onclick = function (element) {
  const code = `
  synth.cancel();
   // utter.rate = 2;
//    synth.resume();
    `;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: code });
  });
};

speedDown.onclick = (element) => {
  const code = `
  utter.rate = 2;
    synth.speak(utter);
    `;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: code });
  });
};
