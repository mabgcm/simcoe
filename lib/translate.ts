import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Fields = { title: string; excerpt: string; body: string };
type TranslationResult = { tr: Fields; en: Fields };

/**
 * Translates content into both Turkish and English using GPT-4o-mini.
 * HTML tags in `body` are preserved; only their text content is translated.
 * Falls back gracefully — on failure returns the original in both locales.
 */
export async function translateContent(original: Fields): Promise<TranslationResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a professional Turkish-English translator for a community association website. " +
            "Translate the provided content fields into both Turkish (tr) and English (en). " +
            "The `body` field may contain HTML — preserve ALL HTML tags exactly as they are and translate only the visible text inside them. " +
            "Return a valid JSON object with this exact shape: { \"tr\": { \"title\": \"\", \"excerpt\": \"\", \"body\": \"\" }, \"en\": { \"title\": \"\", \"excerpt\": \"\", \"body\": \"\" } }. " +
            "Keep the tone natural and community-friendly. Do not add explanations outside the JSON."
        },
        {
          role: "user",
          content: JSON.stringify({ title: original.title, excerpt: original.excerpt, body: original.body })
        }
      ]
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as Partial<TranslationResult>;

    const fallback = (f?: Partial<Fields>): Fields => ({
      title: f?.title || original.title,
      excerpt: f?.excerpt || original.excerpt,
      body: f?.body || original.body
    });

    return { tr: fallback(parsed.tr), en: fallback(parsed.en) };
  } catch (err) {
    console.error("[translate] Failed:", err);
    return { tr: original, en: original };
  }
}
