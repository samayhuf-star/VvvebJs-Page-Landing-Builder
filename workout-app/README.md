# FitCoach – your personal trainer

A zero-dependency, offline-capable web app (PWA). Open `index.html` via any static server, e.g. `python3 -m http.server` in this folder.

- **Adaptive plan** – picks a split (full body / upper-lower / push-pull-legs) from your goal, level, days per week, session length and equipment; chooses exercises, sets, reps and rest; rotates variations and raises targets when you hit them.
- **Exercise demos** – animated figure for every move plus front/back muscle maps showing primary and secondary muscles.
- **Workout player** – set-by-set logging, rest timer, hold timers, weight tracking, calorie estimate.
- **Calories** – BMR/TDEE-based daily target with macros, food search and custom entries.
- **Sleep** – nightly log, 7-day chart, sleep debt. Under 6 h switches the next workout to recovery mode.
- All data stays in your browser (`localStorage`); export/reset on the Me tab.
