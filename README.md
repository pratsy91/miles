# Miles

Admin console for users, transactions, and bookings.

**Demo:** [https://miles-flax.vercel.app/](https://miles-flax.vercel.app/)

## Setup

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Public APIs

Seed data comes from [DummyJSON](https://dummyjson.com/):

- `GET https://dummyjson.com/users?limit=100`
- `GET https://dummyjson.com/users/{id}`
- `GET https://dummyjson.com/carts?limit=50`
- `GET https://dummyjson.com/products?limit=50`

Users, carts, and products are mapped into the app’s user, transaction, and booking records.

## State management

Redux Toolkit holds UI state only (whether the mobile sidebar is open).

Users, transactions, and bookings live in small client stores. Each store keeps the list in `localStorage` and notifies subscribers when it changes. Screens read them through `useUsers`, `useTransactions`, and `useBookings`.

## Data fetching

On first load, a store reads `localStorage`. If that list is empty, it fetches DummyJSON, maps the response, and saves it. Later loads use the saved list, so creates, edits, and deletes stick in the browser. A failed fetch shows an error with a retry.
