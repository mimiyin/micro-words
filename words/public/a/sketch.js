let socket = io('/a');

// Listen for connection
// Log a success message
socket.on("connect", function () {
  console.log("Connected");
});

let ab = { 'a': [], 'b': [] };
let phrases;
let speaker;

let urlParams = new URLSearchParams(window.location.search);

// RECORD
let timers = structuredClone(ab);
let start_frame = 0;
let go = false;

// CUES
let cues = [];
let stage_mgr;

let debug = true;


function preload() {
  phrases = loadStrings('../a.txt');
  timers.a = loadStrings('../record-a.txt');
  timers.b = loadStrings('../record-b.txt');
  cues = loadStrings('../cues.txt');
  stage_mgr = loadSound('../bell.wav');
  stage_mgr.setVolume(0.25);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  speaker = new p5.Speech(); // speech synthesis object
  speaker.setVolume(0.5);

  randomSeed(7);
  noStroke();
  background(0);
}

function draw() {
  // auto-pilot;

  if (go) {
    let frame = frameCount - start_frame;

    for (let ab in timers) {
      let timer = timers[ab];
      for (let fc of timer) {
        if (frame == fc) {
          if (ab == 'a') speak();
          else socket.emit('next');
          console.log(ab + ' speaks @', frame);
          break;
        }
      }
    }

    // cues
    for (let c in cues) {
      let fc = cues[c] * 60;
      if (frame == fc) {
        stage_mgr.play();
        socket.emit('cue');
        console.log('CUE @', frame);
      }
    }
  }

  if (frameCount % 180 == 0) background(0);
}

function speak() {
  let random_phrase = random(phrases);
  speaker.speak(random_phrase);
  textSize(48);
  textAlign(CENTER);

  background(255);
  if (debug) {
    fill(128);
    text(random_phrase, width / 2, height / 2);
  }
}

function keyPressed() {
  if (key == 'd') debug = !debug;
  if (key == ' ') {
    go = !go;
    if (go) {
      stage_mgr.play();
      start();
    }
  }
}

function start() {
  start_frame = frameCount;
}