# Guía de despliegue en la nube — Planeador Académico UdeA

## Opción recomendada para el piloto: Google Cloud Run

Para una prueba piloto con estudiantes, Cloud Run es la opción más sencilla
y económica. No requiere administrar servidores.

---

## Opción A — Google Cloud Run (recomendada para el piloto)

### Prerequisitos
- Cuenta Google Cloud con proyecto creado
- `gcloud` CLI instalado y autenticado
- Docker instalado

### Pasos

```bash
# 1. Configurar proyecto
gcloud config set project TU-PROJECT-ID

# 2. Habilitar servicios necesarios
gcloud services enable run.googleapis.com
gcloud services enable sql-admin.googleapis.com
gcloud services enable redis.googleapis.com

# 3. Crear base de datos PostgreSQL (Cloud SQL)
gcloud sql instances create planeador-udea \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=us-central1

gcloud sql databases create planeador --instance=planeador-udea
gcloud sql users create udea --instance=planeador-udea --password=TU_PASSWORD_SEGURO

# 4. Build y push de imágenes a Google Container Registry
docker build -t gcr.io/TU-PROJECT-ID/planeador-backend ./backend
docker build -t gcr.io/TU-PROJECT-ID/planeador-frontend ./frontend
docker push gcr.io/TU-PROJECT-ID/planeador-backend
docker push gcr.io/TU-PROJECT-ID/planeador-frontend

# 5. Deploy backend
gcloud run deploy planeador-backend \
  --image gcr.io/TU-PROJECT-ID/planeador-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "ANTHROPIC_API_KEY=TU_KEY,DATABASE_URL=postgresql://..."

# 6. Deploy frontend
gcloud run deploy planeador-frontend \
  --image gcr.io/TU-PROJECT-ID/planeador-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "VITE_API_URL=https://planeador-backend-xxxx.run.app"
```

### Costo estimado (piloto ~200 estudiantes)
- Cloud Run: ~$0 (capa gratuita suficiente para el piloto)
- Cloud SQL micro: ~$7-15 USD/mes
- **Total estimado: $10-20 USD/mes**

---

## Opción B — AWS (Elastic Beanstalk + RDS)

```bash
# 1. Instalar EB CLI
pip install awsebcli

# 2. Inicializar aplicación
eb init planeador-udea --region us-east-1 --platform docker

# 3. Crear RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier planeador-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username udea \
  --master-user-password TU_PASSWORD \
  --allocated-storage 20

# 4. Deploy
eb create planeador-staging --single
eb deploy
```

### Costo estimado (piloto)
- EC2 t3.micro: ~$8-10 USD/mes (o capa gratuita 1 año)
- RDS t3.micro: ~$15-20 USD/mes
- **Total estimado: $25-30 USD/mes**

---

## Opción C — Azure App Service + Azure Database

```bash
# 1. Crear grupo de recursos
az group create --name planeador-udea --location eastus

# 2. Crear servidor PostgreSQL
az postgres flexible-server create \
  --resource-group planeador-udea \
  --name planeador-db \
  --admin-user udea \
  --admin-password TU_PASSWORD \
  --sku-name Standard_B1ms

# 3. Crear App Service
az appservice plan create --name planeador-plan \
  --resource-group planeador-udea \
  --sku B1 --is-linux

az webapp create --resource-group planeador-udea \
  --plan planeador-plan --name planeador-backend \
  --deployment-container-image-name TU_IMAGEN

# 4. Configurar variables
az webapp config appsettings set \
  --resource-group planeador-udea \
  --name planeador-backend \
  --settings ANTHROPIC_API_KEY=TU_KEY DATABASE_URL=postgresql://...
```

---

## Dominio institucional

Una vez la UdeA confirme el dominio, apuntar el DNS:

```
# Para Cloud Run (Google)
CNAME planeador.ingenieria.udea.edu.co → ghs.googlehosted.com

# Para AWS
CNAME planeador.ingenieria.udea.edu.co → TU-LB.elb.amazonaws.com

# Para Azure
CNAME planeador.ingenieria.udea.edu.co → planeador-frontend.azurewebsites.net
```

El certificado SSL se genera automáticamente en todos los proveedores.

---

## SSL/TLS con dominio propio (Certbot/Let's Encrypt)

Si se usa un servidor propio con Nginx:

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx

# Generar certificado
certbot --nginx -d planeador.ingenieria.udea.edu.co

# Renovación automática (ya incluida por Certbot)
certbot renew --dry-run
```

---

## Checklist antes de ir a producción

- [ ] Variables de entorno seguras (no en código)
- [ ] HTTPS configurado con certificado válido
- [ ] Backup automático de base de datos
- [ ] Rate limiting en endpoints de IA
- [ ] Logs de errores configurados
- [ ] Variables CORS actualizadas con dominio real
- [ ] ANTHROPIC_API_KEY con límites de gasto configurados
- [ ] Prueba de carga con usuarios simulados
