-- Add ai_feedback column to Submission table

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Submission' AND column_name = 'ai_feedback') THEN
        ALTER TABLE "Submission" ADD COLUMN ai_feedback TEXT;
    END IF;
END $$;
