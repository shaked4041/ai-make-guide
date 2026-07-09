import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const GenerateInput = z.object({
  description: z
    .string()
    .trim()
    .min(10, "Please describe your automation in a bit more detail")
    .max(2000, "Description must be under 2000 characters"),
  userType: z.enum(["My own business", "A client", "Learning / practice"]),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  mainGoal: z.string().trim().min(1).max(120),
  appsInvolved: z.string().trim().max(300).optional(),
});

const SYSTEM_PROMPT = `You are Make Copilot, an expert Make.com (formerly Integromat) automation architect. Given a user's automation goal, produce a complete, practical Make.com implementation plan in well-formatted Markdown.

Always use EXACTLY this structure with these numbered H2 headings:

## 1. Automation Summary
A short paragraph explaining what the automation does and the value it delivers.

## 2. Make.com Scenario Design
List the required modules IN ORDER as an ordered list (e.g. "1. Webhooks — Custom webhook"). Then, for each module, add an H3 subsection containing:
- **Module name** (exact app + module name as it appears in Make.com)
- **Purpose** — why this module is in the scenario
- **Configuration** — step-by-step setup instructions
- **Required fields** — the fields that must be filled in
- **Data mapping** — which values map from earlier modules and how

## 3. Logic
Cover filters (with example conditions), routers (if branching is needed), conditions, and error handling recommendations (error handlers, retries, incomplete executions).

## 4. Best Practices
Common mistakes to avoid, how to make the scenario reliable, and how to reduce unnecessary operations.

## 5. Estimated Make.com Operations
Give an approximate number of operations consumed per execution and briefly explain the math.

## 6. Beginner-Friendly Explanation
Explain the whole automation in simple, non-technical language a complete beginner can follow.

Rules:
- Only design for Make.com — never suggest Zapier, n8n, or other platforms.
- Use real Make.com module names where possible.
- Tailor depth of explanations to the user's experience level.
- Be concrete and actionable; avoid filler.`;

export const generatePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured for this project.");

    const { data: request, error: reqError } = await supabase
      .from("automation_requests")
      .insert({
        user_id: userId,
        description: data.description,
        user_type: data.userType,
        experience_level: data.experienceLevel,
        main_goal: data.mainGoal,
        apps_involved: data.appsInvolved || null,
      })
      .select("id")
      .single();

    if (reqError || !request) {
      console.error("Failed to save request", reqError);
      throw new Error("Could not save your request. Please try again.");
    }

    const gateway = createLovableAiGatewayProvider(apiKey);
    let content = "";
    try {
      const result = await generateText({
        model: gateway("openai/gpt-5.5"),
        system: SYSTEM_PROMPT,
        prompt: [
          `Automation description: ${data.description}`,
          `Who is this automation for: ${data.userType}`,
          `Experience level with Make.com: ${data.experienceLevel}`,
          `Main goal: ${data.mainGoal}`,
          data.appsInvolved ? `Apps involved: ${data.appsInvolved}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      });
      content = result.text;
    } catch (err) {
      console.error("AI generation failed", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) {
        throw new Error("Rate limit reached. Please wait a moment and try again.");
      }
      if (msg.includes("402")) {
        throw new Error("AI credits are exhausted. Please add credits to your workspace and try again.");
      }
      throw new Error("Plan generation failed. Please try again.");
    }

    if (!content.trim()) {
      throw new Error("The AI returned an empty plan. Please try again.");
    }

    const { error: planError } = await supabase.from("generated_plans").insert({
      request_id: request.id,
      user_id: userId,
      content,
      model: "openai/gpt-5.5",
    });

    if (planError) {
      console.error("Failed to save plan", planError);
      throw new Error("The plan was generated but could not be saved. Please try again.");
    }

    return { requestId: request.id };
  });
