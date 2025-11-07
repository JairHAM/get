import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import prisma from '../prisma/client.js';

const router = express.Router();

// Obtener todas las categorías
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Crear categoría
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    const category = await prisma.category.create({
      data: { name, description, color, icon }
    });

    res.status(201).json({ 
      message: 'Categoría creada exitosamente',
      category 
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

export default router;
