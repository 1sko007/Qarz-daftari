const crypto = require('crypto');

function secret() {
  if (!process.env.AUTH_SECRET) throw new Error('AUTH_SECRET is not configured');
  return process.env.AUTH_SECRET;
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(raw.split(';').map(x => x.trim()).filter(Boolean).map(x => {
    const i = x.indexOf('=');
    return i < 0 ? [x, ''] : [x.slice(0, i), decodeURIComponent(x.slice(i + 1))];
  }));
}

function setSession(res, username) {
  const payload = `${username}.${Date.now()}`;
  const token = Buffer.from(payload).toString('base64url') + '.' + sign(payload);
  res.setHeader('Set-Cookie', `qd_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
}

function clearSession(res) {
  res.setHeader('Set-Cookie', 'qd_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
}

function isAuthenticated(req) {
  try {
    const token = parseCookies(req).qd_session;
    if (!token) return false;
    const [encoded, sig] = token.split('.');
    if (!encoded || !sig) return false;
    const payload = Buffer.from(encoded, 'base64url').toString('utf8');
    const expected = sign(payload);
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const [username, timestamp] = payload.split('.');
    if (!username || !timestamp || Date.now() - Number(timestamp) > 604800000) return false;
    return username === process.env.ADMIN_USERNAME;
  } catch (_) { return false; }
}

function requireAuth(req, res) {
  if (isAuthenticated(req)) return true;
  res.status(401).json({ error: 'Unauthorized' });
  return false;
}

module.exports = { setSession, clearSession, isAuthenticated, requireAuth };
