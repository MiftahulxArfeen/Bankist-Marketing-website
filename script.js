"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelector(".operations__tab-container");
const tab = document.querySelectorAll(".operations__tab");
const content = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav__links");
const navBar = document.querySelector(".nav");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);
btnsOpenModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
//
//
// Implementing smooth scrolling

btnScrollTo.addEventListener("click", function (e) {
  e.preventDefault();
  const s1cords = section1.getBoundingClientRect();
  console.log(s1cords);
  // console.log(e);
  console.log(e.target.getBoundingClientRect());
  console.log("Current scroll X/Y", window.scrollX, window.scrollY);
  console.log(
    "Height/Width of the viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  console.log(s1cords.left, s1cords.top);
  // Scrolling
  // window.scrollTo(s1cords.left + window.scrollX, s1cords.top + window.scrollY);
  // window.scrollTo({
  //   left: s1cords.left + window.scrollX,
  //   top: s1cords.top + window.scrollY,
  //   behavior: "smooth",
  // });
  // Modern way
  section1.scrollIntoView({ behavior: "smooth" });
});

////////////////////////////////////////////
// nav scroll
// console.log(document.querySelectorAll(".nav__link"));
// document.querySelectorAll(".nav__link").forEach((el) => {
//   el.addEventListener("click", (e) => {
//     e.preventDefault();
//     // console.log(el.getAttribute("href"));
//     document
//       .querySelector(el.getAttribute("href"))
//       .scrollIntoView({ behavior: "smooth" });
//   });
// });
//
// nav scroll using event delegation (a concept which uses event propagation)
document.querySelector(".nav__links").addEventListener("click", (e) => {
  e.preventDefault();
  console.log(e.target);
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Tab component

tabs.addEventListener("click", function (t) {
  const clicked = t.target.closest(".operations__tab");
  // Guards closure
  if (!clicked) return;
  // Removing active class to non-clicked button
  tab.forEach((t) => t.classList.remove("operations__tab--active"));
  // Removing active class to non-clicked button's content
  content.forEach((c) => c.classList.remove("operations__content--active"));
  // Adding active class to clicked button
  clicked.classList.add("operations__tab--active");
  // Adding active class to clicked button's content
  const clickedContent = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  clickedContent.classList.add("operations__content--active");
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    e.preventDefault();
    const link = e.target;
    const siblings = link.closest(".nav__links").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector(".nav__logo");
    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// console.log(window.clientHeight);
// Sticky navigation

// const section1Coords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function (e) {
//   console.log(e);
//   console.log(window.scrollY);
//   console.log(section1.getBoundingClientRect().top);
//   if (window.scrollY > section1Coords.top - navBar.clientHeight) {
//     navBar.classList.add("sticky");
//   } else {
//     navBar.classList.remove("sticky");
//   }
// });
// Sticky header
const header = document.querySelector(".header");
// console.log(header);
const navHeight = navBar.getBoundingClientRect().height;
// console.log(navHeight);

const obsCallback = function (entries) {
  // console.log(entries);
  const [entry] = entries;
  if (!entry.isIntersecting) navBar.classList.add("sticky");
  else navBar.classList.remove("sticky");
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(header);

// Reveals section

const allSections = document.querySelectorAll(".section");
// console.log(allSections);
const revealCallback = function (entries, observer) {
  // console.log(entries);
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  });
};

const revealSection = new IntersectionObserver(revealCallback, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  // console.log(section);
  section.classList.add("section--hidden");
  revealSection.observe(section);
});

// Lazy load images
const setOfImages = document.querySelectorAll("img[data-src]");
// console.log(setOfImages);
const lazyImageCallback = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  // Guards closure
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
};
const lazyImageObserver = new IntersectionObserver(lazyImageCallback, {
  root: null,
  threshold: 0,
  // rootMargin: "0px",
});
setOfImages.forEach((img) => lazyImageObserver.observe(img));

// Slider
const slider = function () {
  const sliders = document.querySelectorAll(".slide");
  const btnRight = document.querySelector(".slider__btn--right");
  const btnLeft = document.querySelector(".slider__btn--left");
  const dots = document.querySelector(".dots");
  const maxSlide = sliders.length;
  let curSlide = 0;
  //
  const createDots = function () {
    sliders.forEach(function (_, i) {
      dots.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  //
  const activeDots = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };
  //
  const goToSlide = function (slide) {
    sliders.forEach((img, i) => {
      img.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    // console.log(curSlide);
    goToSlide(curSlide);
    activeDots(curSlide);
  };
  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = sliders.length - 1;
    } else {
      curSlide--;
    }
    // console.log(curSlide);
    goToSlide(curSlide);
    activeDots(curSlide);
  };
  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);
  //
  const init = function () {
    createDots();
    goToSlide(0);
    activeDots(0);
  };
  init();
  //

  dots.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      // const clicked = e.target.dataset.slide;
      // console.log(clicked);
      // goToSlide(clicked);
      curSlide = Number(e.target.dataset.slide);
      activeDots(curSlide);
      goToSlide(curSlide);
    }
  });
  document.addEventListener("keydown", function (e) {
    console.log(e);
    if (e.key === "ArrowRight") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    }
  });
};
slider();
