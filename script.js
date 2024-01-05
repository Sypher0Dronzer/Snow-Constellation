/**@type {HTMLCanvasElement} */
const image= new Image()
  image.src='stars.png'
let particlecount=screen.width/5;

window.addEventListener('load',()=>{
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  

  

  let effect = new Effect(canvas);
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  requestAnimationFrame(animate);
}
animate();
  
})


class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius = Math.random() * 6 + 2;
    
    this.velX = Math.random() * 0.5 - 0.25;
    this.velY = Math.random() * 0.5 - 0.25;
    // this push acts as a acceleration
        // now similar way we need friction to reduce the speed as well 
    this.pushX=0;
    this.pushY=0;
    this.friction= 0.7
    this.image= image;
    this.imgWidth= this.image.width/3
    this.imgHeight=this.image.height/3
    this.scalefactor=Math.random()*2 +0.8
    this.starwidth=this.imgWidth/this.scalefactor
    this.starheight= this.imgHeight/this.scalefactor
    this.startypeX=Math.floor(Math.random()*3) * this.imgWidth
    this.startypeY=Math.floor(Math.random()*3) * this.imgHeight
    this.x =
      this.starwidth +
      Math.floor(Math.random() * (this.effect.width - this.starwidth));
    this.y =
      this.starheight +
      Math.floor(Math.random() * (this.effect.height - this.starheight));
    

  }
  reset() {
    // this portion ensures that no partcle is stuck outside the canvas on resizing
    this.x =
      this.radius +
      Math.floor(Math.random() * (this.effect.width - this.radius * 2));
    this.y =
      this.radius +
      Math.floor(Math.random() * (this.effect.height - this.radius * 2));
  }
  draw(context) {
    context.drawImage(image,this.startypeX,this.startypeY,this.imgWidth,this.imgHeight,this.x-this.starwidth/2,this.y-this.starheight/2,this.starwidth,this.starheight)
  }
  // for bouncing
  update() {

    //mouse click effect
    if (this.effect.mouse.pressed) {
      let dy = this.y - this.effect.mouse.y;
      let dx = this.x - this.effect.mouse.x;
      let distance = Math.hypot(dx, dy);
      let force= this.effect.mouse.radius/distance
      if (distance < this.effect.mouse.radius) {
        let angle = Math.atan2(dy, dx);
        
        this.pushX += Math.cos(angle)*force;
        this.pushY += Math.sin(angle)*force;
      }
    }

    
    this.x +=(this.pushX) + this.velX;
    this.y += (this.pushY) + this.velY;
    this.pushX *= this.friction
    this.pushY *= this.friction

    if(this.x <this.starwidth){
      this.x=this.starwidth;
      this.velX *= -1;
    }
    else if(this.x > this.effect.width-this.starwidth){
      this.x=this.effect.width-this.starheight
      this.velX *= -1;

    }
    if(this.y <this.starheight){
      this.y=this.starheight;
      this.velY *= -1;
    }
     else if(this.y > this.effect.height-this.starheight || this.y == this.effect.height-this.starheight){
      this.y =this.effect.height-this.starheight
      this.velY *= -1;

    }
    
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = Math.floor(screen.width/5);
    this.createParticles();

    window.addEventListener("resize", (e) => {
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });

    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: 100,
    };
    window.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      }
      
    });
    window.addEventListener("mousedown", (e) => {
      this.mouse.pressed = true;
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
    window.addEventListener("mouseup", () => {
      this.mouse.pressed = false;
    });
    window.addEventListener("touchstart", (e) => {
      [...e.changedTouches].forEach((touch) => {
        this.mouse.pressed = true;
        this.mouse.x = touch.pageX;
        this.mouse.y = touch.pageY;
        this.mouse.pressed = true;
      });
    });
    window.addEventListener("touchmove", (e) => {
      [...e.changedTouches].forEach((touch) => {
        this.mouse.pressed = true;
        this.mouse.x = touch.pageX;
        this.mouse.y = touch.pageY;
        this.mouse.pressed = true;
      });
    });
    
  }
  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }
  handleParticles(context) {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
  resize(width, height) {
    this.canvas.width = width;
    this.width = width;
    this.height = height;
    this.canvas.height = height;
    this.particles.forEach((particle) => {
      particle.reset();
    });
  }
}



