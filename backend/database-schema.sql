-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  suffix VARCHAR(20),
  birthday DATE,
  gender VARCHAR(20),
  civil_status VARCHAR(50),
  citizenship VARCHAR(100),
  mobile_number VARCHAR(20),
  facebook VARCHAR(255),
  street TEXT,
  barangay VARCHAR(100),
  city VARCHAR(100),
  province VARCHAR(100),
  country VARCHAR(100),
  zip_code VARCHAR(20),
  profile_picture_url TEXT,
  role VARCHAR(50) CHECK(role IN ('applicant', 'scholar', 'staff', 'admin')) DEFAULT 'applicant',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- STAFF TABLE (already exists, referenced by KKFI grant)
-- ============================================================
CREATE TABLE staff (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id      TEXT UNIQUE NOT NULL,
  first_name    TEXT NOT NULL,
  middle_name   TEXT,
  last_name     TEXT NOT NULL,
  suffix        TEXT,
  gender        TEXT,
  birthdate     DATE,
  position      TEXT NOT NULL,
  date_hired    DATE,
  regularization_date DATE,
  email         TEXT,
  contact_number TEXT,
  tin           TEXT,
  sss           TEXT,
  pagibig       TEXT,
  philhealth    TEXT,
  address       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- BASE APPLICATION TABLE (shared across all 3 types)
-- ============================================================
CREATE TABLE applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- discriminator column — tells you which detail table to join
  application_type TEXT NOT NULL,
  -- 'tertiary'
  -- 'kkfi_grant'
  -- 'vocational'

  fund_type       TEXT,           -- nullable: 'KKFI Funded' | 'Partner Funded'
  status          TEXT DEFAULT 'pending',
  -- 'pending' | 'under_review' | 'approved' | 'rejected'

  submitted_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- SHARED: SECONDARY EDUCATION
-- (used by Tertiary, KKFI Child/Self-Tertiary, Vocational)
-- ============================================================
CREATE TABLE secondary_education (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,

  school_name     TEXT NOT NULL,
  strand          TEXT NOT NULL,  -- 'STEM'|'ABM'|'HUMSS'|'GAS'|'TVL'
  year_graduated  INTEGER NOT NULL,

  created_at      TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- SHARED: TERTIARY EDUCATION
-- (used by Tertiary, KKFI Child, KKFI Self-Tertiary path)
-- ============================================================
CREATE TABLE tertiary_education (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,

  school_name     TEXT NOT NULL,
  program         TEXT NOT NULL,
  term_type       TEXT NOT NULL,  -- 'Semester'|'Trimester'|'Quarter System'
  grade_scale     TEXT NOT NULL,
  year_level      TEXT NOT NULL,  -- '1st'|'2nd'|'3rd'|'4th'
  term            TEXT NOT NULL,  -- '1st'|'2nd'|'3rd'|'4th'

  created_at      TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- SHARED: FAMILY MEMBERS
-- (used by Tertiary and Vocational)
-- ============================================================
CREATE TABLE family_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID REFERENCES applications(id) ON DELETE CASCADE,

  role            TEXT NOT NULL,  -- 'father'|'mother'|'other'
  full_name       TEXT NOT NULL,
  employment_status TEXT NOT NULL,
  occupation      TEXT,
  monthly_income  NUMERIC(12,2),

  created_at      TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- TYPE 1: TERTIARY SCHOLARSHIP — extra fields
-- ============================================================
CREATE TABLE tertiary_application_details (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id      UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,

  scholarship_type    TEXT NOT NULL,
  -- 'Manila Scholars'|'Bulacan Scholars'|'Nationwide Scholars'

  incoming_freshman   BOOLEAN DEFAULT FALSE,

  created_at          TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- TYPE 2: KKFI EMPLOYEE-CHILD EDUCATION GRANT — extra fields
-- ============================================================
CREATE TABLE kkfi_grant_details (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id      UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,

  -- Who is applying
  applicant_category  TEXT NOT NULL,
  -- 'self_advancement' | 'child_designated'

  -- If self_advancement: are they going tertiary or masters?
  education_path      TEXT,
  -- 'tertiary' | 'masters'  (NULL if child_designated)

  -- Staff linkage (both categories need this)
  staff_id            UUID REFERENCES staff(id) ON DELETE SET NULL,

  created_at          TIMESTAMPTZ DEFAULT now()
);


-- MASTERS EDUCATION (only for self_advancement + masters path)
CREATE TABLE masters_education (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,

  -- Previous tertiary (what they finished)
  prev_school_name    TEXT NOT NULL,
  prev_program        TEXT NOT NULL,
  prev_year_graduated INTEGER NOT NULL,

  -- Current masters
  school_name     TEXT NOT NULL,
  program         TEXT NOT NULL,
  year_level      TEXT NOT NULL,
  term_type       TEXT NOT NULL,
  term            TEXT NOT NULL,
  grade_scale     TEXT NOT NULL,

  created_at      TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- TYPE 3: VOCATIONAL & TECHNOLOGY SCHOLARSHIP — extra fields
-- ============================================================
CREATE TABLE vocational_application_details (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id      UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,

  scholarship_type    TEXT NOT NULL,

  created_at          TIMESTAMPTZ DEFAULT now()
);

-- Vocational/Technical Education
CREATE TABLE vocational_education (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,

  school_name       TEXT NOT NULL,
  program           TEXT NOT NULL,
  course_duration   TEXT NOT NULL,  -- e.g. '6 months', '1 year'
  completion_date   DATE NOT NULL,

  created_at        TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- DOCUMENTS (shared — all 3 types use this)
-- ============================================================
CREATE TABLE application_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID REFERENCES applications(id) ON DELETE CASCADE,

  document_type   TEXT NOT NULL,
  -- Shared:        'grade_report' | 'cor'
  -- Tertiary:      'current_term_report' | 'certificate_of_indigency'
  --                'birth_certificate' | 'income_cert_father'
  --                'income_cert_mother' | 'essay' | 'recommendation_letter'
  -- KKFI Masters:  'masters_grade_report' | 'masters_cor'
  -- Vocational:    same as tertiary supporting docs

  file_path       TEXT NOT NULL,
  file_name       TEXT NOT NULL,
  file_size       INTEGER,
  mime_type       TEXT,
  is_required     BOOLEAN DEFAULT TRUE,

  uploaded_at     TIMESTAMPTZ DEFAULT now()
);
```

---

## How the Tables Relate Per Type
```
TYPE 1 — Tertiary Scholarship
applications
  └── tertiary_application_details   (scholarship_type, incoming_freshman)
  └── secondary_education
  └── tertiary_education
  └── family_members[]
  └── application_documents[]

TYPE 2a — KKFI Grant › Self Advancement › Tertiary path
applications
  └── kkfi_grant_details             (category=self_advancement, path=tertiary)
  └── secondary_education
  └── tertiary_education
  └── application_documents[]        (no family members — staff record instead)

TYPE 2b — KKFI Grant › Self Advancement › Masters path
applications
  └── kkfi_grant_details             (category=self_advancement, path=masters)
  └── masters_education              (prev tertiary + current masters)
  └── application_documents[]

TYPE 2c — KKFI Grant › Child Designated
applications
  └── kkfi_grant_details             (category=child_designated, path=NULL)
  └── secondary_education
  └── tertiary_education
  └── application_documents[]        (includes current_term_report if not freshman)

TYPE 3 — Vocational & Technology
applications
  └── vocational_application_details (scholarship_type)
  └── secondary_education
  └── vocational_education           (school, program, duration, completion)
  └── family_members[]
  └── application_documents[]
```

---

## Key Design Decisions

**Why not one giant table?**
A single table would have ~30+ nullable columns. Querying `WHERE education_path = 'masters'` on a table where 80% of rows have that column as `NULL` is messy and hard to maintain.

**Why `UNIQUE` on `application_id` in detail tables?**
Each application has exactly one detail record per table — the `UNIQUE` constraint enforces this at the DB level.

**Why reuse `secondary_education` and `tertiary_education`?**
Types 1, 2a, and 2c all collect the exact same secondary/tertiary fields. One table, no duplication.

**Staff lookup flow for KKFI Grant:**
```
Frontend enters staff_id text
→ GET /api/staff/:staffId
→ returns { first_name, middle_name, last_name, suffix, position }
→ displayed read-only, staff UUID stored in kkfi_grant_details.staff_id
