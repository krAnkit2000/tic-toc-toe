const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const message = document.getElementById("message");

let blank = 0,
  X = 1,
  O = -1;
const cellsize = 100;
var map = [
     0, 0, 0,
     0, 0, 0,
     0, 0, 0
    ];
var winPattern = [
  0b111000000,
  0b000111000,
  0b000000111, //row
  0b100100100,
  0b010010010,
  0b001001001, //columns
  0b100010001,
  0b001010100, //diagonals
];

var mouse = {
  X: -1,
 Y: -1,
};

let currentPlayer = X;
let gameOver = false;

canvas.width = canvas.height = 3 * cellsize;

canvas.addEventListener("mouseout", function() {
  mouse.x = mouse.y = -1;
});

canvas.addEventListener("mousemove", function(e) {
  let x = e.pageX - canvas.offsetLeft,
    y = e.pageY - canvas.offsetTop;
  console.log(x);

  mouse.X = x;
  mouse.Y = y;
});
canvas.addEventListener("click", function(e){
  play(getCellByCoords(mouse.X, mouse.Y));
});
displayTurn();
function displayTurn() {
  message.textContent = (currentPlayer == X) ? 'X turn' : 'O turn' ;
}

function play(cell) {
  if (gameOver) {
    return;
  }
  if (map[cell] != blank) {
  alert("POSITION IS TAKEN. TRY ANOTHER BOX");
    message.textContent = "POSITION IS TAKEN. TRY ANOTHER BOX";
    return;
  }
  map[cell] = currentPlayer;

  let wincheck = checkWin(currentPlayer);
   if (wincheck != 0){
    gameOver =true ; 
    message.textContent =((currentPlayer == X) ? 'X' : 'O') +  '  wins!';
    alert((currentPlayer == X) ? 'X WIN'  : 'O WIN' );
    return ;

   } else if(map.indexOf(blank) == -1){
     gameOver =true ; 
     alert('Game Tie!')
     message.textContent =' Game Tie!'
     return ;
   }
  currentPlayer = currentPlayer * -1;
  displayTurn();
}

function checkWin(player) {
  let playerMapBitMask = 0;

  for (let i = 0; i < map.length; i++) {
    playerMapBitMask <<= 1;
    if (map[i] == player) {
      playerMapBitMask += 1;

    }
  }
  for (let i = 0; i < winPattern.length; i++) {
if ((playerMapBitMask & winPattern[i]) == winPattern[i]) {
       return winPattern[i];
}
    
  }
  return 0 ;
}
function draw() {
  // context.clearReact(0, 0, canvas.width,canvas.height);
  drawBoard();
  fillBoard();
  function drawBoard() {
    context.strokeStyle = "white";
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(cellsize, 0);
    context.lineTo(cellsize, canvas.height);
    context.stroke();
    context.beginPath();
    context.moveTo(cellsize * 2, 0);
    context.lineTo(cellsize * 2, canvas.height);
    context.stroke();

    context.beginPath();
    context.moveTo(0, cellsize);
    context.lineTo(canvas.width, cellsize);
    context.stroke();

    context.beginPath();
    context.moveTo(0, cellsize * 2);
    context.lineTo(canvas.width, cellsize * 2);
    context.stroke();
  }
  function fillBoard() {
    context.strokeStyle = "green";
    context.lineWidth = 10;
    for (let i = 0; i < map.length; i++) {
      let coords = getCellCoords(i);
      context.save();
      context.translate(coords.x + cellsize / 2, coords.y + cellsize / 2);
      if (map[i] == X) {
        drawX();
      } else if (map[i] == O) {
        drawO();
      }
      context.restore();
    }
  }

  function drawX() {
    context.beginPath();
    context.moveTo(-cellsize / 3, -cellsize / 3);
    context.lineTo(cellsize / 3, cellsize / 3);
    context.moveTo(cellsize / 3, -cellsize / 3);
    context.lineTo(-cellsize / 3, cellsize / 3);
    context.stroke();
  }
  function drawO() {
    context.beginPath();
    context.arc(0, 0, cellsize / 3, 0, Math.PI * 2);
    context.stroke();
  }
  requestAnimationFrame(draw);
}

function getCellCoords(cell) {
  let x = (cell % 3) * cellsize,
    y = Math.floor(cell / 3) * cellsize;
  return {
    x,
    y,
  };
}

function getCellByCoords(x, y) {
  return (Math.floor(x / cellsize) % 3) + Math.floor(y / cellsize) * 3;
}
draw();
