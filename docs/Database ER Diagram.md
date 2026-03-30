## Database ER Diagram
- asset
  - symbol
  - name
  - type
  - avg-price(db transaction to protect data integrity)
- transaction-record
  - id
  - symbol
  - quantity(+/-)
  - price
  - date
- stocks
  - symbol
- user-state
  - username
  - balance

