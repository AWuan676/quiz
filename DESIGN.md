---
name: Quizmap
description: A bilingual real-time classroom quiz drawn as a park guide map, with flat colour lands on cream water and every control a capsule.
colors:
  water: "#f5f1e4"
  water-2: "#ebe5d2"
  paper: "#fffdf6"
  ink: "#2c2e2a"
  ink-2: "#5a5c55"
  land: "#8ed462"
  land-2: "#74bd47"
  sun: "#f5e211"
  coral: "#ff705d"
  pond: "#2ba0ff"
  lilac: "#ebc1ff"
  apricot: "#ffb46b"
  mint: "#7ed9cb"
  rose: "#ffa3c7"
typography:
  display:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7.5vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.625
  label:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.12em"
  button:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    letterSpacing: "-0.01em"
rounded:
  key: "16px"
  plate: "36px"
  panel: "40px"
  full: "9999px"
spacing:
  gutter-sm: "20px"
  gutter: "40px"
  cell: "8px"
  stack: "24px"
  content-max: "1500px"
components:
  button-land:
    backgroundColor: "{colors.land}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    height: "64px"
    padding: "0 28px"
  button-land-hover:
    backgroundColor: "{colors.land-2}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.water}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    height: "64px"
    padding: "0 28px"
  button-outline:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    height: "64px"
    padding: "0 28px"
  button-arrow-chip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.water}"
    rounded: "{rounded.full}"
    size: "48px"
  code-cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.key}"
  text-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: "64px"
    padding: "0 24px"
  info-capsule:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  time-track:
    backgroundColor: "{colors.water-2}"
    rounded: "{rounded.full}"
    height: "20px"
  answer-plate:
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "20px"
---

# Design System: Quizmap

## Overview

**Creative North Star: "The Park Guide Map"**

Quizmap reads like the fold-out map handed out at a zoo or botanical garden: flat colour lands sitting on cream water, organic coastlines that swell in from the frame edge, and every control shaped as a capsule. The classroom room is the park; teams are coloured areas on it, each carrying a number; the question timer is a path that drains; the answer lands as a coloured pin. One land lobe per screen is enough. Everything else is cream, ink, and capsules.

The system is minimal by commitment. There is one typeface, one ink, one ground, and a small set of saturated flat colours that always carry ink text. No surface is dark, nothing is gradient-filled, nothing casts a shadow. Measurements (question number, live points, seconds left) always sit on a fixed three-column tabular grid so a projector can be read from the back row and a phone can be read at arm's length. Motion is one grammar: a short spring that overshoots and settles.

It deliberately refuses the dark scoreboard panel and the purple game-show field.

**Key Characteristics:**
- Cream water ground (never white, never dark) with ink text throughout.
- Flat colour lands and blobs, drawn as SVG coastlines; no gradients, grain, or shadows.
- Every interactive control is a full capsule; panels use very large radii.
- One grotesk, Be Vietnam Pro, with an 800-weight display at 0.95 leading and -0.04em tracking.
- Numbers are tabular and arranged on a fixed measurement grid.
- One spring for every move: ~0.4s, overshoot, settle.

## Colors

A cream-and-ink map with a short run of bright, flat land colours that all carry ink text.

### Primary
- **Park Lawn Green** (land): the default land. The landing-page corner lobe, the lobby's QR land, the primary capsule button, the "answered" check dot, the healthy state of the time track, and the correct-answer feedback panel. Hover deepens to **Mown Lawn** (land-2).

### Secondary
- **Map Sun Yellow** (sun): information capsules (game mode), the revealed-answer capsule in clue mode, the time track between 50% and 20%, the text selection colour, and the "open player" link capsule.
- **Coral Enclosure** (coral): urgency. The time track in its last fifth, the "time up / all answered" status capsule, the incorrect-answer feedback panel, the invalid code-cell ring, and answer pin A.
- **Pond Blue** (pond): the focus ring for every focusable element, a secondary corner lobe at the bottom-left of landing and waiting screens, and answer pin B.

### Tertiary
- **Lilac Garden** (lilac): quiet secondary information (duration and question count capsule), the time-up panel, the footer blob on landing.
- **Apricot**, **Mint**, **Rose** (apricot, mint, rose): team colours only, extending the kit run after land, coral, pond, sun, and lilac. Teams receive colours in join order and cycle after eight.

