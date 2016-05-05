function Effects($http) {
  'ngInject';

  Effects.prototype.canvasDimensions = (canvas) => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
  }

  Effects.prototype.stop = (ctx) => {
    clearInterval(this._effecInterval);
    ctx.clearRect(0, 0, width, height);
  }

  Effects.prototype.particles = (canvas, ctx, width, height) => {
    let particles = [];
    let patriclesNum = 500;
    let colors = ['#f35d4f', '#f36849', '#c0d988', '#6ddaf1', '#f1e85b'];

    function Factory() {
      this.x = Math.round(Math.random() * width);
      this.y = Math.round(Math.random() * height);
      this.rad = Math.round(Math.random() * 1) + 1;
      this.rgba = colors[Math.round(Math.random() * 3)];
      this.vx = Math.round(Math.random() * 3) - 1.5;
      this.vy = Math.round(Math.random() * 3) - 1.5;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < patriclesNum; i++) {
        let temp = particles[i];
        let factor = 1;

        for (let j = 0; j < patriclesNum; j++) {

          let temp2 = particles[j];
          ctx.linewidth = 0.5;

          if (temp.rgba == temp2.rgba && findDistance(temp, temp2) < 50) {
            ctx.strokeStyle = temp.rgba;
            ctx.beginPath();
            ctx.moveTo(temp.x, temp.y);
            ctx.lineTo(temp2.x, temp2.y);
            ctx.stroke();
            factor++;
          }
        }


        ctx.fillStyle = temp.rgba;
        ctx.strokeStyle = temp.rgba;

        ctx.beginPath();
        ctx.arc(temp.x, temp.y, temp.rad * factor, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(temp.x, temp.y, (temp.rad + 5) * factor, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();


        temp.x += temp.vx;
        temp.y += temp.vy;

        if (temp.x > width) temp.x = 0;
        if (temp.x < 0) temp.x = width;
        if (temp.y > height) temp.y = 0;
        if (temp.y < 0) temp.y = height;
      }
    }

    function findDistance(p1, p2) {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    window.requestAnimFrame = (() => {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 100);
        };
    })();

    (function init() {
      for (let i = 0; i < patriclesNum; i++) {
        particles.push(new Factory);
      }
      console.log(particles)
    })();

    (function loop() {
      draw();
      requestAnimFrame(loop);
    })();
  }

  Effects.prototype.christmas = (ctx, width, height) => {
    //snowflake particles
    let mp = 25; //max particles
    let particles = [];
    let angle;

    for (let i = 0; i < mp; i++) {
      particles.push({
        x: Math.random() * width, //x-coordinate
        y: Math.random() * height, //y-coordinate
        r: Math.random() * 4 + 1, //radius
        d: Math.random() * mp //density
      })
    }

    //Lets draw the flakes
    let draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      for (let i = 0; i < mp; i++) {
        let p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
    }

    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    angle = 0;

    let update = () => {
      angle += 0.01;
      for (let i = 0; i < mp; i++) {
        let p = particles[i];
        //Updating X and Y coordinates
        //widthe will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
        //Every particle has its own density which can be used to make the downward movement different for each flake
        //Lets make it more random by adding in the radius
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        p.x += Math.sin(angle) * 2;

        //Sending flakes back from the top when it exits
        //Lets make it a bit more organic and let flakes enter from the left and right also.
        if (p.x > width + 5 || p.x < -5 || p.y > height) {
          if (i % 3 > 0) //66.67% of the flakes
          {
            particles[i] = {
              x: Math.random() * width,
              y: -10,
              r: p.r,
              d: p.d
            };
          } else {
            //If the flake is exitting from the right
            if (Math.sin(angle) > 0) {
              //Enter from the left
              particles[i] = {
                x: -5,
                y: Math.random() * height,
                r: p.r,
                d: p.d
              };
            } else {
              //Enter from the right
              particles[i] = {
                x: width + 5,
                y: Math.random() * height,
                r: p.r,
                d: p.d
              };
            }
          }
        }
      }
    }

    //animation loop
    clearInterval(this._effecInterval);
    this._effecInterval = setInterval(draw, 33);
  }


  return Effects.prototype;

}

export default {
  name: 'Effects',
  fn: Effects
};
