const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
const adjustX = 5;
const adjustY = 0;

let particleArray = [];

let sizeModifier = 1;

function calcSize() {
  if (window.innerWidth > 1400) {
    sizeModifier = 1;
  } else if (window.innerWidth < 1400 && window.innerWidth > 800) {
    sizeModifier = 1.5;
  } else if (window.innerWidth < 800 && window.innerWidth > 600) {
    sizeModifier = 2;
  } else if (window.innerWidth < 600 && window.innerWidth > 400) {
    sizeModifier = 3.3;
  } else {
    sizeModifier = 3.6;
  }
}

let mouse = {
  x: 2000,
  y: 2000,
  // radius: (canvas.height / 130) * (canvas.width / 130),
  radius: 100 / sizeModifier,
};

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

ctx.fillStyle = 'white';
ctx.font = `${20 / sizeModifier}px Verdana`;
ctx.fillText('Developer', 0, 30);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 5 / sizeModifier;
    this.baseX = this.x;
    this.baseY = this.y;
    // Density affects the movement speed of parcticles making them more natural
    this.density = (Math.random() * 30 / sizeModifier) + 1;
  };

  draw() {
    ctx.fillStyle = 'salmon';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  /* 
  ! Particle physics **/
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x
      let dy = particleArray[a].y - particleArray[b].y
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 25) {
        opacityValue = 1 - (distance / (50 / sizeModifier));
        ctx.strokeStyle = `rgba(223, 83, 83, ${opacityValue})`
        // ctx.strokeStyle = 'pink';
        ctx.lineWidth = 2 / sizeModifier;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function init() {
  particleArray = [];
  calcSize();
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(new Particle(positionX * (12 / sizeModifier), positionY * (12 / sizeModifier)));
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize',
  function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  }
);

window.addEventListener('mouseout',
  function() {
    mouse.x = 2000;
    mouse.y = 2000;
  }
);
