# Portfolio Manager REST API Design

**Architecture**: Frontend ↔ Your Backend ↔ Yahoo Finance API ↔ Database

**Scope**: Only core portfolio & asset data stored in DB; real‑time/historical prices from Yahoo

------

## Base URL

```
/api/portfolio
```

------

## 1. Portfolio Item Management APIs

### GET /api/portfolio

- **Description**: Get all portfolio items (with sorting support)
- **Response**: List of assets (id, type, ticker, volume, purchaseDate)
- **Query Params**: `sortBy` (ticker/type/value), `order` (asc/desc)
- **Used by**: T1.1, T1.2, T1.4

### GET /api/portfolio/{id}

- **Description**: Get full details of a single portfolio item
- **Response**: type, ticker, volume, purchaseDate, currentPrice (Yahoo), totalValue
- **Used by**: T5.2

### POST /api/portfolio

- **Description**: Add new asset to portfolio
- **Request Body**: `type, ticker, volume, purchaseDate`
- **Validation**: Non-empty ticker, positive volume
- **Used by**: T3.1

### DELETE /api/portfolio/{id}

- **Description**: Remove an asset from portfolio by ID
- **Used by**: T4.1

------

## 2. Portfolio Value & Performance APIs

### GET /api/portfolio/value

- **Description**: Get total portfolio value + individual item values
- **Response**: totalValue, items: [{ id, ticker, currentPrice, totalValue }]
- **Used by**: T6.1, T6.2

### GET /api/portfolio/performance

- **Description**: Get portfolio performance metrics (total value, daily changes)
- **Query Params**: `period` (1W, 1M, 3M, 1Y)
- **Used by**: T2.2

### GET /api/portfolio/historical

- **Description**: Get historical performance for comparison (start value, end value, gains/losses)
- **Query Params**: `period` (1W, 1M, 1Y, CUSTOM)
- **Used by**: T8.2

------

## 3. External Yahoo Data (Backend Only)

- **Internal Call**: Yahoo Finance API → fetch real-time price
- **Internal Call**: Yahoo Finance API → fetch historical prices
- **Not exposed to frontend**