# Happy Birthday, Yassmine — a small digital gift

A static website (HTML, CSS, vanilla JavaScript). No build step, no dependencies.

```
birthday-website/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/   (favicon, song artwork, movie poster artwork)
│   └── fonts/
└── README.md
```

## Publish it for free with GitHub Pages

1. Sign in at [github.com](https://github.com) and click **New repository**. Name it, for example, `yassmine-birthday`. Keep it **Public** (free Pages requires this) and create it.
2. On the new repository page click **uploading an existing file**.
3. Drag in the **contents** of the `birthday-website` folder: `index.html`, `style.css`, `script.js`, `README.md` and the whole `assets` folder. `index.html` must sit at the top level of the repository, not inside another folder.
4. Click **Commit changes**.
5. Open **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch **main** and folder **/ (root)**, then click **Save**.
6. Wait 1–2 minutes and refresh. Your link will be:
   `https://YOUR-USERNAME.github.io/yassmine-birthday/`

All paths are relative, so it works in a repository subfolder like this. Send her the link. It is built for iPhone first.

## Good to know

- **Song:** the site does not play audio itself. The button opens YouTube (a search for *Adele Lovesong Lyric Video*), so there is no pretend player.
- **Trailer:** the button opens a YouTube search for the *Death Proof 2007 official trailer*.
- **Movie poster:** the page shows original placeholder artwork. To use the real poster, save an image as `assets/images/poster.jpg` (portrait, about 2:3) and it is picked up automatically.
- **IMDb rating** (7.0/10) was checked on IMDb on 2 November 2026 and can drift over time.
- **Fonts** load from Google Fonts; offline, system fonts take over.
- To test locally, just double-click `index.html`.
