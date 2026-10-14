# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React (user choice), Tailwind CSS, Framer Motion, lucide-react, qrcode.react. Client-only; multiplayer is mocked with the browser `BroadcastChannel` API behind a single `useMultiplayerSync` hook so a real realtime backend can replace it later.

## Users

- **Host:** a lecturer or trainer running a live quiz for a room of university students or adult trainees. Drives the game from a laptop connected to a projector.
- **Players:** university students / adult learners, organised into teams, each team answering from one phone.

## Product Purpose

A real-time classroom quiz (Kahoot/Quizizz-like) that turns a lecture segment into a team competition. Success: the host can create a room, get teams in within a minute via code or QR, run a round, and end on a leaderboard without explaining anything.

## Positioning

Two game modes in one room: **Convergent Clues** (4 hints revealed one by one converging on one typed answer — early commitment earns more) and **Standard Quiz** (1 question, 4 options). Score is strictly time-based: `points = 1000 × remaining / total`.

## Operating Context

- Host screen is projected in a lit lecture hall and read from the back row; type must be huge.
- Players hold phones, often joining by scanning the QR with Zalo or the camera app.
- Prototype testing happens with host and player in separate tabs of the same browser.

## Capabilities and Constraints

- Flow: Landing → Host setup (mode, time limit) → Lobby (6-digit code, QR to `/join/{code}`, live team list) → Gameplay → Leaderboard. Player: Join (code, auto-filled from QR URL) → Team name → Waiting → Controller → Feedback.
- Convergent Clues answers are matched leniently: case-, diacritic- and whitespace-insensitive, with accepted aliases per answer.
- UI is bilingual Vietnamese / English with a toggle; mock data exists in both languages.
- BroadcastChannel only syncs tabs of one browser on one machine; a phone scanning the QR loads the join screen but cannot sync until a real backend replaces the hook.

## Evidence on Hand

No real question bank, school, or brand assets. Mock questions are authored demonstration content.

## Product Principles

1. The projector is read from the back row: scale beats density.
2. A team should never wonder what to do next; every waiting state says what happens next.
3. Speed is the drama: the shrinking score must be visible, not just computed.
4. One sync seam: all realtime traffic passes through one hook.
