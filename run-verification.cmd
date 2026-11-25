@echo off
REM ==================================================================
REM  Veenus Electronics - local verification (read-only checks + build)
REM  Runs: TypeScript, ESLint, unit tests, Playwright (against the
REM  running dev server on http://localhost:3001), then the production
REM  build. Results are written to docs\test-results\*.txt
REM  It does NOT deploy, push, or touch Supabase / DNS.
REM ==================================================================
setlocal
cd /d "%~dp0"
set "OUT=docs\test-results"
if not exist "%OUT%" mkdir "%OUT%"
if exist "%OUT%\DONE.txt" del "%OUT%\DONE.txt"
echo Started %date% %time% > "%OUT%\summary.txt"

echo.
echo [1/5] TypeScript (npm run typecheck)...
call npm run typecheck > "%OUT%\1-typecheck.txt" 2>&1
echo EXIT_CODE=%ERRORLEVEL%>> "%OUT%\1-typecheck.txt"
echo typecheck exit %ERRORLEVEL%>> "%OUT%\summary.txt"

echo [2/5] ESLint (npm run lint)...
call npm run lint > "%OUT%\2-lint.txt" 2>&1
echo EXIT_CODE=%ERRORLEVEL%>> "%OUT%\2-lint.txt"
echo lint exit %ERRORLEVEL%>> "%OUT%\summary.txt"

echo [3/5] Unit tests (npm test)...
call npm test > "%OUT%\3-unit-tests.txt" 2>&1
echo EXIT_CODE=%ERRORLEVEL%>> "%OUT%\3-unit-tests.txt"
echo unit-tests exit %ERRORLEVEL%>> "%OUT%\summary.txt"

echo [4/5] Playwright browser tests against http://localhost:3001 (takes several minutes)...
set "E2E_BASE_URL=http://localhost:3001"
call npx playwright test --reporter=list > "%OUT%\4-e2e.txt" 2>&1
echo EXIT_CODE=%ERRORLEVEL%>> "%OUT%\4-e2e.txt"
echo e2e exit %ERRORLEVEL%>> "%OUT%\summary.txt"
set "E2E_BASE_URL="

echo.
echo ==================================================================
echo  [5/5] Production build
echo  The build writes to the .next folder used by the dev server.
echo  Please STOP the dev server now (press Ctrl+C in its window),
echo  then come back here and press any key to build.
echo ==================================================================
pause
call npm run build > "%OUT%\5-build.txt" 2>&1
echo EXIT_CODE=%ERRORLEVEL%>> "%OUT%\5-build.txt"
echo build exit %ERRORLEVEL%>> "%OUT%\summary.txt"

echo Finished %date% %time%>> "%OUT%\summary.txt"
echo done> "%OUT%\DONE.txt"
echo.
echo All done. Results are in %OUT%. You can restart the dev server with:
echo    npm run dev -- -p 3001
echo Tell Claude it has finished.
pause
