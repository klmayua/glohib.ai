import { test, expect } from '@playwright/test';

test('Dashboard Screenshot and Analysis', async ({ page }) => {
  console.log('\n=== NAVIGATING TO DASHBOARD ===\n');
  
  // Go to dashboard
  await page.goto('http://localhost:3000/dashboard', { 
    waitUntil: 'domcontentloaded',
    timeout: 15000
  });
  
  // Wait for content to load
  await page.waitForTimeout(5000);

  // Take full page screenshot
  await page.screenshot({ 
    path: 'test-results/dashboard-fullpage.png', 
    fullPage: true 
  });
  console.log('✓ Full page screenshot saved\n');

  // Take screenshot of just the visible area
  await page.screenshot({ 
    path: 'test-results/dashboard-viewport.png'
  });
  console.log('✓ Viewport screenshot saved\n');

  // Get the page title/heading
  const pageTitle = await page.locator('h1').first().textContent();
  console.log(`\n=== PAGE TITLE ===`);
  console.log(pageTitle);
  console.log('==================\n');

  // Get ALL text content from the main content area
  const mainContent = await page.locator('main').textContent();
  console.log('\n=== MAIN CONTENT TEXT ===');
  console.log(mainContent);
  console.log('=========================\n');

  // Get ALL headings
  const allHeadings = await page.locator('h1, h2, h3, h4').allTextContents();
  console.log('\n=== ALL HEADINGS ===');
  console.log(allHeadings);
  console.log('====================\n');

  // Get ALL stat cards (look for cards with numbers)
  const statCards = await page.locator('[class*="card"], [class*="Card"]').all();
  console.log('\n=== CARD COUNT ===');
  console.log(`Found ${statCards.length} cards`);
  console.log('==================\n');

  // Get text from first 10 cards
  for (let i = 0; i < Math.min(statCards.length, 10); i++) {
    const cardText = await statCards[i].textContent();
    console.log(`\n--- CARD ${i + 1} ---`);
    console.log(cardText?.trim());
    console.log('---------------\n');
  }

  // Get all links
  const allLinks = await page.locator('a').all();
  console.log('\n=== ALL LINKS ===');
  for (const link of allLinks) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    console.log(`"${text?.trim()}" -> ${href}`);
  }
  console.log('=================\n');

  // Get all buttons
  const allButtons = await page.locator('button').all();
  console.log('\n=== ALL BUTTONS ===');
  for (const button of allButtons) {
    const text = await button.textContent();
    console.log(`"${text?.trim()}"`);
  }
  console.log('==================\n');

  // Check for specific content
  console.log('\n=== CONTENT CHECKS ===');
  const checks = [
    'Overview',
    'Dashboard',
    'Welcome',
    'Applications',
    'Interviews',
    'Profile',
    'Saved',
    'Recommendations',
    'Quick Actions',
    'Browse Internships',
    'Complete Profile',
    'Recent Applications',
    'AI Career',
    'Recommended Opportunities',
  ];
  
  const bodyText = await page.locator('body').textContent();
  for (const text of checks) {
    const found = bodyText?.includes(text);
    console.log(`${text}: ${found ? '✓ FOUND' : '✗ NOT FOUND'}`);
  }
  console.log('======================\n');

  // Get URL
  const currentUrl = page.url();
  console.log(`\n=== CURRENT URL ===`);
  console.log(currentUrl);
  console.log('===================\n');
});
