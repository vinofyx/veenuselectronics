@echo off
REM ==================================================================
REM  Veenus Electronics - production build + speed measurement
REM  Safe to run while the dev server (port 3001) is running:
REM  the production build goes to a separate folder (.next-prod)
REM  and is served on http://localhost:3002.
REM  Writes results to docs\test-results\ and docs\lighthouse\
REM  It does NOT deploy, push, or touch Supabase / DNS.
REM ==================================================================
setlocal
cd /d "%~dp0"
set "OUT=docs\test-results"
set "LH=docs\lighthouse"
if not exist "%OUT%" mkdir "%OUT%"
if not exist "%LH%" mkdir "%LH%"
if exist "%OUT%\PROD-DONE.txt" del "%OUT%\PROD-DONE.txt"
echo Started %date% %time% > "%OUT%\prod-summary.txt"

echo [1/7] TypeScript...
call npm run typecheck > "%OUT%\1-typecheck.txt" 2>&1
echo typecheck exit %ERRORLEVEL%>> "%OUT%\prod-summary.txt"

echo [2/7] ESLint...
call npm run lint > "%OUT%\2-lint.txt" 2>&1
echo lint exit %ERRORLEVEL%>> "%OUT%\prod-summary.txt"

echo [3/7] Unit tests...
call npm test > "%OUT%\3-unit-tests.txt" 2>&1
echo unit-tests exit %ERRORLEVEL%>> "%OUT%\prod-summary.txt"

echo [4/7] Production build into .next-prod (a few minutes)...
set "NEXT_DIST_DIR=.next-prod"
call npx next build > "%OUT%\5-build.txt" 2>&1
set BUILD_EXIT=%ERRORLEVEL%
echo build exit %BUILD_EXIT%>> "%OUT%\prod-summary.txt"
if not "%BUILD_EXIT%"=="0" goto finish

echo [5/7] Starting production server on http://localhost:3002 (separate window)...
start "Veenus production server - port 3002 (close when finished)" /min cmd /c "set NEXT_DIST_DIR=.next-prod&& npx next start -p 3002 > %OUT%\prod-server.txt 2>&1"
timeout /t 20 /nobreak > nul

echo [6/7] Lighthouse (mobile + desktop, 4 pages)...
for %%P in (home:/ led:/tv-repair/led-tv-repair black-screen:/tv-problems/tv-black-screen contact:/contact-us) do (
  for /f "tokens=1,2 delims=:" %%A in ("%%P") do (
    echo    %%A mobile
    call npx --yes lighthouse@12 "http://localhost:3002%%B" --quiet --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="%LH%\%%A-mobile.json" --chrome-flags="--headless=new" > "%LH%\%%A-mobile.log" 2>&1
    echo    %%A desktop
    call npx --yes lighthouse@12 "http://localhost:3002%%B" --quiet --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="%LH%\%%A-desktop.json" --chrome-flags="--headless=new" > "%LH%\%%A-desktop.log" 2>&1
  )
)
echo lighthouse done>> "%OUT%\prod-summary.txt"

echo [7/7] Playwright browser tests against the production server...
set "E2E_BASE_URL=http://localhost:3002"
call npx playwright test --reporter=list > "%OUT%\4-e2e.txt" 2>&1
echo e2e exit %ERRORLEVEL%>> "%OUT%\prod-summary.txt"

:finish
echo Finished %date% %time%>> "%OUT%\prod-summary.txt"
echo done> "%OUT%\PROD-DONE.txt"
echo.
echo All done. The production server keeps running on http://localhost:3002
echo so Claude can check it; close its window when you no longer need it.
pause
