document.addEventListener("DOMContentLoaded", () => {
    const exploreButton = document.getElementById("exploreButton");
    const intro = document.getElementById("intro");
    const world = document.getElementById("world");
    const detailPanel = document.getElementById("detailPanel");
    const detailTitle = document.getElementById("detailTitle");
    const detailDescription = document.getElementById("detailDescription");
    const detailClose = document.getElementById("detailClose");
    const sceneObjects = document.querySelectorAll(".scene-object");

    let hasEntered = false;

    exploreButton.addEventListener("click", () => {
        if (hasEntered) return;
        hasEntered = true;

        intro.classList.add("is-leaving");
        world.classList.add("is-visible");

        // Let the empty screen fade before the room begins to open.
        window.setTimeout(() => {
            world.classList.add("is-opening");
        }, 350);

        // The scene is ready after the wall and objects have finished moving.
        window.setTimeout(() => {
            world.classList.add("is-ready");
        }, 3100);
    });

    sceneObjects.forEach((object) => {
        object.addEventListener("click", () => {
            detailTitle.textContent = object.dataset.title;
            detailDescription.textContent = object.dataset.description;
            detailPanel.hidden = false;
        });
    });

    detailClose.addEventListener("click", () => {
        detailPanel.hidden = true;
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            detailPanel.hidden = true;
        }
    });
});
