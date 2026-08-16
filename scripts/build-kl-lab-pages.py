#!/usr/bin/env python3
"""
Builds src/templates/kl-lab/pages.generated.ts from the reference page images.

Why base64 data URIs?
  - expo-print on Android loads the HTML with a null base URL, so relative
    file/asset references don't resolve — data URIs always work.
  - The same HTML is used for the in-app WebView preview and (later) iOS,
    where local asset URLs are also unsupported in print HTML.

The source PNGs (assets/template1/page1.png .. page9.png) are fully opaque,
so we encode as JPEG (quality 95) to keep the generated module small
(~2 MB instead of ~13 MB for base64 PNG).

Regenerate after swapping the images:
  tmp/pdfenv/Scripts/python.exe scripts/build-kl-lab-pages.py
"""

import base64
import glob
import io
import os

from PIL import Image

SRC_GLOB = os.path.join("assets", "template1", "page*.png")
OUT = os.path.join("src", "templates", "kl-lab", "pages.generated.ts")
JPEG_QUALITY = 95

HEADER = """/**
 * GENERATED FILE — do not edit by hand.
 * Built from assets/template1/page1.png .. page9.png by
 * scripts/build-kl-lab-pages.py (see that file for how to regenerate).
 *
 * Each entry is one full-bleed brochure page: the reference artwork as a
 * base64 JPEG data URI plus its pixel dimensions (w/h = aspect ratio used
 * for the PDF page size).
 */
export interface KlLabPage {
  /** Pixel width of the source image (also the page aspect ratio). */
  w: number;
  /** Pixel height of the source image (also the page aspect ratio). */
  h: number;
  /** base64 JPEG data URI. */
  src: string;
}

export const KL_LAB_PAGES: KlLabPage[] = [
"""


def main() -> None:
    files = sorted(glob.glob(SRC_GLOB))
    if not files:
        raise SystemExit(f"no pages found at {SRC_GLOB}")

    entries: list[str] = []
    total_bytes = 0
    for f in files:
        im = Image.open(f).convert("RGB")
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        data = buf.getvalue()
        total_bytes += len(data)
        b64 = base64.b64encode(data).decode("ascii")
        entries.append(
            "  { w: %d, h: %d, src: 'data:image/jpeg;base64,%s' },\n"
            % (im.size[0], im.size[1], b64)
        )

    with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(HEADER)
        fh.writelines(entries)
        fh.write("];\n")

    print(
        "wrote %s (%d pages, %.2f MB source -> %.2f MB base64)"
        % (OUT, len(entries), total_bytes / 1e6, total_bytes * 4 / 3 / 1e6)
    )


if __name__ == "__main__":
    main()
