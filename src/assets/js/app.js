import Fuse from 'fuse.js';

let url = 'https://oblac.rs/index.json';

// search

var fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.0,
  tokenize:true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {name:"title",weight:0.8},
    {name:"contents",weight:0.5},
    {name:"tags",weight:0.3}
  ]
};
var fuse;
fetch(url)
  .then(res => res.json())
  .then((out) => {
    fuse = new Fuse(out, fuseOptions);
  })
  .catch(err => { throw err });

// words array
var defaultWords = [
  "bla.",
  "bla bla.",
  "bla bla, oblac.",
]
var words = defaultWords;
var nextWords = [];
var wordIndex = 0;

function applyTyper(element) {
  const LETTER_TYPE_DELAY = 75;
  const WORD_STAY_DELAY = 2000;

  const DIRECTION_FORWARDS = 0;
  const DIRECTION_BACKWARDS = 1;

  var direction = DIRECTION_FORWARDS;
  var letterIndex = 0;

  var wordTypeInterval;

  startTyping();

  function startTyping() {
    wordTypeInterval = setInterval(typeLetter, LETTER_TYPE_DELAY);
  }

  function typeLetter() {
    const word = words[wordIndex];

    if (direction == DIRECTION_FORWARDS) {
      letterIndex++;

      if (letterIndex == word.length) {
        direction = DIRECTION_BACKWARDS;
        clearInterval(wordTypeInterval);
        setTimeout(startTyping, WORD_STAY_DELAY);
      }

    } else if (direction == DIRECTION_BACKWARDS) {
      letterIndex--;

      if (letterIndex == 0) {
        nextWord();
      }
    }

    const textToType = word.substring(0, letterIndex);
    element.textContent = textToType;
  }

  function nextWord() {
    letterIndex = 0;
    direction = DIRECTION_FORWARDS;
    if (nextWords.length !== 0) {
      words = nextWords;
      nextWords = [];
      wordIndex = 0;
    }
    else {
      wordIndex++;
    }
    if (wordIndex >= words.length) {
      wordIndex = 0;
    }
  }
}


// typing
const text = document.querySelector('.typing-text');
applyTyper(text);

// box
const box = document.querySelector('#box');
const unbox = document.querySelector('#unbox');
const input = document.querySelector('#in');

function boxStart() {
  box.style.display = 'none';
  unbox.style.display = 'flex';
  input.focus();
}
function boxEnd() {
  box.style.display = 'block';
  unbox.style.display = 'none';
  input.value = "";
}

box.addEventListener('click', function() {boxStart();});

// keyboard

document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    var isShow = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
        isShow = (evt.key === "Enter");
    } else {
        isEscape = (evt.keyCode === 27);
        isShow = (evt.keyCode === 13);
    }
    if (isEscape) {
      boxEnd();
      resetBlaBla();
    }
    if (isShow) {
      boxStart();
    }
};


// keyboard timeout search

var timeout = null;
input.onkeyup = function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      blabla(input.value);
    }, 800);
};


// bla bla search

function resetBlaBla() {
  blabla('');
}

function blabla(text) {
  if (!fuse) return;
  var results = fuse.search(text);

  // filtering
  var filteredResults = [];
  for (var ndx in results) {
    filteredResults.push(results[ndx]);
  }
  results = filteredResults;

  if (results.length === 0) {
    nextWords = defaultWords;
  } else {
    const arr = [];
    for (var ndx in results) {
      arr.push(results[ndx].item.title);
    }
    nextWords = arr;
  }
}

// waiting for document to be ready
function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  let url = window.location.href;
  let searchParams = new URLSearchParams(new URL(url).search);
  const s = searchParams.get('s');
  if (s) {
    boxStart();
    input.value = s;
    blabla(s);
  }
});
