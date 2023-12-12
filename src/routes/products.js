import express from 'express';
import fs from 'fs/promises';

const PRODUCTS_FILE_PATH = './data/products.json';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE_PATH, 'utf8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE_PATH, 'utf8');
    const products = JSON.parse(data);
    const product = products.find(p => p.id == req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = await fs.readFile(PRODUCTS_FILE_PATH, 'utf8');
    const products = JSON.parse(data);

    const newProduct = {
      id: generateProductId(), 
      title,
      description,
      code,
      price,
      status: status || true,
      stock,
      category,
      thumbnails: thumbnails || [],
    };

    products.push(newProduct);
    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2));

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    const data = await fs.readFile(PRODUCTS_FILE_PATH, 'utf8');
    let products = JSON.parse(data);

    const index = products.findIndex(product => product.id == productId);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = {
      id: productId,
      title: title || products[index].title,
      description: description || products[index].description,
      code: code || products[index].code,
      price: price || products[index].price,
      status: status || products[index].status,
      stock: stock || products[index].stock,
      category: category || products[index].category,
      thumbnails: thumbnails || products[index].thumbnails,
    };

    products[index] = updatedProduct;
    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2));

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;

    const data = await fs.readFile(PRODUCTS_FILE_PATH, 'utf8');
    let products = JSON.parse(data);

    const index = products.findIndex(product => product.id == productId);

    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    products.splice(index, 1);
    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2));

    res.json({ message: 'Producto eliminado con exito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Función para generar un nuevo ID único
function generateProductId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default router;