#!/usr/bin/env python3
"""
Extract + analyze pdfs/K.L LAB.pdf (Template 1 reference).
Extracts each page's embedded artwork into pdfs/kl-lab/ and prints:
  - page size + orientation
  - embedded image count/size
  - dominant colors (hex + coverage)
  - brand-accent candidates (saturated, non-neutral colors)
  - 8-band average luminance (rough layout: dark header band, etc.)

Run: tmp/pdfenv/Scripts/python.exe scripts/analyze-kl-lab.py
"""
import os
import zlib
from pypdf import PdfReader
from PIL import Image

PDF_PATH = "pdfs/K.L LAB.pdf"
OUT_DIR = "pdfs/kl-lab"

BAND_COUNT = 8


def dominant_colors(im, n=6):
    small = im.convert("RGB").resize((max(1, im.width // 8), max(1, im.height // 8)))
    q = small.quantize(colors=n, method=Image.MEDIANCUT)
    pal = q.getpalette()
    total = small.width * small.height
    out = []
    for count, idx in sorted(q.getcolors(), reverse=True):
        r, g, b = pal[idx * 3 : idx * 3 + 3]
        out.append((count / total * 100, (r, g, b)))
    return out


def is_neutral(c, tol=28):
    return max(c) - min(c) < tol


def luminance_bands(im):
    small = im.convert("L")
    w, h = small.size
    bands = []
    for b in range(BAND_COUNT):
        top = b * h // BAND_COUNT
        strip = small.crop((0, top, w, top + h // BAND_COUNT))
        hist = strip.histogram()
        total = w * (h // BAND_COUNT)
        avg = sum(i * c for i, c in enumerate(hist)) / total
        bands.append(round(avg))
    return bands


def main():
    reader = PdfReader(PDF_PATH)
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"== {PDF_PATH}: {len(reader.pages)} pages, {os.path.getsize(PDF_PATH)} bytes")

    for i, page in enumerate(reader.pages):
        w, h = float(page.mediabox.width), float(page.mediabox.height)
        orient = "portrait" if w < h else "landscape"
        text = (page.extract_text() or "").strip()
        print(f"\n--- page {i + 1}: {w:.0f}x{h:.0f} ({orient}) text_len={len(text)}")

        images = list(page.images)
        print(f"  images: {len(images)}")
        for j, img in enumerate(images):
            path = os.path.join(OUT_DIR, f"page{i + 1:02d}_{j}.jpg")
            try:
                pil_img = img.image
                if pil_img is None:
                    raise ValueError("undecodable")
                pil_img.convert("RGB").save(path)
                im = pil_img.convert("RGB")
            except Exception:
                raw = img.data
                try:
                    raw = zlib.decompress(raw)
                except Exception:
                    pass
                with open(path, "wb") as f:
                    f.write(raw)
                try:
                    im = Image.open(path).convert("RGB")
                except Exception as e:
                    print(f"    image {j}: {img.name} UNREADABLE ({e})")
                    continue

            print(f"  image {j}: {img.name} -> {im.size}px, mode={im.mode}")
            cols = dominant_colors(im)
            for pct, (r, g, b) in cols:
                tag = ""
                if not is_neutral((r, g, b)) and pct > 0.5:
                    tag = "  <-- accent candidate"
                print(f"    {pct:5.1f}%  #{r:02X}{g:02X}{b:02X}{tag}")
            bands = luminance_bands(im)
            print(f"    luminance bands (dark->light 0-255): {bands}")


if __name__ == "__main__":
    main()
