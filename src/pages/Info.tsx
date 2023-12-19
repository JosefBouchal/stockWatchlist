import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonAccordion,
  IonAccordionGroup,
  IonIcon,
  IonItem,
  IonLabel
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import './Info.css';
import '../i18n'; // import your i18n config file
import { Suspense } from 'react';
import { searchOutline, list, newspaperOutline, bagAddOutline, cashOutline, informationCircle } from 'ionicons/icons';


const Info: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string | undefined) => {
    i18n.changeLanguage(language);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('pageTitle')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonButton onClick={() => changeLanguage('en')}>English</IonButton>
        <IonButton onClick={() => changeLanguage('cs')}>Česky</IonButton>
        <div className='pageExplain'>
        {t('pageExplain')}
        </div>
        <IonAccordionGroup multiple={true}>
        <IonAccordion value="info">
            <IonItem slot="header" color="light">
              <IonLabel className='pageLabel'><IonIcon icon={informationCircle} /> Info</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
                <p className='accordionHeaderText'>{t('pageDescription')}</p>
                <p className='accordionContent'>{t('pageInfoDescription')}</p>
                <p className='accordionHeaderText'>{t('pageFeatures')}</p>
                <p className='accordionContent'>{t('pageInfoFeaturesPart1')}<a href='https://www.i18next.com'>https://www.i18next.com.</a>{t('pageInfoFeaturesPart2')}</p>
                <p className='accordionHeaderText'>{t('pageAPI')}</p>
                <p className='accordionContent'>{t('pageInfoAPI')}</p>
            </div>
          </IonAccordion>
          <IonAccordion value="stockSearch">
            <IonItem slot="header" color="light">
              <IonLabel className='pageLabel'><IonIcon icon={searchOutline} /> Stock Search</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
                <p className='accordionHeaderText'>{t('pageDescription')}</p>
                <p className='accordionContent'>{t('pageInfoDescription')}</p>
                <p className='accordionHeaderText'>{t('pageFeatures')}</p>
                <p className='accordionContent'>{t('pageInfoFeaturesPart1')}<a href='https://www.i18next.com'>https://www.i18next.com.</a>{t('pageInfoFeaturesPart2')}</p>
                <p className='accordionHeaderText'>{t('pageAPI')}</p>
                <p className='accordionContent bold'>{t('pageSSearchAPICall1')}</p>
                <p className='accordionContent'>{t('pageSSearchAPICall1Description')}</p>
                <p className='accordionContent bold'>{t('pageSSearchAPICall2')}</p>
                <p className='accordionContent'>{t('pageSSearchAPICall2Description')}</p>
                <p className='accordionContent bold'>{t('pageSSearchAPICall3')}</p>
                <p className='accordionContent'>{t('pageSSearchAPICall3Description')}</p>
            </div>
          </IonAccordion>

          <IonAccordion value="watchlist">
            <IonItem slot="header" color="light">
              <IonLabel><IonIcon icon={list} /> Watchlist</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Content for Watchlist...
                <IonAccordion value="news">
                  <IonItem slot="header" color="light">
                    <IonLabel><IonIcon icon={newspaperOutline} /> News</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    News content...
                  </div>
                </IonAccordion>
            </div>
          </IonAccordion>

          <IonAccordion value="ipos">
            <IonItem slot="header" color="light">
              <IonLabel><IonIcon icon={bagAddOutline} /> IPOs</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Content for IPOs...
            </div>
          </IonAccordion>

          <IonAccordion value="earnings">
            <IonItem slot="header" color="light">
              <IonLabel><IonIcon icon={cashOutline} /> Earnings</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Content for Earnings...
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default Info;


/*
import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/react';
import { bagAddOutline, cashOutline, list, newspaperOutline, searchOutline } from 'ionicons/icons';
import './Info.css';

const Info: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>App Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonAccordionGroup multiple={true}>
          <IonAccordion value="stockSearch">
            <IonItem slot="header" color="light">
              <IonLabel><IonIcon icon={searchOutline} /> Stock Search</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Content for Stock Search...
            </div>
          </IonAccordion>

          <IonAccordion value="watchlist">
            <IonItem slot="header" color="light">
              <IonLabel><IonIcon icon={list} /> Watchlist</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Content for Watchlist...
                <IonAccordion value="news">
                  <IonItem slot="header" color="light">
                    <IonLabel><IonIcon icon={newspaperOutline} /> News</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    News content...
                  </div>
                </IonAccordion>
            </div>
          </IonAccordion>

          <IonAccordion value="ipos">
            <IonItem slot="header" color="light">
              <IonLabel><IonIcon icon={bagAddOutline} /> IPOs</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Content for IPOs...
            </div>
          </IonAccordion>

          <IonAccordion value="earnings">
            <IonItem slot="header" color="light">
              <IonLabel><IonIcon icon={cashOutline} /> Earnings</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Content for Earnings...
            </div>
          </IonAccordion>
        </IonAccordionGroup>
        <IonAccordionGroup multiple={true}>
            <IonAccordion value="languageCz">
                <IonItem slot="header" color="light">
                <IonLabel>CZ</IonLabel>
                </IonItem>
                <div className="ion-padding" slot="content">
                <IonAccordion value="stockSearch">
                  <IonItem slot="header" color="light">
                    <IonLabel><IonIcon icon={newspaperOutline} /> News</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    News content...
                  </div>
                </IonAccordion>
                <IonAccordion value="watchlist">
                  <IonItem slot="header" color="light">
                    <IonLabel><IonIcon icon={newspaperOutline} /> News</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    News content...
                  </div>
                </IonAccordion>
                <IonAccordion value="ipos">
                  <IonItem slot="header" color="light">
                    <IonLabel><IonIcon icon={newspaperOutline} /> News</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    News content...
                  </div>
                </IonAccordion>
                <IonAccordion value="earnings">
                  <IonItem slot="header" color="light">
                    <IonLabel><IonIcon icon={newspaperOutline} /> News</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    News content...
                  </div>
                </IonAccordion>
            </div>
            </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default Info;
*/