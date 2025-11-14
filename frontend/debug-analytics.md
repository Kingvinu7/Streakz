# Debug Reown Analytics

## Step 1: Verify Vercel Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Confirm `NEXT_PUBLIC_PROJECT_ID` is set for Production
3. Copy the value

## Step 2: Verify in Reown Dashboard

1. Go to https://cloud.reown.com/
2. Open your project
3. Compare the Project ID with your Vercel env var
4. They must match EXACTLY

## Step 3: Check Allowed Origins

1. In Reown Cloud → Your Project → Settings
2. Look for "Allowed Origins" or "Domains"
3. Add your production domain (e.g., `https://your-app.vercel.app`)
4. Save changes

## Step 4: Check Browser Console

1. Open your production site
2. Open browser DevTools (F12) → Console tab
3. Connect your wallet
4. Look for:
   - Any error messages mentioning "appkit", "reown", or "analytics"
   - Network tab: Check for failed requests to Reown APIs
   - Look for the warning: "NEXT_PUBLIC_PROJECT_ID is not set" (shouldn't appear in production)

## Step 5: Check Network Tab

1. Open DevTools → Network tab
2. Filter by "reown" or "walletconnect"
3. Connect your wallet
4. Look for API calls to Reown servers
5. Check if they're succeeding (status 200) or failing

## Step 6: Verify Build

Run this in your production build's browser console:
```javascript
console.log('ProjectId in build:', process.env.NEXT_PUBLIC_PROJECT_ID)
```

Note: This won't work in production (process.env is only available at build time in Next.js), but you can check the built files.

## Step 7: Check Reown Dashboard Sections

The analytics might be in different sections:
- Overview → Connected Wallets
- Analytics → Users
- Analytics → Connections
- Some dashboards have a delay of 24-48 hours

## Common Issues & Fixes

### Issue: "No data available"
**Fix**: Wait 24-48 hours after first deployment with correct Project ID

### Issue: Domain not allowed
**Fix**: Add production domain to Reown allowed origins

### Issue: Wrong dashboard
**Fix**: Ensure you're checking the correct project in Reown Cloud

### Issue: Old version
**Fix**: Update to latest @reown/appkit version

## Test Analytics is Working

Add this to your code temporarily to confirm Project ID is loaded:

```typescript
// Add to frontend/src/components/Providers.tsx after imports
if (typeof window !== 'undefined') {
  console.log('🔍 Debug - Project ID loaded:', projectId ? 'YES ✅' : 'NO ❌')
  console.log('🔍 Debug - Analytics enabled:', true)
}
```

Then check your production site's console for these messages.
