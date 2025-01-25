# AI Learning Platform MVP - IDE Step-by-Step Implementation Guide

## 0. Pre-requisite Setup (Must Complete First)

### 0.1 IDE Configuration (Cursor/Warp Specific)
1. **Enable AI Code Completion**  
   - Open Command Palette (Cmd+K) → Search "Settings: Open Settings"  
   - Enable:  
     - `Cursor: Enable Codebase Context`  
     - `Cursor: Enable Experimental Features`  
     - `Cursor: Use GPT-4 for Code Completion`

2. **Terminal Setup**  
   - Create dedicated terminal tabs for:  
     - `Frontend Server` (Next.js)  
     - `Database Operations` (Supabase CLI)  
     - `Testing` (Jest/Playwright)

---

## 1. Core Infrastructure Setup

### 1.1 Project Initialization
1. **Create Base Structure**  
   - In IDE terminal:  
   ```bash
   mkdir ai-learning-platform && cd ai-learning-platform
   pnpm init
   ```

   When prompted:

   - Package name: @org/ai-learning
   - Version: 0.1.0
   - Description: "AI Training Platform MVP"

   Initialize Git:
   ```bash
   git init
   git branch -M main
   git commit --allow-empty -m "Initial commit"
   ```

## 2. Authentication System Implementation

### 2.1 Supabase Auth Configuration

#### Database Schema Creation

In Supabase Dashboard:

- Go to SQL Editor
- Create profiles table:
  ```sql
  CREATE TABLE profiles (
    id UUID REFERENCES auth.users,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- Create Row Level Security Policy:
  ```sql
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "User can view own profile" 
  ON profiles FOR SELECT USING (auth.uid() = id);
  ```

#### Google OAuth Setup

In Supabase Dashboard → Authentication → Providers:

- Enable Google
- Client ID: [Get from Google Cloud Console]
- Client Secret: [Get from Google Cloud Console]
- Redirect URL: http://localhost:3000/auth/callback
- Enable "Enable Google Provider" toggle

## 3. RAG System Implementation

### 3.1 Document Processing Pipeline

#### PDF Ingestion Workflow

- Create `/lib/rag` directory
- Implement document loader:
  - Use PDFLoader from LangChain
  - Configure chunking strategy:
    - Chunk size: 1000 tokens
    - Overlap: 200 tokens

#### Vectorization Setup
- Use HuggingFaceInferenceEmbeddings
- Model: sentence-transformers/all-mpnet-base-v2
- API Key: Get free token from HF account

#### Testing Instructions

- Place test PDF in `/samples` directory
- Run ingestion command:
  ```bash
  curl -X POST http://localhost:3000/api/ingest \
    -F "file=@samples/test-sop.pdf" \
    -H "Authorization: Bearer {SUPABASE_ANON_KEY}"
  ```

- Verify in Supabase:
  ```sql
  SELECT COUNT(*) FROM materials WHERE metadata->>'source' = 'test-sop.pdf';
  ```

## 4. Guardrail System Implementation

### 4.1 Sensitive Data Filter

#### Blocklist Configuration

- Create `/config/blocked-terms.txt`
- Add terms line-by-line:
  ```
  confidential
  internal-only
  salary-range
  ```

#### Implement Regex Patterns
- Phone numbers: `\d{3}-\d{3}-\d{4}`
- Credit cards: `\d{4}-\d{4}-\d{4}-\d{4}`

#### Testing Protocol

Run test queries:
```bash
# Should be blocked
curl -d "What's the salary range for directors?" http://localhost:3000/api/chat

# Should pass
curl -d "Explain vacation policy" http://localhost:3000/api/chat
```

Check logs:
```bash
grep "REDACTED" logs/guardrails.log
```

## 5. Chatbot Implementation

### 5.1 Conversation Memory

#### Session Storage Setup

Create sessions table:
```sql
CREATE TABLE sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  history JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Implement TTL cleanup:
```sql
CREATE INDEX sessions_ttl_idx ON sessions (created_at);
```

#### Testing Workflow

Start conversation:
```bash
curl -X POST http://localhost:3000/api/chat/session
```

Send multiple messages:
```bash
curl -d '{"session_id":"...", "message":"What benefits do we have?"}' http://localhost:3000/api/chat
```

Verify context retention:
```sql
SELECT history->'messages' FROM sessions WHERE session_id = '...';
```

## 6. Deployment Pipeline

### 6.1 Vercel Production Setup

#### Environment Variables

Required variables:
```
SUPABASE_URL
SUPABASE_SERVICE_KEY
HF_API_TOKEN
NEXT_PUBLIC_GA_ID
```

Set via:
```bash
vercel env add SUPABASE_URL production
```

#### Build Optimization

In `next.config.js`:
```javascript
experimental: {
  optimizePackageImports: [
    '@supabase/supabase-js',
    '@huggingface/inference'
  ]
}
```

#### Smoke Test Checklist

Post-deployment checks:
```bash
curl -I https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/auth/providers
```

## 7. Testing Framework

### 7.1 Unit Test Implementation

#### Jest Configuration

- Create `/__tests__/rag.test.ts`
- Implement test cases:
  - PDF ingestion success/failure
  - Vector similarity threshold validation
  - Chunk overlap verification

#### Test Run Command
```bash
pnpm test --watchAll --coverage
```

### 7.2 Load Testing

#### k6 Scenario Design

Simulate 50 concurrent users:
```javascript
export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-arrival-rate',
      stages: [
        { duration: '1m', target: 50 },
        { duration: '3m', target: 50 },
      ],
    },
  },
};
```

## 8. Maintenance Protocol

### 8.1 Daily Health Checks

#### Database Maintenance
```sql
-- Check index bloat
SELECT * FROM pgstatindex('materials_embedding_idx');

-- Vacuum analyze
VACUUM ANALYZE materials;
```

#### Model Monitoring

Track response latency:
```bash
curl -o /dev/null -s -w "%{time_total}" http://localhost:3000/api/chat
```

## 9. IDE-Specific Optimization

### 9.1 Cursor AI Shortcuts

#### Code Generation
- Highlight code block → Cmd+K → "Add error handling"
- Place caret in empty function → Cmd+K → "Implement RAG pipeline"

#### Debugging
- Add breakpoint → Right-click → "Explain this code path"
- Error message → Cmd+Shift+D → "Suggest fixes"

## 10. Progressive Delivery Plan

### 10.1 MVP Release Stages

| Stage | Scope | Testing Cohort |
|-------|-------|----------------|
| Alpha | Auth + Basic Chat | Internal team (5 users) |
| Beta | Full RAG + Guardrails | Department leads (20 users) |
| GA | Analytics + SSO | Entire company (200+ users) |

### 10.2 Rollback Procedure

If critical bug found:
```bash
vercel rollback <deployment-id>
```

Database snapshot restore:
```bash
supabase db restore <backup-id>
```

---

**Note:** This document enables direct implementation in AI IDEs with:  
1. Precise terminal commands for every action  
2. Verifiable checkpoints after each section  
3. IDE-specific optimization tips  
4. Progressive testing gates  
5. Automated rollback procedures  

Each numbered step can be directly executed with AI code completion guidance, and the testing protocols ensure immediate validation of implemented features.