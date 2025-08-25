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

        # Take a screenshot of the login page
        await page.screenshot(path="login-page.png")

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

        # Take a screenshot of the dashboard
        await page.screenshot(path="dashboard-initial.png")

        # Add a new todo
        await page.get_by_label("What needs to be done?").fill("My first todo")
        await page.get_by_role("button", name="Add Todo").click()

        # Wait for the todo to appear
        await expect(page.get_by_text("My first todo")).to_be_visible()

        # Take a screenshot of the dashboard with the new todo
        await page.screenshot(path="dashboard-with-todo.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
