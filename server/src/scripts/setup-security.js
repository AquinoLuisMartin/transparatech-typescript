#!/usr/bin/env node

/**
 * Secure Setup Script for TransparaTech Server
 * Generates secure environment variables and validates configuration
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('TransparaTech Security Setup Tool\n');

/**
 * Generate cryptographically secure secrets
 */
const generateSecrets = () => {
  return {
    jwtSecret: crypto.randomBytes(64).toString('hex'),
    jwtRefreshSecret: crypto.randomBytes(64).toString('hex'),
    encryptionKey: crypto.randomBytes(32).toString('hex'),
    sessionSecret: crypto.randomBytes(32).toString('hex')
  };
};

/**
 * Create secure .env file
 */
const createSecureEnvFile = () => {
  const envPath = path.join(__dirname, '../../.env');
  const examplePath = path.join(__dirname, '../../.env.example');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('.env file already exists. Creating .env.secure with new secrets...\n');
  }

  // Generate secure secrets
  const secrets = generateSecrets();
  
  // Read the example file
  let envTemplate = '';
  if (fs.existsSync(examplePath)) {
    envTemplate = fs.readFileSync(examplePath, 'utf8');
  } else {
    // Create a basic template if example doesn't exist
    envTemplate = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transparatech_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration - CRITICAL SECURITY SETTINGS
JWT_SECRET=your_secure_jwt_secret_at_least_32_characters_long_generated_randomly
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
JWT_ISSUER=transparatech
JWT_AUDIENCE=transparatech-users

# CORS Configuration
CLIENT_URL=http://localhost:5173

# API Configuration
API_PREFIX=/api/v1

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_ai_key_here

# Security Configuration
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
  }

  // Replace placeholders with secure values
  let secureEnv = envTemplate
    .replace(/JWT_SECRET=.*/, `JWT_SECRET=${secrets.jwtSecret}`)
    .replace(/your_secure_jwt_secret_at_least_32_characters_long_generated_randomly/, secrets.jwtSecret)
    .replace(/your_jwt_secret_key_here/, secrets.jwtSecret);

  // Add additional security variables if not present
  if (!secureEnv.includes('SESSION_SECRET=')) {
    secureEnv += `\n# Session Security\nSESSION_SECRET=${secrets.sessionSecret}\n`;
  }

  if (!secureEnv.includes('ENCRYPTION_KEY=')) {
    secureEnv += `\n# Data Encryption\nENCRYPTION_KEY=${secrets.encryptionKey}\n`;
  }

  // Write the secure environment file
  const outputPath = fs.existsSync(envPath) ? path.join(__dirname, '../../.env.secure') : envPath;
  fs.writeFileSync(outputPath, secureEnv);

  console.log(`Secure environment file created: ${path.basename(outputPath)}`);
  console.log('\nGenerated Security Configuration:');
  console.log(`   JWT Secret: ${secrets.jwtSecret.substring(0, 16)}... (128 characters)`);
  console.log(`   Session Secret: ${secrets.sessionSecret.substring(0, 16)}... (64 characters)`);
  console.log(`   Encryption Key: ${secrets.encryptionKey.substring(0, 16)}... (64 characters)`);

  if (outputPath.includes('.secure')) {
    console.log('\nPlease review the generated .env.secure file and rename it to .env');
    console.log('   Make sure to update database credentials and other configuration values.');
  }

  return secrets;
};

/**
 * Validate existing environment
 */
const validateEnvironment = () => {
  console.log('\nValidating Current Environment Configuration...\n');

  const issues = [];
  const warnings = [];

  // Check JWT_SECRET
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    issues.push('JWT_SECRET is not set');
  } else if (jwtSecret.length < 32) {
    issues.push(`JWT_SECRET is too short (${jwtSecret.length} chars, minimum 32)`);
  } else if (['secret', 'test-secret', 'your_jwt_secret_key_here'].includes(jwtSecret.toLowerCase())) {
    issues.push('JWT_SECRET is using a default/weak value');
  } else {
    console.log('JWT_SECRET is properly configured');
  }

  // Check CORS configuration
  const clientUrl = process.env.CLIENT_URL;
  if (!clientUrl) {
    warnings.push('CLIENT_URL is not set (CORS origins)');
  } else {
    const origins = clientUrl.split(',').map(o => o.trim());
    const env = process.env.NODE_ENV || 'development';
    
    if (env === 'production') {
      const hasLocalhost = origins.some(origin => 
        origin.includes('localhost') || origin.includes('127.0.0.1')
      );
      
      if (hasLocalhost) {
        issues.push('CLIENT_URL contains localhost origins in production');
      } else {
        const hasHttp = origins.some(origin => origin.startsWith('http://'));
        if (hasHttp) {
          warnings.push('CLIENT_URL contains HTTP origins (HTTPS recommended for production)');
        }
        console.log('CLIENT_URL is properly configured for production');
      }
    } else {
      console.log('CLIENT_URL is configured');
    }
  }

  // Check database configuration
  const requiredDbVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  requiredDbVars.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`${varName} is not set`);
    } else {
      console.log(`${varName} is configured`);
    }
  });

  // Print results
  if (issues.length > 0) {
    console.log('\nCritical Security Issues:');
    issues.forEach(issue => console.log(`   ${issue}`));
  }

  if (warnings.length > 0) {
    console.log('\nConfiguration Warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }

  if (issues.length === 0 && warnings.length === 0) {
    console.log('\nConfiguration looks good!');
  }

  return { issues, warnings };
};

/**
 * Main setup function
 */
const main = () => {
  const args = process.argv.slice(2);
  
  if (args.includes('--generate') || args.includes('-g')) {
    console.log('Generating secure environment configuration...\n');
    createSecureEnvFile();
  } else if (args.includes('--validate') || args.includes('-v')) {
    // Load environment variables
    require('dotenv').config();
    validateEnvironment();
  } else if (args.includes('--jwt-secret')) {
    const secret = generateSecrets().jwtSecret;
    console.log('🔐 Generated JWT Secret:');
    console.log(secret);
    console.log('\n📝 Add this to your .env file:');
    console.log(`JWT_SECRET=${secret}`);
  } else {
    console.log('Usage:');
    console.log('  node setup-security.js --generate    Generate secure .env file');
    console.log('  node setup-security.js --validate    Validate current configuration');
    console.log('  node setup-security.js --jwt-secret  Generate JWT secret only');
    console.log('\nFor production deployment, always use --validate to ensure security compliance.');
  }
};

// Run the setup
main();