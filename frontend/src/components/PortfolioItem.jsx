import './PortfolioItem.css';

export default function PortfolioItem({ item }) {
    const unrealizedPL = (item.currentPrice - item.purchasePrice) * item.volume;
    const todayPL = (item.currentPrice - item.prevClose) * item.volume;

    const plColor = (value) => (value >= 0 ? 'green' : 'red');

    return (
        <div className="portfolio-card">
            <div className="portfolio-header">
                <span className="ticker">{item.ticker}</span>
                <span className="type">{item.type}</span>
            </div>
            <div className="portfolio-details">
                <div className="detail">
                    <div className="label">Volume</div>
                    <div className="value">{item.volume}</div>
                </div>
                <div className="detail">
                    <div className="label">Purchase Price</div>
                    <div className="value">{item.purchasePrice.toFixed(2)}</div>
                </div>
                <div className="detail">
                    <div className="label">Current Price</div>
                    <div className="value">{item.currentPrice.toFixed(2)}</div>
                </div>
                <div className="detail">
                    <div className="label">Unrealized P/L</div>
                    <div className={`value ${plColor(unrealizedPL)}`}>
                        {unrealizedPL.toFixed(2)}
                    </div>
                </div>
                <div className="detail">
                    <div className="label">Today P/L</div>
                    <div className={`value ${plColor(todayPL)}`}>
                        {todayPL.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
}