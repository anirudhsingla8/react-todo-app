import asyncio
from playwright.async_api import async_playwright, expect
import random
import string

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Go to the login page
        await page.goto("http://localhost:5173")

        # Generate random user credentials
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        username = f"testuser_{random_suffix}"
        password = f"Password123!"

        # Sign up a new user
        await page.get_by_role("button", name="Sign Up").click()
        await page.get_by_label("Username").fill(username)
        await page.get_by_label("Password").fill(password)
        await page.get_by_label("Confirm Password").fill(password)
        await page.get_by_role("button", name="Create Account").click()

        # Wait for the success notification
        await expect(page.get_by_text("Account created successfully!")).to_be_visible()

        # Log in
        await page.get_by_label("Username").fill(username)
        await page.get_by_label("Password").fill(password)
        await page.get_by_role("button", name="Sign In").click()

        # Wait for the dashboard to load
        await expect(page.get_by_text("Todo Dashboard")).to_be_visible()

        # Take a screenshot of the FilterControls component
        filter_controls = page.locator('text=Search & Filters').first.locator('xpath=..').first.locator('xpath=..').first
        await filter_controls.screenshot(path="filter-controls.png")

        # Interact with the new ToggleButtonGroup
        await page.get_by_role("button", name="Completed").click()

        # Take a screenshot of the FilterControls component after interaction
        await filter_controls.screenshot(path="filter-controls-completed.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
