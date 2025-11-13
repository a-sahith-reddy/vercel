-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create study materials table
CREATE TABLE IF NOT EXISTS public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quiz attempts table (for tracking user progress)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  attempted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, quiz_id)
);

-- Create study sessions table (for tracking progress)
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  duration_minutes INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Allow users to view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Subjects RLS policies
CREATE POLICY "Allow users to view their own subjects"
  ON public.subjects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create subjects"
  ON public.subjects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own subjects"
  ON public.subjects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own subjects"
  ON public.subjects FOR DELETE
  USING (auth.uid() = user_id);

-- Study materials RLS policies
CREATE POLICY "Allow users to view study materials of their subjects"
  ON public.study_materials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.subjects
      WHERE subjects.id = study_materials.subject_id
      AND subjects.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to create study materials"
  ON public.study_materials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subjects
      WHERE subjects.id = study_materials.subject_id
      AND subjects.user_id = auth.uid()
    )
  );

-- Quizzes RLS policies
CREATE POLICY "Allow users to view quizzes of their subjects"
  ON public.quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.subjects
      WHERE subjects.id = quizzes.subject_id
      AND subjects.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to create quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subjects
      WHERE subjects.id = quizzes.subject_id
      AND subjects.user_id = auth.uid()
    )
  );

-- Quiz questions RLS policies
CREATE POLICY "Allow users to view quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      JOIN public.subjects ON subjects.id = quizzes.subject_id
      WHERE quizzes.id = quiz_questions.quiz_id
      AND subjects.user_id = auth.uid()
    )
  );

-- Quiz attempts RLS policies
CREATE POLICY "Allow users to view their own attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own attempts"
  ON public.quiz_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- Study sessions RLS policies
CREATE POLICY "Allow users to view their own sessions"
  ON public.study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create sessions"
  ON public.study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
