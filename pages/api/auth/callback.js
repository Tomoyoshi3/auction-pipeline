import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const { code, shop } = req.query;

  if (!code || !shop) {
    return res.status(400).json({ error: 'Missing code or shop' });
  }

  try {
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();
    const accessToken = data.access_token;

    await redis.set(`shopify_token:${shop}`, accessToken);

    res.redirect('/success');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
