# Formspree Integration Setup Guide

This guide walks you through setting up Formspree for email submissions in Promptloper.

## What is Formspree?

Formspree is a form backend service that handles form submissions without requiring a server. It's perfect for static sites and JAMstack applications.

**Benefits:**
- No backend code required
- Spam protection built-in
- Email notifications
- Free tier available (50 submissions/month)
- Easy integration

## Step-by-Step Setup

### 1. Create a Formspree Account

1. Go to [https://formspree.io](https://formspree.io)
2. Click "Sign Up" (or "Get Started")
3. Choose your plan:
   - **Free**: 50 submissions/month
   - **Gold**: $10/month, 1,000 submissions
   - **Platinum**: Custom pricing

### 2. Create a New Form

1. After logging in, click "New Form" or "+ New Project"
2. Give your form a name (e.g., "Promptloper Contributions")
3. Click "Create Form"

### 3. Get Your Form Endpoint

After creating the form, you'll see your endpoint:

```
https://formspree.io/f/YOUR_FORM_ID
```

**Example:**
```
https://formspree.io/f/mwkgopqr
```

Copy this entire URL - you'll need it in the next step.

### 4. Configure the Application

1. Open the file: `src/components/ContributionForm/index.tsx`

2. Find this line near the top:
```typescript
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
```

3. Replace `YOUR_FORM_ID` with your actual form ID:
```typescript
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwkgopqr'
```

4. Save the file

### 5. Set Up Email Notifications

In your Formspree dashboard:

1. Click on your form
2. Go to "Settings"
3. Under "Email Notifications":
   - Add email: `suedacicekli@gmail.com`
   - Configure notification template (optional)
   - Enable/disable certain fields in emails

### 6. Configure Form Settings (Optional)

#### Spam Protection

1. In Formspree dashboard → Settings → Spam Protection
2. Options:
   - **reCAPTCHA**: Add Google reCAPTCHA (recommended)
   - **Honeypot**: Enable honeypot field
   - **Rate Limiting**: Limit submissions per IP

#### Redirect After Submission

The current implementation handles success in-app, but you can also configure:

1. Settings → Redirect URL
2. Add: `https://yoursite.com/contribute?success=true`

#### Auto-Responder

Send automatic confirmation emails to contributors:

1. Settings → Auto-Responder
2. Enable "Send Auto-Responder"
3. Customize the email template:

```
Thank you for contributing to Promptloper!

We've received your prompt submission and will review it within 1-3 business days.

Prompt Details:
Title: {{title}}
Category: {{category}}

We appreciate your contribution to the community!

Best regards,
The Promptloper Team
```

### 7. Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Open `http://localhost:3000`

3. Click the floating action button (FAB)

4. Fill out the form and submit

5. Check:
   - Form submission succeeds
   - You receive email notification
   - Success message appears in the app

### 8. Advanced Configuration

#### Custom Email Template

In Formspree dashboard, customize the email format:

**Subject Line Template:**
```
New Prompt Contribution: {{title}}
```

**Email Body Template:**
```html
<h2>New Prompt Submission</h2>

<h3>Prompt Details</h3>
<ul>
  <li><strong>Title:</strong> {{title}}</li>
  <li><strong>Category:</strong> {{category}}</li>
  <li><strong>Description:</strong> {{description}}</li>
</ul>

<h3>Prompt Content</h3>
<p>{{prompt}}</p>

<h3>Additional Information</h3>
<ul>
  <li><strong>Tags:</strong> {{tags}}</li>
  <li><strong>Image URL:</strong> {{imageUrl}}</li>
  <li><strong>Contributor Name:</strong> {{userName}}</li>
  <li><strong>Contributor Email:</strong> {{userEmail}}</li>
</ul>

<h3>Generated JSON</h3>
<pre>{{json}}</pre>
```

#### Multiple Recipients

Add multiple email addresses to receive notifications:

1. Settings → Email Notifications
2. Add emails:
   - suedacicekli@gmail.com
   - team@yourcompany.com
   - review@promptloper.com

#### Webhook Integration

For advanced workflows (e.g., automatic GitHub PR creation):

1. Settings → Webhooks
2. Add webhook URL: `https://yourapi.com/webhook`
3. Configure webhook events
4. Set up your backend to handle submissions

## Security Best Practices

### 1. Environment Variables

For better security, use environment variables:

1. Create `.env.local`:
```bash
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/mwkgopqr
```

2. Update `ContributionForm/index.tsx`:
```typescript
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || ''
```

3. Add to `.gitignore`:
```
.env.local
```

### 2. Rate Limiting

Enable rate limiting in Formspree:
- Settings → Rate Limiting
- Set maximum submissions per IP per hour
- Recommended: 5-10 submissions/hour

### 3. CORS Configuration

Formspree automatically handles CORS, but you can restrict domains:

1. Settings → CORS
2. Add allowed domains:
   - `https://promptloper.com`
   - `http://localhost:3000` (for development)

## Troubleshooting

### Common Issues

#### 1. Form submission fails with CORS error

**Solution:**
- Check Formspree CORS settings
- Ensure your domain is whitelisted
- Verify endpoint URL is correct

#### 2. Not receiving emails

**Solution:**
- Check spam folder
- Verify email address in Formspree settings
- Check Formspree dashboard for submission logs
- Ensure email notifications are enabled

#### 3. Formspree returns 404

**Solution:**
- Verify form ID is correct
- Check if form is active in dashboard
- Ensure no typos in endpoint URL

#### 4. Submission succeeds but JSON field is empty

**Solution:**
- Check that `generateJson()` is being called
- Verify JSON.stringify is working
- Check browser console for errors

### Debugging

Enable console logging in `ContributionForm/index.tsx`:

```typescript
const handleEmailSubmit = async (e: FormEvent) => {
  e.preventDefault()
  console.log('Submitting form:', formData)

  const payload = {
    ...formData,
    json: JSON.stringify(generateJson(), null, 2),
  }

  console.log('Payload:', payload)

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    console.log('Response:', response)
    // ... rest of code
  }
}
```

## Monitoring

### Formspree Dashboard

Monitor submissions in real-time:

1. Go to Formspree dashboard
2. Click on your form
3. View:
   - Recent submissions
   - Submission count
   - Failed submissions
   - Spam blocked

### Analytics

Track form performance:
- Submission rate
- Success/failure ratio
- Popular submission times
- Geographic data (paid plans)

## Upgrading

### When to Upgrade

Consider upgrading from free tier when:
- Receiving >50 submissions/month
- Need more form customization
- Want advanced spam protection
- Need team collaboration features
- Require priority support

### Plan Comparison

| Feature | Free | Gold ($10/mo) | Platinum |
|---------|------|---------------|----------|
| Submissions | 50/mo | 1,000/mo | Custom |
| Forms | 1 | Unlimited | Unlimited |
| Spam Protection | Basic | Advanced | Advanced |
| File Uploads | ❌ | ✅ | ✅ |
| Webhooks | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

## Alternative Solutions

If Formspree doesn't meet your needs:

### 1. EmailJS
- Similar to Formspree
- Free tier: 200 emails/month
- Good for simple forms

### 2. Netlify Forms
- Built into Netlify hosting
- Free tier: 100 submissions/month
- Great if hosting on Netlify

### 3. Custom Backend
- Full control
- No monthly fees
- Requires server setup
- More complex

## Support

### Formspree Support
- Documentation: https://help.formspree.io
- Email: support@formspree.io
- Discord: https://discord.gg/formspree

### Promptloper Support
- GitHub Issues: https://github.com/yourusername/promptloper/issues
- Email: suedacicekli@gmail.com

---

## Quick Reference

**Formspree Endpoint Format:**
```
https://formspree.io/f/YOUR_FORM_ID
```

**Configuration File:**
```
src/components/ContributionForm/index.tsx
```

**Environment Variable:**
```bash
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

**Test Submission:**
```bash
curl -X POST https://formspree.io/f/YOUR_FORM_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Prompt","category":"Other"}'
```

---

Last Updated: 2024
