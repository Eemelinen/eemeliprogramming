const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let particleArray = [];

let mouse = {
  x: null,
  y: null,
  // radius: (canvas.height / 130) * (canvas.width / 130),
  radius: 150,
};

window.addEventListener('mousemove', function(e) {
  mouse.x = mouse.x;
  mouse.y = mouse.y;
});

ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText('A', 0, 30);
const data = ctx.getImageData(0, 0, 100, 100);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 30) + 1;
  };

  draw() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

function init() {
  particleArray = [];
  for (let i = 0; i < 500; i++) {
    let x = (Math.random() *  canvas.width);
    let y = (Math.random() *  canvas.height);
    particleArray.push(new Particle(x, y));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
  }
  requestAnimationFrame(animate);
}

init();
animate();