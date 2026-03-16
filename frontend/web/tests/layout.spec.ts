import { test, expect } from '@playwright/test';

test.describe('Glohib.ai Layout Tests', () => {
  test('Homepage renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.screenshot({ path: 'test-results/homepage.png', fullPage: true });
    
    // Check main elements
    await expect(page.getByRole('heading', { name: 'Glohib.ai', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Launch Your Career in Global Health', exact: true })).toBeVisible();
    await expect(page.getByRole('main').getByText('500+').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started', exact: true })).toBeVisible();
  });

  test('Login page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.screenshot({ path: 'test-results/login.png', fullPage: true });
    
    // Check form elements
    await expect(page.getByRole('heading', { name: 'Welcome back', exact: true })).toBeVisible();
    await expect(page.getByLabel('Email address', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  });

  test('Register page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.screenshot({ path: 'test-results/register.png', fullPage: true });
    
    // Check form elements
    await expect(page.getByRole('heading', { name: 'Create your account', exact: true })).toBeVisible();
    await expect(page.getByLabel('First name', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Last name', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Email address', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true }).first()).toBeVisible();
  });

  test('Internships page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/internships');
    await page.screenshot({ path: 'test-results/internships.png', fullPage: true });
    
    // Check page elements
    await expect(page.getByRole('heading', { name: 'Browse Internships', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Search by title, organization, or keywords...')).toBeVisible();
  });

  test('Profile page renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/profile');
    await page.screenshot({ path: 'test-results/profile.png', fullPage: true });
    
    // Check page elements
    await expect(page.getByRole('heading', { name: 'Profile Information', exact: true })).toBeVisible();
  });
});
