import { createRequire } from "module";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode");
const puppeteer = require("puppeteer-core");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const PUBLIC_PRINT = path.join(ROOT, "public/print");
const DOCS_PRINT = path.join(ROOT, "docs/print");
const CHROME = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";

const NAVY = "#00214D";
const GREEN = "#00A878";
const WHITE = "#FFFFFF";

const STAFF = [
  { name: "Maria Santos", code: "maria-santos", photo: "navy" },
  { name: "James Okonkwo", code: "james-okonkwo", photo: "green" },
  { name: "Elena Rossi", code: "elena-rossi", photo: "ring" },
];

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "GT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function fontFace(family, weight, filePath) {
  const bytes = await readFile(filePath);
  return `@font-face{font-family:${family};font-weight:${weight};font-style:normal;src:url(data:font/truetype;base64,${bytes.toString("base64")}) format("truetype");}`;
}

function markSvg(stroke = NAVY, size = 32) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" aria-hidden="true">
  <g fill="${GREEN}">
    <path d="M 158.425 50.613 L 157.249 50.366 L 156.016 50.197 L 154.725 50.102 L 153.374 50.079 L 151.962 50.127 L 150.491 50.244 L 148.959 50.430 L 147.367 50.684 L 145.715 51.005 L 144.006 51.393 L 142.239 51.848 L 140.418 52.368 L 138.543 52.952 L 136.617 53.602 L 134.642 54.314 L 132.620 55.089 L 130.555 55.926 L 128.447 56.823 L 126.301 57.780 L 124.119 58.794 L 121.904 59.865 L 119.659 60.991 L 117.387 62.171 L 115.091 63.403 L 112.774 64.685 L 110.440 66.016 L 108.091 67.394 L 105.731 68.816 L 103.363 70.281 L 100.991 71.787 L 98.617 73.331 L 96.246 74.912 L 93.879 76.527 L 91.522 78.174 L 89.176 79.851 L 86.846 81.555 L 84.535 83.284 L 82.245 85.035 L 79.980 86.806 L 77.744 88.594 L 75.538 90.398 L 73.368 92.214 L 71.234 94.039 L 69.141 95.872 L 67.092 97.709 L 65.089 99.548 L 63.134 101.386 L 61.232 103.221 L 59.384 105.050 L 57.593 106.871 L 55.861 108.680 L 54.191 110.476 L 52.585 112.256 L 51.046 114.016 L 49.574 115.756 L 48.173 117.472 L 46.844 119.162 L 45.589 120.823 L 44.409 122.453 L 43.305 124.051 L 42.280 125.613 L 41.333 127.139 L 40.466 128.625 L 39.680 130.070 L 38.975 131.473 L 38.351 132.833 L 37.809 134.148 L 37.349 135.418 L 36.970 136.642 L 36.672 137.822 L 36.456 138.957 L 36.321 140.052 L 36.269 141.107 L 36.302 142.125 L 36.422 143.111 L 36.635 144.067 L 36.946 144.993 L 37.360 145.889 L 37.884 146.752 L 38.520 147.577 L 38.520 147.577 L 37.636 146.993 L 36.816 146.314 L 36.066 145.537 L 35.393 144.661 L 34.805 143.687 L 34.308 142.621 L 33.908 141.467 L 33.608 140.232 L 33.410 138.921 L 33.316 137.541 L 33.326 136.097 L 33.439 134.595 L 33.655 133.038 L 33.972 131.431 L 34.390 129.777 L 34.906 128.079 L 35.520 126.340 L 36.230 124.565 L 37.035 122.754 L 37.932 120.912 L 38.921 119.041 L 39.999 117.144 L 41.166 115.223 L 42.417 113.282 L 43.753 111.323 L 45.170 109.350 L 46.667 107.364 L 48.242 105.369 L 49.891 103.368 L 51.612 101.363 L 53.404 99.358 L 55.263 97.355 L 57.186 95.357 L 59.171 93.367 L 61.215 91.388 L 63.314 89.422 L 65.467 87.473 L 67.669 85.543 L 69.918 83.635 L 72.210 81.752 L 74.542 79.896 L 76.911 78.070 L 79.312 76.277 L 81.744 74.518 L 84.201 72.798 L 86.682 71.118 L 89.181 69.480 L 91.696 67.887 L 94.222 66.342 L 96.757 64.846 L 99.296 63.402 L 101.835 62.011 L 104.372 60.676 L 106.903 59.399 L 109.422 58.181 L 111.928 57.025 L 114.417 55.931 L 116.883 54.903 L 119.325 53.940 L 121.739 53.045 L 124.119 52.219 L 126.465 51.463 L 128.770 50.779 L 131.033 50.167 L 133.249 49.628 L 135.415 49.164 L 137.527 48.774 L 139.583 48.461 L 141.577 48.223 L 143.508 48.063 L 145.370 47.979 L 147.161 47.972 L 148.877 48.043 L 150.513 48.190 L 152.066 48.413 L 153.531 48.711 L 154.904 49.083 L 156.180 49.526 L 157.355 50.037 L 158.425 50.613 Z"/>
    <path d="M 50.216 141.310 L 49.409 140.833 L 48.712 140.305 L 48.127 139.734 L 47.651 139.127 L 47.281 138.493 L 47.009 137.834 L 46.828 137.150 L 46.728 136.439 L 46.705 135.695 L 46.756 134.912 L 46.881 134.084 L 47.079 133.208 L 47.352 132.282 L 47.701 131.306 L 48.128 130.278 L 48.632 129.200 L 49.215 128.072 L 49.875 126.898 L 50.614 125.678 L 51.430 124.414 L 52.322 123.109 L 53.290 121.765 L 54.333 120.383 L 55.447 118.968 L 56.634 117.520 L 57.889 116.042 L 59.212 114.537 L 60.600 113.007 L 62.052 111.456 L 63.565 109.884 L 65.137 108.296 L 66.765 106.693 L 68.446 105.079 L 70.178 103.456 L 71.959 101.826 L 73.785 100.192 L 75.653 98.558 L 77.561 96.925 L 79.505 95.297 L 81.482 93.675 L 83.490 92.063 L 85.524 90.463 L 87.582 88.878 L 89.660 87.310 L 91.756 85.762 L 93.865 84.237 L 95.984 82.736 L 98.110 81.263 L 100.239 79.819 L 102.368 78.407 L 104.494 77.029 L 106.613 75.687 L 108.722 74.384 L 110.818 73.122 L 112.896 71.902 L 114.954 70.726 L 116.989 69.597 L 118.997 68.516 L 120.976 67.485 L 122.921 66.505 L 124.830 65.578 L 126.701 64.705 L 128.529 63.888 L 130.313 63.128 L 132.050 62.425 L 133.737 61.782 L 135.372 61.198 L 136.952 60.674 L 138.476 60.212 L 139.941 59.811 L 141.347 59.473 L 142.691 59.197 L 143.974 58.985 L 145.194 58.835 L 146.351 58.750 L 147.446 58.729 L 148.481 58.774 L 149.457 58.888 L 150.376 59.072 L 151.239 59.332 L 151.239 59.332 L 150.490 58.805 L 149.632 58.334 L 148.673 57.926 L 147.615 57.584 L 146.466 57.311 L 145.228 57.108 L 143.908 56.977 L 142.508 56.918 L 141.033 56.931 L 139.487 57.016 L 137.872 57.173 L 136.193 57.401 L 134.452 57.701 L 132.653 58.070 L 130.800 58.509 L 128.895 59.016 L 126.942 59.591 L 124.944 60.232 L 122.905 60.939 L 120.828 61.710 L 118.716 62.543 L 116.573 63.438 L 114.403 64.393 L 112.209 65.406 L 109.995 66.476 L 107.764 67.601 L 105.519 68.778 L 103.266 70.007 L 101.007 71.284 L 98.746 72.609 L 96.486 73.978 L 94.231 75.390 L 91.986 76.842 L 89.753 78.332 L 87.536 79.857 L 85.339 81.415 L 83.166 83.004 L 81.019 84.621 L 78.902 86.264 L 76.820 87.929 L 74.774 89.614 L 72.768 91.317 L 70.807 93.034 L 68.892 94.763 L 67.027 96.501 L 65.215 98.246 L 63.459 99.994 L 61.762 101.743 L 60.126 103.491 L 58.554 105.233 L 57.050 106.968 L 55.614 108.693 L 54.250 110.406 L 52.960 112.102 L 51.747 113.781 L 50.611 115.439 L 49.556 117.074 L 48.583 118.682 L 47.693 120.263 L 46.890 121.813 L 46.173 123.330 L 45.546 124.812 L 45.009 126.255 L 44.564 127.659 L 44.214 129.020 L 43.958 130.336 L 43.801 131.603 L 43.742 132.819 L 43.784 133.978 L 43.929 135.076 L 44.177 136.105 L 44.526 137.058 L 44.974 137.925 L 45.515 138.699 L 46.138 139.374 L 46.835 139.948 L 47.596 140.423 L 48.415 140.804 L 49.289 141.098 L 50.216 141.310 Z"/>
    <circle cx="158.425" cy="50.613" r="6.3"/>
    <circle cx="50.216" cy="141.310" r="6.3"/>
  </g>
  <g fill="none" stroke="${stroke}" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="100" cy="100" r="38"/>
    <ellipse cx="100" cy="100" rx="14.440" ry="38"/>
    <path d="M 64.851 85.560 Q 100.000 79.480 135.149 85.560"/>
    <path d="M 64.851 114.440 Q 100.000 120.520 135.149 114.440"/>
  </g>
