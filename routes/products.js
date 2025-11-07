import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import prisma from '../prisma/client.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { categoryId, isActive } = req.query;
    
    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ products });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Crear producto
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, cost, sku, barcode, stock, minStock, categoryId, imageUrl } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : null,
        sku,
        barcode,
        stock: stock || 0,
        minStock: minStock || 5,
        categoryId,
        imageUrl
      },
      include: { category: true }
    });

    res.status(201).json({ 
      message: 'Producto creado exitosamente',
      product 
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Actualizar producto
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, cost, sku, barcode, stock, minStock, categoryId, isActive, imageUrl } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        cost: cost ? parseFloat(cost) : undefined,
        sku,
        barcode,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        minStock: minStock !== undefined ? parseInt(minStock) : undefined,
        categoryId,
        isActive,
        imageUrl
      },
      include: { category: true }
    });

    res.json({ 
      message: 'Producto actualizado exitosamente',
      product 
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar producto (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ 
      message: 'Producto desactivado exitosamente',
      product 
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
