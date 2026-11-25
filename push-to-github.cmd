@echo off
REM ==================================================================
REM  Veenus Electronics - push this project to GitHub
REM  Repository: https://github.com/<your-username>/veenus-electronics (private - create it first,
REM              empty: no README, no .gitignore, no licence)
REM  What it does (nothing else):
REM   1. Copies setup\github-ci.yml to .github\workflows\ci.yml
REM   2. Creates/updates a local git repository in this folder (first run imports the
REM      verified commit from setup\veenus.bundle, so GitHub gets the checked content)
REM   3. Commits all files (secrets such as .env.local are excluded by .gitignore)
REM   4. Pushes to GitHub - Git may open a browser window asking you to sign in
REM  Safe to run again: it only commits and pushes new changes.
REM ==================================================================
setlocal
cd /d "%~dp0"
set "LOG=setup\push.log"
echo Veenus push %date% %time% > "%LOG%"

REM A freshly installed Git may not be on PATH yet in this window
where git >nul 2>nul || if exist "%ProgramFiles%\Git\cmd\git.exe" set "PATH=%ProgramFiles%\Git\cmd;%PATH%"
where git >nul 2>nul
if errorlevel 1 (
  echo RESULT: git not installed >> "%LOG%"
  echo.
  echo Git is not installed. Install "Git for Windows" from https://git-scm.com/download/win
  echo then run this file again.
  pause
  exit /b 1
)

if not exist ".github\workflows" mkdir ".github\workflows"
copy /Y "setup\github-ci.yml" ".github\workflows\ci.yml" >nul

if not exist ".git" (
  git init -b main >> "%LOG%" 2>&1
  if exist "setup\veenus.bundle" (
    echo Importing the verified commit from setup\veenus.bundle ...
    git fetch -q "setup\veenus.bundle" main >> "%LOG%" 2>&1
    git reset -q FETCH_HEAD >> "%LOG%" 2>&1
    echo Imported commit: >> "%LOG%"
    git log --format="%%H %%s" -1 >> "%LOG%" 2>&1
  )
)
for /f "delims=" %%r in ('git remote get-url origin 2^>nul') do set "REMOTE=%%r"
if not defined REMOTE (
  set /p "OWNER=Your GitHub username: "
)
if not defined REMOTE (
  git remote add origin https://github.com/%OWNER%/veenus-electronics.git
  set "REMOTE=https://github.com/%OWNER%/veenus-electronics.git"
)

git config user.name >nul 2>nul || git config user.name "Veenus Electronics"
git config user.email >nul 2>nul || git config user.email "noreply@users.noreply.github.com"

git add -A
git diff --cached --quiet && (
  echo No new changes to commit.
) || (
  git commit -q -F "setup\commit-message.txt" >> "%LOG%" 2>&1
)
echo --- local state >> "%LOG%"
git --version >> "%LOG%" 2>&1
git remote -v >> "%LOG%" 2>&1
git log --format="%%H %%s" -3 >> "%LOG%" 2>&1
echo tracked files: >> "%LOG%"
git ls-files | find /c /v "" >> "%LOG%" 2>&1
git status --porcelain >> "%LOG%" 2>&1

echo.
echo Pushing to GitHub...
echo --- push >> "%LOG%"
git push -u origin main >> "%LOG%" 2>&1
if errorlevel 1 (
  echo RESULT: push failed >> "%LOG%"
  type "%LOG%"
  echo.
  echo Push failed. Copy the message above into the Claude chat.
  pause
  exit /b 1
)
echo RESULT: push succeeded >> "%LOG%"
git ls-remote origin >> "%LOG%" 2>&1
echo.
echo Done. Open the Actions tab of your repository to see the CI run:
echo %REMOTE:.git=%/actions
pause
