create table sessions (
id uuid primary key default gen_random_uuid(),
user_id text,
created_at timestamptz default now()
);


create table messages (
id uuid primary key default gen_random_uuid(),
session_id uuid references sessions(id),
role text check (role in ('user','assistant','system')),
content text,
created_at timestamptz default now()
);


create table audit_logs (
id uuid primary key default gen_random_uuid(),
session_id uuid references sessions(id),
input text,
intent text,
guardrails text[],
created_at timestamptz default now()
);