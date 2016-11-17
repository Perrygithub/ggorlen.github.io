// declare variables
var side = 8;
var numMines = 10;
var board;
var gameOver = false;

// represents a tile
var Tile = function (x, y) {
  this.flagged = false;
  this.mined = false;
  this.revealed = false;
  this.x = x;
  this.y = y;

  this.getImg = function (isOver) {
    if (isOver && this.mined) return "<img src='mine.png'></img>";
    if (this.flagged) return "<img src='flag.png'></img>";
    if (this.revealed) {
      var numMines = countMines(this);
      if (numMines === 0) return "<img src='revealed.png'></img>";
      else return "<img src='" + numMines + ".png'></img>";
    }
    else return "<img src='hidden.png'></img>";
  };
}; // end Tile class

// minesweeper board
var Board = function (height, width, numMines) {
  this.tiles = [];
  this.height = height;
  this.width = width;

  this.print = function (isOver) {
    var s = "<table id='mscontainer'>";
    for (var i = 0; i < board.height; i++) {
      s += "<tr>";
      for (var j = 0; j < board.width; j++) {
        s += "<td class='mstile' id='" + i + '-' + j + "'>" + 
          this.tiles[i][j].getImg(isOver) + "</td>";
      }
      s += "</tr>";
    }
    s += "</table>";
    document.getElementById("mscontainer").innerHTML = s;
    
    // disable right click
    $("td").on("contextmenu", function () {
      return false;
    });
    
    // redirect mouse clicks on grid
    $('.mstile').mousedown(function (e) {
      if (gameOver) newGame();
      if (e.button == 0) mark($(this).attr('id'), "reveal");
      if (e.button == 2) mark($(this).attr('id'), "flag");
    });
  };

  // initializes a new board
  this.init = function () {
    for (var i = 0; i < this.height; i++) {
      this.tiles.push(new Array());
      for (var j = 0; j < this.width; j++) {
        this.tiles[i].push(new Tile(i, j));
      }
    }
    
    // add mines randomly
    if (numMines >= this.height * this.width ||
        numMines < 1) {
      throw "Invalid number of mines specified";
    } 

    for (var i = 0; i < numMines;) {
      var rh = rand(0, this.height);
      var rw = rand(0, this.width);
      if (!this.tiles[rh][rw].mined) {
        this.tiles[rh][rw].mined = true;
        i++;
      }
    }
  };
  
  // call init function  
  this.init();

}; // end Board class

// generate a random int between two bounds
function rand(lo, hi) {
  return Math.floor(Math.random() * (hi - lo)) + lo;
}

// marks a tile according to left/right click event
function mark(loc, action) {
  checkGameOver();
  var x = loc.split("-")[0];
  var y = loc.split("-")[1];
  
  if (action === "reveal") {
    if (board.tiles[x][y].mined) {
      gameOver = true;
    }
    else {
      reveal(board.tiles[x][y]);
    }
  }
  else if (action === "flag") {
      board.tiles[x][y].flagged = 
        board.tiles[x][y].flagged ? false : true;
  }
  
  // re-print board
  board.print(gameOver);
}

// checks for win conditions
function checkGameOver() {
  for (var i = 0; i < board.height; i++) {
    for (var j = 0; j < board.width; j++) {
      if (!board.tiles[i][j].mined && 
          !board.tiles[i][j].revealed) {
        gameOver = false;
        return;
      }
    }
  }
  gameOver = true;
}

// recursively reveals unmined tiles
function reveal(tile) {
  if (!tile.mined && !tile.flagged && 
      !tile.revealed) {
    tile.revealed = true;
    
    if (!countMines(tile)) {
      var neighbors = getNeighbors(tile);
      for (var i = 0; i < neighbors.length; i++) {
        reveal(neighbors[i]);
      }
    }
  }
}

// counts number of mines adjacent to a tile
function countMines(tile) {
  var neighbors = getNeighbors(tile);
  
  var mineCount = 0;
  for (var i = 0; i < neighbors.length; i++) {
    if (neighbors[i].mined) mineCount++;
  }

  return mineCount;
}

// returns x/y coordinate arrays for each 
// neighbor of a coordinate parameter
function getNeighbors(tile) {
  var dirs = [[-1, -1], [-1, 1], [1, -1], [-1, 0], 
              [0,  -1], [0,  1], [1,  0], [1,  1]];
  var neighbors = [];
  
  for (var i = 0; i < dirs.length; i++) {
    if (tile.x + dirs[i][0] >= 0 && 
        tile.y + dirs[i][1] >= 0 &&
        tile.x + dirs[i][0] < board.width && 
        tile.y + dirs[i][1] < board.height) {
      neighbors.push(board.tiles[tile.x + dirs[i][0]]
                                [tile.y + dirs[i][1]]);
    }
  }
  
  return neighbors;
}

// start a new game
function newGame() {
  gameOver = false;
  board = new Board(side, side, 10);
  board.print();
}

newGame();