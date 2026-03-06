/**
 * Supabase Info (Legacy - Not used with MongoDB)
 * This file is kept for backward compatibility only
 */

// Deprecated: Not used with MongoDB backend
export const projectId = 'deprecated-mongodb-backend-in-use';
export const publicAnonKey = 'deprecated-mongodb-backend-in-use';

console.warn('⚠️ supabase/info is deprecated. System now uses MongoDB backend. Please update imports to use utils/api.ts');
