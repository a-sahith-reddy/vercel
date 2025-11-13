import type { SupabaseClient } from "@supabase/supabase-js"

interface DefaultResource {
  title: string
  description: string
  link?: string
}

interface DefaultModuleContent {
  title: string
  description: string
  materials: DefaultResource[]
  quizzes: {
    title: string
    questions: {
      question: string
      options: string[]
      correct_answer: string
      explanation: string
    }[]
  }[]
}

type DbClient = SupabaseClient<any, "public", any>

const DEFAULT_SUBJECTS: DefaultModuleContent[] = [
  {
    title: "English Language Arts",
    description: "Core literacy skills with reading comprehension, writing, and grammar essentials.",
    materials: [
      {
        title: "Active Reading Checklist",
        description: "Step-by-step approach to previewing, annotating, and summarizing nonfiction passages.",
      },
      {
        title: "Grammar Essentials",
        description: "Reference sheet covering parts of speech, sentence structure, and common pitfalls.",
      },
      {
        title: "Writing Workshop Prompts",
        description: "Weekly writing prompts with guiding questions to practice structured responses.",
      },
    ],
    quizzes: [
      {
        title: "Foundations Of English Skills",
        questions: [
          {
            question: "Which sentence uses the correct subject-verb agreement?",
            options: [
              "The list of items are on the desk.",
              "Neither the teacher nor the students know the answer.",
              "Both the dog and the cat chases the ball.",
              "Each of the players have a new uniform.",
            ],
            correct_answer: "Neither the teacher nor the students know the answer.",
            explanation:
              "With 'neither/nor' constructions, the verb agrees with the subject closest to it; because 'students' is plural, the verb should be 'know'.",
          },
        ],
      },
    ],
  },
  {
    title: "Mathematics Fundamentals",
    description: "Fluency with algebra, number sense, and problem-solving patterns.",
    materials: [
      {
        title: "Algebra Cheat Sheet",
        description: "Key formulas for linear equations, inequalities, and factoring.",
      },
      {
        title: "Daily Number Sense Drills",
        description: "15-minute practice sets improving mental math and estimation.",
      },
      {
        title: "Visual Problem-Solving Strategies",
        description: "Graphic organizers for translating word problems into solvable steps.",
      },
    ],
    quizzes: [
      {
        title: "Algebra Readiness Check",
        questions: [
          {
            question: "What is the solution to 3(x - 2) = 21?",
            options: ["x = 5", "x = 7", "x = 9", "x = 11"],
            correct_answer: "x = 9",
            explanation: "Divide both sides by 3 to get x - 2 = 7, then add 2 to find x = 9.",
          },
        ],
      },
    ],
  },
  {
    title: "Science Explorations",
    description: "Inquiry-based overview of life, physical, and earth sciences with lab-style prompts.",
    materials: [
      {
        title: "Scientific Method Planner",
        description: "Template to structure hypotheses, observations, and conclusions for experiments.",
      },
      {
        title: "Energy Transformations Summary",
        description: "Visual guide explaining potential, kinetic, and thermal energy with real-world examples.",
      },
      {
        title: "Weekly Science Spotlight",
        description: "Curated articles highlighting current discoveries with reflection questions.",
      },
    ],
    quizzes: [
      {
        title: "Science Concepts Pulse Check",
        questions: [
          {
            question: "Which statement best describes photosynthesis?",
            options: [
              "It converts sunlight into stored chemical energy in plants.",
              "It releases energy from glucose molecules in animal cells.",
              "It transfers heat between the atmosphere and oceans.",
              "It breaks down nutrients in the digestive systems of mammals.",
            ],
            correct_answer: "It converts sunlight into stored chemical energy in plants.",
            explanation:
              "Photosynthesis uses sunlight, water, and carbon dioxide to produce glucose, storing chemical energy within plant tissues.",
          },
        ],
      },
    ],
  },
]

/**
 * Ensure a newly created user has starter subjects, materials, and zeroed dashboard state.
 * This should be invoked during the user's first authenticated request.
 */
export async function initializeUserDefaults(supabase: DbClient, userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_initialized")
    .eq("id", userId)
    .maybeSingle()

  if (profileError) {
    console.error("Failed to fetch profile during initialization:", profileError)
    return
  }

  if (profile?.is_initialized) {
    return
  }

  const { data: subjectRecords, error: subjectsError } = await supabase
    .from("subjects")
    .select("id")
    .eq("user_id", userId)

  if (subjectsError) {
    console.error("Failed to check subjects during initialization:", subjectsError)
    return
  }

  if (subjectRecords && subjectRecords.length > 0) {
    await markInitialized(supabase, userId)
    return
  }

  const insertPayload = DEFAULT_SUBJECTS.map((subject) => ({
    user_id: userId,
    name: subject.title,
    description: subject.description,
  }))

  const { data: insertedSubjects, error: insertError } = await supabase
    .from("subjects")
    .insert(insertPayload)
    .select("id, name")

  if (insertError || !insertedSubjects) {
    console.error("Failed to insert default subjects:", insertError)
    return
  }

  for (const inserted of insertedSubjects) {
    const source = DEFAULT_SUBJECTS.find((subject) => subject.title === inserted.name)
    if (!source) continue

    if (source.materials.length > 0) {
      const materialsPayload = source.materials.map((material) => ({
        subject_id: inserted.id,
        title: material.title,
        content: material.description,
      }))

      const { error: materialsError } = await supabase.from("study_materials").insert(materialsPayload)
      if (materialsError) {
        console.error(`Failed to insert materials for subject ${inserted.name}:`, materialsError)
      }
    }

    for (const quiz of source.quizzes) {
      const { data: quizRecord, error: quizError } = await supabase
        .from("quizzes")
        .insert({ subject_id: inserted.id, title: quiz.title })
        .select("id")
        .single()

      if (quizError || !quizRecord) {
        console.error(`Failed to insert quiz for subject ${inserted.name}:`, quizError)
        continue
      }

      const questionsPayload = quiz.questions.map((question) => ({
        quiz_id: quizRecord.id,
        question: question.question,
        options: question.options,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
      }))

      const { error: questionsError } = await supabase.from("quiz_questions").insert(questionsPayload)
      if (questionsError) {
        console.error(`Failed to insert quiz questions for subject ${inserted.name}:`, questionsError)
      }
    }
  }

  await markInitialized(supabase, userId)
}

async function markInitialized(supabase: DbClient, userId: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ is_initialized: true })
    .eq("id", userId)

  if (error) {
    console.error("Failed to mark profile as initialized:", error)
  }
}

