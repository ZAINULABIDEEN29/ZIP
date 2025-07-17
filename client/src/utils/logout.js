// client/src/utils/logout.js
export function logoutUtility() {
  // Clear localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  // Clear sessionStorage backups
  sessionStorage.removeItem('backup_authToken');
  sessionStorage.removeItem('backup_userData');
  sessionStorage.removeItem('previousToken');
  sessionStorage.removeItem('previousUser');
} 