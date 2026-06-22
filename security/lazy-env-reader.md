# Lazy env reader

Read environment variables **lazily, at call time**, not at module top-level.
Eager reads at import break builds (the var isn't set yet at build time) and leak
config-order bugs into runtime. Validate on first use; fail with a clear message.

## TypeScript (Node / Next)

```ts
// src/lib/env.ts
function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

// Lazy getters — evaluated on first access, never at import time.
export const env = {
  get databaseUrl() { return required("DATABASE_URL"); },
  get anthropicKey() { return required("ANTHROPIC_API_KEY"); },
  // optional with default:
  get baseUrl() { return process.env.APP_BASE_URL ?? "http://localhost:3000"; },
};
```

Never `const DB = process.env.DATABASE_URL!` at module scope — that throws at
build/import time and bakes the value into the bundle.

## Python (FastAPI / Pydantic)

```python
# app/settings.py
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str
    anthropic_api_key: str
    app_base_url: str = "http://localhost:3000"


@lru_cache  # built once, on first call — not at import
def get_settings() -> Settings:
    return Settings()  # raises clearly if a required var is missing
```

Call `get_settings()` inside handlers/deps, not at module top level.

## Rules

- `.env*` git-ignored; only `.env.example` (placeholders) tracked.
- Never print a secret value in logs, errors, or chat.
- Validate presence on first use with a named error, not a silent `undefined`/`None`.
