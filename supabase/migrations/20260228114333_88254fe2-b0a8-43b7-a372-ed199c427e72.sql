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

CREATE POLICY "Allow all access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);