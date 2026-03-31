# User Stories



## 1. Basic Portfolio Browsing - Must have

**As a** portfolio user, **I want** to view all items in my financial portfolio (e.g., stocks, bonds, cash), **So that** I can have a clear overview of my portfolio contents at a glance. 

### *Acceptance Criteria:*     

- **AC1.1:** I can see all portfolio items with their key details (e.g., stock ticker, volume, type).     
- **AC1.2:** The items are displayed in a clear, organized format (e.g., sorted by item type or ticker).     
- **AC1.3:** If the portfolio is empty, I see a clear message indicating no items are present.

### Tasks

+ **T1.1**: **Backend**: Develop GET /api/portfolio API to return all portfolio items with key details (ticker, volume, type) and support sorting by type or ticker.
+ **T1.2**: **Backend**: Add logic to return empty status and prompt message when the portfolio has no items.
+ **T1.3**: **Frontend**: Create a portfolio list page to display all items in an organized format.
+ **T1.4**: **Frontend**: Implement empty state display and sorting interaction for the portfolio list.
+ **T1.5**: **Frontend & Backend**: Jointly test API connection and all scenarios (normal data, empty portfolio, sorting) to ensure compliance with acceptance criteria.



## 2. Portfolio Performance Viewing - Must have

**As a** portfolio user, **I want** to view the performance of my portfolio in a graphical format (e.g., charts), **So that** I can easily understand how my portfolio is performing over time. 

### *Acceptance Criteria:*     

- **AC2.1:** I can view a visual representation (e.g., line chart, bar chart) of portfolio performance.     
- **AC2.2:** The chart displays key metrics (e.g., total value, daily changes) for a selected time period.     
- **AC2.3:** The chart updates automatically when new items are added or existing items are removed.

### Tasks

+ **T2.1**: **Backend**: Integrate Yahoo Finance API to fetch real-time/historical price data and store/process it in the database
+ **T2.2**: **Backend**: Develop REST API to calculate and return portfolio performance metrics (total value, daily changes) for time periods
+ **T2.3**: **Frontend**: Call backend performance API and render line/bar chart to display visual portfolio performance
+ **T2.4**: **Frontend**: Implement auto-refresh for the chart when portfolio data changes
+ **T2.5**: **Frontend & Backend**: Joint test performance data API, chart rendering, and auto-update functionality



## 3. Add Items to Portfolio - Must have

**As a** portfolio user, **I want** to add new items (e.g., stocks, bonds) to my portfolio, **So that** I can track all my financial assets in one place. 

### *Acceptance Criteria:*     

- **AC3.1:** I can enter key details for the new item (e.g., stock ticker, volume, purchase date).     
- **AC3.2:** The system validates the input (e.g., non-empty ticker, positive volume) and shows an error message if input is invalid.     
- **AC3.3:** After adding, the new item appears in the portfolio list and updates the performance chart.

### Tasks

+ **T3.1**: **Backend**: Create database schema for portfolio items and implement POST API to save new assets with input validation
+ **T3.2**: **Backend**: Retrieve all the available stocks and implement GET API to render them to frontend
+ **T3.3**: **Frontend**: Build input form to submit new asset details and display validation error messages
+ **T3.4**: **Frontend & Backend**: Test end-to-end flow – form submission, API validation, list refresh, and chart update



## 4. Remove Items from Portfolio - Must have

**As a** portfolio user, **I want** to remove existing items from my portfolio, **So that** I can keep my portfolio up-to-date (e.g., when I sell an asset). 

### *Acceptance Criteria:*     

- **AC4.1:** I can select an item from the portfolio list and choose to delete it.     
- **AC4.2:** The system asks for confirmation before deleting the item to avoid accidental removal.     
- **AC4.3:** After deletion, the item is no longer in the portfolio list, and the performance chart updates accordingly.

### Tasks

