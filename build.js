/* ============================================================
   build.js — assembles the deployable site into ./public
   Run by:  npm run build   (and automatically before deploy)
   Steps:
     1. Regenerate index.html from content.json
     2. Copy everything the live site + editor need into ./public
   Cloudflare Pages (via Wrangler) serves the ./public folder.
   ============================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const OUT = path.join(ROOT, "public");

// 1) Clean + create the output folder
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 2) Build index.html from content.json
const SiteGen = require("./site-generate.js");
const content = JSON.parse(fs.readFileSync(path.join(ROOT, "content.json"), "utf8"));
fs.writeFileSync(path.join(OUT, "index.html"), SiteGen.buildIndexHtml(content));
fs.writeFileSync(path.join(OUT, "privacy.html"), SiteGen.buildPrivacyHtml(content));
console.log("Built  index.html");

// 3) Copy the files the public site and the editor rely on
["content.json", "admin.html", "site-generate.js", "_headers", "_redirects", "favicon.ico", "robots.txt"].forEach(function (f) {
  var src = path.join(ROOT, f);
  if (fs.existsSync(src)) { fs.copyFileSync(src, path.join(OUT, f)); console.log("Copied " + f); }
});

// 4) Copy all images and logos
var imgCount = 0;
fs.readdirSync(ROOT).forEach(function (f) {
  if (/\.(jpe?g|png|svg|webp|gif|ico|avif)$/i.test(f)) {
    fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
    imgCount++;
  }
});
console.log("Copied " + imgCount + " image(s)");
console.log("Done  ->  ./public");
