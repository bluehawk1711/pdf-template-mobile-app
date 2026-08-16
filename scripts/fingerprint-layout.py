#!/usr/bin/env python3
"""
Layout fingerprint for comparing invoice designs.
Downscales an image, binarizes dark content, and reports:
  - content margins (left/right/top/bottom, % of page)
  - horizontal content bands (rows with dark content, as % ranges)
  - vertical zones where dark content clusters
Run: tmp/pdfenv/Scripts/python.exe scripts/fingerprint-layout.py <image> [threshold]
"""
import sys
from PIL import Image

W = 200  # analysis width


def fingerprint(path, threshold=150):
    im = Image.open(path).convert("L")
    w, h = im.size
    H = int(h * W / w)
    small = im.resize((W, H))
    px = small.load()

    dark = [[px[x, y] < threshold for x in range(W)] for y in range(H)]
    row_frac = [sum(1 for c in row if c) / W for row in dark]
    col_frac = [sum(1 for y in range(H) if dark[y][x]) / H for x in range(W)]

    def runs(fracs, min_frac=0.02, gap=1):
        """Bands where frac > min_frac, merging gaps <= gap."""
        bands = []
        start = None
        for i, f in enumerate(fracs):
            if f > min_frac and start is None:
                start = i
            elif f <= min_frac and start is not None:
                bands.append((start, i))
                start = None
        if start is not None:
            bands.append((start, len(fracs)))
        merged = []
        for b in bands:
            if merged and b[0] - merged[-1][1] <= gap:
                merged[-1] = (merged[-1][0], b[1])
            else:
                merged.append(b)
        return merged

    rows = runs(row_frac)
    cols = runs(col_frac)

    top = rows[0][0] / H * 100 if rows else 0
    bottom = (H - rows[-1][1]) / H * 100 if rows else 0
    left = cols[0][0] / W * 100 if cols else 0
    right = (W - cols[-1][1]) / W * 100 if cols else 0

    print(f"== {path}  ({w}x{h} -> {W}x{H})")
    print(f"   margins %: top={top:.1f} bottom={bottom:.1f} left={left:.1f} right={right:.1f}")
    print(f"   {len(rows)} content bands (% of height):")
    for s, e in rows:
        print(f"     {s/H*100:5.1f}% - {e/H*100:5.1f}%   (density {max(row_frac[s:e]):.2f})")
    return rows, cols


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: fingerprint-layout.py <image> [threshold]")
        sys.exit(1)
    threshold = int(sys.argv[2]) if len(sys.argv) > 2 else 150
    fingerprint(sys.argv[1], threshold)
