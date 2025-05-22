import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 3000;

// Дозволені джерела для CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://sportshop.onrender.com', // Додай URL твого Render
];
app.use(cors({ origin: allowedOrigins }));

// Логування запитів (можна вимкнути в продакшені, якщо не потрібне)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Ендпоінти (залишаються без змін)
app.get('/api/products', async (req, res) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched products:', productsList);
    res.json(productsList);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

app.get('/api/promotions', async (req, res) => {
  try {
    const promotionsRef = db.collection('promotions');
    const snapshot = await promotionsRef.get();
    const promotionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched promotions:', promotionsList);
    res.json(promotionsList);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ error: 'Failed to fetch promotions', details: error.message });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(`Received GET /api/cart/${userId}`);
  try {
    const cartRef = db.collection('carts').doc(userId);
    const doc = await cartRef.get();
    if (!doc.exists) {
      console.log(`No cart document found for userId: ${userId}`);
      return res.status(404).json({ items: [], message: 'No cart found' });
    }
    const cartData = doc.data().items || [];
    console.log(`Cart data for userId: ${userId}`, cartData);
    res.json(cartData);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart', details: error.message });
  }
});

app.post('/api/cart/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { items } = req.body;
  console.log(`Received POST /api/cart/${userId} with items:`, items);
  if (!userId || !items || !Array.isArray(items)) {
    console.error('Invalid input: userId and items array are required');
    return res.status(400).json({ error: 'Invalid input: userId and items array are required' });
  }
  if (items.some(item => !item.id || !item.name || !item.price || !item.quantity)) {
    console.error('Invalid item data:', items);
    return res.status(400).json({ error: 'Each item must have id, name, price, and quantity' });
  }
  try {
    const cartRef = db.collection('carts').doc(userId);
    await cartRef.set({ items }, { merge: true });
    console.log(`Cart updated for userId: ${userId}, new items:`, items);
    res.status(200).json({ items, message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart', details: error.message });
  }
});

app.get('/api/wishlist/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(`Received GET /api/wishlist/${userId}`);
  try {
    const wishlistRef = db.collection('wishlists').doc(userId);
    const doc = await wishlistRef.get();
    if (!doc.exists) {
      console.log(`No wishlist document found for userId: ${userId}`);
      return res.status(404).json({ items: [], message: 'No wishlist found' });
    }
    const wishlistData = doc.data().items || [];
    console.log(`Wishlist data for userId: ${userId}`, wishlistData);
    res.json(wishlistData);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist', details: error.message });
  }
});

app.post('/api/wishlist/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { items } = req.body;
  console.log(`Received POST /api/wishlist/${userId} with items:`, items);
  if (!userId || !items || !Array.isArray(items)) {
    console.error('Invalid input: userId and items array are required');
    return res.status(400).json({ error: 'Invalid input: userId and items array are required' });
  }
  if (items.length > 0 && items.some(item => !item.id || !item.name || !item.price)) {
    console.error('Invalid item data:', items);
    return res.status(400).json({ error: 'Each item must have id, name, and price' });
  }
  try {
    const wishlistRef = db.collection('wishlists').doc(userId);
    console.log('Saving wishlist to Firestore:', items);
    await wishlistRef.set({ items }, { merge: true });
    console.log(`Wishlist updated for userId: ${userId}, new items:`, items);
    res.status(200).json({ items, message: 'Wishlist updated successfully' });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ error: 'Failed to update wishlist', details: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});