-- Crear usuario admin
-- Usuario: admin
-- Contraseña: admin123

INSERT INTO users (id, email, username, password, "fullName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@pos.com',
  'admin',
  '$2a$10$N9qo8uLOickgx2ZfQZqvMOvSJzQGxJKl5YqGxJKl5YqGxJKl5Yq',
  'Administrador Principal',
  'ADMIN':::"UserRole",
  true,
  NOW(),
  NOW()
);
