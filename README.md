# Internet Banka (NestJS + Angular)

> Projekt iz kolegija **RWA** – tema: *Internet bankarstvo*.  
> Aplikacija demonstrira tipičan full-stack (auth, računi, prijenos, promet) uz realan REST API.

- **Backend:** NestJS (TypeScript), TypeORM, **SQLite** (`bank.db`), **JWT** autentikacija  
- **Frontend:** Angular 17 (standalone), SSR u dev-u, **proxy** prema API-ju  
- **UI/UX:** jednostavan layout, light/dark tema, potvrda plaćanja, poruke (toast)

**Demo korisnik (seed):**
- Email: `pera@bank.hr`
- Lozinka: `test1234`

---

## Sadržaj

1. [Tehnički opis](#tehnički-opis)  
2. [Struktura i tehnologije](#struktura-i-tehnologije)  
3. [Instalacija](#instalacija)  
4. [Pokretanje](#pokretanje)  
5. [Korištenje aplikacije](#korištenje-aplikacije)  
6. [API referenca (sa primjerima)](#api-referenca-sa-primjerima)  
7. [Konfiguracija (ENV, proxy)](#konfiguracija-env-proxy)  
8. [Build / Production](#build--production)  
9. [Troubleshooting](#troubleshooting)  

---

## Tehnički opis

**Backend**
- **NestJS** modularna arhitektura: `auth`, `users`, `accounts`, `transactions`, `common`
- **TypeORM** entiteti: `User`, `Account`, `Transaction`
- **SQLite** datotečna baza (`backend/bank.db`) – *nema* dodatnih servisa za pokretanje
- **JWT** autentikacija; lozinke hashirane **bcrypt**-om
- `seed.ts` skripta generira demo korisnika, račune i transakcije
- Guardovi/dekoratori (npr. roles) i interceptor logiranja (primjeri u `common/`)

**Frontend**
- **Angular 17** standalone komponente i rute
- Stranice: `Login`, `Računi`, `Prijenos` (interni transfer), `Prometi`, `Početna`
- **Auth interceptor** automatski šalje `Authorization: Bearer <token>`
- **Toast** servis/komponenta (poruke uspjeha/greške)
- **Proxy** preusmjerava `/api` na `http://127.0.0.1:3000` u dev-okruženju

---

## Struktura i tehnologije

internet-banka/
├─ backend/
│ ├─ src/
│ │ ├─ auth/ ... # login, jwt.strategy
│ │ ├─ accounts/ ... # entity, controller, service, transfer
│ │ ├─ transactions/ ... # entity, controller, service
│ │ ├─ users/ ... # entity + CRUD osnove
│ │ ├─ common/ ... # guardovi, dekoratori, utils (npr. IBAN)
│ │ ├─ seeds/seed.ts # demo podaci
│ │ └─ app.module.ts, main.ts
│ ├─ bank.db # SQLite baza (generira se/seed-a)
│ └─ package.json
└─ frontend/
├─ src/app/
│ ├─ core/ ... # api.service, auth.service, interceptor, toast
│ ├─ pages/ # login, accounts, transfer, transactions
│ ├─ shared/iban.ts # helperi: format/clean
│ ├─ app.component.* # layout + navbar + tema
│ └─ app.routes.ts
├─ proxy.conf.json # /api → http://127.0.0.1:3000

└─ package.json

---


**Glavne tehnologije i verzije**
- Node.js 18+ 
- NestJS 10/11, TypeORM 0.3.x, SQLite
- Angular 17

---

## Instalacija

### 0) Kloniranje repozitorija
```bash
git clone <URL_REPOZITORIJA>
cd internet-banka

1) Backend
cd backend
npm ci          
npm run seed    

2) Frontend
cd ../frontend
npm ci          

--- 

Pokretanje

Otvori dva terminala:

Backend (terminal #1)
cd backend
npm run start:dev
# API: http://127.0.0.1:3000

Frontend (terminal #2)
cd frontend
npm start
# App: http://localhost:4200  

Korištenje aplikacije

Login: otvori http://localhost:4200/login
Email pera@bank.hr, lozinka test1234

Računi: pregled IBAN-ova i stanja (npr. HR1122..., HR0000...)

Prijenos: interni prijenos – odaberi “S računa”, unesi “Na IBAN” (npr. HR0000111122223333), iznos i (opcionalno) opis; potvrdi u modalu

Prometi: pregled transakcija po IBAN-u

Odjava/tema: gornja navigacija s gumbom za Light/Dark

--- 

API referenca (sa primjerima)
POST /auth/login

Body

{ "email": "pera@bank.hr", "password": "test1234" }


Response

{ "accessToken": "eyJhbGciOi..." }

GET /accounts/mine (Auth: Bearer)

Response (primjer)

[
  { "iban": "HR1122334455667788", "balance": 1500.00 },
  { "iban": "HR0000111122223333", "balance": 240.50 }
]

POST /accounts/transfer (Auth: Bearer)

Body

{
  "fromIban": "HR1122334455667788",
  "toIban": "HR0000111122223333",
  "amount": 10.00,
  "description": "Štednja"
}


Response

{ "ok": true }

GET /transactions/:iban (Auth: Bearer)

Response (primjer)

[
  {
    "createdAt": "2025-09-30T10:12:00.000Z",
    "description": "Štednja",
    "counterpartyIban": "HR0000111122223333",
    "amount": -10.00
  }
]

Konfiguracija (ENV, proxy)
Backend – .env (opcionalno)
JWT_SECRET=super_secret
JWT_EXPIRES_IN=1d


Ako .env izostane, koriste se default vrijednosti iz koda. Baza je SQLite datoteka backend/bank.db.

Frontend – proxy (dev)

frontend/proxy.conf.json:

{
  "/api": {
    "target": "http://127.0.0.1:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}


U Angularu se poziva ApiService na /api/..., pa proxy preusmjeri na backend.

Build / Production
Frontend build
cd frontend
npm run build


Backend build / start
cd backend
npm run build
node dist/main.js        

Produkcijski API URL (frontend)

U dev-u koristimo /api + proxy. Za produkciju (npr. Render backend) u frontend/src/app/core/api.service.ts možeš postaviti bazu ovako:

private base =
  (typeof window !== 'undefined' && location.hostname !== 'localhost')
    ? 'https://MOJ-BACKEND.onrender.com'
    : '/api';

Troubleshooting

Port 4200 is already in use → CLI će pitati “Use a different port?” → odaberi Y

Login ne radi → provjeri da backend stvarno sluša na http://127.0.0.1:3000 i da si pokrenuo npm run seed

Greška IBAN → koristi seed primjer HR0000111122223333 ili vlastiti koji zadovoljava front validaciju (HR + 14–21 znamenka)

CORS → u dev-u proxy rješava CORS; u produkciji koristi apsolutni API URL

Node verzija → koristi 18+ (ili 20+); ako su čudne greške, obriši node_modules i package-lock.json, pa npm ci

Skripte (sažetak)

backend/package.json

seed – popunjava bazu demo podacima

start:dev – Nest dev server (watch)

build – transpile u dist/

frontend/package.json

start – Angular dev server s proxyjem

build – production build u dist/frontend/browser

