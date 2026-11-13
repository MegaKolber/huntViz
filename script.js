document.addEventListener("DOMContentLoaded", () => {
  const exploreButton = document.getElementById("exploreButton");
  const intro = document.getElementById("intro");
  const world = document.getElementById("world");
  const hoverText = document.getElementById("hoverText");
  const hoverObjects = document.querySelectorAll("[data-hover-text]");
  let hasEntered = false;

  exploreButton.addEventListener("click", () => {
    if (hasEntered) return;
    hasEntered = true;
    intro.classList.add("is-leaving");

    // Doors open first. The desk and board do not begin assembling until they clear.
    window.setTimeout(() => world.classList.add("is-opening"), 350);
    window.setTimeout(() => world.classList.add("is-assembling"), 2050);
    window.setTimeout(() => world.classList.add("is-complete"), 9500);
  });

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