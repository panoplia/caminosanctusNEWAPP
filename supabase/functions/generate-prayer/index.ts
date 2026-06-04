// Deno runtime — deploy via: supabase functions deploy generate-prayer
// Key is set as a Supabase function secret, NEVER client-side.
// 🔒 HUMAN-GATED: supabase functions deploy generate-prayer (see HANDOFF_CHECKLIST.md)

import Anthropic from "npm:@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SYSTEM_PROMPT_URL = new URL("./system.v1.md", import.meta.url);

// Rate limits: 5/day free users, 30/day paid users (cost-control)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const FREE_DAILY_LIMIT = 5;
const PAID_DAILY_LIMIT = 30;

function getRateLimit(userId: string, isPaid: boolean): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const entry = rateLimitStore.get(userId);

  if (!entry || now > entry.resetAt) {
    const limit = isPaid ? PAID_DAILY_LIMIT : FREE_DAILY_LIMIT;
    rateLimitStore.set(userId, { count: 1, resetAt: now + dayMs });
    return { allowed: true, remaining: limit - 1 };
  }

  const limit = isPaid ? PAID_DAILY_LIMIT : FREE_DAILY_LIMIT;
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

interface GenerateRequest {
  userId: string;
  isPaid: boolean;
  name: string;
  tradition: "catholic" | "orthodox" | "neither";
  emotionalState: string;
  burdenText: string;
  passages: Array<{ ref: string; text: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate required fields
  const { userId, isPaid, name, tradition, emotionalState, burdenText, passages } = body;
  if (!userId || !name || !tradition || !emotionalState || !burdenText) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Rate limiting
  const { allowed, remaining } = getRateLimit(userId, isPaid);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Daily prayer limit reached. Try again tomorrow." }),
      { status: 429, headers: { "Content-Type": "application/json", "X-RateLimit-Remaining": "0" } },
    );
  }

  // Read system prompt from co-located file
  let systemPrompt: string;
  try {
    systemPrompt = await Deno.readTextFile(SYSTEM_PROMPT_URL);
  } catch {
    // Fallback: inline the locked closing lines if file isn't available
    systemPrompt = "Eres un compañero de oración. Escribe UNA oración personal en español. Cierra SIEMPRE con la línea obligatoria de sacerdote/padre espiritual.";
  }

  const passageBlock = passages && passages.length > 0
    ? passages.map((p) => `${p.ref}: "${p.text}"`).join("\n")
    : "(ningún pasaje disponible)";

  const userBlock = `nombre: ${name}
tradicion: ${tradition}
estado: ${emotionalState}
carga: ${burdenText}
pasajes:
${passageBlock}`;

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userBlock }],
    });

    const prayerText = response.content[0].type === "text" ? response.content[0].text.trim() : "";

    return new Response(
      JSON.stringify({
        prayer: prayerText,
        emotionalState,
        tradition,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
  } catch (err) {
    console.error("Anthropic API error:", err);
    return new Response(JSON.stringify({ error: "Prayer generation failed. Please try again." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
});
