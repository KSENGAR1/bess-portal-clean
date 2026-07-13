# Maintenance Mode Guide

This document explains how to put your BESS Portal website into maintenance mode temporarily.

## What is Maintenance Mode?

Maintenance Mode displays a professional maintenance page to all visitors instead of the normal application. This is useful when you need to:
- Perform backend updates or data migrations
- Apply security patches
- Upgrade infrastructure
- Debug issues
- Temporarily pause the service

## How to Enable/Disable Maintenance Mode

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com
2. Log in to your account
3. Click on your project: **bess-portal-clean**

### Step 2: Access Environment Variables
1. Click on **Settings** (top menu)
2. Click on **Environment Variables** (left sidebar)

### Step 3: Toggle Maintenance Mode

#### **To ENABLE Maintenance Mode:**
1. Click **Add New** button
2. Enter Variable Name: `VITE_MAINTENANCE_MODE`
3. Enter Value: `true`
4. Select Environments: Select all (Production, Preview, Development)
5. Click **Add**
6. Vercel will automatically redeploy your site
7. Your site will now show the maintenance page

#### **To DISABLE Maintenance Mode:**
1. Find the existing `VITE_MAINTENANCE_MODE` variable
2. Click the **Edit** button (pencil icon)
3. Change the value from `true` to `false`
4. Click **Save**
5. Vercel will redeploy
6. Your site will be back online

## Maintenance Page Features

The maintenance page includes:
- **Professional Design**: Gradient background with animations
- **Status Information**: Shows estimated maintenance time
- **Live Clock**: Current date and time
- **Safety Message**: Confirms user data is secure
- **Contact Information**: Support email for inquiries
- **Progress Indicator**: Visual loading animation

## Technical Details

- **Variable Name**: `VITE_MAINTENANCE_MODE`
- **Possible Values**: `true` or `false`
- **Default**: Not set (app runs normally)
- **Case Sensitive**: Yes
- **Reload Required**: Yes (auto-redeploy on Vercel)

## Important Notes

✅ **Safe to use** - No data is deleted or lost
✅ **No code changes needed** - Just toggle the environment variable
✅ **Instant effect** - Takes effect after Vercel redeploys
✅ **Reversible** - Can be toggled on/off anytime

## Deployment Flow

```
Change VITE_MAINTENANCE_MODE in Vercel
         ↓
Vercel detects change and redeploys
         ↓
Build completes
         ↓
Maintenance page is live (or app comes back online)
```

## Example Scenarios

### Scenario 1: Database Migration
```
1. Set VITE_MAINTENANCE_MODE = true
2. Wait for redeploy
3. Users see maintenance page
4. Perform database migration on backend
5. Set VITE_MAINTENANCE_MODE = false
6. Site comes back online
```

### Scenario 2: Security Update
```
1. Set VITE_MAINTENANCE_MODE = true
2. Update dependencies locally
3. Push to GitHub
4. Vercel auto-redeploys (with maintenance page showing)
5. Once patched, set VITE_MAINTENANCE_MODE = false
```

## Troubleshooting

**Q: The maintenance page isn't showing after I set the variable?**
- A: Wait 2-3 minutes for Vercel to redeploy. Check the Deployments tab to see progress.

**Q: Can I customize the maintenance page?**
- A: Yes! Edit `src/components/MaintenanceMode.jsx` to change the message, colors, or design.

**Q: Will users lose their session data?**
- A: No, the browser's localStorage keeps user data intact during maintenance mode.

**Q: Can I schedule maintenance for a specific time?**
- A: Vercel doesn't have scheduled deploys, but you can manually toggle the variable when needed.

## Support

For issues or questions:
1. Check this document first
2. Review `src/components/MaintenanceMode.jsx` for customization
3. Contact Vercel support for deployment issues

---

**Last Updated**: July 2026
