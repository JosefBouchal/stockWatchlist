import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './stockDetail.css';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonImg, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { API_TOKEN, BASE_URL } from '../config/config';

// Define the expected type for the route params
interface RouteParams {
  ticker: string;
}

interface NewsItem {
    datetime: number;
    headline: string;
    source: string;
    url: string;
    summary: string;
    image: string;
  }

const StockDetail: React.FC = () => {
    const { ticker } = useParams<RouteParams>();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchNews = async () => {
        setIsLoading(true);
        try {
          const newsData = await retryFetch(`${BASE_URL}/stock/${ticker}/news/last/10?token=${API_TOKEN}`, {}, 3); // Retry up to 3 times
          setNews(newsData);
        } catch (error) {
          console.error('Error fetching news:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchNews();
    }, [ticker]);

    const retryFetch = async (url: RequestInfo, options: RequestInit, n: number): Promise<any> => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
      } catch (error) {
        if (n === 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
        return await retryFetch(url, options, n - 1);
      }
    };
    

      const formatDate = (datetime: number) => {
        const date = new Date(datetime);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '.');
      };

      if (isLoading) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Loading...</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <div>Loading news for ticker: {ticker}...</div>
                </IonContent>
            </IonPage>
        );
    }

      return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>News for ticker: {ticker}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">News for ticker: {ticker}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {news.length > 0 ? (
                    news.map((item, index) => (
                        <IonCard className="stockDetailCard" key={index}>
                            <IonCardHeader>
                                <IonCardTitle>{item.headline}</IonCardTitle>
                            </IonCardHeader>
                            <IonImg className="image" src={item.image} alt={item.headline} />
                            <IonCardContent>
                                <p>Date: {formatDate(item.datetime)}</p>
                                <p>Source: {item.source}</p>
                                <p>{item.summary}</p>
                                <IonButton
                                    shape="round"
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Read more
                                </IonButton>
                            </IonCardContent>
                        </IonCard>
                    ))
                ) : (
                    <div className="noNewsMessage">
                        No news for this stock available.
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
    };

export default StockDetail;
