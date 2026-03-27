# CLAUDE.md — Context Management Rules
# Aturan ini berlaku di semua session. Dibaca ulang setiap compaction.

---

## 🎯 CURRENT TASK
<!-- Always update this section at the start of a new task -->
**Task:** [Describe current task here]
**Scope:** [Files / modules involved]
**Goal:** [What "done" looks like]

---

## ⚡ CONTEXT BUDGET RULES

- **Target:** Keep context usage BELOW 50% at all times
- **Check:** Run `/cost` after every major step (file reads, long outputs, bash commands)
- **Threshold action:**
  - `> 40%` → Plan to compact soon, finish current sub-task first
  - `> 50%` → **Run `/compact` immediately** with task-specific instructions (see template below)
  - `> 70%` → Emergency: run `/compact` regardless of where you are in the task

---

## 🗜️ COMPACT INSTRUCTIONS (Moderate Mode)

When compacting, use this template:

```
/compact Preserve ONLY:
1. Current task goal and scope (from CURRENT TASK section)
2. Files actively being modified (list them)
3. Key architectural decisions made THIS session
4. Last known working state / last test result
5. Any unresolved errors directly related to current task

Strip everything else:
- All file reads and explorations NOT related to current task
- Resolved errors and their debug history
- Previous tasks from earlier in the session
- Redundant tool outputs (grep, bash logs older than 3 steps)
- Any conversation tangents unrelated to current task
```

---

## 🧹 CONTEXT HYGIENE

| Situation | Action |
|---|---|
| Starting a new unrelated task | `/clear` — full reset |
| Continuing same task, context > 50% | `/compact` with template above |
| Quick one-off question | `/btw` — answer won't pollute context |
| Large codebase exploration | Use subagent: `"Use a subagent to explore X and summarize findings"` |
| After fixing a bug / finishing a feature | `/compact` before moving to next feature |

---

## 💾 WHAT ALWAYS SURVIVES COMPACTION

These are never stripped, even with aggressive compaction:
- Active file paths being modified
- Current task goal (from CURRENT TASK section above)
- Tech stack decisions (see stack section below)
- Unmerged / uncommitted changes summary

---

## 🛠️ PROJECT TECH STACK
<!-- Update per project -->

**Frontend:** React / Vue / Vanilla JS
**Backend:** [e.g. Node.js + Express / Laravel / etc.]
**Package manager:** [npm / pnpm / yarn]
**Key conventions:**
- [e.g. use named exports, no default exports]
- [e.g. API base URL from env: `VITE_API_URL`]
- [add your own...]

---

## 🔁 SESSION HANDOFF PROTOCOL

Before ending a session (especially if context > 60%), always:

1. Run: `Save a handoff summary to session-notes.md covering: current task status, files modified, next steps, blockers`
2. Then: `/clear`
3. Next session: `@session-notes.md` → resume cleanly

---

## 🚫 ANTI-PATTERNS (Never Do These)

- ❌ Let context hit 80%+ before acting
- ❌ Read entire files when only a function is needed — use targeted reads
- ❌ Re-explain context that's already in CURRENT TASK section
- ❌ Run broad `find` / `grep` across entire repo — scope to relevant dirs only
- ❌ Keep debug logs of already-resolved issues in context

---

## ✅ GOOD HABITS

- ✅ Update `CURRENT TASK` section at the start of every new task
- ✅ Commit to git before every `/compact` or `/clear` (safety net)
- ✅ Use subagents for exploration, keep main session for implementation
- ✅ Prefer targeted file reads (`Read lines 40-80 of auth.ts`) over full reads
- ✅ Keep CLAUDE.md itself under 200 lines / 2000 tokens

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->