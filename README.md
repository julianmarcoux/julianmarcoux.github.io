# julianmarcoux.github.io

Personal academic website — plain HTML/CSS, no build step.

## Structure
- `index.html` — homepage (About, Research, Teaching, Activities, Visiting)
- `assets/style.css` — the single stylesheet for all pages
- `reading_group/`, `conf_2025/` — standalone pages
- `research/`, `activities/`, `cv/` — redirects that keep old URLs working
- `files/pdf/` — CV and other PDFs
- `images/` — photo and favicon

## How to edit
Everything is plain HTML. To add a paper, copy a `<div class="paper">…</div>`
block in `index.html`. To add a teaching/activity/visiting row, copy a `<li>`
inside the corresponding `<ul class="rows">`.

The `.nojekyll` file tells GitHub Pages to serve files as-is (no Jekyll build).
