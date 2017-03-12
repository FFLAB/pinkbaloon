var imgBG = new Image();
var drawArea, BobContext;
var gameHandle = 0;
var bRightBut = false;
var bLeftBut = false;
var objBob, objTrampoline, objTargetBalloons;
var playPoints = 0;
var tickTock;
var playTime = iMin = iSec = 0;
var prevTickTock, prevScore;
var curvature = (4 * (Math.sqrt(2) - 1)) / 3;
var w_factor = 0.0333;
var h_factor = 0.4;
var tie_w_factor = 0.12;
var tie_h_factor = 0.10;
var tie_curve_factor = 0.13;
var grad_factor = 0.3;
var grad_rad = 3;
var bob = new Image();
var refreshRate = 10;
var clickCounter = 1;
var refreshCounter = 0;
var hitX = -1;
var hitY = -1;
var hitRad = -1;

function Bobby(x, y, dx, dy, r) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
}

function Trampoline(x, w, h) {
    this.x = x;
    this.w = w;
    this.h = h;
}

function TargetBalloons(w, h, r, c, p) {
    this.w = w;
    this.h = h;
    this.r = r; // Number of Rows
    this.c = c; // Number of Columns
    this.p = p; // padding
    this.objs;
    this.blinkCounters;
    this.blinkHandles;
    this.colorCode;
    this.colors = ['9d9d9d', 'f80207', 'feff01', '0072ff', 'fc01fc', '03fe03', 'FF9900', '99CC00', '99FFFF', '330033', 'fff'];
}

function Balloon(centerX, centerY, radius, color) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius * .85;
    this.baseColor = ColorLuminance(color, 0);
    this.darkColor = ColorLuminance(color, -grad_factor);
    this.lightColor = ColorLuminance(color, grad_factor);
}


function clear() {
    BobContext.clearRect(0, 0, BobContext.canvas.width, BobContext.canvas.height);
    var BGpattern = BobContext.createPattern(imgBG, 'repeat');
    BobContext.rect(0, 0, drawArea.width, drawArea.height);
    BobContext.fillStyle = BGpattern;
    BobContext.fill();
}

//Function to blink Balloons once they are hit 
function blinkBalloons(i, j) {
    if (objTargetBalloons.blinkCounters[i][j] > -80) {
        objTargetBalloons.blinkCounters[i][j]--;
    } else {
        objTargetBalloons.objs[i][j] = 0;
    }
}

