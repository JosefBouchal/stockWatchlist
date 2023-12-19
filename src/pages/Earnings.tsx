import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
} from '@ionic/react';
import './Earnings.css';
import { API_TOKEN, BASE_URL } from '../config/config';

interface Earning {
  symbol: string;
  reportDate: string;
}

interface GroupedEarnings {
  [key: string]: Earning[];
}

const Earnings: React.FC = () => {
  const [groupedEarnings, setGroupedEarnings] = useState<GroupedEarnings>({});

  useEffect(() => {
    const fetchUpcomingEarnings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/stock/market/upcoming-earnings?token=${API_TOKEN}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data: Earning[] = await response.json();

        const grouped: GroupedEarnings = {};
        data.forEach((earning) => {
          const date = formatDate(earning.reportDate);
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(earning);
        });

        setGroupedEarnings(grouped);
      } catch (error) {
        console.error('Error fetching earnings:', error);
      }
    };

    fetchUpcomingEarnings();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Upcoming Earnings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonCardContent>
        {Object.keys(groupedEarnings).length > 0 ? (
          Object.keys(groupedEarnings).map((date) => (
            <div key={date} className="date-section">
              <p className="date-header">{date}</p>
              <div className="earning-grid">
                {groupedEarnings[date].map((earning, index) => (
                  <EarningCard key={index} earning={earning} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-earnings">
            <p>No upcoming earnings reports.</p>
          </div>
        )}
        </IonCardContent>
      </IonContent>
    </IonPage>
  );  
};

const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}. ${month}. ${year}`;
};

const EarningCard: React.FC<{ earning: Earning }> = ({ earning }) => (
  <IonCard>
    <IonCardContent>
      <p>{earning.symbol}</p>
    </IonCardContent>
  </IonCard>
);

export default Earnings;
