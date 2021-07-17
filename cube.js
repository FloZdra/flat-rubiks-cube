class Cube {
  
  constructor(i, j, color) {
    this.i = i;
    this.j = j;
    this.x = i * spacing + padding / 2;
    this.y = j * spacing  +  padding / 2;
    this.color = color;
    
    this.moving = null;
  }
  
  calculPos() {
    this.x = this.i * spacing + padding / 2;
    this.y = this.j * spacing + padding / 2;
  }
  
  show(i, j) {
    this.updatePos()
    
    const c = color(this.color);
    fill(c);
    noStroke();
    rect(this.x, this.y, spacing -  padding, spacing -  padding, 16)
  }
  
  move(dir) {
    this.moving = dir
  }
  
  updatePos() {
    if (this.moving === 'UP') {
      this.y -= deltaSpeed;
      if (this.y <= (this.j - 1) * spacing + padding / 2) {
        this.j -= 1;
        if (this.j === -1) {
          this.j = rows - 1
        }
        this.calculPos()
        this.moving = null
      }
    } else if (this.moving === 'DOWN') {
      this.y += deltaSpeed;
      if (this.y >= (this.j + 1) * spacing + padding / 2) {
        this.j += 1;
        if (this.j === rows) {
          this.j = 0
        }
        this.calculPos()
        this.moving = null
      }
    } else if (this.moving === 'RIGHT') {
      this.x += deltaSpeed;
      if (this.x >= (this.i + 1) * spacing + padding / 2) {
        this.i += 1;
        if (this.i === cols) {
          this.i = 0
        }
        this.calculPos()
        this.moving = null
      }
    } else if (this.moving === 'LEFT') {
      this.x -= deltaSpeed;
      if (this.x <= (this.i - 1) * spacing + padding / 2) {
        this.i -= 1;
        if (this.i === -1) {
          this.i = cols - 1
        }
        this.calculPos()
        this.moving = null
      }
    }
  }
}