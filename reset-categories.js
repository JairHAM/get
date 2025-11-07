import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Entrada',
    description: 'Platos de entrada y aperitivos',
    color: '#FF9800',
    icon: '🥗'
  },
  {
    name: 'Plato Principal',
    description: 'Platos principales',
    color: '#F44336',
    icon: '🍽️'
  },
  {
    name: 'Bebidas',
    description: 'Todo tipo de bebidas',
    color: '#03A9F4',
    icon: '🥤'
  },
  {
    name: 'Otro',
    description: 'Otros productos',
    color: '#9E9E9E',
    icon: '📦'
  }
];

async function resetCategories() {
  try {
    console.log('🗑️  Eliminando todas las categorías existentes...\n');
    
    // Eliminar todas las categorías
    await prisma.category.deleteMany({});
    console.log('✅ Categorías eliminadas\n');

    console.log('🚀 Creando nuevas categorías...\n');

    for (const category of categories) {
      const created = await prisma.category.create({
        data: category
      });
      console.log(`✅ Categoría creada: ${created.icon} ${created.name}`);
    }

    console.log('\n✨ ¡Proceso completado!');
    console.log(`📊 Total de categorías: ${categories.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetCategories();
