import "prismjs";
import "prismjs/components/prism-typescript";

import "./scss/demo.scss";

import {
  // open,
  close,
  init,
} from "./lib/nano-modal";
init();

// Toggle content
const toggleContent = document.querySelector(
  ".toggle-content",
) as HTMLButtonElement;

toggleContent.addEventListener("click", () => {
  const content = document.querySelector(".content") as HTMLDivElement;
  content.classList.toggle("hidden");
});

// Toggle scrollbar width
const toggleScrollBarWidth = document.querySelector(
  ".toggle-scrollbar-width",
) as HTMLButtonElement;

toggleScrollBarWidth.addEventListener("click", () => {
  document.documentElement.classList.toggle("thin-scrollbar");
});

// Destroy nano modal
// const destroyButtons = document.querySelectorAll(
//   ".destroy",
// ) as NodeListOf<HTMLButtonElement>;

// destroyButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     destroy();
//   });
// });

// Init nano modal
const initButton = document.querySelector(".init") as HTMLButtonElement;

initButton.addEventListener("click", () => {
  init();
});

// Modal nav

document
  .querySelectorAll("#modal-nav .nav__link, #modal-nav .nav__logo")
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href") || "");
      if (target) {
        close().then(() => {
          target.scrollIntoView({ behavior: "smooth" });
        });
      }
    });
  });

// Goat counter
if (import.meta.env.PROD) {
  const gc = document.createElement("script");
  gc.setAttribute(
    "data-goatcounter",
    "https://muffinman_io.goatcounter.com/count",
  );
  gc.setAttribute("async", "");
  gc.src = "//gc.zgo.at/count.js";

  document.body.appendChild(gc);
}
