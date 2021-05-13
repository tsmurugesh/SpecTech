/***********************************************************************************
  Speculative Technology
  by Tanvi Murugesh

  Uses the p5.2DAdventure.js class, functions likes a series of states that you navigate through via clickables, mouse,and key pressed. 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager; // the manager class
var clickables; // an array of clickable objects

var totalScore = 0;

let myFont1;
let myFont2;


// Allocate Adventure Manager with states table and interaction tables
function preload() {

    myFont1 = loadFont('fonts/ArgentPixelCF-Regular.otf');
    myFont2 = loadFont('fonts/ArgentPixelCF-Italic.otf');

    clickablesManager = new ClickableManager('data/clickableLayout.csv');
    adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
    print("Starting Score: ", totalScore);
}

// Setup the adventure manager
function setup() {
    createCanvas(1100, 800);

    // setup the clickables = this will allocate the array
    clickables = clickablesManager.setup();

    // this is optional but will manage turning visibility of buttons on/off
    // based on the state name in the clickableLayout
    adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
    adventureManager.setup();

    // load all text screens
    //loadAllText();

    // call OUR function to setup additional information about the p5.clickables
    // that are not in the array 
    setupClickables();

    fs = fullscreen();


}

// Adventure manager handles it all!
function draw() {
    // draws background rooms and handles movement from one to another
    adventureManager.draw();
    

    // draw the p5.clickables, in front of the mazes but behind the sprites 
    clickablesManager.draw();

    if (adventureManager.getStateName() == "Splash") {} else {
        drawScore();
    }
    
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
    // toggle fullscreen mode
    if (key === 'f') {
        fs = fullscreen();
        fullscreen(!fs);
        return;
    }

    // simply for code checking puposes, checks current score in js viewer
    // you want fewer points!
    if (key === "z") {
        print("Current Score: ", totalScore);
        return;
    }

    // depending on what states you are in, adds to score depending on the key that is pressed

    if (adventureManager.getStateName() == "ArtistAgree") {
        if (key === '1') {
            totalScore = totalScore + 1;
        } else if (key === '2') {
            totalScore = totalScore + 2;
        } else if (key === '3') {
            totalScore = totalScore + 1;
        }
    }

    if (adventureManager.getStateName() == "LearnMore") {
        if (key === 'Y' || key === 'y') {
            totalScore = totalScore;
        } else if (key === 'N' || key === 'n') {
            totalScore = totalScore + 2;
        }
    }

    if (adventureManager.getStateName() == "ChooseViewer") {
        if (key === '1') {
            totalScore = totalScore + 2;
        } else if (key === '2') {
            totalScore = totalScore;
        }
    }

    if (adventureManager.getStateName() == "Donate") {
        if (key === 'Y' || key === 'y') {
            if (totalScore == 1) {
                adventureManager.changeState("Ending1");
            } else if (totalScore >= 2 && totalScore <= 5) {
                adventureManager.changeState("Ending2");
            } else if (totalScore >= 6) {
                adventureManager.changeState("Ending3");
            }
        } else if (key === 'N' || key === 'n') {
            if (totalScore == 1) {
                adventureManager.changeState("Ending4");
            } else {
                adventureManager.changeState("Ending5");
            }
        }
    }
    // dispatch all keys to adventure manager
    adventureManager.keyPressed(key);
}

function mouseReleased() {
    // dispatch all mouse events to adventure manager
    adventureManager.mouseReleased();
}


//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
    // All clickables to have same effects
    //this.textFont(myFont1);
    for (let i = 0; i < clickables.length; i++) {
        clickables[i].onHover = clickableButtonHover;
        clickables[i].onOutside = clickableButtonOnOutside;
        clickables[i].onPress = clickableButtonPressed;
        clickables[i].textSize = 15;
        clickables[i].cornerRadius = 0;
        clickables[i].stroke = "#294A6A";
        clickables[i].strokeWeight = 5;
    }
}

// tint when mouse is over

clickableButtonHover = function () {
    this.color = "#294A6A";
    this.noTint = false;
    this.tint = "#d1bfb1";
    this.textFont = (myFont2);
    this.textColor = "#F5F5F2";
    //this.y=this.y - 5;
}

clickableButtonOnOutside = function () {
    this.color = "#F5F5F2";
    this.textFont = (myFont1);
    this.textColor = "#294A6A";
}

clickableButtonPressed = function () {
    // these clickables are ones that change your state
    // so they route to the adventure manager to do this
    adventureManager.clickablePressed(this.name);

}

// draws current score for the user to see in the top left corner
function drawScore() {
    stroke("#294A6A");
    fill("white");
    strokeWeight(5);
    rect(61, 60, 170, 30)
    textFont(myFont1);
    textSize(16);
    strokeWeight(0);
    fill("#294A6A");
    text('Current Score: ' + totalScore, 67, 81);
}
