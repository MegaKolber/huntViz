// One renderer for every project. Data is generated from project folders.
const content = document.getElementById("projectContent");
const title = document.getElementById("pageTitle");
const params = new URLSearchParams(location.search);
const category = params.get("category") || "";
const projectId = params.get("project");
const categoryNames = {films: "Films", fabs: "Fabrications", interacts: "Interactives"};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function path(src) { return "../" + src.split("/").map(encodeURIComponent).join("/"); }
function card(project) {
  const link = element("a", "project-card");
  link.href = "?project=" + encodeURIComponent(project.id);
  if (project.cover) {
    const image = element("img");
    image.src = path(project.cover);
    image.alt = "";
    image.loading = "lazy";
    link.append(image);
  } else link.append(element("div", "project-placeholder"));
  link.append(element("h2", "", project.title));
  link.append(element("p", "", [categoryNames[project.category], project.year].filter(Boolean).join(" · ")));
  return link;
}
function detail(project) {
  title.textContent = categoryNames[project.category].toUpperCase();
  document.title = project.title + " | Hunt Your Vizion";
  const main = element("article", "project-detail");
  const back = element("a", "back-link", "← Back to " + categoryNames[project.category]);
  back.href = "?category=" + encodeURIComponent(project.category);
  main.append(back, element("h2", "", project.title));
  if (project.year) main.append(element("p", "project-year", project.year));
  if (project.description) main.append(element("p", "project-description", project.description));
  const gallery = element("div", "project-media");
  for (const media of project.media) {
    if (media.type === "video") {
      const video = element("video");
      video.src = path(media.src);
      video.controls = true;
      video.preload = "metadata";
      gallery.append(video);
    } else {
      const img = element("img");
      img.src = path(media.src);
      img.alt = project.title;
      img.loading = "lazy";
      gallery.append(img);
    }
  }
  main.append(gallery);
  content.replaceChildren(main);
}
fetch("../projects.json")
  .then(response => { if (!response.ok) throw new Error("Catalog unavailable"); return response.json(); })
  .then(projects => {
    if (projectId) {
      const found = projects.find(p => p.id === projectId);
      if (!found) { content.textContent = "Project not found."; return; }
      detail(found);
      return;
    }
    const selected = categoryNames[category] ? category : "";
    title.textContent = selected ? categoryNames[selected].toUpperCase() : "PROJECTS";
    for (const link of document.querySelectorAll(".collection-header nav a")) {
      const target = new URL(link.href).searchParams.get("category") || "";
      if (target === selected) link.setAttribute("aria-current", "page");
    }
    const filtered = projects.filter(p => !selected || p.category === selected);
    if (!filtered.length) { content.textContent = "No projects here yet."; return; }
    const grid = element("div", "project-grid");
    filtered.forEach(p => grid.append(card(p)));
    content.replaceChildren(grid);
  })
  .catch(error => { content.textContent = "Couldn't load the project catalog. " + error.message; });
