# The Gordon Hotel — site editor (backend)

GitHub Pages only serves files, it can't run a server or database. So instead of a traditional backend, your site now has a **built-in editor that publishes straight to GitHub**. No hosting fees, no separate server, nothing to maintain.

## The pieces

- **index.html** — the public website (fast, static, what visitors see).
- **content.json** — all your content: menu, specials, hours, contact. This is the bit that gets edited.
- **site-generate.js** — turns `content.json` into `index.html`.
- **admin.html** — the editor. You open it, change things, hit Publish.
- **.github/workflows/build-site.yml** — the auto-rebuild step (the "wrangler" bit — explained below).

You only ever touch **admin.html**. Never hand-edit `index.html` — it gets rebuilt automatically.

## One-time setup

1. Upload the new files to your repo (same place as `index.html`): **admin.html**, **site-generate.js**, **content.json**, and the **.github** folder (for automatic rebuilds — see below). You can also replace `index.html` with the new one — either way it gets rebuilt on your first publish.
2. Create a GitHub token so the editor can save for you:
   - GitHub → your photo (top right) → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
   - Name it "Gordon Hotel site", pick an expiry.
   - **Repository access** → **Only select repositories** → choose **Gordon-Hotel-Website**.
   - **Permissions** → **Repository permissions** → **Contents** → **Read and write**.
   - **Generate token** and copy it.
3. Open your editor at **https://va-ward.github.io/Gordon-Hotel-Website/admin.html**, go to the **Publish** tab, and paste the token in.

## Day-to-day use

Open the admin link, make your changes, then:

- **Preview** — see exactly how it'll look before going live.
- **Publish** — saves to GitHub; the live site updates in about a minute.

Your edits auto-save in your browser as you go, so you won't lose work if you close the tab before publishing.

What you can edit: business details and all the front-page wording (Business & text tab), the What's On specials including reordering and photos (Specials tab), the full menu — tabs, sections, items, prices, tags and dish photos (Menu tab), and opening hours including the live "open now" badge schedule (Hours tab).

## Photos

In any special or menu item, click **Upload / replace photo**. With your token set, it shrinks the photo for the web and uploads it for you automatically. Without a token, it saves the photo to your Downloads so you can add it to the repo yourself.

## Contact form & Google reviews

Both live in the editor under the **Contact & reviews** tab.

**Contact form.** Messages are delivered to your inbox by Web3Forms, which is free and has no dashboard to babysit. Go to web3forms.com, enter the pub's email (gordonhotel3345@gmail.com) and they email you an access key. Paste that key into the editor and on-site sending switches on. Until you add a key the form still works — it just opens the visitor's email app with their message pre-filled.

**Google review link.** Paste your "write a review" link and the gold *Leave a Google review* button points straight at it. Easiest way to get the link: in your Google Business Profile choose **Ask for reviews** and copy the short link. Leave it blank and the button just opens the pub on Google Maps.

**Reviews wall.** This uses SociableKit (free). On sociablekit.com, create a "Google Reviews" widget, connect the pub's Google listing, and copy the embed ID (the number in their embed code). Paste that number into the editor and a live wall of your real reviews appears on the page. It refreshes itself — new reviews show up on their own, nothing for you to do.

You can switch either section off with its tick-box if you're not ready to use it yet.

## Automatic rebuilds (the "wrangler" bit)

Quick clarification: **Wrangler** is Cloudflare's tool (its config file is `wrangler.toml`), and it only applies if your site is hosted on Cloudflare. Yours is on **GitHub Pages**, so the right tool for the same job — a config file in the repo that auto-updates the live site — is a **GitHub Actions workflow**. That's the file at `.github/workflows/build-site.yml`.

What it does: whenever `content.json` changes, GitHub automatically rebuilds `index.html` and publishes it. So even if the content is edited directly on GitHub (not through the editor), the live site still updates on its own. When you publish from the editor it already does this for you, so the workflow is a safety net that keeps everything in sync no matter how a change is made.

To turn it on: upload the **.github** folder to your repo (keep the folders exactly as named), then in GitHub go to **Settings → Actions → General → Workflow permissions** and choose **Read and write permissions**, and Save. That's a one-time click.

If you'd actually prefer to move hosting to Cloudflare and use a real `wrangler` setup, that's a separate job — say the word and I'll set it up.

## No token? (manual option)

You don't have to use a token. In the Publish tab, hit **Download index.html** and **Download content.json**, then upload those two files to your repo by hand. Same result, just a couple more clicks.

## About the token (security)

The token lets the editor write to this one repository only. It's stored in your browser, never sent anywhere except GitHub, and never shared with anyone. Leave "Remember on this device" unticked on shared computers, and use **Clear token** when you're done. If a token is ever lost, delete it on GitHub and make a new one.

Made for David Hudson / The Gordon Hotel.
