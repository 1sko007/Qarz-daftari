const { neon } = require('@neondatabase/serverless');
const { requireAuth } = require('./_auth');

function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  return neon(process.env.DATABASE_URL);
}
function cors(res) {
  res.setHeader('Cache-Control','no-store');
}
function normalize(row) {
  return {
    id: row.id, shop: row.shop, phone: row.phone || '', product: row.product,
    qty: Number(row.qty), price: Number(row.price), total: Number(row.total),
    date: row.date, due: row.due || '', paid: Number(row.paid || 0),
    payments: row.payments || []
  };
}
module.exports = async (req,res) => {
  cors(res);
  if (!requireAuth(req,res)) return;
  try {
    const sql = db();
    if (req.method === 'GET') {
      const rows = await sql`SELECT id,shop,phone,product,qty,price,total,date,due,paid,payments
        FROM debts ORDER BY created_at DESC`;
      return res.status(200).json(rows.map(normalize));
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.shop || !b.product || !b.qty || !b.price || !b.date)
        return res.status(400).send('Required fields are missing');
      const total = Number(b.qty) * Number(b.price);
      const rows = await sql`INSERT INTO debts
        (shop,phone,product,qty,price,total,date,due,paid,payments)
        VALUES (${b.shop},${b.phone||''},${b.product},${Number(b.qty)},${Number(b.price)},
        ${total},${b.date},${b.due||null},0,'[]'::jsonb)
        RETURNING id,shop,phone,product,qty,price,total,date,due,paid,payments`;
      return res.status(201).json(normalize(rows[0]));
    }
    return res.status(405).send('Method not allowed');
  } catch (e) { console.error(e); return res.status(500).send(e.message); }
};