import { generateObject } from "ai"
import { z } from "zod"

const studyGuideSchema = z.object({
  overview: z.object({
    introduction: z.string(),
    learningObjectives: z.array(z.string()),
    summary: z.string(),
  }),
  suggestedSubjects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    }),
  ),
  modules: z
    .array(
    z.object({
      title: z.string(),
      objective: z.string(),
      contentSummary: z.string(),
      keyConcepts: z.array(z.string()),
      practiceActivities: z.array(z.string()),
      resources: z.array(
        z.object({
          title: z.string(),
          type: z.string(),
          reference: z.string(),
        }),
      ),
    }),
    )
    .min(3),
  quickNotes: z.array(z.string()).min(3),
  quiz: z
    .array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).min(3),
      answer: z.string(),
      explanation: z.string(),
    }),
    )
    .min(3),
  suggestedMaterials: z
    .array(
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),
    }),
    )
    .min(3),
  studyTips: z.array(z.string()),
  notesSummary: z.string().optional(),
})

export const maxDuration = 30

export async function POST(req: Request) {
  const { topic, subject, level, notes } = await req.json()

  if (!topic || !subject) {
    return Response.json({ error: "Topic and subject are required" }, { status: 400 })
  }

  try {
    const noteContext = notes ? `Additional learner notes to summarize and integrate:\n"""${notes.trim()}"""` : ""

    const prompt = `You are an AI study coach. Develop a structured learning guide with modules, summaries, quizzes, and curated resources.
Focus topic: "${topic}"
Subject area: "${subject}"
Learner level: "${level || "intermediate"}"
${noteContext}

Requirements:
- Return JSON that fits the provided schema exactly.
- Modules should scaffold learning (overview -> practice) and include resource suggestions (books, videos, websites) with plain-text references.
- Provide a short quiz (4 options per question) and name the correct answer in the answer field as the full option text. Include clear explanations.
- Suggested materials must span at least three different subject areas such as English, mathematics, science, social studies, or technology.
- If notes are provided, add a concise notesSummary highlighting the most important takeaways.
- Keep language encouraging, learner-friendly, and free of markdown formatting characters.`

    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: studyGuideSchema,
      prompt,
      temperature: 0.6,
      maxOutputTokens: 2500,
    })

    return Response.json({ guide: object })
  } catch (error: unknown) {
    console.error("Error generating guide:", error)
    return Response.json({ error: "Failed to generate study guide" }, { status: 500 })
  }
}
