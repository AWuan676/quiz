---
name: Matchday Quiz
description: A real-time classroom quiz played on a stadium scoreboard, where the shot clock drains points live in amber LED.
colors:
  concrete: "#e9edf3"
  concrete-2: "#d9e0ea"
  paper: "#ffffff"
  ink: "#12141c"
  ink-2: "#464d5f"
  board: "#15171f"
  board-2: "#22253a"
  board-3: "#30344b"
  board-text: "#c9cede"
  led: "#ffb400"
  led-hot: "#ff4a2e"
  pitch: "#0e9f4f"
  pitch-2: "#0b8a43"
  chalk: "#f4fff7"
  kit-red: "#e5243b"
  kit-blue: "#1d5bff"
  kit-yellow: "#ffc20e"
  kit-green: "#0fa24a"
  kit-orange: "#ff6a13"
  kit-purple: "#7b3fe4"
  kit-cyan: "#00b3d6"
  kit-pink: "#ff3d8b"
typography:
  display:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "normal"
  headline:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "normal"
  prompt:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.08
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.375
  label:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    lineHeight: 1.43
    letterSpacing: "0.18em"
  ticker:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.56
    letterSpacing: "0.12em"
  button:
    fontFamily: "Big Shoulders Display, Barlow, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.33
    letterSpacing: "0.025em"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  board: "28px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
components:
  button-led:
    backgroundColor: "{colors.led}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.2xl}"
    height: "64px"
    padding: "0 28px"
  button-led-xl:
    backgroundColor: "{colors.led}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.2xl}"
    height: "80px"
    padding: "0 40px"
  button-pitch:
    backgroundColor: "{colors.pitch}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.2xl}"
    height: "64px"
    padding: "0 28px"
  button-board:
    backgroundColor: "{colors.board-2}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.2xl}"
    height: "64px"
    padding: "0 28px"
  button-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.xl}"
    height: "48px"
    padding: "0 20px"
  board-housing:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-text}"
    rounded: "{rounded.board}"
    padding: "24px"
  board-cell:
    backgroundColor: "{colors.board-2}"
    textColor: "{colors.board-text}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  code-cell:
    backgroundColor: "{colors.board-2}"
    textColor: "{colors.led}"
    rounded: "{rounded.xl}"
  text-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    height: "64px"
    padding: "0 20px"
  ticker:
    backgroundColor: "{colors.board}"
    textColor: "{colors.led}"
    typography: "{typography.ticker}"
    padding: "8px 0"
  status-pill:
    backgroundColor: "{colors.board}"
    textColor: "{colors.led}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  status-pill-alert:
    backgroundColor: "{colors.led-hot}"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  answer-plate-a:
    backgroundColor: "{colors.kit-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.2xl}"
    padding: "20px 24px"
  answer-plate-b:
    backgroundColor: "{colors.kit-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.2xl}"
    padding: "20px 24px"
  answer-plate-c:
    backgroundColor: "{colors.kit-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "20px 24px"
  answer-plate-d:
    backgroundColor: "{colors.kit-green}"
    textColor: "{colors.paper}"
    rounded: "{rounded.2xl}"
    padding: "20px 24px"
  hint-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "16px 24px 16px 16px"
  gate-ticket:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "28px 32px"
---

# Design System: Matchday Quiz

## Overview

**Creative North Star: "The Matchday Scoreboard"**

Every question is a match period played in front of the whole room. The ground is bright: cool concrete-white for the host's working screens and a striped pitch green, with chalk field markings, behind the moments of arrival (landing, a player's waiting screen). On top of that ground stands the scoreboard: a near-black housing with a faint LED lattice, holding amber digits that light, dim and drain. Teams are not avatars; they wear saturated kits with big jersey numbers and walk on as banners.

The system is loud by design and sized for the back row of a lecture hall. Signage is Big Shoulders Display, condensed and uppercase in 800 and 900 weights; anything meant to be read as a sentence (question prompts, clues, help text) is Barlow. Density is low on the projector and thumb-sized on the phone. State never arrives as toast chrome: it prints on the ticker strip or a status pill on the board.

Everything that moves uses one grammar: a quick spring (about 0.4s) that overshoots and settles. Banners walk on with it, cells pop with it, rankings reshuffle with it. The only long-running motions are ambient: the ticker crawl, the code-cell cursor blink and waiting dots.

**Key Characteristics:**
- Dark scoreboard housing on a bright concrete or pitch ground.
- Amber LED as light: seven-segment digits, a draining shot clock, glow instead of shadow.
- Eight saturated team kits; answer colours always paired with a shape.
- Condensed uppercase signage over a plain, readable Barlow body.
- One overshoot spring for all state changes; state prints on the ticker.

## Colors

A cool, bright ground; a dark housing; one amber light source with a hot-red warning; and a fixed set of eight kit colours that belong to teams and answers, never to chrome.

