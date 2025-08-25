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
        await page.screenshot(path="login-page-new.png")

        # Sign up and log in
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        username = f"testuser_{random_suffix}"
        password = f"Password123!"
        await page.get_by_role("button", name="Don't have an account? Sign Up").click()
        await page.get_by_label("Username").fill(username)
        await page.get_by_label("Password").fill(password)
        await page.get_by_label("Confirm Password").fill(password)
        await page.get_by_role("button", name="Create Account").click()
        await expect(page.get_by_text("Signup successful! Please log in.")).to_be_visible()

        await page.get_by_label("Username").fill(username)
        await page.get_by_label("Password").fill(password)
        await page.get_by_role("button", name="Sign In").click()
        await expect(page.get_by_text("TodoApp")).to_be_visible()

        # Dashboard screenshot
        await page.screenshot(path="dashboard-new.png")

        # Add a todo
        await page.get_by_label("What needs to be done?").fill("My new todo")
        await page.get_by_role("button", name="Add Todo").click()
        await expect(page.get_by_text("My new todo")).to_be_visible()
        await page.screenshot(path="dashboard-with-todo-new.png")

        # Filter todos
        await page.get_by_role("button", name="Completed").click()
        await page.screenshot(path="dashboard-filtered-new.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
