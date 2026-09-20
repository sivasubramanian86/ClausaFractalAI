import { test, expect } from "@playwright/test";

test.describe("ClausaFractalAI End-to-End Enterprise GUI Test Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders brand header, legal role switcher, and switches theme", async ({ page }) => {
    // Assert title & branding
    await expect(page.getByRole("heading", { name: "ClausaFractalAI" })).toBeVisible();
    await expect(page.getByText("PromptWars Exclusive")).toBeVisible();

    // Toggle theme between dark and light
    const themeBtn = page.getByRole("button", { name: /Switch to (Light|Dark) Mode/i });
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    await expect(page.locator("html")).toHaveClass(/light|dark/);
  });

  test("navigates smoothly across all main studio and informational views", async ({ page }) => {
    // 1. Analytics Dashboard View
    await page.getByRole("button", { name: /Analytics & Intelligence/i }).click();
    await expect(page.getByRole("heading", { name: /Contract Portfolio Intelligence/i })).toBeVisible();
    await expect(page.getByText("Total Contracts Analyzed")).toBeVisible();

    // 2. FAQ Section View
    await page.getByRole("button", { name: /Knowledge & FAQ/i }).click();
    await expect(page.getByRole("heading", { name: /Legal Intelligence Knowledge Base/i })).toBeVisible();
    await expect(page.getByText("How does ClausaFractalAI prevent hallucinations?")).toBeVisible();

    // 3. About / Foundational Research View
    await page.getByRole("button", { name: /Agentic Architecture/i }).click();
    await expect(page.getByRole("heading", { name: /Enterprise Agentic AI Architecture/i })).toBeVisible();
    await expect(page.getByText("Refusal Ladder")).toBeVisible();

    // 4. Governance & VPC-SC View
    await page.getByRole("button", { name: /Governance & VPC-SC/i }).click();
    await expect(page.getByRole("heading", { name: /Enterprise Security & Governance Perimeter/i })).toBeVisible();
    await expect(page.getByText("VPC Service Controls Perimeter")).toBeVisible();

    // 5. Back to Studio View
    await page.getByRole("button", { name: /Active Studio/i }).click();
    await expect(page.getByRole("region", { name: /Document Viewer and Multimodal Ingestion/i })).toBeVisible();
  });

  test("verifies WCAG ARIA accessibility landmarks and controls", async ({ page }) => {
    // Ensure landmark regions exist
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main Application Sections" })).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();

    // Ensure accessible form controls
    const searchInput = page.getByRole("textbox", { name: /Ask a legal question/i });
    await expect(searchInput).toBeVisible();
  });
});
