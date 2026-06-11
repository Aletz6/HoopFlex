# Guía: Subir Monorepo HoopFlex a GitHub

## 1️⃣ **Preparación Inicial**

```bash
cd CompleteHoopFlex

# Inicializa git (si no está iniciado)
git init
```

## 2️⃣ **Configura Git User (importante!)**

```bash
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# Global (opcional)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

## 3️⃣ **Agregar archivos y commit**

```bash
# Agrega todos los archivos
git add .

# Verifica qué se va a subir
git status

# Realiza primer commit
git commit -m "Initial commit: HoopFlex Monorepo setup with CI/CD"
```

## 4️⃣ **Crea repositorio en GitHub**

1. Ve a https://github.com/new
2. Nombre del repo: `HoopFlex` (o el que prefieras)
3. Descripción: "React Native + FastAPI app for basketball training"
4. **NO** inicialices con README, .gitignore o License
5. Click en "Create repository"

## 5️⃣ **Conecta tu repo local con GitHub**

```bash
# Reemplaza TU_USUARIO con tu usuario de GitHub
git branch -M main
git remote add origin https://github.com/TU_USUARIO/HoopFlex.git
git push -u origin main
```

Si pide autenticación:
- **SSH**: [Genera SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- **HTTPS**: USA Personal Access Token en lugar de contraseña
  - Ve a https://github.com/settings/tokens
  - Crea token con permisos `repo`
  - Úsalo como contraseña

## 6️⃣ **Verifica en GitHub**

- Ve a https://github.com/TU_USUARIO/HoopFlex
- Deberías ver toda la estructura del monorepo
- Las Actions debería estar ejecutándose automáticamente

## 7️⃣ **Configura Branch Protection (Recomendado)**

En tu repo de GitHub:

1. Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. ✓ Require status checks to pass before merging
5. Selecciona los checks que quieras (frontend-lint, backend-test, etc)
6. ✓ Require branches to be up to date before merging
7. Save changes

## 8️⃣ **Configura Secrets (Para Producción)**

En tu repo → Settings → Secrets and variables → Actions

Si necesitas variables de entorno en CI/CD:

```bash
# Agregar en GitHub secrets
MONGODB_URL=tu_mongodb_url
FIREBASE_CONFIG=tu_firebase_config
API_KEY=tu_api_key
```

Luego usa en el workflow:

```yaml
env:
  MONGODB_URL: ${{ secrets.MONGODB_URL }}
```

## 9️⃣ **Flujo de Trabajo Recomendado**

```bash
# 1. Crea rama para tu feature
git checkout -b feature/nueva-funcionalidad

# 2. Realiza cambios
# ... edita archivos ...

# 3. Commit
git add .
git commit -m "feat: descripción de cambios"

# 4. Push
git push origin feature/nueva-funcionalidad

# 5. Abre Pull Request en GitHub
# Los checks (CI/CD) se ejecutarán automáticamente

# 6. Merge cuando todo pase ✅
```

## 🔟 **Monitorear CI/CD**

En tu repo: **Actions** tab

Aquí verás:
- ✅ Workflows exitosos
- ❌ Workflows fallidos
- ⏳ Workflows en progreso

Click en un workflow para ver detalles

## 🎯 **Comandos Útiles**

```bash
# Ver status de git
git status

# Ver commits
git log --oneline

# Ver ramas
git branch -a

# Cambiar a main
git checkout main

# Actualizar main desde GitHub
git pull origin main

# Deshacer último commit (local)
git reset --soft HEAD~1

# Deshacer cambios en archivo
git checkout -- nombre_archivo
```

---

✅ **¡Listo!** Tu monorepo ahora tiene:
- ✨ CI/CD automático con GitHub Actions
- 🔍 Linting y formateo automático
- 🧪 Tests automáticos
- 🔐 Seguridad checkeada
- 🐳 Docker ready
