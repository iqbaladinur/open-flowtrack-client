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