import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './stockDetail.css';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonImg, IonTitle, IonToolbar } from '@ionic/react';

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
    const apiToken = 'pk_90c984e91d784fc090c398a3ded5f759';

    useEffect(() => {
        const fetchNews = async () => {
          try {
            const response = await fetch(`https://cloud.iexapis.com/stable/stock/${ticker}/news/last/5?token=${apiToken}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const newsData = await response.json();
            setNews(newsData);
          } catch (error) {
            console.error('Error fetching news:', error);
          }
        };
    
        fetchNews();
      }, [ticker]);

      const formatDate = (datetime: number) => {
        const date = new Date(datetime);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '.');
      };

      return (
        <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>News for ticker: {ticker}</IonTitle>
        </IonToolbar>
      </IonHeader>
        <IonContent>
          {news.map((item, index) => (
            <IonCard key={index}>
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
          ))}
        </IonContent>

        </>
      );
    };

export default StockDetail;
