import { test, expect } from '@playwright/test';

test('Dashboard Content Check', async ({ page }) => {
  // Go to dashboard
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Take full page screenshot
  await page.screenshot({ path: 'test-results/dashboard-check.png', fullPage: true });

  // Get all text content from the page
  const pageContent = await page.locator('body').textContent();
  console.log('\n=== DASHBOARD PAGE CONTENT ===');
  console.log(pageContent);
  console.log('=== END DASHBOARD CONTENT ===\n');

  // Check for specific elements
  const checks = [
    'Overview',
    'Applications',
    'Interviews',
    'Profile Views',
    'Recommendations',
    'Saved Roles',
    'Recent Applications',
    'AI Career Insight',
    'Recommended Opportunities',
    'Welcome',
  ];

  console.log('\n=== ELEMENT CHECKS ===');
  for (const text of checks) {
    const found = pageContent?.includes(text);
    console.log(`${text}: ${found ? '✓ FOUND' : '✗ NOT FOUND'}`);
  }
  console.log('=== END CHECKS ===\n');

  // Get all headings
  const headings = await page.locator('h1, h2, h3').allTextContents();
  console.log('\n=== HEADINGS ===');
  console.log(headings);
  console.log('=== END HEADINGS ===\n');

  // Get all buttons
  const buttons = await page.locator('button').allTextContents();
  console.log('\n=== BUTTONS ===');
  console.log(buttons);
  console.log('=== END BUTTONS ===\n');

  // Get all links
  const links = await page.locator('a').all();
  console.log('\n=== LINKS ===');
  for (const link of links) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    console.log(`${text}: ${href}`);
  }
  console.log('=== END LINKS ===\n');
});
