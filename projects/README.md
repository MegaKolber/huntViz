# Adding a project

1. Open the `projects` folder, then choose `films`, `fabs`, or `interacts`.
2. Create a new folder for your project, for example `ice-cream-prop`.
3. Add an `info.md` file using the example below, plus your images and videos.
4. Commit and push from VS Code. GitHub automatically updates `projects.json`.

Example `info.md`:

```md
---
title: Ice Cream Prop
year: 2026
cover: cover.jpg
---

A short description of what I made and why.
You can write more than one paragraph here.
```

Put `cover.jpg` in the same project folder. Other JPG, PNG, WebP, GIF, AVIF, MP4, and WebM files in that folder are automatically included in the project gallery.

**Important:** The description is displayed as plain text, so you don't need to learn Markdown formatting. Use small, web-friendly image and video files. Videos can make the repository large; for long films, we can add external video links later.

To preview new projects locally *before pushing*, run `python3 scripts/build_projects.py` in the VS Code terminal. Live Server will then show the updated collection. The automatic GitHub action runs after pushing, not during local editing.

Folders without `info.md` will trigger an error rather than silently disappear. No draft system is included.
