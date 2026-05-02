export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description, price, imageUrl } = req.body;

  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  try {
    const response = await fetch(
      `https://${shopifyDomain}/admin/api/2026-04/products.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify({
          product: {
            title,
            body_html: description,
            variants: [{ price }],
            images: imageUrl ? [{ src: imageUrl }] : [],
            status: 'draft',
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ product: data.product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
