// -----------------------------
// CAMERA GLITCH WITH TRACKING MOTION
// -----------------------------

// -----------------------------
// CAMERA
// -----------------------------
let camera;
let eyeImage;
let errorSound;

// -----------------------------
// TIMING VARIBLES
// -----------------------------
let startTime = 0;
let showError = false;
let fadeToBlack = false;
let fadeAmount = 0;
let errorTriggered = false;
let finalCamera = false;

// -----------------------------
// EYE
// -----------------------------
let eyeStage = 0;
let eyeTimer = 0;

// -----------------------------
// GLITCH EFFECTt
// ----------------------------- 
let glitchAmount = 0;
let glitchStartTime = 0;
let showSystemFailed = false;
let glitchSoundPlaying = false;

// -----------------------------
// FAKE TRACKING
// -----------------------------
let offsetX = 0;
let offsetY = 0;


function preload() {
  // -----------------------------
 // PUT EYE ON SCREEN
 // -----------------------------
 eyeImage = loadImage("amy.PNG");
 errorSound = loadSound("error.mp3");
}


function setup() {
 createCanvas(windowWidth, windowHeight);

// -----------------------------
 // RUN CAMERA AGAIAN
 // -----------------------------
 camera = createCapture(VIDEO);
 camera.size(width, height);
 camera.hide();


 startTime = millis();
}


function windowResized() {
 resizeCanvas(windowWidth, windowHeight);
 camera.size(width, height);
}


function draw() {
 background(0);


 if (!camera) return;


 // -----------------------------
 // PUT CAMERA AGAIN
 // -----------------------------
 if (finalCamera) {
   image(camera, 0, 0, width, height);

// -----------------------------
  // EYE
  // -----------------------------
   // AFTER EYE FLASH GLITCH AND AUDIO
   // -----------------------------
   if (eyeStage >= 5 && !showSystemFailed) {
     glitchCamera();


     if (!glitchStartTime) glitchStartTime = millis();
// -----------------------------
// SPAM ERROR SOUND
     // - ----------------------------
     if (errorSound && !glitchSoundPlaying) {
       errorSound.loop();
       glitchSoundPlaying = true;
     }

// -----------------------------
     // END GLITCH AND SHOW SYTEM ERROR AFTER 5 SECS
        // -----------------------------------------
     if (millis() - glitchStartTime > 5000) {
       showSystemFailed = true;
       if (errorSound && glitchSoundPlaying) {
         errorSound.stop();
         glitchSoundPlaying = false;
       }
     }
   }


   if (showSystemFailed) drawSystemFailed();


   if (eyeStage < 5) handleEyeSequence();


   return;
 }


 // -----------------------------
 // ERROR SSYSTEM
 // -----------------------------
 if (showError) {
   drawErrorScreen();
   return;
 }


 // -----------------------------
 // TRACKING CAMERA
 // -----------------------------
 camera.loadPixels();
 if (camera.pixels.length > 0) {
 



   let totalX = 0;
   let totalY = 0;
   let count = 0;


   for (let y = 0; y < camera.height; y += 10) {
     for (let x = 0; x < camera.width; x += 10) {
       let i = (x + y * camera.width) * 4;
       let r = camera.pixels[i];
       let g = camera.pixels[i + 1];
       let b = camera.pixels[i + 2];


       if ((r + g + b) / 3 > 150) {
         totalX += x;
         totalY += y;
         count++;
       }
     }
   }


   if (count > 0) {
     let targetX = totalX / count;
     let targetY = totalY / count;


     offsetX = lerp(offsetX, width / 2 - targetX, 0.05);
     offsetY = lerp(offsetY, height / 2 - targetY, 0.05);
   }
 }


 image(camera, offsetX, offsetY, width, height);


 // -----------------------------
 // PUT ERROR AFTER 6 SECS
 // -----------------------------
 if (!showError && !errorTriggered && millis() - startTime > 6000) {
   showError = true;
   fadeToBlack = false;
   fadeAmount = 0;
   errorTriggered = true;
   startTime = millis();


   if (errorSound && !errorSound.isPlaying()) errorSound.play();
 }
}