</svg>`;
}

function wordmark(sizeClass = "") {
  return `<span class="wordmark ${sizeClass}"><span class="globo">Globo</span><span class="tips">Tips</span></span>`;
}

function logoLockup(markSize, extraClass = "") {
  return `<span class="logo ${extraClass}">${markSvg(NAVY, markSize)}${wordmark()}</span>`;
}

function photoBlock(staff, compact) {
  if (!staff) {
    return `<div class="photo photo-empty${compact ? " compact" : ""}" aria-label="Photo placeholder">
      <span>Photo</span>
    </div>`;
  }
  return `<div class="photo photo-${staff.photo}${compact ? " compact" : ""}" aria-label="Photo placeholder for ${escapeHtml(staff.name)}">
    <span>${initials(staff.name)}</span>
  </div>`;
}

function qrBlock(staff, qrDataUrl) {
  if (!staff) {
    return `<div class="qr-panel">
      <p class="scan-label">This person’s QR</p>
      <div class="qr-empty">
        <span>Print a unique QR<br>for this staff member</span>
      </div>
      <p class="qr-url">globotips.com/tip/<span class="blank">name</span></p>
      <p class="qr-note">One person. One code. Not a hotel-wide QR.</p>
    </div>`;
  }
  return `<div class="qr-panel">
    <p class="scan-label">Scan to tip</p>
    <img class="qr-img" src="${qrDataUrl}" alt="QR code for ${escapeHtml(staff.name)}" />
    <p class="qr-url">globotips.com/tip/${escapeHtml(staff.code)}</p>
  </div>`;
}

function deskCardFace(staff, qrDataUrl, sizeName) {
  const name = staff ? escapeHtml(staff.name) : "Staff name";
  return `<article class="desk ${sizeName}${staff ? "" : " is-template"}">
    <div class="band"></div>
    <header class="head">
      ${logoLockup(sizeName === "size-4x6" ? 28 : 34)}
      <p class="head-meta">Room desk card</p>
    </header>
    <div class="body">
      <div class="copy">
        ${photoBlock(staff, sizeName === "size-4x6")}
        <h1 class="${staff ? "" : "name-blank"}">${name}</h1>
        <p class="who">Tip this person</p>
        <p class="cash">You can still leave cash, or scan the QR — whichever is convenient. No app needed.</p>
      </div>
      ${qrBlock(staff, qrDataUrl)}
    </div>
    <footer class="foot">
      ${markSvg(NAVY, sizeName === "size-4x6" ? 18 : 22)}
      <p>Tips go to this person. The hotel does not handle the money.</p>
    </footer>
  </article>`;
}

function sharedCss(fontCss) {
  return `${fontCss}
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: ${WHITE}; color: ${NAVY}; }
    body {
      font-family: Inter, ui-sans-serif, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .logo, .wordmark { display: inline-flex; align-items: center; }
    .logo { gap: 0.09in; }
    .logo svg { display: block; flex: 0 0 auto; }
    .wordmark { font-weight: 700; letter-spacing: -0.03em; line-height: 1; white-space: nowrap; }
    .globo { color: ${NAVY}; }
    .tips { color: ${GREEN}; }

    .desk {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: ${NAVY};
    }
    .size-5x7 { width: 7in; height: 5in; }
    .size-4x6 { width: 6in; height: 4in; }
    .band { height: 0.22in; background: ${GREEN}; flex: 0 0 auto; }
    .size-4x6 .band { height: 0.16in; }
    .head, .foot {
      background: ${WHITE};
      display: flex;
      align-items: center;
      flex: 0 0 auto;
    }
    .head {
      justify-content: space-between;
      padding: 0 0.32in;
      height: 0.64in;
    }
    .size-4x6 .head { height: 0.52in; padding: 0 0.24in; }
    .head .wordmark { font-size: 22px; }
    .size-4x6 .head .wordmark { font-size: 18px; }
    .head-meta {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${NAVY};
    }
    .body {
      flex: 1 1 auto;
      display: grid;
      grid-template-columns: 1fr 3.08in;
      gap: 0.22in;
      padding: 0.26in 0.32in 0.2in;
      min-height: 0;
    }
    .size-4x6 .body {
      grid-template-columns: 1fr 2.42in;
      gap: 0.16in;
      padding: 0.16in 0.24in 0.12in;
    }
    .copy { color: ${WHITE}; display: flex; flex-direction: column; min-width: 0; }
    .photo {
      width: 0.78in;
      height: 0.78in;
      border-radius: 50%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      color: ${WHITE};
      font-weight: 700;
      font-size: 22px;
      letter-spacing: -0.03em;
      line-height: 1;
      margin-bottom: 0.14in;
    }
    .photo span { margin-bottom: 0.16in; }
    .photo.compact { width: 0.58in; height: 0.58in; font-size: 16px; margin-bottom: 0.1in; }
    .photo.compact span { margin-bottom: 0.12in; }
    .photo-navy { background: ${WHITE}; color: ${NAVY}; }
    .photo-green { background: ${GREEN}; color: ${WHITE}; }
    .photo-ring { background: ${WHITE}; color: ${NAVY}; box-shadow: 0 0 0 0.045in ${GREEN}; }
    .photo-empty {
      background: transparent;
      border: 0.018in dashed ${WHITE};
      color: ${WHITE};
      align-items: center;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .photo-empty span { margin: 0; }
    .copy h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.035em;
      line-height: 1.05;
    }
    .size-4x6 .copy h1 { font-size: 22px; }
    .name-blank {
      border-bottom: 0.018in solid ${WHITE};
      padding-bottom: 0.06in;
      opacity: 0.92;
    }
    .who {
      margin-top: 0.06in;
      color: ${GREEN};
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .size-4x6 .who { font-size: 9px; }
    .cash {
      margin-top: auto;
      padding-top: 0.16in;
      font-size: 13.5px;
      font-weight: 500;
      line-height: 1.35;
      max-width: 2.85in;
    }
    .size-4x6 .cash { font-size: 11px; padding-top: 0.1in; max-width: 2.3in; }
    .qr-panel {
      background: ${WHITE};
      border-radius: 0.1in;
      padding: 0.14in 0.12in 0.12in;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 0;
    }
    .scan-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: ${GREEN};
      margin-bottom: 0.06in;
    }
    .qr-img { width: 2.42in; height: 2.42in; display: block; }
    .size-4x6 .qr-img { width: 1.88in; height: 1.88in; }
    .qr-empty {
      width: 2.42in;
      height: 2.42in;
      border: 0.02in dashed ${NAVY};
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0.16in;
      color: ${NAVY};
      font-size: 13px;
      font-weight: 600;
      line-height: 1.35;
    }
    .size-4x6 .qr-empty { width: 1.88in; height: 1.88in; font-size: 11px; }
    .qr-url {
      margin-top: 0.07in;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: ${NAVY};
    }
    .size-4x6 .qr-url { font-size: 8px; }
    .qr-url .blank {
      border-bottom: 0.012in solid ${NAVY};
      padding: 0 0.12in 0.01in;
    }
    .qr-note {
      margin-top: 0.05in;
      font-size: 8px;
      font-weight: 600;
      color: ${NAVY};
      text-align: center;
      line-height: 1.3;
    }
    .foot {
      gap: 0.1in;
      height: 0.46in;
      padding: 0 0.32in;
    }
    .size-4x6 .foot { height: 0.38in; padding: 0 0.24in; gap: 0.08in; }
    .foot svg { flex: 0 0 auto; }
    .foot p {
      font-size: 10px;
      font-weight: 600;
      line-height: 1.25;
      color: ${NAVY};
    }
    .size-4x6 .foot p { font-size: 8.5px; }

    .tent { width: 7in; height: 10in; background: ${WHITE}; }
    .tent-face { width: 7in; height: 5in; }
    .tent-top { transform: rotate(180deg); box-shadow: inset 0 -0.75pt 0 0 ${GREEN}; }
    .tent-hint {
      display: none;
    }

    .onepager {
      width: 8.5in;
      height: 11in;
      padding: 0.62in 0.7in 0.5in;
      display: flex;
      flex-direction: column;
      background: ${WHITE};
    }
    .onepager .topbar {
      height: 0.16in;
      background: ${GREEN};
      margin: -0.62in -0.7in 0.36in;
    }
    .onepager .eyebrow {
      margin-top: 0.22in;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${GREEN};
    }
    .onepager h1 {
      margin-top: 0.14in;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.08;
      max-width: 7.1in;
    }
    .onepager .lede {
      margin-top: 0.22in;
      font-size: 14.5px;
      font-weight: 500;
      line-height: 1.45;
      max-width: 6.3in;
    }
    .onepager .founders {
      margin-top: 0.16in;
      font-size: 13px;
      font-weight: 500;
    }
    .onepager .founders strong { font-weight: 700; }
    .steps {
      margin-top: 0.38in;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.28in;
    }
    .steps h2 {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${GREEN};
      margin-bottom: 0.18in;
      grid-column: 1 / -1;
    }
    .step-num {
      font-size: 12px;
      font-weight: 700;
      color: ${GREEN};
      letter-spacing: 0.08em;
    }
    .step h3 {
      margin-top: 0.08in;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.03em;
    }
    .step p {
      margin-top: 0.08in;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.4;
    }
    .offer {
      margin-top: 0.4in;
      background: ${NAVY};
      color: ${WHITE};
      padding: 0.32in 0.36in;
    }
    .offer h2 {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${GREEN};
    }
    .offer ul {
      margin-top: 0.16in;
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.1in 0.3in;
    }
    .offer li {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.35;
    }
    .bottom {
      margin-top: 0.36in;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 0.4in;
    }
    .bottom h2 {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${GREEN};
    }
    .bottom p {
      margin-top: 0.1in;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }
    .onepager .contact {
      margin-top: auto;
      padding-top: 0.28in;
      border-top: 0.018in solid ${NAVY};
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 0.2in;
    }
    .contact .who-line {
      font-size: 14px;
      font-weight: 700;
    }
    .contact .details {
      margin-top: 0.04in;
      font-size: 12px;
      font-weight: 500;
    }
    .contact .url {
      font-size: 14px;
      font-weight: 700;
      color: ${GREEN};
    }

    .biz {
      width: 3.75in;
      height: 2.25in;
      background: ${WHITE};
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .biz-trim {
      width: 3.5in;
      height: 2in;
    }
    .biz .bleed-band {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0.28in;
      background: ${GREEN};
    }
    .biz .bleed-rail {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 0.28in;
      background: ${NAVY};
    }
    .biz-body {
      position: relative;
      flex: 1;
      padding: 0.34in 0.28in 0.26in 0.42in;
      display: flex;
      flex-direction: column;
    }
    .biz-trim .bleed-band { height: 0.16in; }
    .biz-trim .bleed-rail { width: 0.14in; }
    .biz-trim .biz-body { padding: 0.22in 0.16in 0.14in 0.28in; }
    .biz .wordmark { font-size: 20px; }
    .biz-trim .wordmark { font-size: 18px; }
    .biz h1 {
      margin-top: auto;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .biz .role {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${GREEN};
      margin-top: 0.03in;
    }
    .biz .phone {
      margin-top: 0.08in;
      font-size: 11px;
      font-weight: 500;
    }
    .biz .site {
      font-size: 12px;
      font-weight: 700;
      color: ${GREEN};
    }
    .biz-back .biz-body {
      flex-direction: row;
      align-items: center;
      gap: 0.16in;
    }
    .biz-qr {
      width: 1.05in;
      height: 1.05in;
      display: block;
      flex: 0 0 auto;
      background: ${WHITE};
    }
    .biz-trim .biz-qr { width: 0.95in; height: 0.95in; }
    .biz-back .back-copy {
      min-width: 0;
    }
    .biz-back .line {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.015em;
    }
    .biz-back .site {
      margin-top: 0.1in;
      display: block;
    }
    .sheet {
      width: 8.5in;
      height: 11in;
      background: ${WHITE};
      position: relative;
    }
    .sheet-grid {
      position: absolute;
      top: 0.5in;
      left: 0.75in;
      width: 7in;
      height: 10in;
      display: grid;
      grid-template-columns: 3.5in 3.5in;
      grid-template-rows: repeat(5, 2in);
    }
    .sheet-grid.mirror {
      direction: rtl;
    }
    .sheet-grid.mirror > * { direction: ltr; }
    .sheet .marks {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .sheet .mark {
      position: absolute;
      background: ${NAVY};
    }
    .sheet .hint {
      position: absolute;
      top: 0.18in;
      left: 0.75in;
      font-size: 8px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${NAVY};
    }
    .sheet .hint-right {
      left: auto;
      right: 0.75in;
    }
  `;
}

function pageWrap(css, pageSize, body) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    ${css}
    @page { size: ${pageSize}; margin: 0; }
    html, body { width: ${pageSize.split(" ")[0]}; }
    .print-page { page-break-after: always; break-after: page; }
    .print-page:last-child { page-break-after: auto; break-after: auto; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

function deskHtml(css, staff, qrDataUrl, sizeName) {
  const pageSize = sizeName === "size-4x6" ? "6in 4in" : "7in 5in";
  return pageWrap(css, pageSize, deskCardFace(staff, qrDataUrl, sizeName));
}

function tentHtml(css, staff, qrDataUrl) {
  const face = deskCardFace(staff, qrDataUrl, "size-5x7");
  return pageWrap(
    css,
    "7in 10in",
    `<div class="tent">
      <div class="tent-face tent-top">${face}</div>
      <div class="tent-face">${face}</div>
    </div>`,
  );
}

function onePagerHtml(css) {
  return pageWrap(
    css,
    "8.5in 11in",
    `<article class="onepager">
      <div class="topbar"></div>
      ${logoLockup(42)}
      <p class="eyebrow">For a hotel meeting</p>
      <h1>Staff lose cash tips.<br>This costs the hotel nothing to try.</h1>
      <p class="lede">Guests can still leave cash on the desk. Or they open the camera already on their phone, scan a QR, and tip the person who helped them. There is no guest app. The hotel never holds the money.</p>
      <p class="founders">Founded by <strong>Rosalie Dudkiewicz</strong> and <strong>Dariusz Dudkiewicz</strong>.</p>
      <section class="steps">
        <h2>Three steps</h2>
        <div class="step">
          <p class="step-num">01</p>
          <h3>Add staff</h3>
          <p>The property adds each person. Each one gets a unique tip code.</p>
        </div>
        <div class="step">
          <p class="step-num">02</p>
          <h3>Print their QR</h3>
          <p>A desk card sits where cash tips are left. One person, one QR. Not a hotel-wide code.</p>
        </div>
        <div class="step">
          <p class="step-num">03</p>
          <h3>Guests tip that person</h3>
          <p>Cash or scan — whichever is convenient. The tip goes to that person.</p>
        </div>
      </section>
      <section class="offer">
        <h2>The offer</h2>
        <ul>
          <li>Free 60-day trial</li>
          <li>No monthly fee</li>
          <li>About 3% from the tip</li>
          <li>No guest surcharge</li>
          <li>Hotel never holds funds</li>
          <li>No guest app to install</li>
        </ul>
      </section>
      <section class="bottom">
        <div>
          <h2>Who it is for</h2>
          <p>Hotels first. The same card also works for tour guides and cruise staff. The ask today is one Tampa property for the pilot.</p>
        </div>
        <div>
          <h2>The ask</h2>
          <p>Try it on one property. Add staff, print their cards, and see if guests use them.</p>
        </div>
      </section>
      <footer class="contact">
        <div>
          <p class="who-line">Dariusz Dudkiewicz</p>
          <p class="details">973-271-4228 · woboe1962@gmail.com</p>
        </div>
        <p class="url">globotips.com</p>
      </footer>
    </article>`,
  );
}

function businessCardFace(side, siteQr, { trim = false, paged = true } = {}) {
  const sizeClass = `${trim ? " biz-trim" : ""}${paged ? " print-page" : ""}`;
  if (side === "back") {
    return `<article class="biz biz-back${sizeClass}">
      <div class="bleed-band"></div>
      <div class="bleed-rail"></div>
      <div class="biz-body">
        <img class="biz-qr" src="${siteQr}" alt="QR code for globotips.com" />
        <div class="back-copy">
          ${logoLockup(trim ? 22 : 24)}
          <p class="line">Cashless tips for hotel staff, tour guides, and cruise staff.</p>
          <span class="site">globotips.com</span>
        </div>
      </div>
    </article>`;
  }
  return `<article class="print-page biz${sizeClass}">
    <div class="bleed-band"></div>
    <div class="bleed-rail"></div>
    <div class="biz-body">
      ${logoLockup(trim ? 28 : 32)}
      <h1>Dariusz Dudkiewicz</h1>
      <p class="role">Co-founder</p>
      <p class="site">globotips.com</p>
      <p class="phone">973-271-4228</p>
    </div>
  </article>`;
}

function cropMarks() {
  const marks = [];
  const xs = [0.75, 4.25, 7.75];
  const ys = [0.5, 2.5, 4.5, 6.5, 8.5, 10.5];
  for (const x of xs) {
    for (const y of ys) {
      marks.push(`<span class="mark" style="left:${x - 0.12}in;top:${y}in;width:0.1in;height:0.5pt"></span>`);
      marks.push(`<span class="mark" style="left:${x + 0.02}in;top:${y}in;width:0.1in;height:0.5pt"></span>`);
      marks.push(`<span class="mark" style="top:${y - 0.12}in;left:${x}in;height:0.1in;width:0.5pt"></span>`);
      marks.push(`<span class="mark" style="top:${y + 0.02}in;left:${x}in;height:0.1in;width:0.5pt"></span>`);
    }
  }
  return marks.join("");
}

function businessCardHtml(css, siteQr) {
  return pageWrap(
    css,
    "3.75in 2.25in",
    `${businessCardFace("front", siteQr)}
     ${businessCardFace("back", siteQr)}`,
  );
}

function businessCardSheetHtml(css, siteQr) {
  const fronts = Array.from({ length: 10 }, () =>
    businessCardFace("front", siteQr, { trim: true, paged: false }),
  ).join("");
  const backs = Array.from({ length: 10 }, () =>
    businessCardFace("back", siteQr, { trim: true, paged: false }),
  ).join("");
  return pageWrap(
    css,
    "8.5in 11in",
    `<section class="print-page sheet">
      <p class="hint">Front · 10-up · trim 3.5 × 2 in · cut on marks</p>
      <div class="marks">${cropMarks()}</div>
      <div class="sheet-grid">${fronts}</div>
    </section>
    <section class="print-page sheet">
      <p class="hint hint-right">Back · duplex flip on long edge</p>
      <div class="marks">${cropMarks()}</div>
      <div class="sheet-grid mirror">${backs}</div>
    </section>`,
  );
}

async function makeQr(code) {
  return QRCode.toDataURL(`https://globotips.com/tip/${code}`, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 900,
    color: { dark: NAVY, light: WHITE },
  });
}

function parsePageSize(pageSize) {
  const [w, h] = pageSize.split(" ");
  const toPx = (value) => Math.round(parseFloat(value) * 96);
  return { width: toPx(w), height: toPx(h) };
}

async function render(page, html, pageSize, pdfPath, pngPath, options = {}) {
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluateHandle("document.fonts.ready");
  const { width, height } = parsePageSize(pageSize);
  const scale = options.scale ?? 2;
  await page.setViewport({ width, height, deviceScaleFactor: scale });
  await page.pdf({
    path: pdfPath,
    width: pageSize.split(" ")[0],
    height: pageSize.split(" ")[1],
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    pageRanges: options.pageRanges ?? "1",
  });
  if (pngPath) {
    await page.screenshot({ path: pngPath, type: "png", omitBackground: false });
  }
}

async function main() {
  await mkdir(PUBLIC_PRINT, { recursive: true });
  await mkdir(DOCS_PRINT, { recursive: true });

  const fontCss = [
    await fontFace("Inter", 400, "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"),
    await fontFace("Inter", 500, "/usr/share/fonts/truetype/macos/Inter-Medium.ttf"),
    await fontFace("Inter", 600, "/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf"),
    await fontFace("Inter", 700, "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"),
  ].join("");
  const css = sharedCss(fontCss);

  const qrs = Object.fromEntries(
    await Promise.all(STAFF.map(async (staff) => [staff.code, await makeQr(staff.code)])),
  );
  const siteQr = await QRCode.toDataURL("https://globotips.com", {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 700,
    color: { dark: NAVY, light: WHITE },
  });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--font-render-hinting=none"],
  });
  const page = await browser.newPage();

  const jobs = [];

  for (const staff of [null, ...STAFF]) {
    const slug = staff ? staff.code : "template";
    const qr = staff ? qrs[staff.code] : "";
    jobs.push({
      html: deskHtml(css, staff, qr, "size-5x7"),
      pageSize: "7in 5in",
      pdf: path.join(PUBLIC_PRINT, `desk-card-5x7-${slug}.pdf`),
      png:
        slug === "template" || slug === "maria-santos"
          ? path.join(DOCS_PRINT, `desk-card-5x7-${slug}.png`)
          : path.join(PUBLIC_PRINT, `desk-card-5x7-${slug}.png`),
    });
    jobs.push({
      html: deskHtml(css, staff, qr, "size-4x6"),
      pageSize: "6in 4in",
      pdf: path.join(PUBLIC_PRINT, `desk-card-4x6-${slug}.pdf`),
      png:
        slug === "maria-santos"
          ? path.join(DOCS_PRINT, `desk-card-4x6-${slug}.png`)
          : undefined,
    });
    jobs.push({
      html: tentHtml(css, staff, qr),
      pageSize: "7in 10in",
      pdf: path.join(PUBLIC_PRINT, `desk-card-table-tent-5x7-${slug}.pdf`),
      png:
        slug === "maria-santos"
          ? path.join(DOCS_PRINT, `desk-card-table-tent-5x7-${slug}.png`)
          : undefined,
    });
  }

  jobs.push({
    html: onePagerHtml(css),
    pageSize: "8.5in 11in",
    pdf: path.join(PUBLIC_PRINT, "hotel-one-pager.pdf"),
    png: path.join(DOCS_PRINT, "hotel-one-pager.png"),
  });
  jobs.push({
    html: pageWrap(css, "3.75in 2.25in", businessCardFace("front", siteQr)),
    pageSize: "3.75in 2.25in",
    pdf: path.join(PUBLIC_PRINT, "business-card-front.pdf"),
    png: path.join(DOCS_PRINT, "business-card-front.png"),
    scale: 300 / 96,
  });
  jobs.push({
    html: pageWrap(css, "3.75in 2.25in", businessCardFace("back", siteQr)),
    pageSize: "3.75in 2.25in",
    pdf: path.join(PUBLIC_PRINT, "business-card-back.pdf"),
    png: path.join(DOCS_PRINT, "business-card-back.png"),
    scale: 300 / 96,
  });
  jobs.push({
    html: businessCardHtml(css, siteQr),
    pageSize: "3.75in 2.25in",
    pdf: path.join(PUBLIC_PRINT, "business-card.pdf"),
    pageRanges: "1-2",
  });
  jobs.push({
    html: businessCardSheetHtml(css, siteQr),
    pageSize: "8.5in 11in",
    pdf: path.join(PUBLIC_PRINT, "business-card-10up-letter.pdf"),
    png: path.join(DOCS_PRINT, "business-card-10up-letter.png"),
    pageRanges: "1-2",
  });

  for (const job of jobs) {
    await render(page, job.html, job.pageSize, job.pdf, job.png, {
      pageRanges: job.pageRanges,
      scale: job.scale,
    });
    console.log(path.relative(ROOT, job.pdf));
    if (job.png) console.log(path.relative(ROOT, job.png));
  }

  await browser.close();

  for (const extra of ["james-okonkwo", "elena-rossi"]) {
    const src = path.join(PUBLIC_PRINT, `desk-card-5x7-${extra}.png`);
    const dest = path.join(DOCS_PRINT, `desk-card-5x7-${extra}.png`);
    await writeFile(dest, await readFile(src));
  }

  for (const name of [
    "desk-card-5x7-maria-santos.png",
    "desk-card-5x7-template.png",
    "hotel-one-pager.png",
    "business-card-front.png",
    "business-card-back.png",
  ]) {
    await writeFile(path.join(PUBLIC_PRINT, name), await readFile(path.join(DOCS_PRINT, name)));
  }

  console.log("Print kit written.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
