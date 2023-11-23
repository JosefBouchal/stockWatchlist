import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonGrid, IonCol, IonRow } from '@ionic/react';
import { Link } from 'react-router-dom';
import './Watchlist.css';
const Watchlist: React.FC = () => {
    const [ticker, setTicker] = useState('');
    const [watchlist, setWatchlist] = useState(() => {
        const savedWatchlist = localStorage.getItem('watchlist');
        return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    });
    const [stockPrices, setStockPrices] = useState<{ [key: string]: { price: string, loading: boolean } }>({});
    const [week52Data, setWeek52Data] = useState<{ [key: string]: { low: number, high: number } }>({});
    const [showRefreshButton, setShowRefreshButton] = useState(false);
    const [changePercent, setChangePercent] = useState<{ [key: string]: number }>({});

    const apiToken = 'pk_90c984e91d784fc090c398a3ded5f759';
    const baseUrl = 'https://cloud.iexapis.com/stable';

    const updatePrices = () => {
        watchlist.forEach((symbol: string) => {
            setStockPrices(prevPrices => ({ ...prevPrices, [symbol]: { ...prevPrices[symbol], loading: true } }));
            fetchLatestPrice(symbol);
        });
    };

    useEffect(() => {
        updatePrices(); // Update prices when component mounts
        watchlist.forEach((symbol: string) => fetchStockData(symbol)); // Fetch 52-week data for each symbol
    }, [watchlist]);

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    const checkPriceChange = async () => {
        if (watchlist.length > 0) {
            const firstSymbol = watchlist[0];
            try {
                const response = await fetch(`${baseUrl}/stock/${firstSymbol}/price?token=${apiToken}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const newPrice = await response.text();
                if (newPrice !== stockPrices[firstSymbol].price) {
                    setShowRefreshButton(true);
                }
            } catch (error) {
                console.error('Error checking price:', error);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            checkPriceChange();
            console.log("checking...");
        }, 300000); // 300000 ms = 5 minutes

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [watchlist, stockPrices]);

    const fetchLatestPrice = async (tickerSymbol: string, retryCount = 0) => {
        try {
            const response = await fetch(`${baseUrl}/stock/${tickerSymbol}/price?token=${apiToken}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const price = await response.text();
            setStockPrices(prevPrices => ({ ...prevPrices, [tickerSymbol]: { price, loading: false } }));
        } catch (error) {
            console.error('Fetch error:', error);
            if (retryCount < 3) {
                setTimeout(() => fetchLatestPrice(tickerSymbol, retryCount + 1), 2000); // Retry after 2 seconds
            } else {
                setStockPrices(prevPrices => ({ ...prevPrices, [tickerSymbol]: { price: "Error", loading: false } }));
            }
        }
    };

    const fetchStockData = async (tickerSymbol: string, retryCount = 0) => {
        try {
            const response = await fetch(`${baseUrl}/stock/${tickerSymbol}/quote?token=${apiToken}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setWeek52Data(prevData => ({
                ...prevData,
                [tickerSymbol]: { low: data.week52Low, high: data.week52High }
            }));
            setChangePercent(prevData => ({
                ...prevData,
                [tickerSymbol]: data.changePercent
            }));
        } catch (error) {
            console.error('Fetch error:', error);
            if (retryCount < 3) {
                setTimeout(() => fetchStockData(tickerSymbol, retryCount + 1), 2000); // Retry after 2 seconds
            }
        }
    }
    

    const addToWatchlist = () => {
        const updatedWatchlist = [...watchlist, ticker];
        setWatchlist(updatedWatchlist);
        fetchLatestPrice(ticker);
        fetchStockData(ticker);
        setTicker('');
    };

    const removeFromWatchlist = (symbol: string) => {
        const updatedWatchlist = watchlist.filter((item: string) => item !== symbol);
        setWatchlist(updatedWatchlist);
        setStockPrices(prevPrices => {
            const newPrices = { ...prevPrices };
            delete newPrices[symbol];
            return newPrices;
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Watchlist</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonItem>
                    <IonLabel position="floating">Enter Stock Ticker:</IonLabel>
                    <IonInput value={ticker} onIonChange={e => setTicker(e.detail.value!)} />
                </IonItem>
                <IonButton expand="block" onClick={addToWatchlist}>Add to Watchlist</IonButton>
                {showRefreshButton && (
                    <IonButton expand="block" onClick={updatePrices}>Refresh Prices</IonButton>
                )}
                <IonGrid>
                    <IonRow>
                        <IonCol><strong>Ticker</strong></IonCol>
                        <IonCol><strong>Price</strong></IonCol>
                        <IonCol><strong>Change</strong></IonCol>
                        <IonCol><strong>52-Week Low</strong></IonCol>
                        <IonCol><strong>52-Week High</strong></IonCol>
                        <IonCol size="2"></IonCol> {/* Empty column for buttons */}
                    </IonRow>
                    {watchlist.map((item: string, index: number) => (
                        <IonRow key={index}>
                            <IonCol><a href={`/stock/${item}`}>{item}</a></IonCol>
                            <IonCol>
                                {stockPrices[item]?.loading ? 'Loading...' : 
                                 isNaN(parseFloat(stockPrices[item]?.price)) ? stockPrices[item]?.price : `$${stockPrices[item]?.price}`}
                            </IonCol>
                            <IonCol>
                                {changePercent[item] ? `${(changePercent[item] * 100).toFixed(2)}%` : 'N/A'}
                            </IonCol>
                            <IonCol>
                                {week52Data[item] ? `$${week52Data[item].low.toFixed(2)}` : 'N/A'}
                            </IonCol>
                            <IonCol>
                                {week52Data[item] ? `$${week52Data[item].high.toFixed(2)}` : 'N/A'}
                            </IonCol>
                            <IonCol size="2">
                                <IonButton className="removeBtn" color="danger" onClick={() => removeFromWatchlist(item)}>Remove</IonButton>
                            </IonCol>
                        </IonRow>
                    ))}
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Watchlist;
