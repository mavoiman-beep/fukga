# Cafetería React

Aplicación frontend para registrar, listar y editar ventas de una cafetería escolar.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

## Compilar para producción

```bash
npm run build
```

En desarrollo, la aplicación consume el backend local en `http://localhost:3000`. En producción usa `https://backent-98m3.onrender.com`.

Puedes reemplazar la URL del backend definiendo `VITE_API_URL` en las variables de entorno del proveedor del frontend (por ejemplo, Vercel), sin una barra final, y volviendo a desplegar. El backend debe estar publicado y tener acceso a la base de datos; `localhost` no es una URL válida para el navegador de producción.