### Neutral
- **Cream Water** (water): the page ground on every screen, the sticky action bar, the round backing behind answer-pin icons, the QR card, and text on ink capsules.
- **Shallow Water** (water-2): the empty track of the time track, locked hint bars, unrevealed hint numbers, neutral status capsules, the empty-lobby placeholder blob, scrollbar thumb.
- **Map Paper** (paper): input surfaces only: code cells, the clue answer field, the setup preview card.
- **Map Ink** (ink): all text, the ink capsule button, the arrow chip, the active state of the language toggle, rule lines under standings and reveal grids.
- **Faded Ink** (ink-2): secondary text, measurement labels, fraction denominators ("/10"), rank numbers.

### Named Rules
**The Ink-On-Colour Rule.** Every coloured surface (land, sun, coral, pond, lilac, and every team kit) carries ink (#2c2e2a) text. White text on colour does not exist in this world; the only light text is cream water on ink.

**The Shape-Plus-Colour Rule.** Answer pins are never colour alone: A is a coral triangle, B a pond diamond, C a sun circle, D a land square, and each also shows its letter.

**The Three-Step Track Rule.** Draining time goes land above 50%, sun from 50% to 20%, coral in the last 20%. No other colour sequence signals time.

## Typography

**Display Font:** Be Vietnam Pro (with system-ui, sans-serif)
**Body Font:** Be Vietnam Pro (with system-ui, sans-serif)

**Character:** A single friendly grotesk with full Vietnamese diacritic support. Display text is set heavy and tight, like map titles; everything else is medium or semibold. Only the 500, 600, and 800 cuts are loaded.

### Hierarchy
- **Display** (800, clamp(3rem, 7.5vw, 6rem), 0.95, -0.04em): the landing headline, the lobby room code (scaled up to clamp(5rem, 13vw, 12rem) with -0.02em), the player's final rank, feedback headlines.
- **Headline** (800, clamp(2rem, 3.8vw, 3.5rem), 0.95, -0.04em): the projected question prompt; the revealed answer in clue mode.
- **Title** (800, 1.5rem to 3rem, 0.95, -0.04em): section heads (Standings, Teams), measurement values (text-5xl on projector, text-2xl on phone), team names beside their blobs.
- **Body** (500, 1.125rem, 1.625): explanatory copy at max-w-md (about 28rem); answer option text and hints switch to semibold at larger clamped sizes.
- **Label** (600, 0.75rem, 0.12em, uppercase, faded ink): names the value directly beneath it in the measurement grid and reveal grid. Never stands alone above a heading.
- **Button** (600, 1rem / 1.125rem / 1.5rem by size, -0.01em, uppercase): capsule button text.

### Named Rules
**The Tabular Measures Rule.** Every number that changes (scores, points, seconds, room code, ranks) is set with tabular figures so values do not jitter as they count.

**The One Family Rule.** Hierarchy comes from weight (800 vs 500/600) and size, never from a second typeface.

## Layout

Content sits in a centred column capped at 1500px, with 20px side gutters on phones and 40px from the `sm` breakpoint (640px). Host screens split at `lg` (1024px): the landing uses a 1.15fr / 1fr two-column grid; the host game uses a fluid stage beside a fixed 360px standings column. Player screens are single-column at max-w-md or max-w-xl.

The measurement grid is a fixed three-column row (question number left, live points centred, seconds right, each a label over a tabular value) with the time track directly under it. It appears identically on the projector and the phone, only scaled.

Host screens end in a sticky bottom action bar on cream water, separated by a 2px ink/10 top rule, with status on the left and capsule buttons on the right; content carries bottom padding (pb-36) to clear it. Corner lobes are absolutely positioned, bleed past the frame (negative offsets in vw), and sit behind content (`z-10` content over them). On phones the landing lobe grows to 115vw and shifts further off-frame; the secondary pond lobe is hidden below `md`.

Spacing is Tailwind's 4px scale; common steps are 8px (code-cell and pin gaps of 8 to 12px), 24px (stack between heading and content), 40 to 48px (between major regions).

## Elevation & Depth

The world is completely flat. There are no box-shadows, no gradients, and no textures anywhere in the build. Depth is expressed only by layering flat colour: cream water is the sea, lands (lobes, blobs) sit on it, and paper or water cards sit inside a land (the lobby QR card inside the green blob). Selection emphasis is a ring, not a lift: the correct answer gets a 4px ink ring with a 4px cream offset and a 1.03 scale.

### Named Rules
**The Flat Map Rule.** Nothing casts a shadow. If a surface needs to stand apart, place it on a different flat colour or ring it in ink.

## Shapes

Two families of form. **Organic lands**: SVG coastlines and four blob outlines (`Lobe.jsx`) used for corner lobes, team markers, the brand mark, and the QR land; they are filled flat and never stroked. **Capsules**: every control, chip, status, input, and track is fully rounded (9999px). Larger panels use very soft rectangles: 16px for code cells, 28px for inner preview wells, 36px for answer plates on the phone and the QR card, 40px for full-screen feedback panels, setup cards, and the tops of podium columns.

Rings (2px inset) stand in for borders on inputs, the outline button, the language toggle, and the setup card. Straight rules appear only as data dividers: a 2px ink line under the standings head and above the reveal grid, 1px ink/10 between standings rows.

**The Capsule Rule.** If a user can press it, it is a capsule (or a round chip). No square or slightly-rounded buttons.

## Components

### Buttons
Tactile capsules with an optional arrow chip that rolls forward.
- **Shape:** full capsule (9999px). Three sizes: md 48px tall, lg 64px, xl 80px.
- **Land (default):** land fill, ink uppercase semibold text; hover deepens to land-2.
- **Ink:** ink fill with cream text; used for secondary-but-strong actions (create room, show answer).
- **Sun / Coral / Pond:** flat fills with ink text, for contextual actions.
- **Outline:** transparent with a 2px inset ink ring; hover tints ink at 5%.
- **Arrow chip:** a round ink chip (36 / 48 / 60px) on the trailing edge carrying an arrow; on an ink button the chip inverts to cream. On hover the chip slides 4px right on the spring.
- **Press / Disabled:** press scales to 0.96 on the spring; disabled drops to 35% opacity with a not-allowed cursor. Focus is the global 3px pond outline at 3px offset.

### Chips
- **Info capsules:** sun or lilac fill, ink 14px semibold, 6px by 16px padding (mode, duration).
- **Status capsule:** water-2 by default, coral when urgent; enters with a short spring rise.
- **Gain chip:** land fill for "+points", water-2 with faded ink for none.

### Cards / Containers
- **Corner Style:** 36 to 40px.
- **Background:** paper with a 2px ink/10 ring (setup card), or a flat land / coral / lilac fill for full-screen feedback panels.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Internal Padding:** 20 to 28px.

### Inputs / Fields
- **Code input:** six paper cells (4:5 aspect, 16px radius, 8px gap) over one real numeric input. Empty ring ink/10, filled ink/25, active ink with a small ink caret bar, invalid coral. Digits pop in on the spring in tabular display type.
- **Text field:** paper capsule, 64px tall, 2px inset ink/15 ring that turns full ink on focus; 20px semibold entry.

### Navigation
- **Language toggle:** a capsule with a 2px inset ink ring holding VI / EN segments; the active segment is an ink pill with cream text that slides between options on the spring (shared layout).
- **Brand:** a small land blob beside "Quizmap" in 20px display type.

### Team Blob (signature)
A team is a flat organic blob in its kit colour with its number in ink display type, sized from 16px dots in standings to 160px on the player's waiting screen, where it floats gently.

### Time Track (signature)
A water-2 capsule track (20px on projector, 12px on phone) whose fill drains linearly and shifts land, sun, coral per the Three-Step Track Rule.

### Answer Pins (signature)
Coloured capsules (projector) or 36px-radius plates (phone) in the A to D pin colours, each holding a round cream backing with its filled shape icon, the letter in display type, and the option text. On reveal, wrong pins fade to 30% and the right one gains an ink ring.

### Corner Lobe (signature)
One coastline that swells in from a screen corner (spring from 0.6 scale), bleeding off two edges. One land lobe per screen, optionally a smaller pond lobe in the opposite corner.

### Podium
Three kit-coloured columns with 40px top corners rising on a softer spring (revealed 3rd, 2nd, 1st), each topped by its team blob and name; the winner carries a crown icon.

## Do's and Don'ts

### Do:
- **Do** set every screen on cream water (#f5f1e4) with ink (#2c2e2a) text.
- **Do** put ink text on every colour fill, including all team kits and answer pins.
- **Do** make every pressable control a full capsule or round chip, with the trailing arrow chip on forward actions.
- **Do** use the shared spring (stiffness 460, damping 22, mass 0.9) for enters, presses, and layout moves.
- **Do** show changing numbers in tabular display type on the three-column measurement grid with a label over each value.
- **Do** pair every answer colour with its shape and letter.
- **Do** use the 3px pond focus outline at 3px offset for keyboard focus.

### Don't:
- **Don't** use box-shadows, gradients, grain, or dark panels; depth is flat colour layering.
- **Don't** use white text on a colour fill.
- **Don't** introduce a second typeface or a weight outside 500, 600, 800.
- **Don't** add more than one land lobe per screen.
- **Don't** signal time with any sequence other than land, sun, coral.
- **Don't** use colour alone to distinguish answers.
