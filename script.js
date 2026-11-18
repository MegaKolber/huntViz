document.addEventListener("DOMContentLoaded", () => {
  const exploreButton = document.getElementById("exploreButton");
  const intro = document.getElementById("intro");
  const world = document.getElementById("world");
  const hoverText = document.getElementById("hoverText");
  const hoverObjects = document.querySelectorAll("[data-hover-text]");
  let hasEntered = false;

  const ms = (key, fallback) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
    const number = parseFloat(value);
    return Number.isFinite(number) ? number * (value.endsWith("ms") ? 1 : value.endsWith("s") ? 1000 : 1) : fallback;
  };
  const stages = ["board-assembly","board-name","board-shelf-left","board-shelf-right","board-business-card","board-plant","camera-object","tool-line","drawers","desktop","desk-shelf","book-object","lamp-object","joystick-object"];
  const total = Math.max(...stages.map(n => ms("--enter-" + n + "-delay", 0) + ms("--enter-" + n + "-duration", 0)));
  function enter(skipButton = false) {
    if (hasEntered) return;
    hasEntered = true;
    intro.classList.add("is-leaving");
    const doorStart = skipButton ? 0 : ms("--doors-delay", 350);
    const assemblyStart = skipButton ? ms("--doors-duration", 1500) + 200 : ms("--assembly-delay", 2050);
    window.setTimeout(() => world.classList.add("is-opening"), doorStart);
    window.setTimeout(() => world.classList.add("is-assembling"), assemblyStart);
    window.setTimeout(() => world.classList.add("is-complete"), assemblyStart + total + 350);
  }
  exploreButton.addEventListener("click", () => enter());
  // Only links clicked within the portfolio trigger automatic entry on return.
  const navigation = performance.getEntriesByType("navigation")[0];
  if (navigation?.type === "reload") sessionStorage.removeItem("huntVizReturn");
  if (navigation?.type !== "reload" && sessionStorage.getItem("huntVizReturn") === "1") {
    sessionStorage.removeItem("huntVizReturn");
    enter(true);
  }
  document.querySelectorAll('a[href^="projects/"], a[href^="about/"], a[href^="contact/"]').forEach(link =>
    link.addEventListener("click", () => sessionStorage.setItem("huntVizReturn", "1")));
  
  const lamp = document.querySelector(".lamp-object");
  const plant = document.querySelector(".plant-object");
  lamp?.addEventListener("click", () => {
    const lit = lamp.classList.toggle("is-lit");
    lamp.setAttribute("aria-pressed", String(lit));
  });
  plant?.addEventListener("click", () => plant.classList.toggle("is-dancing"));

  const toolGroup = document.querySelector(".tool-line");
  const toolImages = [...(toolGroup?.querySelectorAll("img") || [])];
  toolGroup?.addEventListener("pointermove", event => {
    const rect = toolGroup.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const styles = getComputedStyle(document.documentElement);
    const radius = parseFloat(styles.getPropertyValue("--tool-mouse-radius")) || .7;
    toolImages.forEach((img, index) => {
      const center = (index + .5) / toolImages.length;
      const proximity = Math.max(0, 1 - Math.abs(x - center) / radius);
      const angle = parseFloat(styles.getPropertyValue("--tool-" + (index + 1) + "-turn")) || 0;
      img.style.setProperty("--live-tool-angle", (angle * proximity).toFixed(2) + "deg");
    });
  });
  toolGroup?.addEventListener("pointerleave", () =>
    toolImages.forEach(img => img.style.removeProperty("--live-tool-angle")));

  hoverObjects.forEach((object) => {
    const showCaption = () => {
      hoverText.textContent = object.dataset.hoverText;
      hoverText.classList.add("is-visible");
    };
    const hideCaption = () => hoverText.classList.remove("is-visible");

    object.addEventListener("pointerenter", showCaption);
    object.addEventListener("pointerleave", hideCaption);
    object.addEventListener("focus", showCaption);
    object.addEventListener("blur", hideCaption);
  });
});