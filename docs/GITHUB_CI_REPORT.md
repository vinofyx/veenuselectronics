# GitHub and CI report (Phases 4–5)

## Status: ⏳ Ready, NOT yet run. No GitHub repository exists.

| Check | Result |
|---|---|
| GitHub CLI in the cloud workspace | Installed, but **not authenticated**: the API returns "No linked GitHub account" |
| Claude GitHub connector | **Not linked to this chat**, despite the user completing an authorisation (probably a different Claude account or org, or the GitHub App wasn't granted access) |
| Browser authentication | The Claude browser pane is open at github.com/login; **not signed in**. Browser sign-in would only allow creating the repo and reading CI pages, not API pushes. |
| GitHub CLI / Git on your PC | **Unknown.** The PC workspace won't start (disk space). The push script checks for Git and explains how to install it. |
| Repository `veenus-electronics` | **Not created** |
| Push / initial commit on GitHub | **Not done** |
| Any CI run | **None.** No CI result exists; nothing here claims one passed. |

## Verified commit, ready to push
Built and checked in the cloud workspace with real Git:
- **Commit ID:** listed in `setup/commit-id.txt` and in the chat summary. It changes whenever the commit is rebuilt.
- **141 files**, including `.github/workflows/ci.yml`, all 3 migrations, tests, docs and configuration.
- Verified **excluded:** `.env*` (except `.env.example`), `node_modules`, `.next`, build output, logs, test output, backups, the bundle.
- **Secret scan of the committed content: none found.**
- Delivered as `setup/veenus.bundle`. `push-to-github.cmd` imports this exact commit, so GitHub receives the verified content and ID.

## How to push (choose one)
**A. Claude does it (preferred):** reconnect GitHub at claude.ai → Settings → Connectors → GitHub with the **same Claude account and organisation** as this chat, and grant the Claude GitHub App access to your account. Tell Claude, and it will create the private repo, push, watch CI and fix failures.

**B. You do it (about 3 minutes):**
1. https://github.com/new → name `veenus-electronics`, **Private**, description "Veenus Electronics TV Repair and Electronics Repair Website", **no** README, .gitignore or licence → Create.
2. Double-click `D:\veenuelectronics\push-to-github.cmd` and enter your GitHub username. Git's sign-in window opens on the first push.
3. Sign in to GitHub in the Claude browser pane (Ctrl+Shift+B) so Claude can read the Actions results, then tell Claude "pushed".

**Verify after pushing:** the repo is private; `.github/workflows/ci.yml` is present; there is no `.env*` file other than `.env.example`; the Actions tab shows a run.

## The workflow (`.github/workflows/ci.yml`)
| Requirement | How it's met |
|---|---|
| Triggers | `push`, `pull_request`, manual |
| Node LTS | Node 22 |
| Lockfile install | `npm ci` when `package-lock.json` exists; on the first run (no lockfile yet) `npm install`, then the lockfile is uploaded as the **`package-lock`** artifact so you can commit it |
| Dependency audit | `npm audit` log; **fails on critical** |
| TypeScript, ESLint | `npm run typecheck`, `npm run lint` |
| Unit and API tests | `npm test` (80 tests) |
| Database tests | `scripts/test-db.sh` on PostgreSQL (37 tests) |
| Production build | `npm run build` (real Next.js, nothing mocked) |
| Playwright | 5 projects: 1920×1080, 1366×768, 768×1024, 390×844, 375×812 |
| Artifacts | `ci-logs` (install, audit, typecheck, lint, unit, database, build, e2e logs), `playwright-report` (HTML report + `test-results/screenshots/*`), `package-lock` |
| Credentials | Only optional **test** Supabase secrets (`TEST_SUPABASE_*`, `E2E_*`), separate from production. Without them, backend e2e tests are **skipped with a stated reason**, not faked. |
| No green-washing | No `continue-on-error`; every step's exit code is kept (`PIPESTATUS`) |

**CI test fixtures:** the workflow sets the clearly-marked dummy number `+91 90000 00000` only so the Call and WhatsApp buttons render in CI and their links can be tested. It never reaches production.
