import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonGrid, IonCol, IonRow, IonIcon } from '@ionic/react';
import { arrowDownCircleOutline, arrowUpCircleOutline, newspaperOutline } from 'ionicons/icons';
import './Watchlist.css';
import { API_TOKEN, BASE_URL } from '../config/config';

const Watchlist: React.FC = () => {
    const [ticker, setTicker] = useState('');
    const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem('watchlist') || '[]'));
    const [stockPrices, setStockPrices] = useState<{ [key: string]: { price: string, loading: boolean } }>({});
    const [week52Data, setWeek52Data] = useState<{ [key: string]: { low: number, high: number } }>({});
    const [showRefreshButton, setShowRefreshButton] = useState(false);
    const [changePercent, setChangePercent] = useState<{ [key: string]: number }>({});
    const [errorMessage, setErrorMessage] = useState('');
    const [shouldFetchPrices, setShouldFetchPrices] = useState(true);

    



    const fetchAllData = (symbol: string) => {
        fetchLatestPrice(symbol);
        fetchStockData(symbol);
        setShowRefreshButton(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            for (const symbol of watchlist) {
                await fetchAllData(symbol);
            }
        };

        if (shouldFetchPrices) {
            fetchData();
            setShouldFetchPrices(false);
        }

        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist, shouldFetchPrices]);

    const updatePrices = () => {
        watchlist.forEach((symbol: string) => {
            setStockPrices(prevPrices => ({ ...prevPrices, [symbol]: { ...prevPrices[symbol], loading: true } }));
            fetchAllData(symbol);
        });
    };

    const moveItemUp = (index: number) => {
        if (index === 0) return;
        const newWatchlist = [...watchlist];
        [newWatchlist[index - 1], newWatchlist[index]] = [newWatchlist[index], newWatchlist[index - 1]];
        setWatchlist(newWatchlist);
    };

    const moveItemDown = (index: number) => {
        if (index === watchlist.length - 1) return;
        const newWatchlist = [...watchlist];
        [newWatchlist[index + 1], newWatchlist[index]] = [newWatchlist[index], newWatchlist[index + 1]];
        setWatchlist(newWatchlist);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (watchlist.length > 0) {
                fetchLatestPrice(watchlist[0], true);
            }
        }, 30000); // 300000 ms = 5 minutes

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [watchlist, stockPrices]);

    const fetchLatestPrice = async (tickerSymbol: string, checkForUpdate = false) => {
        try {
            const response = await fetch(`${BASE_URL}/stock/${tickerSymbol}/price?token=${API_TOKEN}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const price = await response.text();
            setStockPrices(prevPrices => ({ ...prevPrices, [tickerSymbol]: { price, loading: false } }));

            if (checkForUpdate && price !== stockPrices[tickerSymbol]?.price) {
                setShowRefreshButton(true);
            }

            return true;
        } catch (error) {
            console.error('Fetch error:', error);
            setStockPrices(prevPrices => ({ ...prevPrices, [tickerSymbol]: { price: "Error", loading: false } }));
            setErrorMessage('It looks like ticker does not exist. Please try again.');
            clearErrorMessage();
            return false;
        }
    };



    const fetchStockData = async (tickerSymbol: string) => {
        try {
            const response = await fetch(`${BASE_URL}/stock/${tickerSymbol}/quote?token=${API_TOKEN}`);
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
        }
    }


    const addToWatchlist = async () => {
        setShouldFetchPrices(true);
        const tickerUppercase = ticker.toUpperCase();
        if (watchlist.includes(tickerUppercase)) {
            setErrorMessage('This stock is already in your watchlist.');
            clearErrorMessage(); // Call a function to clear the message
            return;
        }
        const success = await fetchLatestPrice(tickerUppercase);
        if (success) {
            const updatedWatchlist = [...watchlist, tickerUppercase];
            setWatchlist(updatedWatchlist);
            fetchAllData(tickerUppercase);
        } else {
            setErrorMessage('It looks like ticker does not exist. Please try again.');
            clearErrorMessage(); // Call a function to clear the message
        }
    };

    // Separate function to clear the error message
    const clearErrorMessage = () => {
        setTimeout(() => setErrorMessage(''), 5000);
    };



    const removeFromWatchlist = (symbol: string) => {
        setShouldFetchPrices(true);
        // Update the watchlist
        const updatedWatchlist = watchlist.filter((item: string) => item !== symbol);
        setWatchlist(updatedWatchlist);

        // Update the stockPrices state by removing the entry for the removed stock
        setStockPrices(prevPrices => {
            const newPrices = { ...prevPrices };
            delete newPrices[symbol];
            return newPrices;
        });

        // Similarly, update week52Data and changePercent
        setWeek52Data(prevData => {
            const newData = { ...prevData };
            delete newData[symbol];
            return newData;
        });

        setChangePercent(prevData => {
            const newData = { ...prevData };
            delete newData[symbol];
            return newData;
        });
    };


    const getChangeTextColor = (changeValue: number) => {
        return changeValue > 0 ? 'green' : 'red';
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Watchlist</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Watchlist</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonItem>
                    <IonLabel position="floating">Enter Stock Ticker:</IonLabel>
                    <IonInput value={ticker} onIonChange={e => setTicker(e.detail.value!)} />
                </IonItem>
                <IonButton expand="block" onClick={addToWatchlist}>Add to Watchlist</IonButton>
                <div className='errorMessage'>{errorMessage && <p>{errorMessage}</p>}</div>

                {showRefreshButton && (
                    <IonButton expand="block" onClick={updatePrices}>Price update available...</IonButton>
                )}
                <IonGrid>
                    <IonRow className='watchlistRow'>
                        <IonCol size="2" className="verticallyCenteredCol colHeader"></IonCol> {/* Empty column for buttons */}
                        <IonCol className="verticallyCenteredCol colHeader">Ticker</IonCol>
                        <IonCol className="verticallyCenteredCol colHeader">Price</IonCol>
                        <IonCol className="verticallyCenteredCol colHeader">Change %</IonCol>
                        <IonCol className="verticallyCenteredCol colHeader">52-Week Low</IonCol>
                        <IonCol className="verticallyCenteredCol colHeader">52-Week High</IonCol>
                        <IonCol size="2" className="verticallyCenteredCol colHeader"></IonCol> {/* Empty column for buttons */}
                    </IonRow>
                    {watchlist.length === 0 ? (
                    <div className="empty-watchlist-message">
                        Empty watchlist. Add some stock to watchlist.
                    </div>
                    ) : (
                        <div>
                    {watchlist.map((item: string, index: number) => ( // index is the second parameter in the map function
                        <IonRow className='watchlistRow' key={item}>

                            <IonCol size="1" className="verticallyCenteredCol">
                                <IonIcon className="moveItemBtn" icon={arrowUpCircleOutline} onClick={() => moveItemUp(index)} />
                                <IonIcon className="moveItemBtn" icon={arrowDownCircleOutline} onClick={() => moveItemDown(index)} />
                            </IonCol>
                            <IonCol size="1" className="verticallyCenteredCol">
                                <div onClick={() => window.location.href = `/stock/${item}`} style={{ cursor: 'pointer' }}>
                                    <IonIcon icon={newspaperOutline} /> News
                                </div>
                            </IonCol>
                            <IonCol className="verticallyCenteredCol">{item}</IonCol>
                            <IonCol className="verticallyCenteredCol">
                                {stockPrices[item]?.loading ? 'Loading...' :
                                    isNaN(parseFloat(stockPrices[item]?.price)) ? stockPrices[item]?.price : `$${stockPrices[item]?.price}`}
                            </IonCol>
                            <IonCol className="verticallyCenteredCol">
                                <span style={{ color: getChangeTextColor(changePercent[item]), fontWeight: 'bold' }}>
                                    {changePercent[item] ? `${(changePercent[item] * 100).toFixed(2)}%` : 'N/A'}
                                </span>
                            </IonCol>
                            <IonCol className="verticallyCenteredCol">
                                {week52Data[item]?.low != null ? `$${week52Data[item].low.toFixed(2)}` : 'N/A'}
                            </IonCol>
                            <IonCol className="verticallyCenteredCol">
                                {week52Data[item]?.high != null ? `$${week52Data[item].high.toFixed(2)}` : 'N/A'}
                            </IonCol>
                            <IonCol size="2" className="verticallyCenteredCol">
                                <IonButton className="removeBtn" color="danger" onClick={() => removeFromWatchlist(item)}>Remove</IonButton>
                            </IonCol>
                        </IonRow>
                    ))}
                    </div>
                    )}
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Watchlist;
