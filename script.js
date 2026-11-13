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
        world.classList.add("is-visible");

        // Fade the invitation, then open the two wall panels.
        window.setTimeout(() => {
            world.classList.add("is-opening");
        }, 350);

        // Mark the scene ready once the entrance animation has settled.
        window.setTimeout(() => {
            world.classList.add("is-ready");
        }, 3100);
    });

    // Only objects with data-hover-text display a caption.
    // The caption appears in the game's bottom text area, never on the object.
    hoverObjects.forEach((object) => {
        const showCaption = () => {
            hoverText.textContent = object.dataset.hoverText;
            hoverText.classList.add("is-visible");
        };

        const hideCaption = () => {
            hoverText.classList.remove("is-visible");
        };

        object.addEventListener("mouseenter", showCaption);
        object.addEventListener("mouseleave", hideCaption);
        object.addEventListener("focus", showCaption);
        object.addEventListener("blur", hideCaption);
    });
});
