# User Stories



## 1. Basic Portfolio Browsing

**As a** portfolio user, **I want** to view all items in my financial portfolio (e.g., stocks, bonds, cash), **So that** I can have a clear overview of my portfolio contents at a glance. 

### *Acceptance Criteria:*     

- I can see all portfolio items with their key details (e.g., stock ticker, volume, type).     
- The items are displayed in a clear, organized format (e.g., sorted by item type or ticker).     
- If the portfolio is empty, I see a clear message indicating no items are present.



## 2. Portfolio Performance Viewing

**As a** portfolio user, **I want** to view the performance of my portfolio in a graphical format (e.g., charts), **So that** I can easily understand how my portfolio is performing over time. 

### *Acceptance Criteria:*     

- I can view a visual representation (e.g., line chart, bar chart) of portfolio performance.     
- The chart displays key metrics (e.g., total value, daily changes) for a selected time period.     
- The chart updates automatically when new items are added or existing items are removed.



## 3. Add Items to Portfolio

**As a** portfolio user, **I want** to add new items (e.g., stocks, bonds) to my portfolio, **So that** I can track all my financial assets in one place. 

### *Acceptance Criteria:*     

- I can enter key details for the new item (e.g., stock ticker, volume, purchase date).     
- The system validates the input (e.g., non-empty ticker, positive volume) and shows an error message if input is invalid.     
- After adding, the new item appears in the portfolio list and updates the performance chart.



## 4. Remove Items from Portfolio

**As a** portfolio user, **I want** to remove existing items from my portfolio, **So that** I can keep my portfolio up-to-date (e.g., when I sell an asset). 

### *Acceptance Criteria:*     

- I can select an item from the portfolio list and choose to delete it.     
- The system asks for confirmation before deleting the item to avoid accidental removal.     
- After deletion, the item is no longer in the portfolio list, and the performance chart updates accordingly.



## 5. View Detailed Item Information

**As a** portfolio user, **I want** to view detailed information about a specific portfolio item (e.g., current price, purchase value), **So that** I can get more context about each asset in my portfolio. 

### *Acceptance Criteria:*     

- I can click on a portfolio item to see its detailed information.     
- Detailed information includes at least: item type, ticker (if applicable), volume, purchase date, current price, and total value.     
- The current price is fetched from a reliable financial data source (e.g., Yahoo Finance).