import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/react';
import { bookmarkOutline, cashOutline, pricetagOutline } from 'ionicons/icons';
import './Ipos.css';
import { API_TOKEN, BASE_URL } from '../config/config';

interface IPO {
  companyName: string;
  symbol: string;
  offeringDate: string;
  priceRangeLow: number;
  priceRangeHigh: number;
  shares: number;
}

interface GroupedIPOs {
  [key: string]: IPO[];
}

const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}. ${month}. ${year}`;
};

const Ipos: React.FC = () => {
  const [groupedIPOs, setGroupedIPOs] = useState<GroupedIPOs>({});

  useEffect(() => {
    const fetchUpcomingIPOs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/stock/market/upcoming-ipos?token=${API_TOKEN}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        // Group IPOs by offeringDate
        const grouped: GroupedIPOs = {};
        data.forEach((ipo: IPO) => {
          const date = formatDate(ipo.offeringDate);
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(ipo);
        });

        setGroupedIPOs(grouped);
      } catch (error) {
        console.error('Error fetching IPOs:', error);
      }
    };

    fetchUpcomingIPOs();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Upcoming IPOs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <h5 style={{color:'rgb(154, 154, 154)'}}>IPO Meaning:</h5>
      <p style={{color:'rgb(154, 154, 154)'}}>An IPO, or Initial Public Offering, is the process by which a private company becomes public by offering its shares for sale to the general public for the first time.</p>
      <div className='verticalLine'></div>
        {Object.keys(groupedIPOs).map((date) => (
          <div key={date}>
            <h2>{date}</h2>
            <IonGrid>
              {groupedIPOs[date].map((ipo, index) => (
                index % 2 === 0 && (
                  <IonRow className='ipoRow' key={index}>
                    <IonCol>
                      <IpoCard ipo={groupedIPOs[date][index]} />
                    </IonCol>
                    {groupedIPOs[date][index + 1] && (
                      <IonCol>
                        <IpoCard ipo={groupedIPOs[date][index + 1]} />
                      </IonCol>
                    )}
                  </IonRow>
                )
              ))}
            </IonGrid>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

const IpoCard: React.FC<{ ipo: IPO }> = ({ ipo }) => (
  <IonCard>
    <IonCardContent>
      <h3>{ipo.companyName}</h3>
      <IonItem lines="none">
        <IonIcon icon={bookmarkOutline} slot="start" />
        <IonLabel>{ipo.symbol}</IonLabel>
      </IonItem>
      <IonItem lines="none">
        <IonIcon icon={pricetagOutline} slot="start" />
        <IonLabel>Price Range: {ipo.priceRangeLow} - {ipo.priceRangeHigh}</IonLabel>
      </IonItem>
      <IonItem lines="none">
        <IonIcon icon={cashOutline} slot="start" />
        <IonLabel>Shares: {ipo.shares}</IonLabel>
      </IonItem>
    </IonCardContent>
  </IonCard>
);

export default Ipos;
