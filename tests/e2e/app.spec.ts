import { test, expect } from '@playwright/test';

test.describe('Autonomous App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Header & Navigation', () => {
    test('should display the header', async ({ page }) => {
      await expect(page.locator('header')).toBeVisible();
    });

    test('should navigate via sidebar', async ({ page }) => {
      await page.click('[data-testid="nav-projects"]');
      await expect(page).toHaveURL(/.*projects/);
    });
  });

  test.describe('Project Management', () => {
    test('should create a new project', async ({ page }) => {
      await page.click('[data-testid="new-project-button"]');
      await page.fill('input[placeholder="e.g. Enterprise CRM"]', 'E2E Test Project');
      await page.fill('input[placeholder="https://github.com/org/repo"]', 'https://github.com/test/repo');
      await page.click('text=Create Project');
      
      await expect(page.locator('[data-testid="project-name"]')).toContainText('E2E Test Project');
    });

    test('should display project card details', async ({ page }) => {
      // Assuming a project exists
      await expect(page.locator('.project-card')).toBeVisible();
      await expect(page.locator('.project-card-name')).toBeVisible();
    });
  });

  test.describe('Blueprint & Workflow', () => {
    test('should display blueprint details', async ({ page }) => {
      await page.click('text=E2E Test Project');
      await page.click('text=Blueprint');
      await expect(page.locator('.blueprint-container')).toBeVisible();
    });

    test('should display workflow steps', async ({ page }) => {
      await page.click('text=E2E Test Project');
      await page.click('text=Workflow');
      await expect(page.locator('.workflow-step')).toBeVisible();
    });
  });

  test.describe('Functionality', () => {
    test('should trigger a build run', async ({ page }) => {
      await page.click('text=E2E Test Project');
      await page.click('text=Trigger Run');
      await expect(page.locator('text=RUN_ID:')).toBeVisible();
    });

    test('should upload a document', async ({ page }) => {
      await page.click('text=E2E Test Project');
      await page.click('text=Documentation');
      
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.click('text=Upload');
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles({
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('test content'),
      });
      
      await expect(page.locator('text=test.txt')).toBeVisible();
    });
  });
});
