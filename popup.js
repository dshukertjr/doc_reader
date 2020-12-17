const read = document.getElementById('read');
const readBackwards = document.getElementById('readBackwards');

chrome.storage.sync.get('color', function(data) {
  // read.style.backgroundColor = data.color;
  // read.setAttribute('value', data.color);
});

read.onclick = function(element) {
  const code = `
  var doc = document.querySelector('.kix-page-content-wrapper');
  var synth = window.speechSynthesis;
  var textContent = doc.textContent;
  var utter = new SpeechSynthesisUtterance(textContent);
  synth.speak(utter);
  `;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: code});
    });
  };

  readBackwards.onclick = function(element) {
    const code = `
    var doc = document.querySelector('.kix-page-content-wrapper');
    var synth = window.speechSynthesis;
    var textContent = doc.textContent;
    var sentences = textContent.split('.')
    sentences.reverse();
    console.log(sentences);
    textContent = sentences.map(ele => ele + '. ').join();
    var utter = new SpeechSynthesisUtterance(textContent);
    synth.speak(utter);
    `;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: code});
      });
    };