// -----------------------------
// ERROR 
// -----------------------------
function drawErrorScreen() {
 let flash = floor(millis() / 300) % 2;
 if (flash === 0) background(255, 0, 0);
 else background(0);


 fill(255);
 textAlign(CENTER, CENTER);
 textSize(width / 6);
 text("ERROR", width / 2, height / 2);


 if (!fadeToBlack && millis() - startTime > 3000) fadeToBlack = true;


 if (fadeToBlack) {
   fadeAmount += 0.02;
   fill(0, 0, 0, fadeAmount * 255);
   rect(0, 0, width, height);


   if (fadeAmount >= 1) {
     showError = false;
     fadeToBlack = false;
     fadeAmount = 0;
     finalCamera = true;
     eyeStage = 0;
     eyeTimer = millis();
   }
 }
}


// -----------------------------
// EYE FLASH
// -----------------------------
function handleEyeSequence() {
 let t = millis() - eyeTimer;
 let eyeW = eyeImage.width * 0.2;
 let eyeH = eyeImage.height * 0.2;


 if (eyeStage === 0) {
   image(eyeImage, width / 2 - eyeImage.width / 2, height / 2 - eyeImage.height / 2);
   if (t > 1000) { eyeStage = 1; eyeTimer = millis(); } return;
 }


 if (eyeStage === 1) {
   image(eyeImage, width - eyeW - 50, 50, eyeW, eyeH);
   if (!errorSound.isPlaying()) errorSound.play();
   if (t > 500) { eyeStage = 2; eyeTimer = millis(); } return;
 }


 if (eyeStage === 2) {
   for (let i = 0; i < 10; i++) {
     let startX = random(width - eyeW - 100);
     let startY = random(height - eyeH - 100);
     image(eyeImage, startX + i * 10, startY + i * 10, eyeW, eyeH);
   }
   if (t > 5000) { eyeStage = 3; eyeTimer = millis(); } return;
 }


 if (eyeStage === 3) { if (t > 3000) { eyeStage = 4; eyeTimer = millis(); } return; }


 if (eyeStage === 4) {
   drawWatchedScreen();
   if (t > 3000) { eyeStage = 5; eyeTimer = millis(); } return;
 }
}


// -----------------------------
// YOUR BEING WATCHED
// -----------------------------
function drawWatchedScreen() {
 background(0);


 if (floor(millis() / 100) % 2 === 0) {
   fill(255, 0, 0);
 } else {
   return;
 }


 textFont('monospace');
 textAlign(CENTER, CENTER);
 textSize(width / 12);


 for (let i = 0; i < 3; i++) {
   text("YOUR BEING WATCHED", width / 2 + random(-5, 5), height / 2 + random(-5, 5));
 }
}


// -----------------------------
// CAMERA GLITCH
// -----------------------------
function glitchCamera() {
 glitchAmount += 1;
 let slices = 10 + glitchAmount * 0.1;


 for (let i = 0; i < slices; i++) {
   let y = (height / slices) * i;
   let h = height / slices;
   let offset = random(-glitchAmount, glitchAmount);
   copy(camera, 0, y, width, h, offset, y, width, h);
 }


 fill(255, 0, 0);
 textAlign(CENTER, CENTER);
 textSize(width / 30);
 text("SYSTEM INSTABILITY DETECTED", width / 2, height - 50);
}


// -----------------------------
// SYSTEM FAILED BOX
// -----------------------------
function drawSystemFailed() {
 fill(200);
 stroke(0);
 strokeWeight(3);
 rect(width / 2 - 200, height / 2 - 75, 400, 150);


 fill(0);
 textFont('monospace');
 textAlign(CENTER, CENTER);
 textSize(width / 40);
 text("SYSTEM FAILED", width / 2, height / 2);
}

// END OF SKETCH AND CODE