//Main function which reevaluates shapes positions and redraws the whole Canvas
function refreshScreen() {
    clear();
    refreshCounter++;
    if (bRightBut)
        objTrampoline.x += 5;
    else if (bLeftBut)
        objTrampoline.x -= 5;



    // Create Balloons (from array of its objects)
    for (i = 0, k = 25; i < objTargetBalloons.r; i++) {
        if (k == 0)
            k = 25;
        else
            k = 0;
        for (j = 0; j < objTargetBalloons.c; j++) {
            if (objTargetBalloons.objs[i][j] == 1 && (objTargetBalloons.blinkCounters[i][j] % 2 != 0 || objTargetBalloons.blinkCounters[i][j] == 0 || objTargetBalloons.blinkCounters[i][j] > -20))
            {
                var balloon1 = new Balloon(k + (j * (objTargetBalloons.w + objTargetBalloons.p)) + objTargetBalloons.p + objTargetBalloons.w / 4, (i * (objTargetBalloons.h + objTargetBalloons.p)) + objTargetBalloons.p, objTargetBalloons.w / 2, objTargetBalloons.colors[objTargetBalloons.colorCode[i][j]]); //objTargetBalloons.colors[i]);
                balloon1.draw(objTargetBalloons.blinkCounters[i][j]);
                if (objTargetBalloons.blinkCounters[i][j] == -80 && objTargetBalloons.blinkHandles[i][j] != -1) {
                    clearInterval(objTargetBalloons.blinkHandles[i][j]);
                    objTargetBalloons.blinkHandles[i][j] = -1;
                    objTargetBalloons.blinkCounters[i][j] == 0;
                    objTargetBalloons.objs[i][j] = 0;
                }
            }
        }
    }

    if (hitRad > 0 && hitRad < 25) {
        var hitGradient = BobContext.createRadialGradient(hitX, hitY, 5, hitX, hitY, 70);
        hitGradient.addColorStop("0", "white");
        hitGradient.addColorStop("0.5", "red");
        BobContext.shadowBlur = 65;
        BobContext.fillStyle = hitGradient;
        BobContext.lineWidth = 5;
        BobContext.shadowColor = "rgb(0, 0, 0)";
        BobContext.beginPath();
        BobContext.arc(hitX, hitY, hitRad, 0, 2 * Math.PI,false);
        BobContext.fill();
       // if(refreshCounter%5==0)
            hitRad = hitRad + 0.2;
    }

    BobContext.drawImage(bob, objBob.x, objBob.y, 50, 50);
    BobContext.beginPath();
    BobContext.closePath();

    BobContext.font = '10px Verdana';
    BobContext.fillStyle = '#000'
    //BobContext.fillText('[Bob\'s x:' + objBob.x + ']', 15, 530);
    //BobContext.fillText('[Bob\'s y:' + objBob.y+ ']', 15, 545);
    BobContext.fillText('x:' + objBob.x + '', objBob.x - 55, objBob.y + 55);
    BobContext.fillText('y:' + objBob.y + '', objBob.x - 55, objBob.y + 65);

    // Create Trampoline
    var trampolineGradient = BobContext.createLinearGradient(objTrampoline.x, BobContext.canvas.height - objTrampoline.h,
                                                             objTrampoline.x + objTrampoline.w, (BobContext.canvas.height - objTrampoline.h));
    trampolineGradient.addColorStop(0, "gray");
    trampolineGradient.addColorStop(0.5, "white");
    trampolineGradient.addColorStop(1.0, "gray");
    BobContext.fillStyle = trampolineGradient;
    BobContext.shadowBlur = 15;
    BobContext.shadowColor = "rgb(0, 0, 0)";
    BobContext.beginPath();
    BobContext.rect(objTrampoline.x, BobContext.canvas.height - objTrampoline.h, objTrampoline.w, objTrampoline.h);
    BobContext.closePath();
    BobContext.fill();
    BobContext.shadowBlur = 0;
    BobContext.shadowColor = '#fff';


    // Evaluate if a Balloon or a Wall was hit
    iRowH = objTargetBalloons.h + objTargetBalloons.p;
    iRow = Math.floor(objBob.y / iRowH);
    iCol = Math.floor(objBob.x / (objTargetBalloons.w + objTargetBalloons.p));

    // Burst Balloon if hit and reverse Bob's direction
    if (objBob.y < objTargetBalloons.r * iRowH && iRow >= 0 && iCol >= 0 && objTargetBalloons.objs[iRow][iCol] == 1) {
        hitX=objBob.x;
        hitY=objBob.y;
        hitRad=10;
        objTargetBalloons.blinkHandles[iRow][iCol] = setInterval(blinkBalloons, refreshRate, iRow, iCol);
        objBob.dy = -objBob.dy;
        playPoints++;
    }

    // Hit a wall!! Reverse Bob's direction
    if (objBob.x + objBob.dx + objBob.r > BobContext.canvas.width || objBob.x + objBob.dx - objBob.r < 0) {
        hitX = objBob.x;
        hitY = objBob.y;
        hitRad = 10;
        objBob.dx = -objBob.dx;
    }

    // Hit a Trampoline!! Reverse Bob's direction
    if (objBob.y + objBob.dy - objBob.r < 0) {
        hitX = objBob.x;
        hitY = objBob.y;
        hitRad = 10;
        objBob.dy = -objBob.dy;
    } else if (objBob.y + objBob.dy + objBob.r > BobContext.canvas.height - (objTrampoline.h + 25)) {
        if (objBob.x > objTrampoline.x && objBob.x < objTrampoline.x + objTrampoline.w) {
            hitX = objBob.x;
            hitY = objBob.y;
            hitRad = 10;
            objBob.dx = 10 * ((objBob.x - (objTrampoline.x + objTrampoline.w / 2)) / objTrampoline.w);
            objBob.dy = -objBob.dy;
        } else if (objBob.y + objBob.dy + objBob.r > BobContext.canvas.height) {
            clearInterval(tickTock);
            clearInterval(gameHandle);
            for (i = 0; i < objTargetBalloons.r; i++)
                for (j = 0; j < objTargetBalloons.c; j++) {
                    clearInterval(objTargetBalloons.blinkHandles[i][j]);
                    objTargetBalloons.blinkHandles[i][j] = -1;
                }

            // HTML5 Local storage - save previous values
            localStorage.setItem('prev-time', iMin + ':' + iSec);
            localStorage.setItem('prev-points', playPoints);
        }
    }

    objBob.x += objBob.dx;
    objBob.y += objBob.dy;

    BobContext.font = '10px Verdana';
    BobContext.fillStyle = '#ff0000';
    iMin = Math.floor(playTime / 60);
    iSec = playTime % 60;
    if (iMin < 10) iMin = "0" + iMin;
    if (iSec < 10) iSec = "0" + iSec;
    BobContext.fillText('[Time: ' + iMin + ':' + iSec + ']', 15, 525);
    BobContext.fillText('[Hits: ' + playPoints + ']', 15, 540);
    if (refreshCounter % 2 == 0)
        BobContext.fillStyle = '#fff';
    BobContext.fillText('[Click to PAUSE Game]', 15, 300);

    if (prevTickTock != null && prevScore != null) {
        BobContext.font = '10px Verdana';
        BobContext.fillStyle = '#474747';
        BobContext.fillText('[Prev Time: ' + prevTickTock + ']', 15, 560);
        BobContext.fillText('[Prev Hits: ' + prevScore + ']', 15, 575);
    }
}

