export default function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const orderId = `order_${Date.now()}`; // Generate mock order ID for preview
      return res.status(200).json({ id: orderId });
    } catch (error) {
      return res.status(500).json({ error: 'Preview mode: Payment order failed (mock data used).' });
    }
  }
  