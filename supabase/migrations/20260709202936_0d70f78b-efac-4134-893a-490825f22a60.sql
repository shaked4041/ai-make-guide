-- Automation requests submitted by users
CREATE TABLE public.automation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  description text NOT NULL,
  user_type text NOT NULL,
  experience_level text NOT NULL,
  main_goal text NOT NULL,
  apps_involved text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.automation_requests TO authenticated;
GRANT ALL ON public.automation_requests TO service_role;
ALTER TABLE public.automation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own requests" ON public.automation_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own requests" ON public.automation_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own requests" ON public.automation_requests
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Generated AI plans linked to requests
CREATE TABLE public.generated_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.automation_requests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  model text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_plans TO authenticated;
GRANT ALL ON public.generated_plans TO service_role;
ALTER TABLE public.generated_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own plans" ON public.generated_plans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own plans" ON public.generated_plans
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON public.generated_plans
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_automation_requests_user ON public.automation_requests(user_id, created_at DESC);
CREATE INDEX idx_generated_plans_request ON public.generated_plans(request_id);