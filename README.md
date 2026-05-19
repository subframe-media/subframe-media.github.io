# subframe.media

This is the source for [subframe.media](https://subframe.media). It's built with [Jekyll](https://jekyllrb.com/) and hosted for free on [GitHub Pages](https://pages.github.com/) — every time you push a change to the `main` branch of this repo, the site rebuilds and goes live within about a minute.

You don't need to know much code to update it. Most edits are just changing a line in a small text file.

---

## TL;DR — the files you'll actually edit

| To change…                                | Edit this file              |
| ----------------------------------------- | --------------------------- |
| The video gallery (add, remove, reorder)  | `_data/videos.yml`          |
| Team bios on the *Who We Are* page        | `_data/team.yml`            |
| Email address and social links            | `_data/site_meta.yml`       |
| The top navigation menu                   | `_data/nav.yml`             |
| Colours, fonts, spacing                   | `_sass/_tokens.scss`        |
| The home page hero text                   | `index.html` (top section)  |
| The *Who We Are* intro line               | `about.md` (front matter)   |
| The *Contact* intro line                  | `contact.md` (front matter) |

Everything else (layout, hover effects, lightbox behaviour) is wired up for you.

---

## Editing without installing anything (easiest)

You can edit any of the files above directly on GitHub:

1. Open [the repo on github.com](https://github.com/subframe-media/subframe-media.github.io).
2. Click the file you want to change.
3. Click the pencil icon (✏️) in the top-right of the file view.
4. Make your edit, scroll down, write a short note in *“Commit changes”*, and click the green button.
5. Wait ~60 seconds — the site rebuilds and your change is live.

If something looks broken after a change, the [Actions tab](https://github.com/subframe-media/subframe-media.github.io/actions) of the repo will show a red ❌ next to the failed build and a hint about why.

---

## File formats: what's a `.yml` and what's a `.md`?

Two plain-text formats do most of the work here. You can edit both in any text editor — TextEdit, VS Code, github.com itself, even Notes (just make sure it's plain text, not "rich text").

### YAML files (`.yml`) — for structured data

YAML is a way of writing lists and labelled fields in plain text. The video gallery, team bios, and nav menu all live in `.yml` files under `_data/`.

The format looks like this:

```yaml
- title: "First item"
  year: 2026
  featured: true

- title: "Second item"
  year: 2025
```

Three rules cover 95% of YAML:

1. **Indent with spaces, not tabs.** Two spaces per level. A stray tab will break the build — most editors handle this automatically, but watch for it if you're copy-pasting.
2. **A `-` starts a new list item.** Everything indented under it belongs to that item.
3. **Put text in double quotes**, especially if it contains a colon, apostrophe, or any punctuation. `title: "Louis XIII @ Harrods"` is safe; `title: Louis XIII: a story` would break because the second colon confuses YAML.

A few extras worth knowing:

- **`true` / `false`** are special — don't quote them (`featured: true`, not `featured: "true"`).
- **Numbers** are written without quotes (`year: 2026`). Vimeo IDs are an exception — we keep them in quotes (`id: "225766554"`) so YAML treats them as a string.
- **Long blurbs** that wrap across lines: start them with `>-` like this:
  ```yaml
  bio: >-
    A multi-line bio. Indent every line the same amount.
    Line breaks here become spaces in the final output.
  ```
- **Comments** start with `#` and are ignored. Use them to leave notes for your future self.

Helpful links:
- [Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml/) — short cheat-sheet
- [YAML Multiline Strings](https://yaml-multiline.info/) — the one thing that always confuses people
- [YAMLLint](https://www.yamllint.com/) — paste your file in, get told what's wrong (handy when GitHub's build fails and you can't see why)

### Markdown files (`.md`) — for prose pages

Markdown is a lightweight way to write formatted text. The *About* and *Contact* pages (`about.md`, `contact.md`) are Markdown.

The basics:

```markdown
# Big heading
## Medium heading
### Small heading

A normal paragraph. Leave a blank line between paragraphs.

*italic* and **bold** and [a link](https://example.com).

- A bulleted list
- Another bullet
  - Indented sub-bullet

1. A numbered list
2. Second item

![Alt text for an image](/assets/img/my-photo.jpg)
```

Helpful links:
- [Markdown Guide — Basic Syntax](https://www.markdownguide.org/basic-syntax/) — the friendliest reference
- [CommonMark spec](https://commonmark.org/help/) — official, with a side-by-side preview
- [Dillinger](https://dillinger.io/) — paste-and-preview editor in the browser

### Front matter (the bit at the top between `---` lines)

Every `.md` page starts with a small block of YAML between two `---` lines. That's called *front matter* and tells Jekyll what the page is:

```yaml
---
layout: page
title: Who We Are
permalink: /about/
eyebrow: About
lede: From initial concept to final edit, we take care of every phase of video production.
---
```

So Markdown pages are actually a mix: a tiny chunk of YAML at the top (settings), then Markdown below (the content). The same indentation/quoting rules from the YAML section apply inside the front matter.

---

## Common tasks

### Add a new video

1. Get the **Vimeo ID** — the number at the end of the Vimeo URL. For `https://vimeo.com/225766554` the id is `225766554`.

2. Open `_data/videos.yml` and append a new block at the bottom:

   ```yaml
   - id: "1234567890"          # Vimeo numeric id, in quotes
     slug: "new-project"        # kebab-case, used internally
     title: "New Project"
     description: "One- or two-sentence blurb shown under the title."
     category: "commercial"     # showreel | commercial | documentary | music-video
     year: 2026
     featured: true             # remove this line if you don't want it on the home page
     client: "Client Name"      # optional — shown in red under the title
     role: "Director, DP"       # optional
   ```

   Order in the file = order on the page. Drag entries around to reorder.

3. Get the poster image. The easiest way is to run the helper script on your laptop:

   ```sh
   bin/fetch-thumbs.sh
   ```

   It looks at `_data/videos.yml`, finds any videos missing a poster under `assets/img/thumbs/`, and downloads them from Vimeo. Existing posters are skipped.

   If the script reports a warning (e.g. *“no thumbnail returned”*) it's because the video has restricted privacy on Vimeo. Two options:
   - On Vimeo, turn on *“Show on vimeo.com”* for that video, then re-run the script.
   - Or leave it — the site will render a tasteful initials-on-gradient card as a fallback.

4. Commit and push (or just commit on github.com).

### Remove a video

Delete its block from `_data/videos.yml`. That's it. The thumbnail file under `assets/img/thumbs/` can stay or be deleted — it won't be referenced.

### Edit a video's title or description

Find it in `_data/videos.yml`, change the line, save. Done.

### Feature (or unfeature) a video on the home page

In `_data/videos.yml`, set `featured: true` (or remove the line). The home page picks up everything marked `featured`, skipping the showreel.

### Change the showreel video

The home-page hero plays the entry with `slug: "showreel"` in `_data/videos.yml`. Change its `id:` to swap in a different Vimeo video. Keep the slug as `"showreel"`.

### Update a team bio

Edit `_data/team.yml`. To add a real photo:

1. Drop a JPEG into `assets/img/team/` (any name works, e.g. `nicola.jpg`).
2. Set `photo: "/assets/img/team/nicola.jpg"` for that person in `_data/team.yml`.
3. In `about.md`, uncomment the `<img>` line inside the `{% comment %}` block (delete the `{% comment %}` and `{% endcomment %}` tags around it).

### Change the contact email or socials

Edit `_data/site_meta.yml`. The footer and contact page both read from this file.

### Change a navigation label or link

Edit `_data/nav.yml`. Each entry is `label:` + `url:`.

---

## Restyling the site

The whole look is controlled by a small number of variables at the top of `_sass/_tokens.scss`. These are the safe knobs to turn:

```scss
:root {
  --bg:        #0a0a0a;   // page background (near-black)
  --fg:        #f4f1ea;   // body text (warm off-white)
  --accent:    #d64027;   // accent colour — buttons, hover states, client labels
  --fg-muted:  #8a8680;   // secondary text
  ...
}
```

- **Change the accent colour** by editing `--accent`. Try a deep blue (`#1e3a8a`), a forest green (`#2d4a2b`), or a warm gold (`#c9a14a`).
- **Lighten the theme** by swapping `--bg` and `--fg` (e.g. `--bg: #f4f1ea; --fg: #0a0a0a;`).
- **Change the typeface** by editing `--ff-display` and `--ff-body`. Then update the Google Fonts link in `_includes/head.html` to load the new families.

Other partials in `_sass/` (`_hero.scss`, `_video-card.scss`, `_lightbox.scss`, etc.) control specific components — edit those for finer tweaks.

---

## Working locally (optional)

You only need this if you want to preview changes before publishing.

**One-time setup** (macOS):

```sh
# install Ruby via Homebrew if you don't have it
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
exec zsh

# install Jekyll + this project's dependencies
cd path/to/subframe-media.github.io
bundle install
```

**Every time you want to preview**:

```sh
bundle exec jekyll serve
```

Open <http://localhost:4000/> in a browser. The site rebuilds on save.

---

## How the videos play (in plain English)

Each tile on the *Work* page shows a **still image** from the video by default — that keeps the page snappy.

- **On a laptop/desktop**, when you hover over a tile, the still fades into a silent looping preview of the video.
- **On a phone or tablet**, hover doesn't exist, so the still stays put until you tap.
- **Clicking (or tapping) anywhere on a tile** opens the video full-size in a black lightbox with sound. Press `Esc` or click outside to close.

This is a *big* upgrade from the original site, where the inline previews relied on signed Vimeo URLs that expired and silently broke. The new approach uses Vimeo's supported embed format, so it won't break on its own.

---

## File map (for reference)

```
subframe-media.github.io/
├── _config.yml            Jekyll settings (site title, plugins, etc.)
├── _data/                 ⬅ the content you edit
│   ├── videos.yml         the gallery — the most-edited file
│   ├── team.yml           bios on the about page
│   ├── site_meta.yml      email + socials
│   └── nav.yml            top menu
├── _sass/                 ⬅ the styling
│   ├── _tokens.scss       colours, fonts, spacing (start here for restyles)
│   ├── _hero.scss         home page hero
│   ├── _video-card.scss   gallery tiles + hover effect
│   ├── _lightbox.scss     full-screen video player
│   └── … etc.
├── _layouts/              page shells (rarely edited)
├── _includes/             reusable bits (nav, footer, head)
├── assets/
│   ├── img/
│   │   ├── thumbs/        Vimeo poster JPEGs (filled by bin/fetch-thumbs.sh)
│   │   ├── team/          drop team headshots here
│   │   └── logo-white.png the wordmark in the top-left
│   ├── css/main.scss      stylesheet entry point
│   └── js/main.js         all the interactive bits
├── bin/
│   └── fetch-thumbs.sh    helper — downloads Vimeo posters listed in videos.yml
├── index.html             home page
├── work.html              gallery page
├── about.md               team page
├── contact.md             contact page
├── 404.html               “page not found”
└── CNAME                  custom-domain pin (subframe.media)
```

---

## Where things live on the internet

- **Source code** (this repo): https://github.com/subframe-media/subframe-media.github.io
- **GitHub Pages default URL**: https://subframe-media.github.io/
- **Custom domain**: https://subframe.media (once DNS at the registrar is pointed at GitHub Pages)
- **Build status**: the *Actions* tab of this repo

---

## When things go wrong

| Symptom                                          | Likely cause / fix                                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| New video shows a generic gradient, not a poster | Run `bin/fetch-thumbs.sh`, or the video has restricted Vimeo privacy.              |
| Edit committed but site hasn't changed           | Check the *Actions* tab for a failed build. YAML is picky about indentation.       |
| Page looks unstyled                              | The CSS didn't compile — check the *Actions* tab for a Sass error.                 |
| Lightbox opens but video won't play              | The video may be set to *“Hide from Vimeo.com”* with no embed permission allowed.  |
| Custom domain `subframe.media` shows a 404       | DNS at the registrar isn't pointing at GitHub Pages yet — see CNAME / A records.   |

For anything else, ping Ben.
