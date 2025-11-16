# Backend Security Refactoring - SQL Injection Prevention

## Overview
All direct SQL queries have been removed from the User model and consolidated into a centralized `DatabaseService`. This prevents SQL injection attacks and ensures consistent parameterized query usage across the backend.

## Architecture

### Service Layer (DatabaseService)
**Location:** `server/src/services/DatabaseService.js`

All database operations now go through this centralized service with:
- ✅ **Parameterized Queries**: All user inputs are passed as parameters ($1, $2, etc.), not concatenated
- ✅ **Input Validation**: Parameter handling prevents SQL injection
- ✅ **Consistent Error Handling**: Centralized error logging
- ✅ **Documentation**: JSDoc comments for all methods

### Model Layer (User)
**Location:** `server/src/models/User.js`

The User model now acts as a wrapper that:
- Calls DatabaseService methods instead of writing raw SQL
- Formats database responses into consistent objects
- Maintains backward compatibility with existing code

### Benefits

| Before | After |
|--------|-------|
| Raw SQL strings in model | Parameterized queries in service |
| SQL injection vulnerable | SQL injection protected |
| Hard to maintain | Centralized, easy to update |
| Multiple query locations | Single source of truth |

## Security Features

### 1. Parameterized Queries
```javascript
// ✅ SAFE - Using parameters
const result = await query(
  `SELECT * FROM "SignUp" WHERE email = $1`,
  [email]  // Parameter passed separately
);

// ❌ UNSAFE - String concatenation (NEVER do this)
const result = await query(
  `SELECT * FROM "SignUp" WHERE email = '${email}'`  // Vulnerable!
);
```

### 2. Null Handling
```javascript
// All optional fields are properly coalesced
password: $8 || null,
firstName: $2 || null
```

### 3. Consistent Database Operations

| Operation | Method | Location |
|-----------|--------|----------|
| Create User | `insertSignUp()` | DatabaseService |
| Read by Email | `findSignUpByEmail()` | DatabaseService |
| Read by ID | `findSignUpById()` | DatabaseService |
| Read by Student# | `findSignUpByStudentNumber()` | DatabaseService |
| Read All | `findAllSignUp()` | DatabaseService |
| Update | `updateSignUp()` | DatabaseService |
| Update Password | `updateSignUpPassword()` | DatabaseService |
| Delete | `deleteSignUp()` | DatabaseService |
| Count | `countSignUp()` | DatabaseService |
| Check Email | `emailExists()` | DatabaseService |
| Check Student# | `studentNumberExists()` | DatabaseService |

## Usage Examples

### In Auth Controller
```javascript
// ❌ Before - Direct queries
const result = await query(
  `SELECT * FROM "SignUp" WHERE email = $1`,
  [email]
);

// ✅ After - Through User model
const user = await User.findByEmail(email);
```

### In Middleware
```javascript
// ❌ Before - Direct queries
const result = await query('SELECT id, email FROM "SignUp" WHERE id = $1', [decoded.id]);

// ✅ After - Through DatabaseService
const user = await DatabaseService.findSignUpById(decoded.id);
```

## Call Flow

```
Request
  ↓
Controller (authController.js)
  ↓
Model (User.js)
  ↓
Service (DatabaseService.js) ← All SQL queries here
  ↓
Database Config (database.js)
  ↓
PostgreSQL
```

## Adding New Features

When adding new database operations:

1. **Add method to DatabaseService.js**
   ```javascript
   static async newOperation(param) {
     return await query(
       `SELECT * FROM "SignUp" WHERE column = $1`,
       [param]  // Always parameterized
     );
   }
   ```

2. **Add wrapper to User.js**
   ```javascript
   static async newMethod(param) {
     const result = await DatabaseService.newOperation(param);
     return this._formatUser(result);
   }
   ```

3. **Use in Controller**
   ```javascript
   const user = await User.newMethod(value);
   ```

## Environment Variables
Make sure these are set in `.env`:
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing key

## Testing

Run the server with:
```bash
npm run dev
```

Test endpoints:
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user (requires auth token)
- `PUT /api/v1/auth/change-password` - Change password (requires auth token)

---

**Security Status:** ✅ Protected against SQL Injection attacks
**Maintainability:** ✅ Centralized, well-documented code
**Performance:** ✅ Parameterized queries are optimized by PostgreSQL
