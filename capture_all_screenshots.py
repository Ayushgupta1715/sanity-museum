import time
from playwright.sync_api import sync_playwright

def capture_all():
    print("Launching Playwright Chrome...")
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()
        
        base_url = "https://sanity2-two.vercel.app"
        
        # 1. Room 1: Inventions
        print("1. Capturing Room 1 (Inventions)...")
        page.goto(base_url, wait_until="load")
        page.wait_for_timeout(4000)
        page.screenshot(path="screenshot_01_room1_inventions.png")
        
        # 2. Room 2: Art
        print("2. Capturing Room 2 (Art)...")
        page.click("text=ROOM 2")
        page.wait_for_timeout(3000)
        page.screenshot(path="screenshot_02_room2_art.png")
        
        # 3. Room 3: History
        print("3. Capturing Room 3 (History)...")
        page.click("text=ROOM 3")
        page.wait_for_timeout(3000)
        page.screenshot(path="screenshot_03_room3_history.png")
        
        # 4. Room 4: Future
        print("4. Capturing Room 4 (Future)...")
        page.click("text=ROOM 4")
        page.wait_for_timeout(3000)
        page.screenshot(path="screenshot_04_room4_future.png")
        
        # 5. Exhibit Item Click (Modal Open) in Day Mode
        print("5. Capturing Exhibit Item Clicked (Modal Open)...")
        page.click("text=ROOM 1")
        page.wait_for_timeout(2500)
        page.evaluate('''() => {
            if (window.__setSelectedExhibit) {
                window.__setSelectedExhibit({
                    name: 'Steam Engine',
                    category: 'INVENTIONS',
                    era: '1776 AD',
                    creator: 'James Watt',
                    description: 'The driving force behind the Industrial Revolution, powering trains, factories, and ships with revolutionary thermodynamic efficiency.',
                    imageUrl: '/exhibits/real_4.jpg',
                    control: {
                        lifecycle: 'ACTIVE',
                        vitality: 94
                    }
                });
            }
        }''')
        page.wait_for_timeout(1500)
        page.screenshot(path="screenshot_05_exhibit_item_modal.png")
        
        # Close modal
        page.evaluate('''() => {
            if (window.__setSelectedExhibit) {
                window.__setSelectedExhibit(null);
            }
        }''')
        page.wait_for_timeout(1000)
        
        # 6. Night Mode / Dark Mode ON
        print("6. Capturing Night Mode (Dark Mode)...")
        toggle_btn = page.query_selector('button[title="Toggle Day/Night Mode"]')
        if toggle_btn:
            toggle_btn.click()
            page.wait_for_timeout(2500)
        page.screenshot(path="screenshot_06_night_mode.png")
        
        # 7. Night Mode with Exhibit Modal Open
        print("7. Capturing Night Mode with Exhibit Modal Open...")
        page.evaluate('''() => {
            if (window.__setSelectedExhibit) {
                window.__setSelectedExhibit({
                    name: 'Light Bulb',
                    category: 'INVENTIONS',
                    era: '1879 AD',
                    creator: 'Thomas Edison',
                    description: 'The first commercially practical incandescent light, conquering darkness and transforming cities worldwide into vibrant 24-hour metropolises.',
                    imageUrl: '/exhibits/real_6.jpg',
                    control: {
                        lifecycle: 'ACTIVE',
                        vitality: 88
                    }
                });
            }
        }''')
        page.wait_for_timeout(1500)
        page.screenshot(path="screenshot_07_night_mode_item_modal.png")
        
        # 8. Control Room
        print("8. Capturing Mission Control Room (/control-room)...")
        page.goto(f"{base_url}/control-room", wait_until="load")
        page.wait_for_timeout(4000)
        page.screenshot(path="screenshot_08_control_room.png")
        
        # 9. Sanity Studio CMS
        print("9. Capturing Sanity Studio (/studio)...")
        page.goto(f"{base_url}/studio", wait_until="load")
        page.wait_for_timeout(6000)
        page.screenshot(path="screenshot_09_sanity_studio.png")
        
        browser.close()
        print("ALL SCREENSHOTS CAPTURED SUCCESSFULLY!")

if __name__ == "__main__":
    capture_all()
