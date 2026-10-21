const { neon } = require('@neondatabase/serverless');
module.exports = async (req,res) => {
  try {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
    const sql = neon(process.env.DATABASE_URL);
    const id = Number(req.query.id);
    if (!id) return res.status(400).send('Invalid id');
    const found = await sql`SELECT id,total,paid,payments FROM debts WHERE id=${id}`;
    if (!found.length) return res.status(404).send('Not found');
    if (req.method === 'DELETE') {
      await sql`DELETE FROM debts WHERE id=${id}`;
      return res.status(204).end();
    }
    if (req.method === 'PATCH') {
      const payment = Number((req.body||{}).payment);
      const date = (req.body||{}).date || new Date().toISOString().slice(0,10);
      if (!payment || payment < 0) return res.status(400).send('Invalid payment');
      const row = found[0];
      const remaining = Number(row.total) - Number(row.paid);
      if (payment > remaining) return res.status(400).send('Payment is larger than remaining debt');
      const payments = Array.isArray(row.payments) ? row.payments : [];
      payments.push({date,amount:payment});
      const newPaid = Number(row.paid) + payment;
      const rows = await sql`UPDATE debts SET paid=${newPaid}, payments=${JSON.stringify(payments)}::jsonb WHERE id=${id}
        RETURNING id,shop,phone,product,qty,price,total,date,due,paid,payments`;
      return res.status(200).json(rows[0]);
    }
    return res.status(405).send('Method not allowed');
  } catch (e) { console.error(e); return res.status(500).send(e.message); }
};