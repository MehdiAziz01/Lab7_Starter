### Mehdi Aziz

## Check Your Understanding

1) Where would you fit automated tests in the Recipe project development pipeline?

I’d plug them into a GitHub Action that runs on every push. That way, each commit automatically goes through our full test suite in a fresh CI environment, catching regressions early, preventing merges until everything passes, and requiring no extra manual steps as the project grows.

## Expose: E2E Testing with Jest-Puppeteer

2) Would you use an end-to-end test to check if a function is returning the correct output?  
**No.** Pure function logic belongs in a fast, isolated unit test—E2E tests are too heavyweight and should focus on complete UI flows rather than individual return values.

## Explore: Lighthouse testing
3) Navigation vs. snapshot mode  
- **Navigation mode** reloads the page from scratch and measures the full load process.  
- **Snapshot mode** inspects the page as it already is in the browser, without doing a full reload.

4) Three quick improvements from Lighthouse insights  
- **Compress & lazy-load images** so they’re smaller and only load when needed.  
- **Minify or remove unused CSS/JS** to shrink the amount of code sent to the browser.  
- **Enable browser caching** so repeat visits load assets (images, scripts) from local cache instead of refetching.   






