const crypto = require('crypto');
const { setSession, clearSession, isAuthenticated } = require('./_auth');

function same(a, b) {
  const aa = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') return res.status(200).json({ authenticated: isAuthenticated(req) });
    if (req.method === 'POST') {
      const { username, password } = req.body || {};
      if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET) {
        return res.status(500).json({ error: 'Login ENV variables are not configured' });
      }
      if (!same(username, process.env.ADMIN_USERNAME) || !same(password, process.env.ADMIN_PASSWORD)) {
        return res.status(401).json({ error: 'Login yoki parol noto‘g‘ri' });
      }
      setSession(res, process.env.ADMIN_USERNAME);
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'DELETE') {
      clearSession(res);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
