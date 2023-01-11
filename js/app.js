// ------------------------------------------------ //
// ------------------ CURSOR -------------------- //
// ------------------------------------------------ //



class ArrowPointer {
  constructor() {
    this.root = document.body
    this.cursor = document.querySelector(".curzr")

    this.position = {
      distanceX: 0,
      distanceY: 0,
      distance: 0,
      pointerX: 0,
      pointerY: 0,
    },
    this.previousPointerX = 0
    this.previousPointerY = 0
    this.angle = 0
    this.previousAngle = 0
    this.angleDisplace = 0
    this.degrees = 57.296
    this.cursorSize = 20

    this.cursorStyle = {
      boxSizing: 'border-box',
      position: 'fixed',
      top: '0px',
      left: `${ -this.cursorSize / 2 }px`,
      zIndex: '2147483647',
      width: `${ this.cursorSize }px`,
      height: `${ this.cursorSize }px`,
      transition: '250ms, transform 100ms',
      userSelect: 'none',
      pointerEvents: 'none'
    }

    this.init(this.cursor, this.cursorStyle)
  }

  init(el, style) {
    Object.assign(el.style, style)
    this.cursor.removeAttribute("hidden")

  }

  move(event) {
    this.previousPointerX = this.position.pointerX
    this.previousPointerY = this.position.pointerY
    this.position.pointerX = event.pageX + this.root.getBoundingClientRect().x
    this.position.pointerY = event.pageY + this.root.getBoundingClientRect().y
    this.position.distanceX = this.previousPointerX - this.position.pointerX
    this.position.distanceY = this.previousPointerY - this.position.pointerY
    this.distance = Math.sqrt(this.position.distanceY ** 2 + this.position.distanceX ** 2)

    this.cursor.style.transform = `translate3d(${this.position.pointerX}px, ${this.position.pointerY}px, 0)`

    if (this.distance > 1) {
      this.rotate(this.position)
    } else {
      this.cursor.style.transform += ` rotate(${this.angleDisplace}deg)`
    }
  }

  rotate(position) {
    let unsortedAngle = Math.atan(Math.abs(position.distanceY) / Math.abs(position.distanceX)) * this.degrees
    let modAngle
    const style = this.cursor.style
    this.previousAngle = this.angle

    if (position.distanceX <= 0 && position.distanceY >= 0) {
      this.angle = 90 - unsortedAngle + 0
    } else if (position.distanceX < 0 && position.distanceY < 0) {
      this.angle = unsortedAngle + 90
    } else if (position.distanceX >= 0 && position.distanceY <= 0) {
      this.angle = 90 - unsortedAngle + 180
    } else if (position.distanceX > 0 && position.distanceY > 0) {
      this.angle = unsortedAngle + 270
    }

    if (isNaN(this.angle)) {
      this.angle = this.previousAngle
    } else {
      if (this.angle - this.previousAngle <= -270) {
        this.angleDisplace += 360 + this.angle - this.previousAngle
      } else if (this.angle - this.previousAngle >= 270) {
        this.angleDisplace += this.angle - this.previousAngle - 360
      } else {
        this.angleDisplace += this.angle - this.previousAngle
      }
    }
    style.transform += ` rotate(${this.angleDisplace}deg)`

    setTimeout(() => {
      modAngle = this.angleDisplace >= 0 ? this.angleDisplace % 360 : 360 + this.angleDisplace % 360
      if (modAngle >= 45 && modAngle < 135) {
        style.left = `${ -this.cursorSize }px`
        style.top = `${ -this.cursorSize / 2 }px`
      } else if (modAngle >= 135 && modAngle < 225) {
        style.left = `${ -this.cursorSize / 2 }px`
        style.top = `${ -this.cursorSize }px`
      } else if (modAngle >= 225 && modAngle < 315) {
        style.left = '0px'
        style.top = `${ -this.cursorSize / 2 }px`
      } else {
        style.left = `${ -this.cursorSize / 2 }px`
        style.top = '0px'
      }
    }, 0)
  }

  remove() {
    this.cursor.remove()
  }
}

(() => {
  const cursor = new ArrowPointer()
  if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.onmousemove = function (event) {
      cursor.move(event)
    }
  } else {
    cursor.remove()
  }
})()

// ------------------------------------------------ //
// --------------- ANIMATED TAG CLOUD ------------ //
// ------------------------------------------------ //

class FibonacciSphere {
  #points;

  get points() {
      return this.#points;
  }

  constructor(N) {
      this.#points = [];

      const goldenAngle = Math.PI * (3 - Math.sqrt(5));

      for (let i = 0; i < N; i++) {
          const y = 1 - (i / (N - 1)) * 2;
          const radius = Math.sqrt(1 - y ** 2);
          const a = goldenAngle * i;
          const x = Math.cos(a) * radius;
          const z = Math.sin(a) * radius;

          this.#points.push([x, y, z]);
      }
  }
}


