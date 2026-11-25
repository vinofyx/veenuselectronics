@echo off
REM ==================================================================
REM  Veenus Electronics - production RE-CHECK after fixes
REM  1) stops the production server on port 3002 (only that port)
REM  2) TypeScript, ESLint, unit tests (exit codes recorded)
REM  3) rebuilds into .next-prod (dev server's .next is untouched)
REM  4) restarts the production server on http://localhost:3002
REM  5) Playwright browser tests against port 3002
REM  6) Lighthouse: mobile x3 (median) and desktop x1 for 4 pages
REM  Does NOT deploy, push, or touch Supabase / DNS.
REM ==================================================================
setlocal
cd /d "%~dp0"
set "OUT=docs\test-results\recheck"
set "LH=docs\lighthouse\recheck"
if not exist "%OUT%" mkdir "%OUT%"
if not exist "%LH%" mkdir "%LH%"
if exist "%OUT%\DONE.txt" del "%OUT%\DONE.txt"
>"%OUT%\summary.txt" echo Started %date% %time%

echo [1/6] Stopping the production server on port 3002...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do taskkill /PID %%p /T /F > nul 2>&1
timeout /t 3 /nobreak > nul

echo [2/6] TypeScript, ESLint, unit tests...
call npm run typecheck > "%OUT%\1-typecheck.txt" 2>&1
>>"%OUT%\summary.txt" echo typecheck exit %ERRORLEVEL%
call npm run lint > "%OUT%\2-lint.txt" 2>&1
>>"%OUT%\summary.txt" echo lint exit %ERRORLEVEL%
call npm test > "%OUT%\3-unit-tests.txt" 2>&1
>>"%OUT%\summary.txt" echo unit-tests exit %ERRORLEVEL%

echo [3/6] Production build into .next-prod...
set "NEXT_DIST_DIR=.next-prod"
call npx next build > "%OUT%\4-build.txt" 2>&1
set BUILD_EXIT=%ERRORLEVEL%
>>"%OUT%\summary.txt" echo build exit %BUILD_EXIT%
if not "%BUILD_EXIT%"=="0" goto finish

echo [4/6] Starting production server on http://localhost:3002 (separate window)...
start "Veenus production server - port 3002 (close when finished)" /min cmd /c "set NEXT_DIST_DIR=.next-prod&& npx next start -p 3002 > %OUT%\prod-server.txt 2>&1"
timeout /t 20 /nobreak > nul

echo [5/6] Playwright browser tests (about 5 minutes)...
set "E2E_BASE_URL=http://localhost:3002"
call npx playwright test --reporter=list > "%OUT%\5-e2e.txt" 2>&1
>>"%OUT%\summary.txt" echo e2e exit %ERRORLEVEL%

echo [6/6] Lighthouse (mobile x3, desktop x1, 4 pages)...
for %%P in (home:/ led:/tv-repair/led-tv-repair black-screen:/tv-problems/tv-black-screen contact:/contact-us) do (
  for /f "tokens=1,2 delims=:" %%A in ("%%P") do (
    for %%R in (1 2 3) do (
      echo    %%A mobile run %%R
      call npx --yes lighthouse@12 "http://localhost:3002%%B" --quiet --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="%LH%\%%A-mobile-%%R.json" --chrome-flags="--headless=new" > nul 2>&1
    )
    echo    %%A desktop
    call npx --yes lighthouse@12 "http://localhost:3002%%B" --quiet --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="%LH%\%%A-desktop.json" --chrome-flags="--headless=new" > nul 2>&1
  )
)
>>"%OUT%\summary.txt" echo lighthouse done

:finish
>>"%OUT%\summary.txt" echo Finished %date% %time%
>"%OUT%\DONE.txt" echo done
echo.
echo All done. The production server keeps running on http://localhost:3002.
pause
