#!/usr/bin/env python3
"""
Focused detail analysis of the K.L LAB reference:
  1. The repeated logo strip (page01_0.jpg) - text bbox, content colors.
  2. Page 1 artwork (page01_1.jpg) - where the red accent pixels sit, and
     the vertical structure (row darkness profile) to sketch layout bands.

Run: tmp/pdfenv/Scripts/python.exe scripts/analyze-kl-lab-detail.py
"""
import os
from PIL import Image

OUT_DIR = "pdfs/kl-lab"


def content_bbox(im, threshold=200):
    """Bounding box of pixels darker than `threshold` (non-white content)."""
    g = im.convert("L")
    w, h = g.size
    g = g.point(lambda p: 255 if p < threshold else 0)
    bbox = g.getbbox()
    if not bbox:
        return None
    left, top, right, bottom = bbox
    return left, top, right, bottom, (right - left), (bottom - top)


def row_profile(im, threshold=200, bands=12):
    """Fraction of dark pixels per horizontal band (0..1)."""
    g = im.convert("L").point(lambda p: 0 if p < threshold else 255)
    w, h = g.size
    out = []
    for b in range(bands):
        top = b * h // bands
        strip = g.crop((0, top, w, top + h // bands))
        hist = strip.histogram()
        dark = sum(hist[: threshold + 1])
        out.append(round(dark / (w * (h // bands)), 3))
    return out


def accent_region(im, target, tol=45):
    """Bounding box + coverage of pixels near `target` color."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    mask = rgb.point(
        lambda p: 0
    )  # placeholder; point() can't do per-pixel distance, use getdata below
    # do it with numpy-free loop over resized image
    small = rgb.resize((min(w, 400), min(h, int(h * 400 / w))))
    sw, sh = small.size
    pts = []
    px = small.load()
    tr, tg, tb = target
    for y in range(sh):
        for x in range(sw):
            r, g, b = px[x, y]
            if abs(r - tr) <= tol and abs(g - tg) <= tol and abs(b - tb) <= tol:
                pts.append((x, y))
    if not pts:
        return None
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    scale_x = w / sw
    scale_y = h / sh
    return {
        "bbox_pct": (
            round(min(xs) / sw * 100),
            round(min(ys) / sh * 100),
            round(max(xs) / sw * 100),
            round(max(ys) / sh * 100),
        ),
        "coverage_pct": round(len(pts) / (sw * sh) * 100, 1),
        "row_dist": [round(sum(1 for p in pts if p[1] == y) / max(1, len(pts)), 2) for y in range(0, sh, max(1, sh // 12))],
    }


def main():
    logo = os.path.join(OUT_DIR, "page01_0.jpg")
    if os.path.exists(logo):
        im = Image.open(logo).convert("RGB")
        print(f"== LOGO strip: {im.size}")
        bbox = content_bbox(im)
        print(f"   content bbox: {bbox}")
        # dominant colors of the *content* (non-white) pixels
        small = im.convert("RGB")
        cols = {}
        for y in range(0, small.height, 2):
            for x in range(0, small.width, 2):
                r, g, b = small.getpixel((x, y))
                if r < 220 or g < 220 or b < 220:
                    key = (r // 32 * 32, g // 32 * 32, b // 32 * 32)
                    cols[key] = cols.get(key, 0) + 1
        total = sum(cols.values())
        print("   content colors:")
        for (r, g, b), c in sorted(cols.items(), key=lambda kv: -kv[1])[:6]:
            print(f"     {c / total * 100:5.1f}%  ~#{r:02X}{g:02X}{b:02X}")

    art = os.path.join(OUT_DIR, "page01_1.jpg")
    if os.path.exists(art):
        im = Image.open(art).convert("RGB")
        print(f"\n== PAGE 1 artwork: {im.size}")
        print(f"   row darkness profile (top->bottom): {row_profile(im)}")
        region = accent_region(im, (0xD7, 0x3C, 0x28))
        print(f"   red #D73C28 region: {region}")

    # orientation check for all artwork images
    print("\n== artwork orientations:")
    for f in sorted(os.listdir(OUT_DIR)):
        if f.endswith("_1.jpg"):
            w, h = Image.open(os.path.join(OUT_DIR, f)).size
            print(f"   {f}: {w}x{h} {'portrait' if h > w else 'landscape'}")


if __name__ == "__main__":
    main()
