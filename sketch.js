var padding = 20;
var speed = 0.2; // 0.5 second

var w_width = 800;
const rows = 6;
const cols = 6;

var spacing = w_width / cols;

var deltaSpeed  = (spacing  +  padding / 2) / (60 * speed)

let grid;
var scrambleInterval;
const scrambleMoves = [];
let scrambling = false;


/** INTERACTION **/
let locked = false;
let selectedRow, selectedCol;
let lockedX, lockedY;

const COLORS = {
  white: '#F2F2F2CC',
  yellow: '#F5FF20CC',
  green: '#3ACE1CCC',
  blue: '#1889E3CC',
  red: '#E20E00CC',
  orange: '#F69D09CC',
}

function setup() {
  
  const w_height = w_width * rows / cols;
  
  createCanvas(w_width, w_height);
  
  grid = [];

  for (let i = 0; i < cols; i++) {
    grid.push([]);
    for (let j = 0; j < rows; j++) {
      const color = getColor(i, j);
      grid[i].push(new Cube(i, j, color));
    }
  }
  
  
  scramble();
}

function draw() {
  background(30);  

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (typeof grid[i][j].show !== 'function') {
        console.log(JSON.parse(JSON.stringify(grid)));
        console.log(i, j);
        noLoop();
        break;
      }
      grid[i][j].show(i, j);
    }
  }
}


function mousePressed() {
  if (scrambling) return
  
  // Get the row and col selected
  setSelectedRowCol()
  
  if (selectedRow !== null && selectedCol !== null) {
    locked = true;
  } else {
    locked = false;
  }
}

function mouseReleased() {
  
  if (locked) {
    const minDist = spacing / 2;
    let dir = null;
    if (mouseY < lockedY - minDist) {
      dir = 'UP'
    } else if (mouseY > lockedY + minDist) {
      dir = 'DOWN'
    } else if (mouseX > lockedX + minDist) {
      dir = 'RIGHT'
    } else if (mouseX < lockedX - minDist) {
      dir = 'LEFT'
    }
    
    if (dir) {
      moveGridLine(dir);
    }
    
  }
  
  
  locked = false;
  selectedRow = null;
  selectedCol = null;
}


function scramble() {
  const dirs = ['UP', 'DOWN', 'RIGHT', 'LEFT']
  const nbMoves = Math.floor(random(15, 20));
  console.log(nbMoves)
  
  for (let i = 0; i < nbMoves; i++) {
    scrambleMoves.push({
      dir: random(dirs),
      row: Math.floor(random(0, rows)),
      col: Math.floor(random(0, cols)),
    }) 
  }
  
  scrambling = true
  
  scrambleInterval = setInterval(scrambleMove, speed * 1200);
  
}

function scrambleMove() {
  if (scrambleMoves.length === 0) {
    scrambling = false;
    clearInterval(scrambleInterval);
    return
  }
  const sMove = scrambleMoves.shift();  
  selectedRow = sMove.row;
  selectedCol = sMove.col;
     
  moveGridLine(sMove.dir);
}

function setSelectedRowCol() {
  selectedRow = null;
  selectedCol = null;
  lockedY = null;
  lockedX = null;
  
  for (let i = 0; i < rows; i++) {
    const boundUp = i * spacing;
    const boundDown = (i + 1) * spacing;
    
    if (mouseY > boundUp && mouseY < boundDown) {
      selectedRow = i;
      lockedY = mouseY;
      break;
    }
  }
  
  if (selectedRow === null) return
    
  for (let j = 0; j < cols; j++) {
    const boundLeft = j * spacing;
    const boundRight = (j + 1) * spacing;
    
    if (mouseX > boundLeft && mouseX < boundRight) {
      selectedCol = j;
      lockedX = mouseX;
      break;
    }
  }
}

function moveGridLine(dir) {
 
  let cubeToInsert;
  
  switch(dir) {
    case 'UP':
      
      for(const cube of grid[selectedCol]) {
        cube.move(dir);
      }
      
      const firstCube = grid[selectedCol].shift();
      grid[selectedCol].push(firstCube);
      break;
      
    case 'DOWN': 
      
      for(const cube of grid[selectedCol]) {
        cube.move(dir);
      }
      
      const lastCube = grid[selectedCol].pop();
      grid[selectedCol].splice(0, 0, lastCube);
      break;
    
    case 'RIGHT':
      
      for(let i = 0; i < cols; i++) {
        const cube = grid[i][selectedRow];
        cube.move(dir);
      }
      
      // Intialize with last cube of row
      cubeToInsert = grid[cols - 1][selectedRow];
      
      for (let i = 0; i < cols; i++) {
        grid[i].splice(selectedRow, 0, cubeToInsert);
        cubeToInsert = grid[i].splice(selectedRow + 1, 1)[0];
      }
      
      
      break;
      
    case 'LEFT': 
      
      for(let i = 0; i < cols; i++) {
        const cube = grid[i][selectedRow];
        cube.move(dir);
      }
      
      // Intialize with first cube of row
      cubeToInsert = grid[0][selectedRow];
      
      for (let i = cols - 1; i >= 0; i--) {
        grid[i].splice(selectedRow, 0, cubeToInsert);
        cubeToInsert = grid[i].splice(selectedRow + 1, 1)[0];
      }
      break; 
  }  
  
}

function getColor(i, j) {
  if (i < 3) {
    return j < 3 ? COLORS.white : COLORS.yellow;
  } else if (i < 6) {
    return j < 3 ? COLORS.green : COLORS.blue;
  } else {    
    return j < 3 ? COLORS.red : COLORS.orange;
  }
  
  const key = random(Object.keys(COLORS));
  return COLORS[key];
  
}
