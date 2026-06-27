# Take-home: Make the Analytics Dashboard work end-to-end

## The situation

You've inherited a half-finished internal **User Analytics Dashboard**. Two
developers built the frontend and the backend separately and then left. Each
half mostly works on its own, but they were never wired together — right now the
dashboard does **not** successfully load data, and the reporting figures it is
meant to show are not yet correct.

Your job is to make the whole thing run end-to-end **and** produce the correct
numbers.

## What "done" looks like

When you're finished, opening **http://localhost:3001/dashboard** should show:

1. A **Total active users** figure populated with the real number from the API.
2. A **usage-over-time** bar chart populated with the real data points.
3. **No errors** in the browser console or the network tab — the analytics
   request returns `200` with the data the UI needs.
4. The reporting figures match the expected values below exactly.

### Expected values (acceptance criteria)

The mock dataset is fixed, so the correct outputs are known. Your dashboard must
show, and the test suite must confirm:

| Figure | Expected value |
|---|---|
| Total active users | **1,420** |
| Events on 2026-06-21 (UTC) | **102** |
| Peak hour (UTC) | **22:00** (51 events) |
| Chart axis labels | the event times **in UTC**, identical on every machine |

> These figures are defined in **UTC**. The data spans a UTC midnight, so an
> implementation that quietly uses the local machine's timezone will produce
> *different* numbers — and may look correct on one machine while being wrong on
> another. We run everything on a machine that is **not** in UTC.

## Tests

There is a test suite. Run it:

```bash
npm test          # from the repo root (runs the frontend suite)
```

It currently **fails**. Part of the task is making it pass. The tests run under
a non-UTC timezone on purpose; that is how we run them during review. **Do not
edit the tests or their expected values** to make them pass — fix the code they
exercise.

## How to work

- **Use whatever AI tools you normally use** (Cursor, Copilot, Claude, ChatGPT,
  Windsurf, etc.). This is encouraged, not penalized. We care about how you
  *direct* your tools and how you *verify* their output, not whether you used
  them. Note that for some of these issues, a tool's first suggestion will look
  right but be subtly wrong — running the app and the tests is the only way to be
  sure.
- Treat the **running system as the source of truth**. The previous developers
  left comments, TODOs, and assumptions in the code. Some are accurate; some are
  stale. Don't assume a comment is correct because it sounds authoritative.
- There are several **independent** problems. They are not all the same kind of
  problem: some block the request, some silently corrupt the data, and some only
  show up when you run the app or the tests on a non-UTC machine. At least one
  thing that *looks* broken is actually fine — don't rewrite what isn't.
- Prefer the smallest change that correctly solves each problem and keeps both
  sides maintainable.

## What to submit

1. **The working repo**, with your fixes, and **`npm test` passing**.
2. **Your commit history** — commit as you go and **do not squash**. We want to
   see the order in which you approached things.
3. **`DEBUG_LOG.md`** (repo root) containing:
   - Each problem you found, **how you noticed it**, and how you fixed it (2–3
     lines each).
   - The **actual prompts** you gave your AI tools for the non-trivial parts. If
     a tool gave you a wrong or misleading suggestion, note what it was and how
     you caught it.
4. **A short walkthrough** — a 3–5 minute screen recording (Loom or similar)
   explaining what was broken, how you confirmed each fix, and the final
   `npm test` run.

## Time

Please **time-box this to about 2 hours**. If you don't finish, submit what you
have and use `DEBUG_LOG.md` to describe what's left and why. We'd much rather see
fewer problems solved with clear, verified reasoning than everything "fixed" by
guessing.

## What we're assessing

- How you **diagnose** an unfamiliar full-stack system (where you look first).
- How you handle a **contract mismatch** between two services without making mess
  elsewhere.
- Your **judgment** about which information to trust.
- Whether you **verify** against real failure conditions and the expected numbers
  rather than assuming success because the screen loaded.
- How clearly you can **explain** what was wrong.

Good luck.