//Document ready function
$(function () {
    init();
});

//RunAgain on button click
function runAgain() {
    clickCounter = 1;
    clearInterval(tickTock);
    clearInterval(gameHandle);
    for (i = 0; i < objTargetBalloons.r; i++)
        for (j = 0; j < objTargetBalloons.c; j++) {
            clearInterval(objTargetBalloons.blinkHandles[i][j]);
            objTargetBalloons.blinkHandles[i][j] = -1;
            objTargetBalloons.blinkCounters[i][j] = 0;
        }

    // HTML5 Local storage - save values
    localStorage.setItem('prev-time', iMin + ':' + iSec);
    localStorage.setItem('prev-points', playPoints);
    init();
}

//Initialisation
function init() {
    bob.src = 'images/Bob.png';
    imgBG.src = 'images/pattern.jpg';
    playTime = iMin = iSec = 0;
    playPoints = 0;
    drawArea = document.getElementById('myCanvas');
    BobContext = drawArea.getContext('2d');
    BobContext.clearRect(0, 0, drawArea.width, drawArea.height);
    var width = drawArea.width;
    var height = drawArea.height;

    objBob = new Bobby(width / 2, 550, 0.5, -5, 10); // new Bobby object
    objTrampoline = new Trampoline(width / 2, 120, 8); // new Trampoline object
    objTargetBalloons = new TargetBalloons((width / 8) - 1, 20, 6, 8, 2); // new TargetBalloons object

    objTargetBalloons.objs = new Array(objTargetBalloons.r); // fill-in TargetBalloons
    objTargetBalloons.blinkCounters = new Array(objTargetBalloons.r);
    objTargetBalloons.colorCode = new Array(objTargetBalloons.r);
    objTargetBalloons.blinkHandles = new Array(objTargetBalloons.r);
    for (i = 0; i < objTargetBalloons.r; i++) {
        objTargetBalloons.objs[i] = new Array(objTargetBalloons.c);
        objTargetBalloons.blinkCounters[i] = new Array(objTargetBalloons.c);
        objTargetBalloons.colorCode[i] = new Array(objTargetBalloons.c);
        objTargetBalloons.blinkHandles[i] = new Array(objTargetBalloons.c);
        for (j = 0; j < objTargetBalloons.c; j++) {
            objTargetBalloons.objs[i][j] = 1;
            objTargetBalloons.blinkCounters[i][j] = 0;
            objTargetBalloons.colorCode[i][j] = Math.ceil(Math.random() * 11);
            objTargetBalloons.blinkHandles[i][j] = -1;
        }
    }

    gameHandle = setInterval(refreshScreen, refreshRate); // loop re Draw Canvas
    tickTock = setInterval(countTimer, 1000); // Game Timer

    // HTML5 Local storage - get values
    prevTickTock = localStorage.getItem('prev-time');
    prevScore = localStorage.getItem('prev-points');

    drawArea.addEventListener("click", pauseGame, false);

    $(window).keydown(function (event) { // keyboard-down alerts
        switch (event.keyCode) {
            case 37: // 'Left' key
                bLeftBut = true;
                break;
            case 39: // 'Right' key
                bRightBut = true;
                break;
        }
    });
    $(window).keyup(function (event) { // keyboard-up alerts
        switch (event.keyCode) {
            case 37: // 'Left' key
                bLeftBut = false;
                break;
            case 39: // 'Right' key
                bRightBut = false;
                break;
        }
    });

    var iCanvX1 = $(drawArea).offset().left;
    var iCanvX2 = iCanvX1 + width;
    $('#myCanvas').mousemove(function (e) { // binding mousemove event
        if (e.pageX > iCanvX1 && e.pageX < iCanvX2) {
            objTrampoline.x = Math.max(e.pageX - iCanvX1 - (objTrampoline.w / 2), 0);
            objTrampoline.x = Math.min(BobContext.canvas.width - objTrampoline.w, objTrampoline.x);
        }
    });
}

