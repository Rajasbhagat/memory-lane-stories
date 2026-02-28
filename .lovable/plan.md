

## Plan: Add Profile Section with Persistent Progress

### Database Changes

Create a `profiles` table to store user data and game progress:

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_mistakes_spotted INTEGER DEFAULT 0,
  total_hints_used INTEGER DEFAULT 0,
  best_star_rating INTEGER DEFAULT 0,
  scenarios_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public read/write since there's no auth (localStorage-based identity)
CREATE POLICY "Allow all access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
```

A device-based profile ID will be stored in localStorage and used to query the table (no auth required since this is a casual game).

### Implementation Steps

1. **Create `profiles` table** via migration tool

2. **Create `src/hooks/useProfile.ts`** -- Hook that:
   - On mount, checks localStorage for a `mindset-profile-id`
   - If found, fetches profile from database
   - If not found, creates a new profile row and stores the ID in localStorage
   - Exposes `profile`, `loading`, `updateProfile(stats)` functions

3. **Update `src/pages/Index.tsx`** -- Add a profile card below the hero showing:
   - Player name (editable)
   - Total sessions played
   - Total mistakes spotted
   - Best star rating
   - A progress bar or visual indicator
   - Still keeps the existing "Start Today's Mission" CTA

4. **Update `src/pages/Summary.tsx`** -- After game completes, call `updateProfile()` to persist the session stats (increment totals, update best rating)

### UI for Profile Section on Home Screen

Below the name input, a card will appear (only when profile data exists) showing:

```text
┌──────────────────────────────────┐
│  🕵️  Detective [Name]           │
│                                  │
│  Sessions: 12    Best: ⭐⭐⭐    │
│  Mistakes Found: 34             │
│  ═══════════════════ Progress   │
└──────────────────────────────────┘
```

The card uses existing `Card` components and animates in with framer-motion consistent with current page animations.

