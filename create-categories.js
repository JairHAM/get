import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Entradas',
    description: 'Aperitivos y entradas',
    color: '#FF9800',
    icon: '🥗'
  },
  {
    name: 'Platos Principales',
    description: 'Platos fuertes y principales',
    color: '#F44336',
    icon: '🍽️'
  },
  {
    name: 'Sopas',
    description: 'Sopas y caldos',
    color: '#FFC107',
    icon: '🍲'
  },
  {
    name: 'Ensaladas',
    description: 'Ensaladas frescas',
    color: '#4CAF50',
    icon: '🥗'
  },
  {
    name: 'Pastas',
    description: 'Pastas y platos italianos',
    color: '#FFEB3B',
    icon: '🍝'
  },
  {
    name: 'Carnes',
    description: 'Carnes rojas y blancas',
    color: '#795548',
    icon: '🥩'
  },
  {
    name: 'Pescados y Mariscos',
    description: 'Productos del mar',
    color: '#00BCD4',
    icon: '🐟'
  },
  {
    name: 'Pizzas',
    description: 'Pizzas artesanales',
    color: '#E91E63',
    icon: '🍕'
  },
  {
    name: 'Hamburguesas',
    description: 'Hamburguesas gourmet',
    color: '#FF5722',
    icon: '🍔'
  },
  {
    name: 'Tacos y Antojitos',
    description: 'Comida mexicana',
    color: '#8BC34A',
    icon: '🌮'
  },
  {
    name: 'Postres',
    description: 'Postres y dulces',
    color: '#E91E63',
    icon: '🍰'
  },
  {
    name: 'Bebidas Frías',
    description: 'Refrescos, jugos y batidos',
    color: '#03A9F4',
    icon: '🥤'
  },
  {
    name: 'Bebidas Calientes',
    description: 'Café, té y chocolate',
    color: '#795548',
    icon: '☕'
  },
  {
    name: 'Cervezas',
    description: 'Cervezas nacionales e importadas',
    color: '#FFC107',
    icon: '🍺'
  },
  {
    name: 'Vinos',
    description: 'Vinos tintos, blancos y rosados',
    color: '#9C27B0',
    icon: '🍷'
  },
  {
    name: 'Cócteles',
    description: 'Bebidas preparadas y mixología',
    color: '#FF4081',
    icon: '🍹'
  }
];

async function createCategories() {
  try {
    console.log('🚀 Creando categorías...\n');

    for (const category of categories) {
      try {
        const existing = await prisma.category.findUnique({
          where: { name: category.name }
        });

        if (existing) {
          console.log(`⚠️  "${category.name}" ya existe, omitiendo...`);
          continue;
        }

        const created = await prisma.category.create({
          data: category
        });

        console.log(`✅ Categoría creada: ${created.icon} ${created.name}`);
      } catch (error) {
        console.error(`❌ Error al crear "${category.name}":`, error.message);
      }
    }

    console.log('\n✨ ¡Proceso completado!');
    console.log(`📊 Total de categorías disponibles: ${categories.length}`);

  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories();
