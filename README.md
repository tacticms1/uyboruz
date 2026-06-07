# UyBor.uz — O'zbekiston Ko'chmas Mulk Platformasi

O'zbekistonda uy sotish, sotib olish va ijaraga berish uchun fullstack web platforma.

## Tech Stack

| Layer | Texnologiya |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Dasturlash tili | TypeScript |
| Stilizatsiya | Tailwind CSS |
| Ma'lumotlar bazasi | PostgreSQL 16 |
| DB klient | `pg` (node-postgres) |
| Ikonlar | lucide-react |
| Konteyner | Docker + Docker Compose |
| Reverse Proxy | Nginx |
| CI/CD | GitHub Actions |
| Cloud | AWS EC2 |

## Loyiha tuzilmasi

```
uyboruz/
├── app/
│   ├── api/              # API yo'nalishlari (backend)
│   │   ├── listings/     # Ko'chmas mulk CRUD
│   │   ├── contact/      # Murojaat formasi
│   │   └── health/       # Sog'liq tekshiruvi
│   ├── listings/         # Barcha e'lonlar + detail
│   ├── sale/             # Sotuvdagi mulklar
│   ├── rent/             # Ijaradagi mulklar
│   ├── contact/          # Murojaat sahifasi
│   ├── admin/            # Admin panel
│   └── page.tsx          # Bosh sahifa
├── components/           # React komponentlar
├── lib/
│   ├── db.ts             # PostgreSQL ulanish va init
│   └── types.ts          # TypeScript interfeyslari
├── nginx/nginx.conf      # Nginx konfiguratsiyasi
├── .github/workflows/    # GitHub Actions CI/CD
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # 3 servis: app + db + nginx
└── .env.example          # Muhit o'zgaruvchilari namunasi
```

## Lokal ishga tushirish

### 1. Talablar

- Node.js 20+
- Docker & Docker Compose
- Git

### 2. O'rnatish

```bash
# Reponi klonlash
git clone https://github.com/SIZNING_USERNAME/uyboruz.git
cd uyboruz

# .env faylini yaratish
cp .env.example .env
```

### 3. Docker bilan ishga tushirish (tavsiya etiladi)

```bash
# Barcha servislarni qurib ishga tushirish
docker compose up -d --build

# Holat tekshirish
docker compose ps

# Loglarni ko'rish
docker compose logs -f app
```

Brauzerda oching: http://localhost

### 4. Lokal dev rejimi (Docker siz)

```bash
# PostgreSQL lokal bo'lishi kerak
npm install
npm run dev
```

---
Loyiha muvaffaqiyatli sozlandi.

## AWS EC2 Deployment

### 1. AWS EC2 Server tayyorlash

**EC2 Instance yaratish:**
- AMI: Ubuntu Server 24.04 LTS
- Instance type: t2.micro (bepul tier) yoki t3.small
- Storage: 20 GB gp3

**Security Group qoidalari (MUHIM):**

| Tur | Port | Source | Izoh |
|-----|------|--------|------|
| Inbound | 22 | Sizning IP | SSH |
| Inbound | 80 | 0.0.0.0/0 | HTTP |
| Inbound | 443 | 0.0.0.0/0 | HTTPS (kelajakda) |
| Outbound | 443 | 0.0.0.0/0 | Docker Hub pull uchun |
| Outbound | 80 | 0.0.0.0/0 | HTTP |
| Outbound | 5432 | VPC | PostgreSQL |

> ⚠️ Outbound 443 ruxsati bo'lmasa, Docker image pull xatosi yuz beradi!

### 2. Server sozlash

SSH orqali ulaning va quyidagi buyruqlarni bajaring:

```bash
# Tizimni yangilash
sudo apt update && sudo apt upgrade -y

# Docker o'rnatish
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# Docker Compose tekshirish
docker compose version

# Git o'rnatish
sudo apt install git -y

# Loyihani klonlash
git clone https://github.com/SIZNING_USERNAME/uyboruz.git
cd uyboruz

# .env sozlash
cp .env.example .env
nano .env
# DB_PASSWORD ni o'zgartiring!

# Ishga tushirish
docker compose up -d --build

# Tekshirish
docker compose ps
curl http://localhost/api/health
```

### 3. GitHub Actions Secrets (CI/CD uchun)

GitHub repo → Settings → Secrets → Actions:

| Secret | Qiymat |
|--------|--------|
| `EC2_HOST` | EC2 public IP yoki DNS |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | SSH private key (-----BEGIN RSA PRIVATE KEY-----) |
| `DB_NAME` | `uyboruz` |
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | Kuchli parol |
| `NEXT_PUBLIC_BASE_URL` | `http://EC2_IP` |

### 4. VPC & Network arxitekturasi (AWS)

```
Internet
    │
    ▼
Internet Gateway
    │
    ▼
Public Subnet (10.0.1.0/24)
    │
    ├── EC2 (Nginx :80 → Next.js :3000)
    │
    ▼
Private Subnet (10.0.2.0/24)
    │
    └── RDS PostgreSQL (kelajakda)
```

---

## API Endpoints

| Method | URL | Tavsif |
|--------|-----|--------|
| GET | `/api/health` | Server holati |
| GET | `/api/listings` | Barcha e'lonlar (filtr qo'llab-quvvatlanadi) |
| GET | `/api/listings?type=sale` | Sotuvdagi mulklar |
| GET | `/api/listings?type=rent` | Ijaradagi mulklar |
| GET | `/api/listings?city=Toshkent` | Shahar bo'yicha |
| GET | `/api/listings?rooms=3` | Xonalar soni bo'yicha |
| GET | `/api/listings/:id` | Bitta e'lon |
| POST | `/api/listings` | Yangi e'lon yaratish |
| PUT | `/api/listings/:id` | E'lonni yangilash |
| DELETE | `/api/listings/:id` | E'lonni o'chirish |
| POST | `/api/contact` | Murojaat yuborish |
| GET | `/api/contact` | Barcha murojaatlar |

---

## Foydali buyruqlar

```bash
# Container holati
docker compose ps

# Loglar
docker compose logs app
docker compose logs nginx
docker compose logs db

# DB ichiga kirish
docker compose exec db psql -U postgres -d uyboruz

# Konteynerlarni qayta ishga tushirish
docker compose restart app

# To'liq qayta qurish
docker compose down && docker compose up -d --build

# Disk tozalash
docker system prune -f
```
