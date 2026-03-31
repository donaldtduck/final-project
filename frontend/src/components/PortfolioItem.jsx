import './PortfolioItem.css';

export default function PortfolioItem({ item }) {
    const priceChange = item.currentPrice - item.purchasePrice || 0;
    const changeColor = priceChange >= 0 ? 'green' : 'red';

    return (
        <div className="portfolio-item">
            <div>{item.ticker}</div>
            <div>{item.volume}</div>
            <div>{item.type}</div>
            <div style={{ color: changeColor }}>
                {priceChange.toFixed(2)}
            </div>
        </div>
    );
}