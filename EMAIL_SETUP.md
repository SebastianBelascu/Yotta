# Email Configuration Setup

This document explains how to configure email sending functionality for the Yotta platform.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Email (where contact forms and service applications will be sent)
ADMIN_EMAIL=admin@yotta.com
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password as `SMTP_PASS`

## Alternative SMTP Providers

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-access-key
SMTP_PASS=your-ses-secret-key
```

## Email Types

The system handles two types of emails:

### 1. Contact Form Emails
- **Endpoint**: `/api/send-email` with `type: 'contact'`
- **Functionality**: 
  - Sends contact form submission to admin
  - Sends confirmation email to user
- **Data Required**: name, email, subject, category, message

### 2. Service Listing Applications
- **Endpoint**: `/api/send-email` with `type: 'list-service'`
- **Functionality**: 
  - Sends service application to admin
  - No confirmation email to user (just success message)
- **Data Required**: businessName, email, phone, category, country

## Testing

1. Set up your environment variables
2. Fill out the contact form at `/contact`
3. Try the "List Your Service" popup from the navigation
4. Check your admin email for received messages
5. Check the user's email for confirmation (contact form only)

## Troubleshooting

### Common Issues

1. **"Email configuration not found"**
   - Ensure `SMTP_USER` and `SMTP_PASS` are set in `.env.local`

2. **Authentication failed**
   - For Gmail: Use app password, not regular password
   - Verify 2FA is enabled on Gmail account

3. **Connection timeout**
   - Check SMTP host and port settings
   - Verify firewall/network settings

4. **Emails not received**
   - Check spam/junk folders
   - Verify `ADMIN_EMAIL` is set correctly
   - Check email provider logs

### Debug Mode

To enable debug logging, add to your environment:
```env
DEBUG_EMAIL=true
```

This will log email sending attempts to the console.
