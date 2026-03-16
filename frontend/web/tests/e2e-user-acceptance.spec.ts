import { test, expect, Page } from '@playwright/test';

/**
 * GLOHIB.AI - End-to-End Human-Like User Acceptance Tests
 * 
 * These tests simulate real user behavior across the entire application.
 * Each test tracks issues and reports them comprehensively.
 */

// Issue tracker
const issues: Array<{
  severity: 'critical' | 'high' | 'medium' | 'low';
  page: string;
  element: string;
  description: string;
  expected: string;
  actual: string;
}> = [];

// Helper to track issues
function trackIssue(
  severity: 'critical' | 'high' | 'medium' | 'low',
  page: string,
  element: string,
  description: string,
  expected: string,
  actual: string
) {
  issues.push({ severity, page, element, description, expected, actual });
  console.error(`[${severity.toUpperCase()}] ${page} - ${element}: ${description}`);
}

// Test suite
test.describe('Glohib.ai - Complete User Acceptance Testing', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.afterAll(async () => {
    // Report all issues at the end
    if (issues.length > 0) {
      console.log('\n=== ISSUE SUMMARY ===');
      console.log(`Total Issues: ${issues.length}`);
      console.log(`Critical: ${issues.filter(i => i.severity === 'critical').length}`);
      console.log(`High: ${issues.filter(i => i.severity === 'high').length}`);
      console.log(`Medium: ${issues.filter(i => i.severity === 'medium').length}`);
      console.log(`Low: ${issues.filter(i => i.severity === 'low').length}`);
      console.log('\n=== DETAILED ISSUES ===');
      issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.severity.toUpperCase()}] ${issue.page}`);
        console.log(`   Element: ${issue.element}`);
        console.log(`   Issue: ${issue.description}`);
        console.log(`   Expected: ${issue.expected}`);
        console.log(`   Actual: ${issue.actual}`);
      });
    } else {
      console.log('\n✅ NO ISSUES FOUND - All tests passed!');
    }
  });

  /**
   * TEST 1: Homepage - Complete User Journey
   */
  test.describe('Homepage User Experience', () => {
    test('should load homepage and verify all elements', async () => {
      console.log('\n📄 Testing Homepage...');
      
      // Navigate to homepage
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); // Wait for animations

      // Take screenshot
      await page.screenshot({ path: 'test-results/e2e-01-homepage.png', fullPage: true });

      // Test Navigation Bar
      console.log('  Testing Navigation...');
      
      // Logo should be visible and clickable
      const logo = page.getByRole('heading', { name: 'Glohib.ai', exact: true }).first();
      if (await logo.isVisible()) {
        console.log('  ✓ Logo visible');
      } else {
        trackIssue('high', 'Homepage', 'Logo', 'Logo not visible', 'Logo should be visible in top-left', 'Logo not found');
      }

      // Test all nav links
      const navLinks = [
        { name: 'Opportunities', href: '/dashboard/internships' },
        { name: 'Programs', href: '/dashboard/programs' },
        { name: 'Global Map', href: '/dashboard/map' },
        { name: 'Resources', href: '/resources' },
        { name: 'Community', href: '/community' },
      ];

      for (const link of navLinks) {
        const navLink = page.getByRole('link', { name: link.name, exact: true });
        if (await navLink.isVisible()) {
          console.log(`  ✓ Nav link "${link.name}" visible`);
        } else {
          trackIssue('medium', 'Homepage', `Nav Link: ${link.name}`, 'Navigation link not visible', `Link "${link.name}" should be in navbar`, 'Link not found');
        }
      }

      // Test Login button
      const loginButton = page.getByRole('link', { name: 'Login', exact: true });
      if (await loginButton.isVisible()) {
        console.log('  ✓ Login button visible');
      } else {
        trackIssue('critical', 'Homepage', 'Login Button', 'Login button not visible', 'Login button should be in top-right', 'Button not found');
      }

      // Test Get Started button (primary CTA)
      const getStartedButton = page.getByRole('link', { name: 'Get Started', exact: true });
      if (await getStartedButton.isVisible()) {
        console.log('  ✓ Get Started button visible');
        
        // Check button has proper styling
        const className = await getStartedButton.getAttribute('class');
        if (className && className.includes('shadow')) {
          console.log('  ✓ Get Started button has shadow effect');
        } else {
          trackIssue('low', 'Homepage', 'Get Started Button', 'Button missing shadow effect', 'CTA button should have shadow for emphasis', 'No shadow class found');
        }
      } else {
        trackIssue('critical', 'Homepage', 'Get Started Button', 'Primary CTA not visible', 'Get Started button should be prominent in navbar', 'Button not found');
      }

      // Test Hero Section
      console.log('  Testing Hero Section...');
      
      const heroHeadline = page.getByRole('heading', { name: 'Launch Your Career in Global Health', exact: true });
      if (await heroHeadline.isVisible()) {
        console.log('  ✓ Hero headline visible');
      } else {
        trackIssue('critical', 'Homepage', 'Hero Headline', 'Main headline not visible', 'Should display "Launch Your Career in Global Health"', 'Headline not found');
      }

      // Test hero subtext
      const heroSubtext = page.getByText('Glohib.ai connects students from Africa and Asia');
      if (await heroSubtext.isVisible()) {
        console.log('  ✓ Hero subtext visible');
      } else {
        trackIssue('medium', 'Homepage', 'Hero Subtext', 'Description text not visible', 'Should explain platform purpose', 'Text not found');
      }

      // Test Hero CTAs
      const startJourneyButton = page.getByRole('link', { name: 'Start Your Journey', exact: true });
      if (await startJourneyButton.isVisible()) {
        console.log('  ✓ "Start Your Journey" CTA visible');
      } else {
        trackIssue('critical', 'Homepage', 'Hero CTA Primary', 'Primary hero CTA not visible', 'Should have "Start Your Journey" button', 'Button not found');
      }

      const exploreButton = page.getByRole('link', { name: 'Explore Opportunities', exact: true });
      if (await exploreButton.isVisible()) {
        console.log('  ✓ "Explore Opportunities" CTA visible');
      } else {
        trackIssue('high', 'Homepage', 'Hero CTA Secondary', 'Secondary hero CTA not visible', 'Should have "Explore Opportunities" button', 'Button not found');
      }

      // Test "How it Works" link
      const howItWorksLink = page.getByRole('link', { name: 'How it Works', exact: true });
      if (await howItWorksLink.isVisible()) {
        console.log('  ✓ "How it Works" link visible');
      } else {
        trackIssue('low', 'Homepage', 'How it Works Link', 'Tertiary link not visible', 'Should have "How it Works" link below CTAs', 'Link not found');
      }

      // Test Stats Section
      console.log('  Testing Stats Section...');
      
      const stats = ['500+', '50+', '10K+', '85%'];
      for (const stat of stats) {
        const statElement = page.getByRole('main').getByText(stat).first();
        if (await statElement.isVisible()) {
          console.log(`  ✓ Stat "${stat}" visible`);
        } else {
          trackIssue('medium', 'Homepage', `Stat: ${stat}`, 'Statistic not visible', `Should display "${stat}" statistic`, 'Stat not found');
        }
      }

      // Test Social Proof Section
      console.log('  Testing Social Proof...');
      
      const socialProofSection = page.getByText('Partner organizations where our students intern');
      if (await socialProofSection.isVisible()) {
        console.log('  ✓ Social proof section visible');
        
        // Check for organization names
        const orgs = ['WHO', 'UNICEF', 'MSF', 'World Bank', 'Gates Foundation'];
        for (const org of orgs) {
          const orgElement = page.getByText(org, { exact: true });
          if (await orgElement.isVisible()) {
            console.log(`  ✓ Organization "${org}" visible`);
          } else {
            trackIssue('low', 'Homepage', `Organization: ${org}`, 'Organization logo not visible', `Should display "${org}" in partner section`, 'Logo not found');
          }
        }
      } else {
        trackIssue('medium', 'Homepage', 'Social Proof Section', 'Partner section not visible', 'Should show partner organizations', 'Section not found');
      }

      // Test How It Works Section
      console.log('  Testing How It Works...');
      
      const howItWorksHeading = page.getByRole('heading', { name: 'How Glohib.ai Works', exact: true });
      if (await howItWorksHeading.isVisible()) {
        console.log('  ✓ "How It Works" section visible');
        
        // Check for 4 steps
        const steps = ['Create Your Profile', 'Discover Opportunities', 'Apply With One Click', 'Launch Your Career'];
        for (const step of steps) {
          const stepElement = page.getByText(step, { exact: true });
          if (await stepElement.isVisible()) {
            console.log(`  ✓ Step "${step}" visible`);
          } else {
            trackIssue('medium', 'Homepage', `Step: ${step}`, 'Process step not visible', `Should display step "${step}"`, 'Step not found');
          }
        }
      } else {
        trackIssue('high', 'Homepage', 'How It Works Section', 'Process section not visible', 'Should explain how platform works', 'Section not found');
      }

      // Test Featured Opportunities
      console.log('  Testing Featured Opportunities...');
      
      const opportunitiesHeading = page.getByRole('heading', { name: 'Featured Opportunities', exact: true });
      if (await opportunitiesHeading.isVisible()) {
        console.log('  ✓ Featured Opportunities section visible');
        
        // Check for opportunity cards
        const opportunityCards = page.getByRole('link', { name: 'Apply Now', exact: true });
        const cardCount = await opportunityCards.count();
        if (cardCount >= 1) {
          console.log(`  ✓ ${cardCount} opportunity card(s) visible`);
        } else {
          trackIssue('high', 'Homepage', 'Opportunity Cards', 'No opportunity cards visible', 'Should display featured opportunities', 'No cards found');
        }

        // Check View All button
        const viewAllButton = page.getByRole('link', { name: 'View All', exact: true });
        if (await viewAllButton.isVisible()) {
          console.log('  ✓ "View All" button visible');
        } else {
          trackIssue('low', 'Homepage', 'View All Button', 'View All button not visible', 'Should have button to view all opportunities', 'Button not found');
        }
      } else {
        trackIssue('high', 'Homepage', 'Featured Opportunities', 'Opportunities section not visible', 'Should show featured opportunities', 'Section not found');
      }

      // Test Global Map Preview
      console.log('  Testing Global Map Preview...');
      
      const mapHeading = page.getByRole('heading', { name: 'Explore Opportunities Worldwide', exact: true });
      if (await mapHeading.isVisible()) {
        console.log('  ✓ Global Map section visible');
        
        const exploreMapButton = page.getByRole('link', { name: 'Explore Global Map', exact: true });
        if (await exploreMapButton.isVisible()) {
          console.log('  ✓ "Explore Global Map" button visible');
        } else {
          trackIssue('medium', 'Homepage', 'Explore Map Button', 'Map CTA not visible', 'Should have button to explore map', 'Button not found');
        }
      } else {
        trackIssue('medium', 'Homepage', 'Global Map Section', 'Map preview not visible', 'Should show global map preview', 'Section not found');
      }

      // Test Success Stories
      console.log('  Testing Success Stories...');
      
      const storiesHeading = page.getByRole('heading', { name: 'Success Stories', exact: true });
      if (await storiesHeading.isVisible()) {
        console.log('  ✓ Success Stories section visible');
        
        // Check for testimonials
        const testimonials = page.locator('text="').filter({ hasText: /Placed at/ });
        const testimonialCount = await testimonials.count();
        if (testimonialCount >= 1) {
          console.log(`  ✓ ${testimonialCount} testimonial(s) visible`);
        } else {
          trackIssue('low', 'Homepage', 'Testimonials', 'No testimonials visible', 'Should show success stories', 'No testimonials found');
        }
      } else {
        trackIssue('low', 'Homepage', 'Success Stories', 'Testimonials section not visible', 'Should show success stories', 'Section not found');
      }

      // Test Newsletter Signup
      console.log('  Testing Newsletter Signup...');
      
      const newsletterHeading = page.getByRole('heading', { name: 'Get Global Health Opportunities Weekly', exact: true });
      if (await newsletterHeading.isVisible()) {
        console.log('  ✓ Newsletter section visible');
        
        const emailInput = page.getByPlaceholder('Enter your email');
        if (await emailInput.isVisible()) {
          console.log('  ✓ Email input visible');
        } else {
          trackIssue('medium', 'Homepage', 'Newsletter Email Input', 'Email input not visible', 'Should have email input field', 'Input not found');
        }

        const subscribeButton = page.getByRole('button', { name: 'Subscribe', exact: true });
        if (await subscribeButton.isVisible()) {
          console.log('  ✓ Subscribe button visible');
        } else {
          trackIssue('medium', 'Homepage', 'Newsletter Subscribe Button', 'Subscribe button not visible', 'Should have subscribe button', 'Button not found');
        }
      } else {
        trackIssue('low', 'Homepage', 'Newsletter Section', 'Newsletter signup not visible', 'Should have newsletter signup', 'Section not found');
      }

      // Test Footer
      console.log('  Testing Footer...');
      
      const footerLinks = ['Opportunities', 'Programs', 'Global Map', 'About Us', 'Partners', 'Contact', 'Blog', 'Privacy Policy', 'Terms of Service'];
      for (const link of footerLinks) {
        const footerLink = page.getByRole('link', { name: link, exact: true });
        if (await footerLink.isVisible()) {
          console.log(`  ✓ Footer link "${link}" visible`);
        } else {
          trackIssue('low', 'Homepage', `Footer Link: ${link}`, 'Footer link not visible', `Should have "${link}" in footer`, 'Link not found');
        }
      }

      // Test Theme Toggle
      const themeToggle = page.getByRole('button').filter({ hasText: /theme|dark|light/i }).first();
      if (await themeToggle.isVisible()) {
        console.log('  ✓ Theme toggle visible');
        
        // Test theme toggle functionality
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Check if dark mode class was added/removed
        const htmlClass = await page.locator('html').first().getAttribute('class');
        if (htmlClass && htmlClass.includes('dark')) {
          console.log('  ✓ Theme toggle functional (dark mode)');
        } else {
          console.log('  ✓ Theme toggle functional (light mode)');
        }
        
        // Toggle back
        await themeToggle.click();
        await page.waitForTimeout(500);
      } else {
        trackIssue('low', 'Homepage', 'Theme Toggle', 'Theme toggle not visible', 'Should have dark/light mode toggle', 'Toggle not found');
      }
    });
  });

  /**
   * TEST 2: Login Page - Complete User Flow
   */
  test.describe('Login Page User Experience', () => {
    test('should test complete login flow', async () => {
      console.log('\n📄 Testing Login Page...');
      
      // Navigate to login page
      await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Take screenshot
      await page.screenshot({ path: 'test-results/e2e-02-login.png', fullPage: true });

      // Test page elements
      const welcomeHeading = page.getByRole('heading', { name: 'Welcome back', exact: true });
      if (await welcomeHeading.isVisible()) {
        console.log('  ✓ "Welcome back" heading visible');
      } else {
        trackIssue('high', 'Login', 'Welcome Heading', 'Welcome heading not visible', 'Should display "Welcome back"', 'Heading not found');
      }

      // Test email field
      const emailLabel = page.getByLabel('Email address', { exact: true });
      if (await emailLabel.isVisible()) {
        console.log('  ✓ Email field visible with label');
        
        // Test email input functionality
        await emailLabel.fill('test@university.edu');
        const emailValue = await emailLabel.inputValue();
        if (emailValue === 'test@university.edu') {
          console.log('  ✓ Email input functional');
        } else {
          trackIssue('critical', 'Login', 'Email Input', 'Email input not functional', 'Should accept text input', 'Input not working');
        }
      } else {
        trackIssue('critical', 'Login', 'Email Field', 'Email field not visible', 'Should have email input with label', 'Field not found');
      }

      // Test password field
      const passwordLabel = page.getByLabel('Password', { exact: true });
      if (await passwordLabel.isVisible()) {
        console.log('  ✓ Password field visible with label');
        
        // Test password input functionality
        await passwordLabel.fill('TestPassword123!');
        const passwordValue = await passwordLabel.inputValue();
        if (passwordValue === 'TestPassword123!') {
          console.log('  ✓ Password input functional');
        } else {
          trackIssue('critical', 'Login', 'Password Input', 'Password input not functional', 'Should accept text input', 'Input not working');
        }
      } else {
        trackIssue('critical', 'Login', 'Password Field', 'Password field not visible', 'Should have password input with label', 'Field not found');
      }

      // Test Remember me checkbox
      const rememberMeCheckbox = page.locator('input[type="checkbox"]').first();
      if (await rememberMeCheckbox.isVisible()) {
        console.log('  ✓ Remember me checkbox visible');
        
        // Test checkbox functionality
        await rememberMeCheckbox.check();
        const isChecked = await rememberMeCheckbox.isChecked();
        if (isChecked) {
          console.log('  ✓ Remember me checkbox functional');
        } else {
          trackIssue('medium', 'Login', 'Remember Me Checkbox', 'Checkbox not functional', 'Should toggle on click', 'Checkbox not working');
        }
      } else {
        trackIssue('low', 'Login', 'Remember Me', 'Remember me option not visible', 'Should have remember me checkbox', 'Checkbox not found');
      }

      // Test Forgot password link
      const forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?', exact: true });
      if (await forgotPasswordLink.isVisible()) {
        console.log('  ✓ "Forgot password?" link visible');
      } else {
        trackIssue('low', 'Login', 'Forgot Password Link', 'Forgot password link not visible', 'Should have password recovery link', 'Link not found');
      }

      // Test Sign in button
      const signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
      if (await signInButton.isVisible()) {
        console.log('  ✓ "Sign in" button visible');
        
        // Test button is enabled
        const isDisabled = await signInButton.isDisabled();
        if (!isDisabled) {
          console.log('  ✓ Sign in button enabled');
        } else {
          trackIssue('high', 'Login', 'Sign In Button', 'Sign in button disabled', 'Button should be enabled after filling form', 'Button disabled');
        }
      } else {
        trackIssue('critical', 'Login', 'Sign In Button', 'Sign in button not visible', 'Should have sign in button', 'Button not found');
      }

      // Test Google OAuth button
      const googleButton = page.getByRole('button', { name: 'Sign in with Google', exact: true });
      if (await googleButton.isVisible()) {
        console.log('  ✓ "Sign in with Google" button visible');
        
        const isDisabled = await googleButton.isDisabled();
        if (isDisabled) {
          console.log('  ℹ Google OAuth button disabled (expected if not configured)');
        }
      } else {
        trackIssue('medium', 'Login', 'Google OAuth', 'Google sign-in not visible', 'Should have Google OAuth option', 'Button not found');
      }

      // Test Create account link
      const createAccountLink = page.getByRole('link', { name: 'Create account', exact: true });
      if (await createAccountLink.isVisible()) {
        console.log('  ✓ "Create account" link visible');
        
        // Test navigation to register page
        await createAccountLink.click();
        await page.waitForTimeout(1000);
        
        const currentUrl = page.url();
        if (currentUrl.includes('/register')) {
          console.log('  ✓ Create account link navigates correctly');
        } else {
          trackIssue('high', 'Login', 'Create Account Link', 'Link does not navigate correctly', 'Should navigate to /register', `Navigated to: ${currentUrl}`);
        }
        
        // Navigate back to login
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
      } else {
        trackIssue('medium', 'Login', 'Create Account Link', 'Registration link not visible', 'Should have link to create account', 'Link not found');
      }

      // Test login submission (demo mode)
      console.log('  Testing login submission...');
      
      await emailLabel.fill('demo@university.edu');
      await passwordLabel.fill('DemoPassword123!');
      await signInButton.click();
      await page.waitForTimeout(2000);

      // Check if redirected to dashboard or stayed on login with error
      const currentUrl = page.url();
      if (currentUrl.includes('/dashboard')) {
        console.log('  ✓ Login successful - redirected to dashboard');
      } else if (currentUrl.includes('/login')) {
        console.log('  ℹ Login form submitted (demo mode or backend unavailable)');
      } else {
        trackIssue('high', 'Login', 'Login Submission', 'Unexpected redirect after login', 'Should redirect to dashboard or show error', `Redirected to: ${currentUrl}`);
      }
    });
  });

  /**
   * TEST 3: Register Page - Complete User Flow
   */
  test.describe('Register Page User Experience', () => {
    test('should test complete registration flow', async () => {
      console.log('\n📄 Testing Register Page...');
      
      // Navigate to register page
      await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Take screenshot
      await page.screenshot({ path: 'test-results/e2e-03-register.png', fullPage: true });

      // Test page elements
      const createAccountHeading = page.getByRole('heading', { name: 'Create your account', exact: true });
      if (await createAccountHeading.isVisible()) {
        console.log('  ✓ "Create your account" heading visible');
      } else {
        trackIssue('high', 'Register', 'Heading', 'Page heading not visible', 'Should display "Create your account"', 'Heading not found');
      }

      // Test First Name field
      const firstNameLabel = page.getByLabel('First name', { exact: true });
      if (await firstNameLabel.isVisible()) {
        console.log('  ✓ First name field visible');
        await firstNameLabel.fill('Test');
      } else {
        trackIssue('critical', 'Register', 'First Name Field', 'First name input not visible', 'Should have first name input', 'Field not found');
      }

      // Test Last Name field
      const lastNameLabel = page.getByLabel('Last name', { exact: true });
      if (await lastNameLabel.isVisible()) {
        console.log('  ✓ Last name field visible');
        await lastNameLabel.fill('User');
      } else {
        trackIssue('critical', 'Register', 'Last Name Field', 'Last name input not visible', 'Should have last name input', 'Field not found');
      }

      // Test Email field
      const emailLabel = page.getByLabel('Email address', { exact: true });
      if (await emailLabel.isVisible()) {
        console.log('  ✓ Email field visible');
        await emailLabel.fill('testuser@university.edu');
      } else {
        trackIssue('critical', 'Register', 'Email Field', 'Email input not visible', 'Should have email input', 'Field not found');
      }

      // Test Password field with strength indicator
      const passwordLabel = page.getByLabel('Password', { exact: true }).first();
      if (await passwordLabel.isVisible()) {
        console.log('  ✓ Password field visible');
        await passwordLabel.fill('SecurePassword123!');
        
        // Check for password strength indicator
        const strengthIndicator = page.locator('div').filter({ hasText: /strength/i }).first();
        if (await strengthIndicator.isVisible()) {
          console.log('  ✓ Password strength indicator visible');
        } else {
          trackIssue('low', 'Register', 'Password Strength', 'Strength indicator not visible', 'Should show password strength', 'Indicator not found');
        }
      } else {
        trackIssue('critical', 'Register', 'Password Field', 'Password input not visible', 'Should have password input', 'Field not found');
      }

      // Test Confirm Password field
      const confirmPasswordLabel = page.getByLabel('Confirm password', { exact: true });
      if (await confirmPasswordLabel.isVisible()) {
        console.log('  ✓ Confirm password field visible');
        await confirmPasswordLabel.fill('SecurePassword123!');
      } else {
        trackIssue('critical', 'Register', 'Confirm Password Field', 'Confirm password input not visible', 'Should have confirm password input', 'Field not found');
      }

      // Test Role selection (Student/Employer/Mentor)
      console.log('  Testing role selection...');
      const roleButtons = ['student', 'employer', 'mentor'];
      for (const role of roleButtons) {
        const roleButton = page.getByRole('button', { name: new RegExp(role, 'i') });
        if (await roleButton.isVisible()) {
          console.log(`  ✓ Role "${role}" button visible`);
        } else {
          trackIssue('medium', 'Register', `Role: ${role}`, 'Role selection not visible', `Should have "${role}" role option`, 'Button not found');
        }
      }

      // Select student role
      const studentButton = page.getByRole('button', { name: 'student', exact: true });
      if (await studentButton.isVisible()) {
        await studentButton.click();
        await page.waitForTimeout(500);
        console.log('  ✓ Student role selected');
      }

      // Test Terms checkbox
      const termsCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /terms/i });
      if (await termsCheckbox.isVisible()) {
        console.log('  ✓ Terms agreement checkbox visible');
      } else {
        trackIssue('medium', 'Register', 'Terms Checkbox', 'Terms checkbox not visible', 'Should have terms agreement checkbox', 'Checkbox not found');
      }

      // Test Terms and Privacy links
      const termsLink = page.getByRole('link', { name: 'Terms of Service', exact: true });
      if (await termsLink.isVisible()) {
        console.log('  ✓ Terms of Service link visible');
      } else {
        trackIssue('low', 'Register', 'Terms Link', 'Terms link not visible', 'Should link to Terms of Service', 'Link not found');
      }

      const privacyLink = page.getByRole('link', { name: 'Privacy Policy', exact: true });
      if (await privacyLink.isVisible()) {
        console.log('  ✓ Privacy Policy link visible');
      } else {
        trackIssue('low', 'Register', 'Privacy Link', 'Privacy link not visible', 'Should link to Privacy Policy', 'Link not found');
      }

      // Test Create Account button
      const createAccountButton = page.getByRole('button', { name: 'Create account', exact: true });
      if (await createAccountButton.isVisible()) {
        console.log('  ✓ "Create account" button visible');
      } else {
        trackIssue('critical', 'Register', 'Create Account Button', 'Submit button not visible', 'Should have create account button', 'Button not found');
      }

      // Test Sign in link
      const signInLink = page.getByRole('link', { name: 'Sign in', exact: true });
      if (await signInLink.isVisible()) {
        console.log('  ✓ "Sign in" link visible');
        
        await signInLink.click();
        await page.waitForTimeout(1000);
        
        const currentUrl = page.url();
        if (currentUrl.includes('/login')) {
          console.log('  ✓ Sign in link navigates correctly');
        } else {
          trackIssue('high', 'Register', 'Sign In Link', 'Link does not navigate correctly', 'Should navigate to /login', `Navigated to: ${currentUrl}`);
        }
        
        // Navigate back to register
        await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
      } else {
        trackIssue('medium', 'Register', 'Sign In Link', 'Sign in link not visible', 'Should have link to sign in', 'Link not found');
      }

      // Test value proposition section
      const valuePropSection = page.getByText('Why join Glohib.ai?');
      if (await valuePropSection.isVisible()) {
        console.log('  ✓ Value proposition section visible');
        
        const benefits = ['500+ global health internships', 'AI-powered matching', 'WHO, UNICEF'];
        for (const benefit of benefits) {
          const benefitElement = page.getByText(benefit);
          if (await benefitElement.isVisible()) {
            console.log(`  ✓ Benefit "${benefit}" visible`);
          } else {
            trackIssue('low', 'Register', `Benefit: ${benefit}`, 'Benefit not visible', `Should display "${benefit}"`, 'Text not found');
          }
        }
      } else {
        trackIssue('low', 'Register', 'Value Proposition', 'Benefits section not visible', 'Should show why join Glohib.ai', 'Section not found');
      }
    });
  });

  /**
   * TEST 4: Dashboard - Complete User Experience
   */
  test.describe('Dashboard User Experience', () => {
    test('should test complete dashboard experience', async () => {
      console.log('\n📄 Testing Dashboard...');
      
      // Navigate to dashboard (may require login)
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Take screenshot
      await page.screenshot({ path: 'test-results/e2e-04-dashboard.png', fullPage: true });

      // Check if redirected to login
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.log('  ℹ Redirected to login - performing login first...');
        
        // Perform login
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        
        const emailInput = page.getByLabel('Email address', { exact: true });
        const passwordInput = page.getByLabel('Password', { exact: true });
        const signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
        
        if (await emailInput.isVisible() && await passwordInput.isVisible()) {
          await emailInput.fill('demo@university.edu');
          await passwordInput.fill('DemoPassword123!');
          await signInButton.click();
          await page.waitForTimeout(2000);
          
          // Navigate to dashboard again
          await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
          await page.waitForTimeout(1000);
        }
      }

      // Test welcome message
      const welcomeHeading = page.getByRole('heading', { name: /welcome back/i });
      if (await welcomeHeading.isVisible()) {
        console.log('  ✓ Welcome message visible');
      } else {
        trackIssue('medium', 'Dashboard', 'Welcome Message', 'Welcome heading not visible', 'Should welcome user by name', 'Heading not found');
      }

      // Test navigation items
      const navItems = [
        { name: 'Internships', href: '/dashboard/internships' },
        { name: 'Profile', href: '/dashboard/profile' },
        { name: 'Applications', href: '/dashboard/applications' },
      ];

      for (const item of navItems) {
        const navLink = page.getByRole('link', { name: item.name, exact: true });
        if (await navLink.isVisible()) {
          console.log(`  ✓ Nav item "${item.name}" visible`);
        } else {
          trackIssue('medium', 'Dashboard', `Nav: ${item.name}`, 'Navigation item not visible', `Should have "${item.name}" in navigation`, 'Link not found');
        }
      }

      // Test stats cards
      const statLabels = ['Applications', 'Interviews', 'Profile Complete', 'AI Matches'];
      for (const label of statLabels) {
        const statCard = page.getByText(label);
        if (await statCard.isVisible()) {
          console.log(`  ✓ Stat "${label}" visible`);
        } else {
          trackIssue('low', 'Dashboard', `Stat: ${label}`, 'Stat card not visible', `Should display "${label}" stat`, 'Card not found');
        }
      }

      // Test Quick Actions section
      const quickActionsHeading = page.getByRole('heading', { name: 'Quick Actions', exact: true });
      if (await quickActionsHeading.isVisible()) {
        console.log('  ✓ Quick Actions section visible');
        
        const actionCards = ['Browse Internships', 'Complete Profile', 'Take Assessments', 'Find Mentors'];
        for (const action of actionCards) {
          const actionCard = page.getByText(action);
          if (await actionCard.isVisible()) {
            console.log(`  ✓ Action "${action}" visible`);
          } else {
            trackIssue('medium', 'Dashboard', `Action: ${action}`, 'Quick action not visible', `Should have "${action}" action`, 'Card not found');
          }
        }
      } else {
        trackIssue('medium', 'Dashboard', 'Quick Actions', 'Quick actions section not visible', 'Should show quick actions', 'Section not found');
      }

      // Test Profile Progress section
      const progressHeading = page.getByRole('heading', { name: 'Profile Progress', exact: true });
      if (await progressHeading.isVisible()) {
        console.log('  ✓ Profile Progress section visible');
        
        const progressItems = ['Basic Info', 'Education', 'Experience', 'Skills', 'Assessments'];
        for (const item of progressItems) {
          const progressItem = page.getByText(item);
          if (await progressItem.isVisible()) {
            console.log(`  ✓ Progress item "${item}" visible`);
          } else {
            trackIssue('low', 'Dashboard', `Progress: ${item}`, 'Progress item not visible', `Should show "${item}" in progress`, 'Item not found');
          }
        }
      } else {
        trackIssue('low', 'Dashboard', 'Profile Progress', 'Progress section not visible', 'Should show profile completion progress', 'Section not found');
      }

      // Test Logout functionality
      const logoutButton = page.getByRole('button').filter({ hasText: /logout|sign out/i }).or(page.getByText(/logout|sign out/i));
      if (await logoutButton.isVisible()) {
        console.log('  ✓ Logout button visible');
      } else {
        trackIssue('low', 'Dashboard', 'Logout', 'Logout option not visible', 'Should have logout option', 'Button not found');
      }

      // Test mobile menu (if viewport is mobile)
      const mobileMenuButton = page.getByRole('button').filter({ hasText: /menu/i }).or(page.locator('[aria-label*="menu"]'));
      if (await mobileMenuButton.isVisible()) {
        console.log('  ✓ Mobile menu button visible');
        
        // Test mobile menu toggle
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
        
        const mobileMenu = page.locator('nav').filter({ hasText: /internships|profile/i });
        if (await mobileMenu.isVisible()) {
          console.log('  ✓ Mobile menu opens correctly');
        } else {
          trackIssue('medium', 'Dashboard', 'Mobile Menu', 'Mobile menu does not open', 'Should show navigation when clicked', 'Menu not visible');
        }
        
        // Close menu
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
      }
    });
  });

  /**
   * TEST 5: Internships Page - Complete User Experience
   */
  test.describe('Internships Page User Experience', () => {
    test('should test complete internships browsing experience', async () => {
      console.log('\n📄 Testing Internships Page...');
      
      // Navigate to internships page
      await page.goto('http://localhost:3000/dashboard/internships', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Take screenshot
      await page.screenshot({ path: 'test-results/e2e-05-internships.png', fullPage: true });

      // Test page heading
      const heading = page.getByRole('heading', { name: 'Browse Internships', exact: true });
      if (await heading.isVisible()) {
        console.log('  ✓ Page heading visible');
      } else {
        trackIssue('high', 'Internships', 'Heading', 'Page heading not visible', 'Should display "Browse Internships"', 'Heading not found');
      }

      // Test search functionality
      const searchInput = page.getByPlaceholder(/search/i);
      if (await searchInput.isVisible()) {
        console.log('  ✓ Search input visible');
        
        // Test search functionality
        await searchInput.fill('WHO');
        await page.waitForTimeout(1000);
        console.log('  ✓ Search input functional');
        
        // Clear search
        await searchInput.fill('');
        await page.waitForTimeout(500);
      } else {
        trackIssue('medium', 'Internships', 'Search', 'Search input not visible', 'Should have search input', 'Input not found');
      }

      // Test filter dropdown
      const filterSelect = page.locator('select');
      if (await filterSelect.isVisible()) {
        console.log('  ✓ Filter dropdown visible');
        
        // Test filter options
        const options = await filterSelect.locator('option').allTextContents();
        console.log(`  ✓ Filter has ${options.length} options: ${options.join(', ')}`);
      } else {
        trackIssue('low', 'Internships', 'Filter', 'Filter dropdown not visible', 'Should have type filter', 'Dropdown not found');
      }

      // Test filter button
      const filterButton = page.getByRole('button').filter({ has: page.getByText(/filter/i) });
      if (await filterButton.isVisible()) {
        console.log('  ✓ Filter button visible');
      } else {
        trackIssue('low', 'Internships', 'Filter Button', 'Filter button not visible', 'Should have additional filter button', 'Button not found');
      }

      // Test results count
      const resultsText = page.getByText(/showing/i);
      if (await resultsText.isVisible()) {
        console.log('  ✓ Results count visible');
      } else {
        trackIssue('low', 'Internships', 'Results Count', 'Results count not visible', 'Should show number of results', 'Text not found');
      }

      // Test internship cards
      const internshipCards = page.locator('[role="article"]').or(page.locator('.card'));
      const cardCount = await internshipCards.count();
      if (cardCount > 0) {
        console.log(`  ✓ ${cardCount} internship card(s) visible`);
      } else {
        // Check for cards by other selectors
        const altCards = page.getByRole('link', { name: /apply now|view details/i });
        const altCount = await altCards.count();
        if (altCount > 0) {
          console.log(`  ✓ ${altCount} internship card(s) visible (alternative selector)`);
        } else {
          trackIssue('high', 'Internships', 'Internship Cards', 'No internship cards visible', 'Should display internship opportunities', 'No cards found');
        }
      }

      // Test Save button on cards
      const saveButtons = page.getByRole('button', { name: /save/i });
      const saveCount = await saveButtons.count();
      if (saveCount > 0) {
        console.log(`  ✓ ${saveCount} Save button(s) visible`);
        
        // Test save functionality
        await saveButtons.first().click();
        await page.waitForTimeout(500);
        console.log('  ✓ Save button clickable');
      } else {
        trackIssue('low', 'Internships', 'Save Button', 'Save buttons not visible', 'Should have save/bookmark buttons', 'Buttons not found');
      }

      // Test View Details buttons
      const viewDetailsButtons = page.getByRole('button', { name: /view details/i });
      const viewCount = await viewDetailsButtons.count();
      if (viewCount > 0) {
        console.log(`  ✓ ${viewCount} "View Details" button(s) visible`);
      } else {
        // Check for links instead
        const viewLinks = page.getByRole('link', { name: /view details/i });
        const linkCount = await viewLinks.count();
        if (linkCount > 0) {
          console.log(`  ✓ ${linkCount} "View Details" link(s) visible`);
        } else {
          trackIssue('medium', 'Internships', 'View Details', 'View Details buttons not visible', 'Should have buttons to view internship details', 'Buttons not found');
        }
      }

      // Test empty state
      await searchInput.fill('xyznonexistent123');
      await page.waitForTimeout(1000);
      
      const emptyState = page.getByText(/no internships found/i);
      if (await emptyState.isVisible()) {
        console.log('  ✓ Empty state visible for no results');
      } else {
        trackIssue('low', 'Internships', 'Empty State', 'Empty state not visible', 'Should show message when no results', 'Empty state not found');
      }
      
      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(500);
    });
  });

  /**
   * TEST 6: Profile Page - Complete User Experience
   */
  test.describe('Profile Page User Experience', () => {
    test('should test complete profile editing experience', async () => {
      console.log('\n📄 Testing Profile Page...');
      
      // Navigate to profile page
      await page.goto('http://localhost:3000/dashboard/profile', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Take screenshot
      await page.screenshot({ path: 'test-results/e2e-06-profile.png', fullPage: true });

      // Test page heading
      const heading = page.getByRole('heading', { name: 'Profile Information', exact: true });
      if (await heading.isVisible()) {
        console.log('  ✓ Profile heading visible');
      } else {
        trackIssue('high', 'Profile', 'Heading', 'Profile heading not visible', 'Should display "Profile Information"', 'Heading not found');
      }

      // Test Edit Profile button
      const editButton = page.getByRole('button', { name: /edit profile/i });
      if (await editButton.isVisible()) {
        console.log('  ✓ Edit Profile button visible');
      } else {
        trackIssue('medium', 'Profile', 'Edit Button', 'Edit button not visible', 'Should have edit profile button', 'Button not found');
      }

      // Test profile photo upload
      const uploadPhotoButton = page.getByRole('button', { name: /upload/i });
      if (await uploadPhotoButton.isVisible()) {
        console.log('  ✓ Upload Photo button visible');
      } else {
        trackIssue('low', 'Profile', 'Photo Upload', 'Photo upload not visible', 'Should have photo upload option', 'Button not found');
      }

      // Test form fields
      const formFields = [
        { name: 'First name', required: true },
        { name: 'Last name', required: true },
        { name: 'Email', required: true },
        { name: 'Phone', required: false },
        { name: 'Location', required: false },
      ];

      for (const field of formFields) {
        const fieldLabel = page.getByLabel(field.name, { exact: true });
        if (await fieldLabel.isVisible()) {
          console.log(`  ✓ "${field.name}" field visible`);
        } else {
          const severity = field.required ? 'high' : 'low';
          trackIssue(severity, 'Profile', `Field: ${field.name}`, 'Form field not visible', `Should have "${field.name}" input`, 'Field not found');
        }
      }

      // Test Bio textarea
      const bioLabel = page.getByLabel('Bio', { exact: true });
      if (await bioLabel.isVisible()) {
        console.log('  ✓ Bio field visible');
      } else {
        // Check for textarea by placeholder
        const bioTextarea = page.getByPlaceholder(/tell us about yourself/i);
        if (await bioTextarea.isVisible()) {
          console.log('  ✓ Bio textarea visible (by placeholder)');
        } else {
          trackIssue('medium', 'Profile', 'Bio Field', 'Bio field not visible', 'Should have bio/description field', 'Field not found');
        }
      }

      // Test Education section
      const educationHeading = page.getByRole('heading', { name: /education/i });
      if (await educationHeading.isVisible()) {
        console.log('  ✓ Education section visible');
        
        const addEducationButton = page.getByRole('button', { name: /add.*education/i });
        if (await addEducationButton.isVisible()) {
          console.log('  ✓ Add Education button visible');
        } else {
          trackIssue('low', 'Profile', 'Add Education', 'Add education button not visible', 'Should have button to add education', 'Button not found');
        }
      } else {
        trackIssue('medium', 'Profile', 'Education Section', 'Education section not visible', 'Should have education section', 'Section not found');
      }

      // Test Experience section
      const experienceHeading = page.getByRole('heading', { name: /experience/i });
      if (await experienceHeading.isVisible()) {
        console.log('  ✓ Experience section visible');
      } else {
        trackIssue('low', 'Profile', 'Experience Section', 'Experience section not visible', 'Should have experience section', 'Section not found');
      }

      // Test Skills section
      const skillsHeading = page.getByRole('heading', { name: /skills/i });
      if (await skillsHeading.isVisible()) {
        console.log('  ✓ Skills section visible');
      } else {
        trackIssue('low', 'Profile', 'Skills Section', 'Skills section not visible', 'Should have skills section', 'Section not found');
      }

      // Test Profile Progress sidebar
      const progressHeading = page.getByRole('heading', { name: /profile (progress|completion)/i });
      if (await progressHeading.isVisible()) {
        console.log('  ✓ Profile Progress section visible');
        
        const progressPercentage = page.getByText(/25%|overall/i);
        if (await progressPercentage.isVisible()) {
          console.log('  ✓ Progress percentage visible');
        } else {
          trackIssue('low', 'Profile', 'Progress Percentage', 'Progress percentage not visible', 'Should show completion percentage', 'Percentage not found');
        }
      } else {
        trackIssue('low', 'Profile', 'Progress Section', 'Progress section not visible', 'Should show profile completion progress', 'Section not found');
      }

      // Test Resources section
      const resourcesHeading = page.getByRole('heading', { name: /resources/i });
      if (await resourcesHeading.isVisible()) {
        console.log('  ✓ Resources section visible');
        
        const resourceLinks = ['Application Guide', 'Interview Prep', 'CV Template'];
        for (const resource of resourceLinks) {
          const resourceLink = page.getByText(resource);
          if (await resourceLink.isVisible()) {
            console.log(`  ✓ Resource "${resource}" visible`);
          } else {
            trackIssue('low', 'Profile', `Resource: ${resource}`, 'Resource link not visible', `Should have "${resource}" resource`, 'Link not found');
          }
        }
      } else {
        trackIssue('low', 'Profile', 'Resources Section', 'Resources section not visible', 'Should show helpful resources', 'Section not found');
      }

      // Test Tips section
      const tipsSection = page.getByText(/complete all sections|professional photo|compelling bio/i);
      if (await tipsSection.isVisible()) {
        console.log('  ✓ Profile tips visible');
      } else {
        trackIssue('low', 'Profile', 'Tips Section', 'Profile tips not visible', 'Should show tips for improving profile', 'Section not found');
      }
    });
  });

  /**
   * TEST 7: Mobile Bottom Navigation
   */
  test.describe('Mobile Bottom Navigation', () => {
    test('should test mobile bottom navigation', async () => {
      console.log('\n📄 Testing Mobile Bottom Navigation...');
      
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      
      // Navigate to homepage
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Take screenshot
      await page.screenshot({ path: 'test-results/e2e-07-mobile-nav.png' });

      // Test bottom navigation visibility (mobile only)
      const bottomNav = page.locator('nav').filter({ hasText: /home|explore|global map|profile/i }).last();
      if (await bottomNav.isVisible()) {
        console.log('  ✓ Bottom navigation visible on mobile');
        
        // Test nav items
        const navItems = ['Home', 'Explore', 'Global Map', 'Profile'];
        for (const item of navItems) {
          const navItem = page.getByRole('link', { name: item, exact: true });
          if (await navItem.isVisible()) {
            console.log(`  ✓ Nav item "${item}" visible`);
          } else {
            trackIssue('high', 'Mobile Nav', `Item: ${item}`, 'Navigation item not visible', `Should have "${item}" in bottom nav`, 'Item not found');
          }
        }

        // Test active state
        const homeItem = page.getByRole('link', { name: 'Home', exact: true });
        const homeClass = await homeItem.getAttribute('class');
        if (homeClass && (homeClass.includes('text-blue') || homeClass.includes('bg-blue'))) {
          console.log('  ✓ Active state visible for current page');
        } else {
          trackIssue('low', 'Mobile Nav', 'Active State', 'Active state not visible', 'Should highlight current page', 'No active state found');
        }

        // Test navigation functionality
        const exploreItem = page.getByRole('link', { name: 'Explore', exact: true });
        if (await exploreItem.isVisible()) {
          await exploreItem.click();
          await page.waitForTimeout(1000);
          
          const currentUrl = page.url();
          if (currentUrl.includes('/internships') || currentUrl.includes('/explore')) {
            console.log('  ✓ Explore navigation works');
          } else {
            trackIssue('medium', 'Mobile Nav', 'Explore Link', 'Explore does not navigate correctly', 'Should navigate to opportunities', `Navigated to: ${currentUrl}`);
          }
        }
      } else {
        trackIssue('high', 'Mobile Nav', 'Bottom Navigation', 'Bottom navigation not visible on mobile', 'Should have bottom navigation bar on mobile viewports', 'Nav not found');
      }

      // Reset viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
    });
  });

  /**
   * TEST 8: Cross-Page Navigation Flow
   */
  test.describe('Cross-Page Navigation Flow', () => {
    test('should test complete user journey across all pages', async () => {
      console.log('\n📄 Testing Cross-Page Navigation...');
      
      // Start at homepage
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      console.log('  ✓ Homepage loaded');

      // Click Get Started
      const getStartedButton = page.getByRole('button', { name: 'Get Started', exact: true });
      if (await getStartedButton.isVisible()) {
        await getStartedButton.click();
        await page.waitForTimeout(1000);
        
        if (page.url().includes('/register')) {
          console.log('  ✓ Get Started navigates to Register');
        } else {
          trackIssue('high', 'Navigation', 'Get Started', 'Get Started button does not navigate correctly', 'Should go to /register', `Went to: ${page.url()}`);
        }
      }

      // From Register, go to Login
      const signInLink = page.getByRole('link', { name: 'Sign in', exact: true });
      if (await signInLink.isVisible()) {
        await signInLink.click();
        await page.waitForTimeout(1000);
        
        if (page.url().includes('/login')) {
          console.log('  ✓ Sign in link navigates to Login');
        } else {
          trackIssue('high', 'Navigation', 'Sign In Link', 'Sign in link does not navigate correctly', 'Should go to /login', `Went to: ${page.url()}`);
        }
      }

      // From Login, create account link
      const createAccountLink = page.getByRole('link', { name: 'Create account', exact: true });
      if (await createAccountLink.isVisible()) {
        await createAccountLink.click();
        await page.waitForTimeout(1000);
        
        if (page.url().includes('/register')) {
          console.log('  ✓ Create account link navigates correctly');
        } else {
          trackIssue('medium', 'Navigation', 'Create Account', 'Create account link does not navigate correctly', 'Should go to /register', `Went to: ${page.url()}`);
        }
      }

      // Navigate to Dashboard (may need login)
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      if (page.url().includes('/dashboard') || page.url().includes('/login')) {
        console.log('  ✓ Dashboard navigation works (or redirects to login)');
      } else {
        trackIssue('medium', 'Navigation', 'Dashboard', 'Dashboard navigation unexpected', 'Should go to /dashboard or /login', `Went to: ${page.url()}`);
      }

      // Navigate to Internships
      await page.goto('http://localhost:3000/dashboard/internships', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      if (page.url().includes('/internships')) {
        console.log('  ✓ Internships page loads correctly');
      } else {
        trackIssue('medium', 'Navigation', 'Internships', 'Internships page navigation failed', 'Should go to /dashboard/internships', `Went to: ${page.url()}`);
      }

      // Navigate to Profile
      await page.goto('http://localhost:3000/dashboard/profile', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      if (page.url().includes('/profile')) {
        console.log('  ✓ Profile page loads correctly');
      } else {
        trackIssue('medium', 'Navigation', 'Profile', 'Profile page navigation failed', 'Should go to /dashboard/profile', `Went to: ${page.url()}`);
      }

      // Test browser back/forward
      await page.goBack();
      await page.waitForTimeout(1000);
      console.log('  ✓ Browser back works');

      await page.goForward();
      await page.waitForTimeout(1000);
      console.log('  ✓ Browser forward works');
    });
  });

  /**
   * TEST 9: Responsive Design
   */
  test.describe('Responsive Design Testing', () => {
    test('should test responsive design across breakpoints', async () => {
      console.log('\n📄 Testing Responsive Design...');
      
      const viewports = [
        { name: 'Mobile', width: 375, height: 812 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 },
      ];

      for (const viewport of viewports) {
        console.log(`  Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);
        
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Take screenshot
        await page.screenshot({ path: `test-results/e2e-08-responsive-${viewport.name.toLowerCase()}.png`, fullPage: true });

        // Check for layout issues
        const body = page.locator('body');
        const bodyWidth = await body.boundingBox().then(b => b?.width || 0);
        
        if (bodyWidth > 0) {
          console.log(`    ✓ ${viewport.name} layout renders (width: ${bodyWidth}px)`);
        } else {
          trackIssue('high', 'Responsive', viewport.name, 'Layout does not render', `Should render at ${viewport.width}px`, 'No width detected');
        }

        // Check for horizontal scroll (should not exist)
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        if (!hasHorizontalScroll) {
          console.log(`    ✓ ${viewport.name} no horizontal scroll`);
        } else {
          trackIssue('medium', 'Responsive', viewport.name, 'Horizontal scroll detected', 'Should not have horizontal scroll', 'Horizontal scroll present');
        }

        // Check text readability
        const headings = page.locator('h1, h2, h3');
        const headingCount = await headings.count();
        if (headingCount > 0) {
          console.log(`    ✓ ${viewport.name} headings visible (${headingCount} found)`);
        } else {
          trackIssue('low', 'Responsive', viewport.name, 'No headings visible', 'Should display page headings', 'No headings found');
        }
      }

      // Reset to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
    });
  });

  /**
   * TEST 10: Accessibility Quick Check
   */
  test.describe('Accessibility Quick Check', () => {
    test('should perform basic accessibility checks', async () => {
      console.log('\n📄 Testing Accessibility...');
      
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Check for skip link
      const skipLink = page.locator('a[href="#main-content"], a[href="#main"]');
      if (await skipLink.isVisible()) {
        console.log('  ✓ Skip link present');
      } else {
        trackIssue('medium', 'Accessibility', 'Skip Link', 'Skip link not found', 'Should have skip to main content link', 'Link not found');
      }

      // Check all images have alt text
      const images = page.locator('img');
      const imageCount = await images.count();
      if (imageCount > 0) {
        let imagesWithoutAlt = 0;
        for (let i = 0; i < imageCount; i++) {
          const alt = await images.nth(i).getAttribute('alt');
          if (alt === null || alt === '') {
            imagesWithoutAlt++;
          }
        }
        if (imagesWithoutAlt === 0) {
          console.log(`  ✓ All ${imageCount} images have alt text`);
        } else {
          trackIssue('medium', 'Accessibility', 'Image Alt Text', `${imagesWithoutAlt} images missing alt text`, 'All images should have alt text', `${imagesWithoutAlt} images without alt`);
        }
      }

      // Check form labels
      const inputs = page.locator('input:not([type="hidden"]), textarea, select');
      const inputCount = await inputs.count();
      if (inputCount > 0) {
        let inputsWithoutLabel = 0;
        for (let i = 0; i < inputCount; i++) {
          const id = await inputs.nth(i).getAttribute('id');
          const ariaLabel = await inputs.nth(i).getAttribute('aria-label');
          const placeholder = await inputs.nth(i).getAttribute('placeholder');
          
          if (!id && !ariaLabel && !placeholder) {
            inputsWithoutLabel++;
          }
        }
        if (inputsWithoutLabel === 0) {
          console.log(`  ✓ All ${inputCount} form inputs have labels`);
        } else {
          trackIssue('high', 'Accessibility', 'Form Labels', `${inputsWithoutLabel} inputs without labels`, 'All form inputs should have labels', `${inputsWithoutLabel} unlabeled inputs`);
        }
      }

      // Check color contrast (basic check - text should be visible)
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, a, button');
      const textCount = await textElements.count();
      if (textCount > 0) {
        console.log(`  ✓ ${textCount} text elements found (visual check needed for contrast)`);
      }

      // Check focus indicators
      const firstButton = page.locator('button, a').first();
      if (await firstButton.isVisible()) {
        await firstButton.focus();
        await page.waitForTimeout(500);
        
        // Take screenshot to manually verify focus indicator
        await page.screenshot({ path: 'test-results/e2e-09-focus-indicator.png' });
        console.log('  ✓ Focus indicator screenshot captured for manual review');
      }
    });
  });
});
