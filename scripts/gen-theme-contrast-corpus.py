#!/usr/bin/env python3
"""
scripts/gen-theme-contrast-corpus.py
Calculates WCAG 2.1 relative luminance and contrast ratio for theme tokens (BR-TEST-014, RD-ENG-02).
"""

import json
import math
from pathlib import Path

def hex_to_rgb(hex_str: str):
    hex_str = hex_str.strip().lstrip("#")
    if len(hex_str) == 3:
        hex_str = "".join([c * 2 for c in hex_str])
    if len(hex_str) >= 6:
        r = int(hex_str[0:2], 16)
        g = int(hex_str[2:4], 16)
        b = int(hex_str[4:6], 16)
        return (r, g, b)
    raise ValueError(f"Invalid hex color: {hex_str}")

def relative_luminance(r: int, g: int, b: int) -> float:
    def channel_lum(c: int) -> float:
        val = c / 255.0
        return val / 12.92 if val <= 0.04045 else math.pow((val + 0.055) / 1.055, 2.4)
    return 0.2126 * channel_lum(r) + 0.7152 * channel_lum(g) + 0.0722 * channel_lum(b)

def contrast_ratio(hex1: str, hex2: str) -> float:
    r1, g1, b1 = hex_to_rgb(hex1)
    r2, g2, b2 = hex_to_rgb(hex2)
    l1 = relative_luminance(r1, g1, b1)
    l2 = relative_luminance(r2, g2, b2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def main():
    fixtures_dir = Path(__file__).resolve().parent.parent / "tests" / "fixtures"
    fixtures_dir.mkdir(parents=True, exist_ok=True)

    # Core theme color tokens from theme.ts
    colors = {
        "bg": "#121214",
        "bgCard": "#1C1C1F",
        "bgCardElevated": "#242428",
        "bgSecondary": "#18181A",
        "border": "#2E2E34",
        "borderLight": "#3E3E46",
        "pickleGreen": "#5B8A61",
        "pickleGreenLight": "#D9E8D2",
        "amberBrine": "#9E8747",
        "amberBrineLight": "#E5C678",
        "berryRed": "#D9534F",
        "berryRedLight": "#FF7875",
        "textPrimary": "#F4EFEA",
        "textSecondary": "#A09C96",
        "textMuted": "#686561"
    }

    pairs_to_check = [
        {"name": "textPrimary on bg", "fg": "textPrimary", "bg": "bg", "min": 7.0, "type": "AAA"},
        {"name": "textPrimary on bgCard", "fg": "textPrimary", "bg": "bgCard", "min": 7.0, "type": "AAA"},
        {"name": "textPrimary on bgCardElevated", "fg": "textPrimary", "bg": "bgCardElevated", "min": 7.0, "type": "AAA"},
        {"name": "textSecondary on bg", "fg": "textSecondary", "bg": "bg", "min": 4.5, "type": "AA"},
        {"name": "textSecondary on bgCard", "fg": "textSecondary", "bg": "bgCard", "min": 4.5, "type": "AA"},
        {"name": "pickleGreenLight on bg", "fg": "pickleGreenLight", "bg": "bg", "min": 4.5, "type": "AA"},
        {"name": "pickleGreenLight on bgCard", "fg": "pickleGreenLight", "bg": "bgCard", "min": 4.5, "type": "AA"},
        {"name": "amberBrineLight on bg", "fg": "amberBrineLight", "bg": "bg", "min": 4.5, "type": "AA"},
        {"name": "amberBrineLight on bgCard", "fg": "amberBrineLight", "bg": "bgCard", "min": 4.5, "type": "AA"},
        {"name": "berryRedLight on bg", "fg": "berryRedLight", "bg": "bg", "min": 4.5, "type": "AA"},
        {"name": "white on pickleGreen (Button)", "fg": "#FFFFFF", "bg": "pickleGreen", "min": 3.0, "type": "Button"},
    ]

    results = []
    for pair in pairs_to_check:
        fg_hex = colors.get(pair["fg"], pair["fg"])
        bg_hex = colors.get(pair["bg"], pair["bg"])
        ratio = round(contrast_ratio(fg_hex, bg_hex), 2)
        passed = ratio >= pair["min"]
        results.append({
            "name": pair["name"],
            "fg": fg_hex,
            "bg": bg_hex,
            "ratio": ratio,
            "min_required": pair["min"],
            "type": pair["type"],
            "passed": passed
        })

    out_file = fixtures_dir / "theme-contrast-corpus.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({
            "version": "1.0.0",
            "pairs_count": len(results),
            "results": results
        }, f, indent=2, ensure_ascii=False)

    print(f"[gen-theme-contrast] Zbadano {len(results)} par kontrastu -> {out_file}")

if __name__ == "__main__":
    main()
