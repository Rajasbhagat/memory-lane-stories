

## Plan: Enhanced Home Screen Dashboard UI

The current home page has the profile card but it only shows when `total_sessions > 0`. The user wants a more polished dashboard-style home screen that always shows the profile section.

### Changes to `src/pages/Index.tsx`

1. **Always-visible profile section** — Show the profile card even for new users (with zero stats), displaying a "New Detective" badge and encouraging first mission

2. **Dashboard-style layout** with these sections:
   - **Hero** — Keep detective icon + greeting (slightly smaller)
   - **Profile Card** — Always visible. Shows avatar area with detective emoji, editable name, and rank/title based on sessions (e.g. "Rookie", "Junior Detective", "Senior Detective")
   - **Stats Grid** — 2x2 grid of stat cards with icons:
     - Sessions played (with calendar icon)
     - Mistakes spotted (with eye icon)  
     - Hints used (with lightbulb icon)
     - Best rating (with star icon)
   - **Progress section** — Visual progress bar with level indicator
   - **CTA Button** — "Start Today's Mission" stays at bottom

3. **Detective rank system** based on sessions:
   - 0 sessions → "Rookie Detective"
   - 1-3 → "Junior Detective"  
   - 4-7 → "Detective"
   - 8+ → "Senior Detective"

4. **Visual polish**:
   - Each stat in its own mini card with a colored icon
   - Warm cream/sage/coral palette consistent with design system
   - All text 22px+ for senior-friendly readability
   - Touch targets 48px+
   - Smooth framer-motion stagger animations

### No database changes needed
The existing `profiles` table already has all required fields.

