const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const catBtn = document.getElementById("catBtn");
const catMenu = document.getElementById("catMenu");
const catLabel = document.getElementById("catLabel");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  searchForm.classList.toggle("open", open);
});

catBtn.addEventListener("click", () => {
  const open = catMenu.hasAttribute("hidden");
  catMenu.toggleAttribute("hidden", !open);
  catBtn.setAttribute("aria-expanded", String(open));
});

catMenu.addEventListener("click", (event) => {
  const item = event.target.closest("li");
  if (!item) return;
  catLabel.textContent = item.textContent;
  catMenu.hidden = true;
  catBtn.setAttribute("aria-expanded", "false");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-cat")) {
    catMenu.hidden = true;
    catBtn.setAttribute("aria-expanded", "false");
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const q = searchInput.value.trim();
  showToast(q ? "Search “" + q + "” in " + catLabel.textContent : "Type something to search");
});

document.querySelector(".login").addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Login opens on the live store");
});

document.querySelector(".cart").addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Your cart is empty");
});

window.addEventListener("scroll", () => {
  header.style.boxShadow = window.scrollY > 4 ? "0 2px 10px rgba(0,0,0,.08)" : "none";
}, { passive: true });

const parallaxLayers = document.querySelectorAll(".brand-parallax");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let parallaxFrame = 0;

function updateBrandParallax() {
  parallaxFrame = 0;
  if (reduceMotion.matches) {
    parallaxLayers.forEach((layer) => {
      layer.style.removeProperty("--parallax-y");
      layer.style.removeProperty("--parallax-x");
    });
    return;
  }

  const viewportCenter = window.innerHeight / 2;
  parallaxLayers.forEach((layer) => {
    const rect = layer.getBoundingClientRect();
    const speed = Number.parseFloat(layer.dataset.parallaxSpeed || "0");
    const horizontalSpeed = Number.parseFloat(layer.dataset.parallaxX || "0");
    const distance = viewportCenter - (rect.top + rect.height / 2);
    const verticalOffset = Math.max(-100, Math.min(100, distance * speed));
    const horizontalOffset = Math.max(-34, Math.min(34, distance * horizontalSpeed));
    layer.style.setProperty("--parallax-y", `${verticalOffset}px`);
    layer.style.setProperty("--parallax-x", `${horizontalOffset}px`);
  });
}

window.addEventListener("scroll", () => {
  if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateBrandParallax);
}, { passive: true });

window.addEventListener("resize", updateBrandParallax);
reduceMotion.addEventListener("change", updateBrandParallax);
updateBrandParallax();

const footerNewsletter = document.getElementById("footerNewsletter");
if (footerNewsletter) {
  footerNewsletter.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Newsletter sign-up is not connected yet.");
  });
}

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
  });
}

(function () {
  var root = document.querySelector(".collections");
  if (!root) return;

  root.querySelectorAll(".tile img").forEach(function (img) {
    img.addEventListener("error", function () {
      var tile = img.parentElement;
      img.remove();
      tile.style.background = "linear-gradient(160deg, #68135f 0%, #2a1028 55%, #e99114 140%)";
    });
  });
})();


(function () {
  var track = document.getElementById("marqueeTrack");
  var note = document.getElementById("marqueeNote");
  if (!track) return;

  track.innerHTML += track.innerHTML;

  var offset = 0;
  var manual = false;

  function cardStep() {
    var card = track.querySelector(".product-card");
    if (!card) return 258;
    return card.getBoundingClientRect().width + 18;
  }

  function nudge(direction) {
    manual = true;
    track.classList.add("is-paused");
    offset += direction * cardStep();
    track.style.transform = "translateX(" + offset + "px)";
  }

  document.querySelector(".marquee-arrow.prev").addEventListener("click", function () {
    nudge(1);
  });

  document.querySelector(".marquee-arrow.next").addEventListener("click", function () {
    nudge(-1);
  });

  track.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button || !note) return;
    var card = button.closest(".product-card");
    var name = card.querySelector("h3").textContent;
    note.textContent = button.dataset.action === "cart"
      ? "Added to cart: " + name
      : "Quick shop: " + name;
  });
})();


(function () {
  var track = document.getElementById("reviewTrack");
  var prev = document.getElementById("reviewPrev");
  var next = document.getElementById("reviewNext");
  if (!track || !prev || !next) return;

  var index = 0;

  function perView() {
    return window.matchMedia("(max-width: 860px)").matches ? 1 : 2;
  }

  function maxIndex() {
    return Math.max(0, track.children.length - perView());
  }

  function step() {
    var card = track.children[0];
    if (!card) return 0;
    var styles = getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function render() {
    index = Math.min(Math.max(index, 0), maxIndex());
    track.style.transform = "translateX(" + (-index * step()) + "px)";
    prev.disabled = index === 0;
    next.disabled = index === maxIndex();
  }

  prev.addEventListener("click", function () {
    index -= 1;
    render();
  });

  next.addEventListener("click", function () {
    index += 1;
    render();
  });

  window.addEventListener("resize", render);
  render();
})();