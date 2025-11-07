import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Verificar si ya existe
    const existing = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existing) {
      console.log('❌ El usuario admin ya existe');
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: 'admin@pos.com',
        username: 'admin',
        password: hashedPassword,
        fullName: 'Administrador Principal',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('✅ Usuario admin creado exitosamente:');
    console.log('   Email:', user.email);
    console.log('   Username:', user.username);
    console.log('   Role:', user.role);
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