### Primary
- **Scoreboard Amber** (#ffb400): the LED. Lit seven-segment digits, shot-clock cells, live scores, the main call-to-action fill, the selected state of toggles and time choices, the focus ring, text selection and the input caret. On the board it is light; on the ground it appears only as a filled object (a button, the answer-reveal plate, a checkmark disc).
- **Hot Lamp** (#ff4a2e): the warning state of the same LED. The last fifth of the shot clock and timer, the "time up / everyone answered" status pill, an invalid code ring, and the time-up hourglass. Between amber and hot, the shot clock passes through a transitional orange (#ff8a1f) past the halfway mark.

### Secondary
- **Pitch Green** (#0e9f4f) and **Pitch Shadow Stripe** (#0b8a43): the playing field. Alternating 80px vertical stripes behind arrival screens, the go-forward button (join, to the leaderboard), and the translucent tip plate on the landing pitch.
- **Chalk** (#f4fff7): field markings drawn over the pitch at 40% opacity, and light text that sits on the pitch.

### Tertiary: Team Kits
- **Kit Red** (#e5243b), **Kit Blue** (#1d5bff), **Kit Yellow** (#ffc20e), **Kit Green** (#0fa24a), **Kit Orange** (#ff6a13), **Kit Purple** (#7b3fe4), **Kit Cyan** (#00b3d6), **Kit Pink** (#ff3d8b): assigned to teams in join order and cycled. The first four double as answer plates A to D. Kit Green and Kit Red also fill the player's correct and incorrect feedback screens.

### Neutral
- **Concrete** (#e9edf3): the default page ground for host and player working screens, and the frosted fixed action bar (95% with backdrop blur).
- **Concrete Seam** (#d9e0ea): dividers, dashed ticket perforation, locked clue rows on the phone, hover fill for secondary ticket actions.
- **Paper** (#ffffff): the gate ticket, revealed hint cards, the light button, the clue-answer input.
- **Ink** (#12141c): primary text on the ground; text on Amber and on the light kits; the selected mode card.
- **Slate Ink** (#464d5f): secondary text on the ground.
- **Housing** (#15171f): the scoreboard body, the ticker, the header bar, status pills. Also the browser theme colour.
- **Housing Panel** (#22253a) and **Housing Recess** (#30344b): the two tonal steps inside the board (cells, inner panels, rows; then chips and unlit gain badges).
- **Board Text** (#c9cede): labels and body text on the housing.

### Named Rules
**The LED Is Light Rule.** Amber text and amber digits sit on the housing. On the bright ground, amber appears only as a filled object carrying ink text. Lit amber glows (a soft same-colour halo); it never casts a dark shadow.

**The Kit Owns Its Ink Rule.** Each kit has one fixed foreground: Yellow, Orange, Cyan and Pink take Ink (#12141c); Red, Blue, Green and Purple take white. Use kits for teams and answers only, never for interface chrome. White on Pitch Green or Kit Green is for large bold type (24px and up); smaller text on those greens takes Ink or moves onto the housing.

**The Hot Means Running Out Rule.** Hot Lamp is spent only on time running out and on rejection (invalid code, time up). It is never decorative and never a second accent.

## Typography

**Display Font:** Big Shoulders Display (with Barlow, system-ui fallback), loaded at 700, 800 and 900
**Body Font:** Barlow (with system-ui fallback), loaded at 500, 600 and 700

**Character:** Big Shoulders is stadium signage, condensed and shouted in uppercase; Barlow is the plain, slightly rounded grotesque you read the question in. The pairing keeps the noise in the signage and the reading calm.

### Hierarchy
- **Display** (900, clamp(3rem, 7vw, 6rem), 0.88): screen titles on the ground (setup title, landing HOST and JOIN titles at clamp(2.75rem, 6vw, 5rem), player result words like CORRECT up to 6rem at 0.85). Always uppercase.
- **Headline** (900, 1.875rem): section headings on the ground ("Teams", "Mode", "Time"). Uppercase.
- **Title** (800, 1.25rem to 2.25rem): team names in standings and banners, mode names, chip text. Uppercase.
- **Prompt** (Barlow 700, clamp(2rem, 3.8vw, 3.75rem), 1.08, balanced): the question on the projector. Clue lines use Barlow 600 at clamp(1.25rem, 2.2vw, 2.25rem). Sentence case.
- **Body** (Barlow 500, 1.125rem, 1.375): explanations, tips, waiting text. Keep to about max-w-sm/2xl measures.
- **Label** (800, 0.875rem, 0.18em, uppercase, Board Text): names a datum on the board: QUESTION, LIVE POINTS, TIME LEFT, ROOM CODE, STANDINGS. Scales down to 0.75rem on the phone mini-board.
- **Ticker** (800, 1.125rem, 0.12em, uppercase, Amber on Housing): the crawling state strip.

### Named Rules
**The Board Digits Rule.** Fixed scoreboard readouts (room code, clock, question index, live points, seconds left, team count, duration choices, hint numbers on the projector) are drawn with the SVG seven-segment component, skewed -6deg, unlit segments at 8% opacity. Scores that roll or count (standings, podium, totals, gained points) and digits a player is typing are set in Big Shoulders 900 with tabular numerals, in Amber. The direction asked for "never a font"; the build draws the line at readouts versus rolling or typed numbers, and that line is the rule.

**The Signage Shouts, Reading Speaks Rule.** Big Shoulders is always uppercase at 800 or 900. Barlow is never uppercase-tracked; anything a team must read and understand in one pass is Barlow in sentence case.

## Layout

Host screens are built for a projector: a full-bleed scoreboard strip or ticker at the top, content in a container up to 1600px wide with 16px side padding (32px from 640px), and a fixed bottom action bar on frosted concrete, with 128px bottom padding on the content so nothing hides behind it. The game screen splits into a stage and a 400px standings column from 1024px; the lobby puts the board and the 380px gate ticket side by side from 1024px. Landing and setup use a 1152px (max-w-6xl) container.

Player screens are a single phone column (max-w-xl for the controller pads, max-w-md for results), with the mini-board pinned on top and the primary action anchored at the bottom with `mt-auto`.

Spacing follows Tailwind's 4px step. Inside the board, gaps are tight (8 to 12px) like hardware; between sections on the ground, gaps open to 48px. The landing board splits HOST | VS | JOIN as a three-column grid from 768px and stacks JOIN first on mobile.

## Elevation & Depth

Depth is mostly tonal. Inside the scoreboard, layers step from Housing to Housing Panel to Housing Recess, with a 6px dot lattice (white at 5%) laid over panels to read as an LED matrix. Light, not shadow, is the scoreboard's depth cue: lit segments carry a 6px same-colour drop-shadow glow, shot-clock cells a 10px glow, typed code digits a 14px amber text glow.

Objects that physically stand on the ground (the scoreboard itself, the gate ticket, team banners, the revealed answer plate, the selected mode card) cast soft, negatively spread drop shadows tinted from Ink.

### Shadow Vocabulary
- **Board drop** (`box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.55)`): the landing scoreboard standing on the pitch.
- **Ticket drop** (`box-shadow: 0 24px 48px -20px rgb(18 20 28 / 0.45)`): the gate ticket and other paper objects lifted off the ground.
- **Banner drop** (`box-shadow: 0 10px 24px -12px rgb(18 20 28 / 0.5)`): team banners in the lobby; hint cards use a lighter `0 8px 20px -12px rgb(18 20 28 / 0.35)`.
- **Amber bloom** (`box-shadow: 0 14px 30px -12px rgb(255 180 0 / 0.8)`): the revealed answer plate and the primary amber button (`0 14px 24px -8px rgb(255 180 0 / 0.6)`).
- **LED glow** (`filter: drop-shadow(0 0 6px currentColor)`): lit seven-segment strokes.

### Named Rules
**The Housing, Not Cards Rule.** Inside the board, separate things with tone steps and the lattice, never with shadows or borders. Shadows belong only to objects standing on the ground.

## Shapes

Hardware with softened corners. The scoreboard housing is the largest radius (28px); panels inside it step down to 16px, cells and buttons to 12 to 16px, small chips to 6 to 8px, so nested corners stay concentric. Pills (full radius) are reserved for status, chips and the language toggle. Shot-clock cells are near-square (2px).

Recurring silhouettes: the seven-segment digit with hexagonal segment ends; the gate ticket, a paper rectangle with two punched semicircular notches (14px) at mid-height and a dashed perforation, tilted -1.5deg; the authored jersey silhouette carrying a 900-weight number; podium columns rounded only on top; and the ticker separator, a small rotated amber square.

## Components

### Buttons
Chunky, signage-scale and physical: they lift on hover and sink on press.
- **Shape:** gently rounded (16px at lg and xl, 12px at md).
- **Sizes:** md 48px tall with 18px text, lg 64px with 24px text, xl 80px with 30px text; all Big Shoulders 800 uppercase with a leading lucide icon.
- **Amber (primary):** Amber fill, Ink text, soft amber bloom. One per action bar: open room, start, show answer, lock in.
- **Pitch:** Pitch Green fill, white text, for going forward to a new place (join the match, go to the leaderboard).
- **Board:** Housing Panel fill, white text, for secondary host actions on the board's side (next hint).
- **Light:** Paper fill with a 2px ink/10 ring, Ink text, for settings and back actions on concrete.
- **Hover / Press:** spring lift of 2px on hover; on press it drops 4px and scales to 0.98, using the pop spring. Keyboard shortcuts show as a small inline key cap (ink/15, Barlow bold).
- **Disabled:** 40% opacity, no shadow, not-allowed cursor.

### Chips and Status
- **Board chips:** Housing Panel pills with white or Amber Big Shoulders 800 text (mode, duration, answered count).
- **Status pill:** Housing pill with Amber text in the host action bar; it turns Hot Lamp with white text when time is up or everyone has answered, and re-enters with the pop spring when its message changes.
- **Gain badge:** after a reveal, `+N` on Kit Green or an unlit Housing Recess badge, popping in staggered by rank.

### Cards / Containers
- **Board housing:** Housing fill, 28px radius, 24 to 40px padding, LED lattice overlay. Holds every readout.
- **Board cell:** Housing Panel, 16px radius, lattice; landing HOST and JOIN halves, reveal stat tiles.
- **Hint card:** a locked clue is a Housing row with an unlit digit, a lock icon and a dim label; when opened it springs in from the left as a Paper card with a lit digit tile and Barlow 600 text.
- **Mode card:** Paper with a 2px ink/10 ring at rest; selected, it becomes an Ink card lifted 4px with an amber check disc.

### Inputs / Fields
- **Code input:** six 3:4 LED cells on Housing Panel with the lattice over one real numeric input (paste and one-time-code autofill work). Typed digits pop in at Amber with glow. The active cell gets a 2px Amber ring and a blinking amber underscore; invalid turns the ring Hot Lamp.
- **Text input:** 64px Paper field, 16px radius, Barlow 700 at 24px, 2px ink/10 ring that grows to a 4px Amber ring on focus.
- **Range:** native slider with Amber accent.
- **Global focus:** 3px Amber outline at 3px offset on every focusable element.

### Navigation
The host and landing header is a Housing bar with the wordmark (Big Shoulders 900, 0.08em, white with an Amber full stop), the room code chip in Amber and the VI/EN language toggle: a pill whose active language sits on a sliding Amber pill (shared-layout spring). The ticker always sits directly beneath it.

### Ticker (signature)
The scoreboard's crawling message strip: Housing with lattice, Amber Ticker type, items separated by rotated amber squares, crawling left over 28s, edges faded into the housing. It is a polite live region and stops under reduced motion. Waiting, counts, instructions and confirmations print here.

### Shot Clock (signature)
A row of LED cells (60 on the projector, 30 on the phone, 24 in the setup demo) that go dark as points drain: Amber above half, transitional orange to 20%, Hot Lamp in the last fifth. Lit cells glow; unlit cells are white at 6%. Exposed as a progressbar. It always appears together with the seven-segment live-points and seconds readouts.

### Answer Plates
Kit Red triangle A, Kit Blue diamond B, Kit Yellow circle C, Kit Green square D. On the projector they spring in staggered; on reveal the correct plate scales to 1.03 with a 6px Ink ring and the rest fade to 28%. On the phone they are 144px-tall 24px-radius pads that scale to 0.92 on tap.

### Team Banners and Jerseys
A kit-coloured banner with a white-backed jersey tile and the team name in Big Shoulders 900. Banners walk on from below with a slight rotation and reshuffle with layout springs. The jersey silhouette also anchors the player's waiting screen (bobbing slowly) and the podium.

### Podium
Second, first and third columns in kit colours, rounded on top, rising with a slower spring (stiffness 160, damping 16) in the order third, second, first; the winner wears an Amber crown. Scores sit in a small Housing plate in Amber.

## Do's and Don'ts

### Do:
- **Do** draw fixed readouts (codes, clocks, counters, live points) with the SVG seven-segment component in Amber on Housing.
- **Do** print state on the ticker or a board status pill, and say what happens next.
- **Do** pair every answer colour with its shape (A triangle, B diamond, C circle, D square) so colour is never the only cue.
- **Do** use the pop spring (stiffness 460, damping 22, mass 0.9) for every state change and entrance.
- **Do** keep Hot Lamp for time running out and rejection only.
- **Do** keep nested radii concentric: 28px housing, 16px panels, 12px cells, 8px chips.
- **Do** use Board Labels only to name a value on the board.

### Don't:
- **Don't** use toasts, snackbars or modal alerts for game state; the ticker and status pill carry it.
- **Don't** make purple the field. Kit Purple is one team's kit among eight, never a ground or chrome colour.
- **Don't** put amber text or digits directly on concrete or paper; on the ground, amber is a filled object with Ink text.
- **Don't** use kit colours for interface chrome, or set white text below 24px bold on Pitch Green or Kit Green.
- **Don't** separate things inside the board with borders or shadows; use the tonal steps and the lattice.
- **Don't** set prompts, clues or explanations in Big Shoulders or in tracked uppercase.
- **Don't** introduce a second easing family; ambient loops (ticker, cursor blink, waiting dots) are the only non-spring motion.
