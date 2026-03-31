## Database ER Diagram
- asset (abort)
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
- stocks (abort)
  - symbol
- user-state (abort)
  - username
  - balance

