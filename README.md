# MediBook Frontend

React + Vite + Tailwind CSS frontend for a serverless healthcare appointment platform.

## Planned Azure architecture

- Azure Static Web Apps / static hosting: React production build
- Azure Functions: Node.js HTTP APIs
- Azure Cosmos DB: hospitals, doctors, patients, appointments
- Azure Blob Storage: receipts/documents later

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

## Production build

```bash
npm run build
```

The deployable frontend is generated in `dist/`.

## API environment

`.env`

```env
VITE_API_BASE_URL=https://YOUR-FUNCTION-APP.azurewebsites.net/api
```

Do not put secrets in Vite environment variables. Anything prefixed with `VITE_` is exposed to the browser.
