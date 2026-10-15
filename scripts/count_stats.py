import glob
import os

files = sorted(glob.glob('kiszonki_brd/*.md'))
total_chars = 0
total_words = 0
total_lines = 0

print(f"{'Plik':<46} | {'Znaki':>9} | {'Słowa':>8} | {'Linie':>6} | {'Strony (1800)':>13}")
print("-" * 90)

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    chars = len(c)
    words = len(c.split())
    lines = len(c.splitlines())
    total_chars += chars
    total_words += words
    total_lines += lines
    print(f"{os.path.basename(f):<46} | {chars:>9,} | {words:>8,} | {lines:>6} | {chars/1800.0:>13.2f}")

print("=" * 90)
print(f"{'SUMA ŁĄCZNA':<46} | {total_chars:>9,} | {total_words:>8,} | {total_lines:>6} | {total_chars/1800.0:>13.2f}")
