# Clueboard

A simple, host-led first-round trivia game. The board has six categories and five clues per category, valued from $200 to $1,000.

## Run it

Open `index.html` in a modern browser. There is no build step, server, account, or external game service.

## Play

1. Choose a category and value.
2. The host reads the clue and judges responses externally.
3. Reveal the response. If one team got it, award the clue value to that team once.
4. Choose **Continue** to mark the clue played and return to the board. If no team got it, continue without awarding points.
5. Use the small **×** (or Escape) to close a mistakenly opened clue without marking it played.

The score and board state live in memory for the current browser session and reset on reload. **New game** also resets them.

## Design notes

The interface uses a saturated blue board, white category and clue text, and yellow-orange values. Bree Serif is used as an accessible web-font approximation for the distinctive clue lettering; Oswald supplies the condensed board typography. If Google Fonts is unavailable, local serif and sans-serif fallbacks are used.

Scoring is intentionally simplified for this host-led prototype: a team can receive the clue value once, after the response is revealed. Incorrect responses do not subtract points here. On the TV show, an incorrect response normally loses the clue value and another contestant may try.

## Clue sound

The loopable ticking clock plays while a clue is open and stops when the response is revealed. Use **Sound on/off** in the header to control it. The sound is the high-quality MP3 preview of “Loopable Ticking Clock” by OwlStorm (Ashe Kirk / Owlish Media), sourced from Freesound and dedicated under CC0 1.0. CC0 does not require attribution; source and license are recorded here for provenance. Source: https://freesound.org/people/OwlStorm/sounds/212181/.

All 30 clues and responses are original starter content for this prototype.
