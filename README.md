# subframe.media

Jekyll source for [subframe.media](https://subframe.media), hosted via GitHub Pages from the `main` branch of `subframe-media/subframe-media.github.io`.

## Editing content

Almost all content lives in `_data/`:

| File                  | What it controls                                  |
| --------------------- | -------------------------------------------------- |
| `_data/videos.yml`    | The video gallery (Vimeo id, title, description, category, featured flag) |
| `_data/team.yml`      | Bios on the *Who We Are* page                      |
| `_data/site_meta.yml` | Email + social links shown in the footer + contact |
| `_data/nav.yml`       | Top navigation                                     |

### Adding a new video

1. Append a new block to `_data/videos.yml`:
   ```yaml
   - id: "1234567890"
     slug: "new-project"
     title: "New Project"
     description: "Short blurb."
     category: "commercial"
     year: 2026
     featured: true        # surfaces on the home page grid
   ```
2. Run `bin/fetch-thumbs.sh` to download the poster image.
3. Commit and push.

## Running locally

```sh
bundle install
bundle exec jekyll serve
# open http://localhost:4000
```

## Architecture

* **Static thumbnails** are committed under `assets/img/thumbs/{vimeo-id}.jpg` — fetched by `bin/fetch-thumbs.sh` (not run by GitHub Pages).
* **Video tiles** show the poster by default; on hover (desktop), JS swaps in a `?background=1` Vimeo iframe for a muted looping preview. On click, the shared lightbox opens with the full player.
* **Styles** are hand-rolled SCSS in `_sass/` and compiled by Jekyll's built-in Sass converter.
* **No build step** outside `bundle exec jekyll build`.
