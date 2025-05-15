# Deployment Instructions

After making changes to the MOSimulator code, you need to follow these steps to see the changes on your mobile device:

## Option 1: Local Testing
1. Run the development server:
   ```
   npm start
   ```
2. Open the app in your browser at http://localhost:3000
3. To test on your mobile device while developing, make sure your computer and mobile device are on the same network, then:
   - Find your computer's IP address (e.g., 192.168.1.100)
   - On your mobile device, navigate to: http://[your-computer-ip]:3000 (e.g., http://192.168.1.100:3000)

## Option 2: Deploy to Netlify
1. Make sure all your changes are committed to Git
   ```
   git add .
   git commit -m "Fixed mobile responsiveness"
   git push
   ```

2. The push should trigger an automatic deployment on Netlify

3. If you want to build and deploy manually:
   ```
   npm run build
   npx netlify deploy --prod
   ```

4. Clear your mobile browser cache or use incognito mode to ensure you're seeing the latest version

## Verifying the Changes
- You should see a red box at the bottom right of the screen with "Mobile View Active" text
- The current time should be displayed to confirm it's the latest version
- The PrinterInfoPopover should now display correctly as a bottom sheet when you tap the info icon

If you don't see these changes, your mobile browser might be showing a cached version. Try:
1. Force refreshing the page
2. Clearing browser cache
3. Using an incognito/private browser window