+ **T4.1**: **Backend**: Implement DELETE API to remove portfolio item by ID and update related database records
+ **T4.2**: **Backend**: Refresh portfolio performance data automatically after item deletion
+ **T4.3**: **Frontend**: Add delete button with confirmation dialog and call backend delete API
+ **T4.4**: **Frontend & Backend**: Test full deletion flow and verify list/chart auto-update



## 5. View Detailed Item Information - Must have

**As a** portfolio user, **I want** to view detailed information about a specific portfolio item (e.g., current price, purchase value), **So that** I can get more context about each asset in my portfolio. 

### *Acceptance Criteria:*     

- **AC5.1:** I can click on a portfolio item to see its detailed information.     
- **AC5.2:** Detailed information includes at least: item type, ticker (if applicable), volume, purchase date, current price, and total value.     
- **AC5.3:** The current price is fetched from a reliable financial data source (e.g., Yahoo Finance).

### Tasks

+ **T5.1**: **Backend**: Integrate Yahoo Finance API to fetch real-time price for individual assets and store in database
+ **T5.2**: **Backend**: Develop GET API to return full details of a single portfolio item (type, ticker, volume, purchase date, current price, total value)
+ **T5.3**: **Frontend**: Build detail view page/component to display full asset information when an item is clicked
+ **T5.4**: **Frontend & Backend**: Test detail data retrieval and display functionality



## 6. Portfolio Value Calculation - Should Have

**As a** portfolio user, **I want** to see the total value of my portfolio and the value of each individual item, **So that** I can understand my overall financial position. 

### *Acceptance Criteria:*     

+ The system calculates the total portfolio value by multiplying each item’s volume by its current price.     
+ The total value and individual item values are displayed prominently in the UI.     
+ The values update automatically when new price data is fetched or items are added/removed.

### Tasks (Portfolio Value Calculation - Could Have)

- **T6.1**: **Backend**: Implement logic to calculate individual item value (volume × current Yahoo price) and total portfolio value
- **T6.2**: **Backend**: Develop API to return calculated item values and total portfolio value with auto-refresh support
- **T6.3**: **Frontend**: Display individual item values in portfolio list and total portfolio value prominently in UI
- **T6.4**: **Frontend & Backend**: Test value calculation accuracy, UI display, and auto-update on price/item changes



## 7. Portfolio Filtering and Sorting - Could Have

**As a** portfolio user, **I want** to filter and sort portfolio items (e.g., by item type, value, ticker), **So that** I can quickly find specific items or organize my portfolio as needed. 

### *Acceptance Criteria:*     

+ I can filter items by type (e.g., stocks only, bonds only).     
+ I can sort items by ticker, volume, or current value (ascending/descending).     
+ The filtering/sorting changes are applied immediately to the portfolio list.

### Tasks (Portfolio Filtering and Sorting - Could Have)

- **T7.1**: **Backend**: Update portfolio list API to support filtering by item type and sorting by ticker/volume/value
- **T7.2**: **Backend**: Add validation for filter/sort parameters and optimize query performance
- **T7.3**: **Frontend**: Add filter dropdown and sort options to the portfolio list page
- **T7.4**: **Frontend & Backend**: Test end-to-end filter/sort functionality and immediate list updates



## 8. Historical Performance Comparison - Could Have

**As a** portfolio user, **I want** to compare my portfolio’s performance over different time periods (e.g., 1 week, 1 month, 1 year), **So that** I can analyze how my portfolio has performed over time. 

### *Acceptance Criteria:*     

- I can select a time period from a dropdown (e.g., 1 week, 1 month, custom range).     
- The performance chart updates to show data for the selected time period.     
- The chart includes a comparison of the portfolio’s value at the start and end of the period, plus any gains/losses.

### Tasks (Historical Performance Comparison - Could Have)

- **T8.1**: **Backend**: Extend Yahoo integration to fetch historical price data for specified time periods
- **T8.2**: **Backend**: Update performance API to accept time period params and return start/end value + gains/losses
- **T8.3**: **Frontend**: Add time period dropdown and update chart to show historical performance data
- **T8.4**: **Frontend & Backend**: Test time period selection, historical data retrieval, and gain/loss calculation

