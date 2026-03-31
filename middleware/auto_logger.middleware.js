import LogActivity from "../models/log_activity.model.js";

/**
 * Detects the action label and module based on the request
 */
function getActionMeta(req) {
  const url = req.originalUrl || '';
  const method = req.method;

  // Auth-specific patterns
  if (url.includes('/auth/login')) {
    return { actionLabel: 'Login Berhasil', modul: 'Autentikasi' };
  }
  if (url.includes('/auth/register')) {
    return { actionLabel: 'Registrasi Akun', modul: 'Autentikasi' };
  }
  if (url.includes('/auth/logout')) {
    return { actionLabel: 'Logout', modul: 'Autentikasi' };
  }

  // General CRUD action labels
  let actionLabel = 'Aktivitas Sistem';
  if (method === 'POST') actionLabel = 'Penambahan Data';
  else if (method === 'PUT' || method === 'PATCH') actionLabel = 'Update Data';
  else if (method === 'DELETE') actionLabel = 'Penghapusan Data';

  // Infer module from URL segments (e.g. /api/v1/tasks -> Tasks)
  const segments = url.replace('/api/v1/', '').split('/');
  let rawModule = segments[0] || 'Sistem';
  
  // Convert kebab-case to readable form (e.g. gived-tasks -> Gived Tasks)
  const modul = rawModule
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return { actionLabel, modul };
}

/**
 * Middleware to auto-log successful CRUD operations and auth events
 */
export const autoLogActivity = (req, res, next) => {
  res.on('finish', async () => {
    const isAuthRoute = req.originalUrl.includes('/auth/');
    const isMutatingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    const isSuccess = res.statusCode >= 200 && res.statusCode < 400;

    // Only log: (auth routes on success) OR (CRUD mutations on success with logged-in user)
    if (!isSuccess) return;
    if (!isAuthRoute && !isMutatingMethod) return;
    
    // For non-auth routes, require an authenticated user
    let userId = req.user?.id;

    // For auth routes (login/register), extract user_id from response body if available
    // We set it on res.locals by auth controller when there's no req.user yet
    if (!userId && res.locals.loggedUserId) {
      userId = res.locals.loggedUserId;
    }

    if (!userId) return;

    const { actionLabel, modul } = getActionMeta(req);
    const ip_address = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1')
      .toString().split(',')[0].trim();
    const activityNote = `${actionLabel} pada ${req.originalUrl}`;

    try {
      await LogActivity.create({
        user_id: userId,
        action_label: actionLabel,
        activity: activityNote,
        modul,
        ip_address,
      });
    } catch (err) {
      console.error("❌ Failed to auto-log activity:", err.message);
    }
  });

  next();
};
