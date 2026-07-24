// Open up a socket
let socket = io('/b');

// Listen for connection
// Log a success message
socket.on("connect", function () {
  console.log("Connected");
});

// Voice
let speaker;
// Bell
let stage_mgr;
// Content
let phrases;

let debug = true;

function preload() {
  phrases = loadStrings('../b.txt');
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

  // Speak next work
  socket.on('next', function(){ 
    next();
    console.log('SPEAK');
  });

  // Play bell for next cue
  socket.on('cue', function(){
    stage_mgr.play();
    console.log('CUE');
  })
}

function draw() {
}

function next() {
  let random_phrase = random(phrases);
  speaker.speak(random_phrase);
  textSize(48);
  textAlign(CENTER);

  if (debug) {
    background(random(0, 64));
    fill(255);
    text(random_phrase, width/2, height / 2);
  }
}

function keyPressed() {
    if(key == 'd') debug = !debug;
}