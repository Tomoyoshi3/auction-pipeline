export default function handler(req, res) {
  const shop = req.query.shop || process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const redirectUri = `https://auction-pipeline.vercel.app/api/auth/callback`;
  const scopes = 'write_products,read_products,write_inventory,read_inventory';

  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;

  res.redirect(installUrl);
}