class TagsCloud {
  #root;
  #size;
  #sphere;
  #tags;
  #rotationAxis;
  #rotationAngle;
  #rotationSpeed;
  #frameRequestId;

  constructor(root) {
      this.#root = root;
      this.#size = this.#root.offsetWidth;
      this.#tags = root.querySelectorAll('.tag');
      this.#sphere = new FibonacciSphere(this.#tags.length);
      this.#rotationAxis = [1, 0, 0];
      this.#rotationAngle = 0;
      this.#rotationSpeed = 0;

      this.#updatePositions();
      this.#initEventListeners();
      this.#root.classList.add('-loaded');
  }

  #initEventListeners() {
      window.addEventListener('resize', this.#updatePositions.bind(this));
      document.addEventListener('mousemove', this.#onMouseMove.bind(this));
  }

  #updatePositions() {
      const sin = Math.sin(this.#rotationAngle);
      const cos = Math.cos(this.#rotationAngle);
      const ux = this.#rotationAxis[0];
      const uy = this.#rotationAxis[1];
      const uz = this.#rotationAxis[2];

      const rotationMatrix = [
          [
              cos + (ux ** 2) * (1 - cos),
              ux * uy * (1 - cos) - uz * sin,
              ux * uz * (1 - cos) + uy * sin,
          ],
          [
              uy * ux * (1 - cos) + uz * sin,
              cos + (uy ** 2) * (1 - cos),
              uy * uz * (1 - cos) - ux * sin,
          ],
          [
              uz * ux * (1 - cos) - uy * sin,
              uz * uy * (1 - cos) + ux * sin,
              cos + (uz ** 2) * (1 - cos)
          ]
      ];

      const N = this.#tags.length;

      for (let i = 0; i < N; i++) {
          const x = this.#sphere.points[i][0];
          const y = this.#sphere.points[i][1];
          const z = this.#sphere.points[i][2];

          const transformedX =
                rotationMatrix[0][0] * x
          + rotationMatrix[0][1] * y
          + rotationMatrix[0][2] * z;
          const transformedY =
                rotationMatrix[1][0] * x
          + rotationMatrix[1][1] * y
          + rotationMatrix[1][2] * z;
          const transformedZ =
                rotationMatrix[2][0] * x
          + rotationMatrix[2][1] * y
          + rotationMatrix[2][2] * z;

          const translateX = this.#size * transformedX / 2;
          const translateY = this.#size * transformedY / 2;
          const scale = (transformedZ + 2) / 3;
          const transform =
                `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`;
          const opacity = (transformedZ + 1.5) / 2.5;

          this.#tags[i].style.transform = transform;
          this.#tags[i].style.opacity = opacity;
      }
  }

  #onMouseMove(e) {
      const rootRect = this.#root.getBoundingClientRect();
      const deltaX = e.clientX - (rootRect.left + rootRect.width / 2);
      const deltaY = e.clientY - (rootRect.top + rootRect.height / 2);
      const a = Math.atan2(deltaX, deltaY) - Math.PI / 2;
      const axis = [Math.sin(a), Math.cos(a), 0];
      const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const speed = delta / Math.max(window.innerHeight, window.innerWidth) / 10;

      this.#rotationAxis = axis;
      this.#rotationSpeed = speed;
  }

  #update() {
      this.#rotationAngle += this.#rotationSpeed;

      this.#updatePositions();
  }

  start() {
      this.#update();

      this.#frameRequestId = requestAnimationFrame(this.start.bind(this));
  }

  stop() {
      cancelAnimationFrame(this.#frameRequestId);
  }
}


function main() {
  {
      const root = document.querySelector('.tags-cloud');
      const cloud = new TagsCloud(root);

      cloud.start();
  }

  {
      const cursor = document.getElementById('cursor');
      const isActivated = false;

      document.addEventListener('mousemove', (e) => {
          if (!isActivated) {
              cursor.classList.add('-activated');
          }

          cursor.style.transform =
              `translateX(${e.clientX}px) translateY(${e.clientY}px)`;
      });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  main();
});

// ------------------------------------------------ //
// ------------------ CAROUSEL -------------------- //
// ------------------------------------------------ //

let slideIndex = [1,1,1];
let slideId = ["mySlides1", "mySlides2", "mySlides3"]
showSlides(1, 0);
showSlides(1, 1);
showSlides(1, 2);

function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
  let i;
  let x = document.getElementsByClassName(slideId[no]);
  if (n > x.length) {slideIndex[no] = 1}
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  x[slideIndex[no]-1].style.display = "block";
}

// ------------------------------------------------ //
// ------------------ ACCORDION -------------------- //
// ------------------------------------------------ //

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");

    var panel = this.nextElementSibling;


    if (panel.style.display === "block") {
      panel.style.display = "none";

    } else {
      panel.style.display = "block";

    }
  });
}
