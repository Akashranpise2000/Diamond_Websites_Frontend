/**
 * Seed Super Admin Credentials
 * 
 * This file contains the pre-configured super admin credentials.
 * The admin account is created on the server-side and cannot be registered through the frontend.
 * 
 * To use the admin panel:
 * 1. The super admin account must be created in the database first
 * 2. Use the credentials below to login via the admin login form
 * 3. The JWT token received can be used for API authentication
 * 
 * IMPORTANT: Keep these credentials secure and never expose them publicly.
 */

export const SUPER_ADMIN_CREDENTIALS = {
  email: 'admin@diamondhousecleaning.com',
  password: 'Admin@DH#2024!',
  role: 'admin'
};

/**
 * Server endpoint for admin login:
 * POST /api/v1/auth/login
 * 
 * Request body:
 * {
 *   "identifier": "admin@diamondhousecleaning.com",
 *   "password": "Admin@DH#2024!",
 *   "role": "admin"
 * }
 * 
 * Response will include JWT token:
 * {
 *   "success": true,
 *   "data": {
 *     "user": { ... },
 *     "token": "eyJhbGciOiJIUzI1...",
 *     "refreshToken": "eyJhbGciOiJIUzI1..."
 *   }
 * }
 * 
 * Use the token in Authorization header for subsequent API requests:
 * Authorization: Bearer <token>
 */

// For reference - these credentials must be set up in the database
// Use the server script: node server/src/scripts/makeAdmin.js
// Or manually create the admin user in MongoDB
