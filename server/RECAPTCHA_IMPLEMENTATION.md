# Google reCAPTCHA v3 Implementation Guide

## Overview

This implementation provides comprehensive Google reCAPTCHA v3 protection for the TransparaTech application, specifically for the login and registration forms. reCAPTCHA v3 uses advanced risk analysis to protect your site from fraud and abuse without user friction.

## Features

✅ **Frontend Integration**
- Invisible reCAPTCHA v3 protection
- Automatic token generation for forms
- Development mode with bypass functionality
- Loading states and user feedback
- Error handling and fallback mechanisms

✅ **Backend Verification**
- Server-side token validation
- Score-based security thresholds
- Action verification
- IP address logging
- Comprehensive security logging

✅ **Security Features**
- SQL injection protection (already implemented)
- Rate limiting (already implemented)
- reCAPTCHA v3 bot protection (new)
- Environment-based configuration
- Development/production mode support

## Configuration

### 1. Get reCAPTCHA Keys

1. Visit [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Choose **reCAPTCHA v3**
3. Add your domain(s):
   - `localhost` (for development)
   - `your-domain.com` (for production)
4. Get your **Site Key** (public) and **Secret Key** (private)

### 2. Frontend Configuration

Add to `client/.env`:
```env
# Replace with your actual site key from Google reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=your_actual_site_key_here
```

### 3. Backend Configuration

Add to `server/.env`:
```env
# Replace with your actual secret key from Google reCAPTCHA
RECAPTCHA_SECRET_KEY=your_actual_secret_key_here
```

## Implementation Details

### Frontend Components

#### 1. RecaptchaWrapper Component
- Location: `client/src/components/common/RecaptchaWrapper.tsx`
- Provides invisible reCAPTCHA v3 for forms
- Shows development mode indicator when reCAPTCHA is disabled

#### 2. RecaptchaService
- Location: `client/src/services/recaptchaService.ts`
- Handles token generation and API calls
- Provides React hooks for easy integration

#### 3. Configuration
- Location: `client/src/config/recaptcha.ts`
- Centralized configuration and constants
- Environment-based settings

### Backend Components

#### 1. RecaptchaService
- Location: `server/src/services/RecaptchaService.js`
- Server-side token verification
- Score analysis and action validation

#### 2. Recaptcha Middleware
- Location: `server/src/middleware/recaptcha.js`
- Express middleware for route protection
- Configurable thresholds and actions

#### 3. Routes Protection
- Registration: `POST /api/v1/auth/register` (threshold: 0.7)
- Login: `POST /api/v1/auth/login` (threshold: 0.5)
- Status check: `GET /api/v1/recaptcha/status`

## Security Thresholds

### reCAPTCHA v3 Scores
- **1.0**: Very likely a human
- **0.9**: Likely a human  
- **0.7**: Probably a human (registration threshold)
- **0.5**: Neutral (login threshold)
- **0.3**: Possibly a bot
- **0.1**: Very likely a bot

### Action-Specific Thresholds
```javascript
{
  register: 0.7,        // High security for account creation
  login: 0.5,           // Medium security for login
  forgot_password: 0.5, // Medium security for password reset
  contact: 0.3          // Low security for contact forms
}
```

## Development Mode

### Automatic Bypass
- Uses test keys when `NODE_ENV=development`
- Shows visual indicator in frontend
- Logs bypass activities in server console
- Allows development without Google reCAPTCHA setup

### Test Keys (Google Provided)
```
Site Key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
Secret Key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

## Production Deployment

### 1. Frontend (client)
```bash
# Set production reCAPTCHA site key
VITE_RECAPTCHA_SITE_KEY=your_production_site_key

# Build for production
npm run build
```

### 2. Backend (server)
```bash
# Set production reCAPTCHA secret key
RECAPTCHA_SECRET_KEY=your_production_secret_key
NODE_ENV=production

# Start production server
npm start
```

### 3. Domain Configuration
Ensure your reCAPTCHA keys are configured for your production domain in the Google reCAPTCHA Admin Console.

## API Endpoints

### Check reCAPTCHA Status
```bash
GET /api/v1/recaptcha/status

Response:
{
  "success": true,
  "data": {
    "enabled": true,
    "configured": true,
    "environment": "development"
  }
}
```

### Registration with reCAPTCHA
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "recaptchaToken": "reCAPTCHA_token_here",
  // ... other fields
}
```

### Login with reCAPTCHA
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "recaptchaToken": "reCAPTCHA_token_here"
}
```

## Error Handling

### Frontend Errors
- **reCAPTCHA Load Failure**: Shows user-friendly message
- **Token Generation Failure**: Displays security verification error
- **Network Issues**: Provides retry mechanism

### Backend Errors
- **Invalid Token**: Returns 400 with "Security verification failed"
- **Low Score**: Returns 400 with "Suspicious activity detected" 
- **Action Mismatch**: Returns 400 with "Invalid request"
- **Service Unavailable**: Returns 500 with generic security error

## Monitoring and Logging

### Frontend Logging
```javascript
// Development mode indicators
console.warn('reCAPTCHA skipped in development mode');

// Success logging
console.log('reCAPTCHA executed successfully for action: login');
```

### Backend Logging
```javascript
// Security events are logged with structured data
logger.info('reCAPTCHA verification successful', {
  score: 0.9,
  action: 'login',
  endpoint: '/api/v1/auth/login',
  ip: '192.168.1.1'
}, 'SECURITY');
```

## Testing

### Manual Testing
1. **Development Mode**: 
   - Should work without real reCAPTCHA keys
   - Shows development indicator
   - Logs bypass activities

2. **Production Mode**:
   - Test with real reCAPTCHA keys
   - Verify token generation and validation
   - Check score thresholds

### Test Scenarios
```bash
# Test registration
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","recaptchaToken":"test_token"}'

# Test login  
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","recaptchaToken":"test_token"}'

# Check status
curl http://localhost:3000/api/v1/recaptcha/status
```

## Troubleshooting

### Common Issues

1. **"Security verification not configured"**
   - Check `RECAPTCHA_SECRET_KEY` environment variable
   - Verify key is not a test key in production

2. **"reCAPTCHA verification failed"**
   - Check site key matches secret key
   - Verify domain configuration in Google Console
   - Check network connectivity

3. **"Score below threshold"**
   - User may be flagged as bot
   - Check score threshold configuration
   - Review user behavior patterns

4. **Development mode not working**
   - Verify `NODE_ENV=development`
   - Check frontend environment variables
   - Review browser console for errors

### Debug Commands

```bash
# Check server reCAPTCHA status
curl http://localhost:3000/api/v1/recaptcha/status

# Test with development bypass token
# (frontend automatically uses this in dev mode)

# Check server logs for reCAPTCHA events
grep "SECURITY" server.log
```

## Security Considerations

### Best Practices
1. **Never expose secret keys** in frontend code
2. **Use HTTPS** in production for secure token transmission  
3. **Monitor scores** and adjust thresholds based on patterns
4. **Log suspicious activity** for security analysis
5. **Rate limit** requests even with reCAPTCHA protection

### Limitations
- reCAPTCHA v3 is not foolproof against sophisticated bots
- Should be combined with other security measures
- Score thresholds may need adjustment based on user feedback
- Google's risk analysis may have false positives

## Support

### Resources
- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/)
- [TransparaTech Security Documentation](./SECURITY_AUDIT_REPORT.md)

### Contact
For issues with reCAPTCHA implementation, check the server logs and frontend console for detailed error messages.