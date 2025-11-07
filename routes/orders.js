import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import prisma from '../prisma/client.js';

const router = express.Router();

// Obtener todas las órdenes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// Crear nueva orden
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, paymentMethod, tableNumber, customerName, notes, tax, discount } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'La orden debe tener al menos un producto' });
    }

    if (!tableNumber) {
      return res.status(400).json({ error: 'El número de mesa es requerido' });
    }

    // Calcular subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(404).json({ error: `Producto ${item.productId} no encontrado` });
      }

      if (!product.isActive) {
        return res.status(400).json({ error: `Producto ${product.name} no está disponible` });
      }

      const itemPrice = item.price || product.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
        notes: item.notes || null
      });
    }

    const taxAmount = tax || 0;
    const discountAmount = discount || 0;
    const total = subtotal + taxAmount - discountAmount;

    // Generar número de orden
    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;
    
    // Crear orden con estado PENDING (para que aparezca en cocina)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        total,
        paymentMethod: paymentMethod || 'CASH',
        tableNumber: tableNumber.toString(),
        customerName,
        notes,
        status: 'PENDING', // ← CAMBIO: Inicia como PENDING en lugar de COMPLETED
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            username: true,
            fullName: true
          }
        }
      }
    });

    res.status(201).json({ 
      message: 'Orden creada exitosamente',
      order 
    });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear orden', details: error.message });
  }
});

// Obtener orden por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            fullName: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ error: 'Error al obtener orden' });
  }
});

// Actualizar estado de orden (NUEVO ENDPOINT)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json({ 
      message: 'Estado actualizado exitosamente',
      order 
    });
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ error: 'Error al actualizar orden' });
  }
});

// Cancelar orden
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({ 
      message: 'Orden cancelada exitosamente',
      order 
    });
  } catch (error) {
    console.error('Error al cancelar orden:', error);
    res.status(500).json({ error: 'Error al cancelar orden' });
  }
});

export default router;
