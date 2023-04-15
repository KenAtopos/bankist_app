"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll(".section");

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

btnScrollTo.addEventListener("click", (event) => {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(event.target.getBoundingClientRect());
  console.log("current scroll (X/Y)", window.pageXOffset, window.pageYOffset); // for scroll
  console.log(
    "height/width",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // for viewpoint

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // }); // viewpoint top to bottom + page top to bottom

  section1.scrollIntoView({ behavior: "smooth" });
});

// document.querySelectorAll(".nav__link").forEach((element) => {
//   element.addEventListener("click", function (event) {
//     event.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// event delegation
document
  .querySelector(".nav__links")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // matching strategy
    if (event.target.classList.contains("nav__link")) {
      const id = event.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  });

// tabbed component
tabsContainer.addEventListener("click", (event) => {
  const clicked = event.target.closest(".operations__tab");
  // guard clause
  if (!clicked) return;
  // active tab
  tabs.forEach((tab) => {
    tab.classList.remove("operations__tab--active");
  });
  clicked.classList.add("operations__tab--active");
  // active content area
  tabsContent.forEach((content) => {
    content.classList.remove("operations__content--active");
  });
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// menu fade animation
const handleHover = function (event) {
  if (event.target.classList.contains("nav__link")) {
    const link = event.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((element) => {
      if (element !== link) {
        element.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function () {
//   if (this.window.scrollY >= initialCoords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

// sticky navigation: intersection observer api
// const obsCallback = function (entires, observer) {
//   entires.forEach((entry) => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, // null means the entire viewpoint, root is the object which the target element tries to intersect
//   threshold: [0, 0.2], // 10%
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// reveal sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// lazy loading imgs
const imgTarget = document.querySelectorAll("img[data-src]");
const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imgTarget.forEach((img) => imgObserver.observe(img));
