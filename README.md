# Proyecto Colmena - WebAR PWA

Una Progressive Web App con Realidad Aumentada para mercados emergentes de alto riesgo.

## 🍯 Características

- **WebAR con MindAR**: Detección de marcadores hexagonales usando la cámara del dispositivo
- **Chroma Key Shader**: Eliminación de fondo verde en tiempo real para optimizar peso de videos
- **Sistema de Néctar**: Puntuación persistente con LocalStorage
- **PWA Offline**: Funciona sin conexión a internet
- **Botón de Pánico**: Redirección instantánea a Wikipedia
- **Integración Supabase**: CDN para contenido dinámico

## 🛠️ Stack Tecnológico

- **Frontend**: React + Vite
- **AR**: MindAR + Three.js
- **Estilos**: Tailwind CSS
- **Almacenamiento**: LocalStorage + Supabase
- **PWA**: Vite PWA Plugin

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd proyecto-colmena

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Iniciar desarrollo
npm run dev
```

## 📱 Configuración

### Variables de Entorno

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Estructura de Supabase

```sql
-- Tabla de marcadores
CREATE TABLE markers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Uso

1. Abrir la app en un dispositivo móvil con cámara
2. Permitir acceso a la cámara
3. Apuntar a marcadores hexagonales
4. Recolectar gotas de néctar al detectar nuevos marcadores
5. Usar el botón de pánico si es necesario

## 🔧 Desarrollo

### Componentes Principales

- `App.jsx`: Componente principal que orquesta toda la aplicación
- `ARViewer.jsx`: Motor de AR con MindAR y shader Chroma Key
- `HUD.jsx`: Interfaz flotante con contador y botón de pánico
- `SuccessAnimation.jsx`: Animación al recolectar néctar

### Hooks

- `useNectar.js`: Gestión de néctar y marcadores polinizados

### Utils

- `supabase.js`: Cliente de Supabase y funciones de datos

## 📦 Build

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🐳 Docker Deployment

```bash
# Construir y ejecutar con Docker Compose
docker-compose up --build

# Solo construir la imagen
docker build -t proyecto-colmena .

# Ejecutar contenedor
docker run -p 8080:80 proyecto-colmena
```

### Docker Features:
- **Multi-stage build**: Optimización de tamaño de imagen
- **Nginx production**: Servidor web ligero y rápido
- **Gzip compression**: Reducción de tamaño de archivos
- **Security headers**: Protección XSS y CSRF
- **PWA support**: Cache óptimo para service workers
- **Health checks**: Monitoreo de estado del contenedor

### Variables de Entorno para Producción:
```env
NODE_ENV=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🌐 PWA Features

- Service Worker para offline
- Manifest para instalación
- Cache de recursos estáticos
- Actualización automática

## ⚡ Optimizaciones

- Carga perezosa del motor AR
- Suspense para mejor UX
- Bundle minimal
- Chroma Key para reducir peso de videos

## 🐛 Troubleshooting

### Problemas comunes:

1. **Cámara no funciona**: Verificar permisos y HTTPS
2. **MindAR no carga**: Requiere HTTPS y cámara compatible
3. **Shader no funciona**: Verificar soporte WebGL
4. **PWA no instala**: Requiere HTTPS y manifest válido

## 📄 Licencia

MIT License
