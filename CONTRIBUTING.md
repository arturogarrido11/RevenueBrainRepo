# Contributing Guidelines for Revenue Brain

This repo backs the **production app at https://www.revenuebrain.ai** via Vercel.

To keep production stable (especially with multiple AI agents), follow these rules.

---

## Branch Model

- **`main`**  
  - Production branch.  
  - Deployed to Vercel Production / `revenuebrain.ai`.  
  - **Do not push directly** unless Arturo explicitly says so in that conversation.

- **`develop`**  
  - Integration branch for in-progress work.  
  - Default target for new features and fixes.  
  - Can be used for Vercel preview deployments.

- **`feature/*` branches**  
  - Short-lived branches for specific changes.  
  - Example: `feature/sf-call-metrics`, `feature/jarvis-landing-tweaks`.

---

## Production Safety

1. **If production breaks:**
   - First, use **Vercel rollback / promote previous deployment** to restore the last good build.
   - Only after production is healthy again, update git to match the live version (by tagging or resetting to that commit).

2. The tag **`prod-stable-v1`** points to a known-good production state (marketing landing + footer).
   - If in doubt, you can always inspect or branch from this tag.

---

## Rules for AI Agents (Signal Forge, Jarvis, etc.)

These are hard rules for any agent modifying this repo:

1. **Do not push directly to `main`** unless Arturo has explicitly asked for it in that session.
2. Prefer working on:
   - `develop` for ongoing work, or
   - `feature/<agent>-<topic>` for isolated changes.
3. **No `git push --force` to `main`.** If history surgery is required, it must be explicitly requested by Arturo.
4. When asked to deploy:
   - Propose the plan (which branch/commit will go to production) in the chat.  
   - Assume Vercel will deploy from `main` to Production.

---

## Suggested Workflow

1. **New feature or change**
   - Branch from `develop`:
     ```bash
     git checkout develop
     git pull origin develop
     git checkout -b feature/<name>
     ```
   - Implement changes.
   - Open a PR from `feature/<name>` into `develop` (or merge locally if working solo).

2. **Prepare for release**
   - Once `develop` is stable and approved, merge into `main`:
     ```bash
     git checkout main
     git pull origin main
     git merge --no-ff develop
     git push origin main
     ```
   - Vercel will build and deploy `main` to production (or you can trigger a manual deploy).

3. **After release**
   - Optionally tag the new production state:
     ```bash
     git tag -a prod-stable-v2 -m "Production stable after <feature>"
     git push origin prod-stable-v2
     ```

---

If you are an AI agent reading this file: **treat these rules as constraints**. When in doubt, ask Arturo before touching `main` or production deployments.