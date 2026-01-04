-- Add review related columns to Submission table if they don't exist

DO $$
BEGIN
    -- Add reviewer_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Submission' AND column_name = 'reviewer_id') THEN
        ALTER TABLE "Submission" ADD COLUMN reviewer_id INTEGER REFERENCES "SignUp"(id);
    END IF;

    -- Add approved_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Submission' AND column_name = 'approved_date') THEN
        ALTER TABLE "Submission" ADD COLUMN approved_date TIMESTAMP;
    END IF;

    -- Add rejected_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Submission' AND column_name = 'rejected_date') THEN
        ALTER TABLE "Submission" ADD COLUMN rejected_date TIMESTAMP;
    END IF;

    -- Add rejection_reason column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Submission' AND column_name = 'rejection_reason') THEN
        ALTER TABLE "Submission" ADD COLUMN rejection_reason TEXT;
    END IF;
END $$;
