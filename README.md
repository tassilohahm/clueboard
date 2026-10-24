# Clueboard

A simple, host-led first-round trivia game. The board has six categories and five clues per category, valued from $200 to $1,000.

## Run it

Open `index.html` in a modern browser. There is no build step, server, account, or external game service.

## Play

1. Choose a category and value.
2. The host reads the clue and judges responses externally.
3. Use the score controls to add or subtract the selected clue's value for a team.
4. Reveal the response, then choose **Continue** to mark the clue played and return to the board.
5. Use the small **×** (or Escape) to close a mistakenly opened clue without marking it played.

The score and board state live in memory for the current browser session and reset on reload. **New game** also resets them.

## Design notes

The interface uses a saturated blue board, white category and clue text, and yellow-orange values. Bree Serif is used as an accessible web-font approximation for the distinctive clue lettering; Oswald supplies the condensed board typography. If Google Fonts is unavailable, local serif and sans-serif fallbacks are used.

All 30 clues and responses are original starter content for this prototype.
