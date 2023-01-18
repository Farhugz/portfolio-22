const maps_frame = () => {
  const ifr = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22090.250590987896!2d6.125486373179405!3d46.204858358002085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c650693d0e2eb%3A0xa0b695357b0bbc39!2sGeneva!5e0!3m2!1sen!2sch!4v1674058687528!5m2!1sen!2sch" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>" referrerpolicy="no-referrer-when-downgrade"></iframe>';

  document.querySelector('.gmap_canvas').innerHTML = ifr;
}
const wait_for_map = () => {
  const tm = setTimeout(() => {
    maps_frame();
    clearTimeout(tm);
  }, 2000);
}
window.addEventListener('load', wait_for_map)


// ------------------------------------------------ //
// --------------- NAVBAR ON SCROLL ---------------- //
// ------------------------------------------------ //

// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

// ------------------------------------------------ //
// --------------- ACTIVE ANIMATION ON SCROLL ---------------- //
// ------------------------------------------------ //

/*
     * GO TOP ON LOAD
     */
window.onload = function () {
  if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
  } else {
      window.onbeforeunload = function () {
          window.scrollTo(0, 0);
      };
  }
}


/*
* INTERSECTION OBSERVER ANIMATION
*/
/* ========== reveal animation: scroll to 0 reset ========== */
const resetRevealAnimation = () => {
  if (window.scrollY === 0) {
      // console.log(0);
      initOberverReveal();
  }
}
window.addEventListener('load', resetRevealAnimation);

/* ============== reveal animation: observe ============== */
const observerAnime = new IntersectionObserver(function (entries, self) {
  //console.log(entries);
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          let el = entry.target;
          el.style.opacity = '1';

          el.classList.add(el.dataset.reveal);
          // console.log(el);
          self.unobserve(entry.target);
      }
  });
}, {
  root: null,
  threshold: [1],
  rootMargin: '0px 0px 0px 0px'
});

/* ============== reveal animation: init ============== */
const initOberverReveal = () => {
  let elsAnime = document.querySelectorAll('[data-reveal]');
  elsAnime.forEach((el) => {
      el.style.opacity = '0';
      el.classList.remove(el.dataset.reveal);
      observerAnime.observe(el);
  });
}
window.addEventListener('load', initOberverReveal);


// ------------------------------------------------ //
// ------------------ CURSOR -------------------- //
// ------------------------------------------------ //




class RingDot {
  constructor() {
    this.root = document.body
    this.cursor = document.querySelector(".curzr")
    this.dot = document.querySelector(".curzr-dot")

    this.pointerX = 0
    this.pointerY = 0
    this.cursorSize = 20

    this.cursorStyle = {
      boxSizing: 'border-box',
      position: 'fixed',
      display: 'flex',
      top: `${ this.cursorSize / -2 }px`,
      left: `${ this.cursorSize / -2 }px`,
      zIndex: '2147483647',
      justifyContent: 'center',
      alignItems: 'center',
      width: `${ this.cursorSize }px`,
      height: `${ this.cursorSize }px`,
      backgroundColor: '#fff0',
      boxShadow: '0 0 0 1.25px #111920, 0 0 0 2.25px #F2F5F8',
      borderRadius: '50%',
      transition: '200ms, transform 100ms',
      userSelect: 'none',
      pointerEvents: 'none'
    }

    this.dotStyle = {
      boxSizing: 'border-box',
      position: 'fixed',
      zIndex: '2147483647',
      width: '4px',
      height: '4px',
      backgroundColor: '#111920',
      boxShadow: '0 0 0 1px #F2F5F8',
      borderRadius: '50%',
      userSelect: 'none',
      pointerEvents: 'none',
    }

    this.init(this.cursor, this.cursorStyle)
    this.init(this.dot, this.dotStyle)
  }

  init(el, style) {
    Object.assign(el.style, style)
    this.cursor.removeAttribute("hidden")

  }

  move(event) {
    if (event.target.localName === 'button' ||
        event.target.localName === 'a' ||
        event.target.onclick !== null ||
        event.target.className.includes('curzr-hover')) {
      this.hover(40)
    } else {
      this.hoverout()
    }

    this.pointerX = event.pageX + this.root.getBoundingClientRect().x
    this.pointerY = event.pageY + this.root.getBoundingClientRect().y

    this.cursor.style.transform = `translate3d(${this.pointerX}px, ${this.pointerY}px, 0)`
  }

  hover(radius) {
    this.cursor.style.width = this.cursor.style.height = `${radius}px`
    this.cursor.style.top = this.cursor.style.left = `${radius / -2}px`
  }

  hoverout() {
    this.cursor.style.width = this.cursor.style.height = `${this.cursorSize}px`
    this.cursor.style.top = this.cursor.style.left = `${this.cursorSize / -2}px`
  }

  click() {
    this.cursor.style.transform += ` scale(0.75)`
    setTimeout(() => {
      this.cursor.style.transform = this.cursor.style.transform.replace(` scale(0.75)`, '')
    }, 35)
  }

  remove() {
    this.cursor.remove()
    this.dot.remove()
  }
}

(() => {
  const cursor = new RingDot()
  if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.onmousemove = function (event) {
      cursor.move(event)
    }
    document.onclick = function () {
      cursor.click()
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


const main = () => {
  {
      const root = document.querySelector('.tags-cloud');
      const cloud = new TagsCloud(root);

      cloud.start();
  }
}
window.addEventListener('load', main);


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
