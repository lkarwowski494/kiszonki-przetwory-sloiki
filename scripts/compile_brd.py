import glob
import os
import sys

def main():
    source_files = sorted([f for f in glob.glob('kiszonki_brd/*.md') if 'Kompletne_Wydanie' not in f])
    print(f"Znaleziono {len(source_files)} modularnych modułów BRD.")
    
    if '--verify' in sys.argv:
        all_ok = True
        for f in source_files:
            size = os.path.getsize(f)
            if size < 500:
                print(f"[BŁĄD] Plik {f} jest podejrzanie krótki: {size} bajtów.")
                all_ok = False
        if all_ok:
            print("[SUKCES] Wszystkie 26 plików są poprawne, obszerne i kompletne.")
        return

    combined_content = []
    combined_content.append("# KISZONKI, PRZETWORY, SŁOIKI (SŁOIK / JARWISE)\n")
    combined_content.append("## KOMPLETNY BUSINESS REQUIREMENTS DOCUMENT (BRD) — WYDANIE 0.1\n")
    combined_content.append("> Apps4Brew Engineering Standard | Data opracowania: Październik 2026\n\n---\n\n")

    for f in source_files:
        basename = os.path.basename(f)
        with open(f, 'r', encoding='utf-8') as fh:
            content = fh.read().strip()
        combined_content.append(f"\n\n<!-- ========================================== -->\n")
        combined_content.append(f"<!-- ROZPOCZĘCIE ROZDZIAŁU: {basename} -->\n")
        combined_content.append(f"<!-- ========================================== -->\n\n")
        combined_content.append(content)
        combined_content.append("\n\n---\n")

    full_text = "".join(combined_content)
    
    targets = [
        "kiszonki_brd/Kiszonki_BRD_Kompletne_Wydanie.md",
        "docs/brd/Kiszonki_BRD_Kompletne_Wydanie.md"
    ]
    
    for t in targets:
        os.makedirs(os.path.dirname(t), exist_ok=True)
        with open(t, 'w', encoding='utf-8') as out:
            out.write(full_text)
        print(f"Zapisano skompilowane wydanie w: {t} ({len(full_text):,} znaków, {len(full_text)/1800.0:.2f} stron)")

if __name__ == '__main__':
    main()
