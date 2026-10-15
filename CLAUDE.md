# Kiszonki, przetwory, słoiki (Słoik / Jarwise) — zasady dla agenta

- **Repozytorium jest PUBLICZNE** (`lkarwowski494/kiszonki-przetwory-sloiki`). Nigdy nie commituj sekretów (klucze API, tokeny, certyfikaty, `.p8`/`.p12`, `.env`) ani danych osobowych (UDID, e-mail). Przed commitem sprawdź `git diff --cached`. Logi i artefakty CI też są publiczne — nie wypisuj w nich identyfikatorów ani UDID.
- **Narzędzia i infrastruktura: 0 zł poza opłatą Apple Developer.** macOS w GitHub Actions jest darmowy tylko dlatego, że repo jest publiczne. Build na telefon i dla testerów: `testflight.yml` (wyłącznie oficjalne narzędzia Apple; zero zewnętrznych płatnych platform SaaS/EAS).
- **Testy przed kodem (TDD).** Każdy błąd z audytu lub zgłoszenia dostaje test odtwarzający regresję (`tests/regress.test.ts`, plan w `docs/09-plan-testow.md`).
- **Macierz testów (Zasada Zero Luk):** Każdy ekran, widok szczegółowy kalkulatora, element UI, komunikat ostrzegawczy (zwłaszcza botulizm i pasteryzacja), funkcja dziedzinowa w `src/core/` oraz stała fizykochemiczna ma przypisany test jednostkowy/scenariuszowy; `npm run check:matrix` blokuje braki.
- **Katalog przepływów użytkownika i E2E Maestro:** Każdy realny przepływ (obliczenie solanki, monitoring fermentacji, pasteryzacja z timerem, dodanie słoika do spiżarni, diagnostyka zepsucia) ma scenariusz Maestro. E2E zastępuje manualne testy.
- **Definicja ukończenia (DoD - 9 warstw jakości):** Każda funkcjonalność przy wdrażaniu ma pełen zakres testów automatycznych:
  1. *Warstwa 1: Jednostkowa i niezmienniki domenowe* (100% pokrycia formuł solanek, $P_0$, $F_0$, pH).
  2. *Warstwa 2: Macierz testów krawędziowych* (skrajne wartości temp., zasolenia, objętości słoików).
  3. *Warstwa 3: Niezmienniki spójności bazy danych* (SQLite foreign keys, transakcyjność, sumy partii w spiżarni).
  4. *Warstwa 4: Regresja i odporność na zepsucie danych* (błędne pliki JSON, recovery po awarii zasilania).
  5. *Warstwa 5: Migracje schematu SQLite* (testowanie migracji `v1 -> v2 -> vN` na rzeczywistych bazach).
  6. *Warstwa 6: Zrzuty ekranowe i lokalizacja (Snapshot/i18n)* (PL/EN, Dynamic Type, Dark/Light mode).
  7. *Warstwa 7: Integracja komponentów i stanu React Native/Expo* (hands-free kitchen mode, store).
  8. *Warstwa 8: E2E Maestro na symulatorze iOS* (pełne scenariusze kuchenne bez dotykania telefonu brudnymi rękami).
  9. *Warstwa 9: Weryfikacja audytowa bezpieczeństwa biologicznego* (blokada zaleceń grożących zatruciem jadem kiełbasianym).
- **Weryfikacja jakości przed wypchnięciem:**
  - W trakcie pracy: `npm run test:fast` (testy powiązane ze zmienionymi plikami).
  - Przed commitem i PR: pełne `npm run verify` (`typecheck`, `check:i18n`, `jest`, `expo export --platform ios`).
- **Zasada projektowa (Spójność interakcji):** Identyczne akcje działają w całej aplikacji tak samo (sposób wywołania, widoczny przycisk „Anuluj” / „Zamknij” w modalu po lewej stronie nagłówka, haptyka sukcesu, obsługa VoiceOver).
- **Liczby i stałe w jednym źródle prawdy:** Stałe mikrobiologiczne (progi pH, gęstości solanek, wartości $z$ i $D$, tabele pasteryzacji USDA) zdefiniowane wyłącznie w `src/core/constants/`. Dokumenty generowane ze skryptów walidacyjnych, nigdy nieprzepisywane ręcznie.
- **Prywatność i 100% Offline-First:** Wszystkie dane użytkownika, wpisy spiżarni, parametry partii i notatki przechowywane są lokalnie w bazie SQLite z włączonym trybem WAL (`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;`). Zero trackerów, zero zewnętrznych SDK analitycznych, certyfikat App Store: "Data Not Collected".