function countTimer() {
    playTime++;
}

function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#",
        c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

Balloon.prototype.draw = function (blinkCounter) {

    var centerX = this.centerX;
    var centerY = this.centerY;
    var radius = this.radius;

    var handleLength = curvature * radius; //Curvature = [(4 * (Math.sqrt(2) - 1)) / 3]

    var widthDiff = (radius * w_factor); //width factor is a constant of 0.333 defined as global
    var heightDiff = (radius * h_factor); //height factor is a constant of 0.4 defined as global -- Height will be larger than width to make it a Baloon else would become a circular balloon

    var balloonBottomY = centerY + radius + heightDiff; //Calculating the Bottom point of our Baloon by adding the centre Y, the Radies and the Height difference which was obtained from height factor
    BobContext.save();
    BobContext.beginPath();
    if (blinkCounter > -20) {
        BobContext.translate(blinkCounter / 2, -(blinkCounter * 4));
        BobContext.scale((40 + (blinkCounter / 2)) / 40, (40 + (blinkCounter / 2)) / 40);
        BobContext.rotate(((-blinkCounter) * Math.PI / 180));
    }
    if (blinkCounter <= -20) {
        blinkCounter = -20;
        BobContext.translate(blinkCounter / 2, -(blinkCounter * 4));
        BobContext.scale((40 + (blinkCounter / 2)) / 40, (40 + (blinkCounter / 2)) / 40);
        BobContext.rotate(((-blinkCounter) * Math.PI / 180));
    }

    // Section to draw the Top Left Curve

    var topLeftCurveStartX = centerX - radius;
    var topLeftCurveStartY = centerY;

    var topLeftCurveEndX = centerX;
    var topLeftCurveEndY = centerY - radius;

    BobContext.moveTo(topLeftCurveStartX, topLeftCurveStartY);
    BobContext.bezierCurveTo(topLeftCurveStartX, topLeftCurveStartY - handleLength - widthDiff,
        topLeftCurveEndX - handleLength, topLeftCurveEndY,
        topLeftCurveEndX, topLeftCurveEndY); // The 2 Control points are placed in a way to get a bigger arc on the top

    // Section to draw the Top Right Curve

    var topRightCurveStartX = centerX;
    var topRightCurveStartY = centerY - radius;

    var topRightCurveEndX = centerX + radius;
    var topRightCurveEndY = centerY;

    BobContext.bezierCurveTo(topRightCurveStartX + handleLength + widthDiff, topRightCurveStartY,
        topRightCurveEndX, topRightCurveEndY - handleLength,
        topRightCurveEndX, topRightCurveEndY);  // The 2 Control points are placed in a way to get a bigger arc on the top 

    // Section to draw the Bottom Right Curve

    var bottomRightCurveStartX = centerX + radius;
    var bottomRightCurveStartY = centerY;

    var bottomRightCurveEndX = centerX;
    var bottomRightCurveEndY = balloonBottomY;

    BobContext.bezierCurveTo(bottomRightCurveStartX, bottomRightCurveStartY + handleLength,
        bottomRightCurveEndX + handleLength, bottomRightCurveEndY,
        bottomRightCurveEndX, bottomRightCurveEndY);  // The 2 Control points are placed in a way to get a a smaller curve at the bottom

    // Section to draw the Bottom Left Curve

    var bottomLeftCurveStartX = centerX;
    var bottomLeftCurveStartY = balloonBottomY;

    var bottomLeftCurveEndX = centerX - radius;
    var bottomLeftCurveEndY = centerY;

    BobContext.bezierCurveTo(bottomLeftCurveStartX - handleLength, bottomLeftCurveStartY,
        bottomLeftCurveEndX, bottomLeftCurveEndY + handleLength,
        bottomLeftCurveEndX, bottomLeftCurveEndY);  // The 2 Control points are placed in a way to get a a smaller curve at the bottom

    // Create balloon gradient

    var gradientOffset = (radius / 3);

    var balloonGradient =
        BobContext.createRadialGradient(centerX + gradientOffset, centerY - gradientOffset,
            grad_rad,
            centerX, centerY, radius + heightDiff);
    balloonGradient.addColorStop(0, this.lightColor);
    balloonGradient.addColorStop(0.7, this.darkColor);

    BobContext.fillStyle = balloonGradient;
    BobContext.fill();

    // End balloon path

    // Create balloon tie

    var halfTieWidth = (radius * tie_w_factor) / 2;
    var tieHeight = (radius * tie_h_factor);
    var tieCurveHeight = (radius * tie_curve_factor);

    BobContext.beginPath();
    BobContext.moveTo(centerX - 1, balloonBottomY);
    BobContext.lineTo(centerX - halfTieWidth, balloonBottomY + tieHeight);
    BobContext.quadraticCurveTo(centerX, balloonBottomY + tieCurveHeight,
        centerX + halfTieWidth, balloonBottomY + tieHeight);
    BobContext.lineTo(centerX + 1, balloonBottomY); // Quadratic Curve to make a slightly curved triangle at the bottom
    BobContext.fill();
    //BobContext.translate(-(blinkCounter * 2), -(blinkCounter * 2));
    //BobContext.scale(1, 1);
    BobContext.restore();
}

function pauseGame() {
    if (clickCounter % 2 != 0)
        clearInterval(gameHandle);
    else
        gameHandle = setInterval(refreshScreen, refreshRate);
    clickCounter++;
}