---

## Merytoryczne podstawy i bezpieczeństwo żywności (Rygor mikrobiologiczny)

Wszystko, czego aplikacja uczy lub co kalkuluje (stężenie soli, czas pasteryzacji, kinetyka fermentacji, diagnostyka pleśni), musi bezwzględnie opierać się na zweryfikowanej literaturze naukowej i wytycznych urzędowych.

### Hierarchia źródeł:
1. **Szczebel 1 (Najwyższy — Normy Bezpieczeństwa):**
   - Oficjalne przewodniki termicznego przetwarzania żywności: *USDA Complete Guide to Home Canning* (Agriculture Information Bulletin No. 539),
   - Wytyczne agencji bezpieczeństwa żywności: FDA BAM (*Bacteriological Analytical Manual*), EFSA (*European Food Safety Authority*),
   - Publikacje akademickich ośrodków przetwórstwa: NCHFP (*National Center for Home Food Preservation* - University of Georgia).
2. **Szczebel 2 (Monografie naukowe i mikrobiologia żywności):**
   - *Microbiology and Technology of Fermented Foods* (Robert W. Hutkins),
   - *Handbook of Fermented Functional Foods* (Cherl-Ho Lee),
   - *Indigenous Fermented Foods of the World* (Keith H. Steinkraus, Jyoti Prakash Tamang),
   - *Food Microbiology: Fundamentals and Frontiers* (Doyle & Buchanan).
3. **Szczebel 3 (Chemia żywności i inżynieria kulinarna):**
   - *On Food and Cooking: The Science and Lore of the Kitchen* (Harold McGee),
   - *The Noma Guide to Fermentation* (René Redzepi & David Zilber),
   - *The Art of Fermentation* (Sandor Ellix Katz).
4. **Szczebel 4 (Standardy branżowe producentów szkła i akcesoriów):**
   - Dokumentacja techniczna J. Weck GmbH u. Co. KG, Ball Canning / Newell Brands, hermetyczne słoiki z uszczelką gumową.
5. **Szczebel 5 (Tradycja i blogi kulinarne):**
   - Wyłącznie jako inspiracja kulturowa, zawsze poddawana weryfikacji przez pryzmat Szczębla 1 i 2.

### Żelazne reguły bezpieczeństwa (Zero-Tolerance Food Safety Rules):
- **Bariera Botulinowa ($pH = 4.60$):** Żaden przetwór o mierzonym lub modelowanym $pH \ge 4.60$ (warzywa w zalewie bez octu, czosnek w oliwie, mięsa, ryby, grzyby słodkowodne) nie może być oznaczony jako bezpieczny w prostej kąpieli wodnej $100^\circ\text{C}$. Wymagana jest pasteryzacja ciśnieniowa (Pressure Canner, minimum $121.1^\circ\text{C}$ / 15 PSI przez czas wyznaczony algorytmem lethality $F_0 \ge 3.0$) lub trzykrotna tyndalizacja.
- **Korekta Solanki na Masę Wsadu (Total Salinity Rule):** Aplikacja nigdy nie podaje stężenia solanki w odniesieniu wyłącznie do dodanej wody. Zawsze oblicza i wyświetla stężenie w całkowitej masie układu (warzywa + woda + sól), zapobiegając rozcieńczeniu osmotycznemu i rozwojowi bakterii gnilnych.
- **Rozróżnienie Kożucha Fermentacyjnego od Pleśni:** Pleśń (strzępki wielokomórkowe, barwa biało-zielona/czarna, puszysta struktura ponad taflą płynu) skutkuje natychmiastowym zaleceniem bezwzględnej utylizacji partii (toksyny mikotoksynowe dyfundują w głąb zalewy). Kożuch drożdżowy (Kahm yeast — cienka, matowa, biała, jednolita powłoka) jest oznaczany jako wada estetyczna niegroźna toksykologicznie.
