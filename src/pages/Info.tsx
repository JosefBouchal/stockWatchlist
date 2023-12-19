import React, { useState } from "react";
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
  IonLabel,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import "./Info.css";
import "../i18n"; // import your i18n config file
import {
  searchOutline,
  list,
  newspaperOutline,
  bagAddOutline,
  cashOutline,
  informationCircle,
} from "ionicons/icons";

const Info: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("pageTitle")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="firstLabel">
          <IonLabel>{t("langugePicker")}</IonLabel>
        </div>
        <div className="btn-group">
          <button
            onClick={() => changeLanguage("cs")}
            className={`firstBtn ${selectedLanguage === "cs" ? "selected" : ""}`}
          >
            Česky
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={`secondBtn ${selectedLanguage === "en" ? "selected" : ""}`}
          >
            English
          </button>
        </div>

        <div className="pageExplain">{t("pageExplain")}</div>
        <IonAccordionGroup multiple={true}>
          <IonAccordion value="info">
            <IonItem slot="header" color="light">
              <IonLabel className="pageLabel">
                <IonIcon icon={informationCircle} /> Info
              </IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <p className="accordionHeaderText">{t("pageDescription")}</p>
              <p className="accordionContent">{t("pageInfoDescription")}</p>
              <p className="accordionHeaderText">{t("pageFeatures")}</p>
              <p className="accordionContent">
                {t("pageInfoFeaturesPart1")}
                <a href="https://www.i18next.com">https://www.i18next.com.</a>
                {t("pageInfoFeaturesPart2")}
              </p>
              <p className="accordionHeaderText">{t("pageAPI")}</p>
              <p className="accordionContent">{t("pageInfoAPI")}</p>
            </div>
          </IonAccordion>
          <IonAccordion value="stockSearch">
            <IonItem slot="header" color="light">
              <IonLabel className="pageLabel">
                <IonIcon icon={searchOutline} /> Stock Search
              </IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <p className="accordionHeaderText">{t("pageDescription")}</p>
              <p className="accordionContent">{t("pageSSearchDescription")}</p>
              <p className="accordionHeaderText">{t("pageFeatures")}</p>
              <p className="accordionContent">{t("pageSSearchFeatures")}</p>
              <p className="accordionHeaderText">{t("pageAPI")}</p>
              <p className="accordionContent bold">
                {t("pageSSearchAPICall1")}
              </p>
              <p className="accordionContent">
                {t("pageSSearchAPICall1Description")}
              </p>
              <p className="accordionContent bold">
                {t("pageSSearchAPICall2")}
              </p>
              <p className="accordionContent">
                {t("pageSSearchAPICall2Description")}
              </p>
              <p className="accordionContent bold">
                {t("pageSSearchAPICall3")}
              </p>
              <p className="accordionContent">
                {t("pageSSearchAPICall3Description")}
              </p>
              <p className="accordionContent bold">
                {t("pageSSearchAPICall4")}
              </p>
              <p className="accordionContent">
                {t("pageSSearchAPICall4Description")}
              </p>
            </div>
          </IonAccordion>

          <IonAccordion value="watchlist">
            <IonItem slot="header" color="light">
            <IonLabel className="pageLabel">
                <IonIcon icon={list} /> Watchlist
              </IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <p className="accordionHeaderText">{t("pageDescription")}</p>
              <p className="accordionContent">
                {t("pageWatchlistDescription")}
              </p>
              <p className="accordionHeaderText">{t("pageFeatures")}</p>
              <p className="accordionContent">{t("pageWatchlistFeatures")}</p>
              <p className="accordionHeaderText">{t("pageAPI")}</p>
              <p className="accordionContent bold">
                {t("pageWatchlistAPICall1")}
              </p>
              <p className="accordionContent">
                {t("pageWatchlistAPICall1Description")}
              </p>
              <p className="accordionContent bold">
                {t("pageWatchlistAPICall2")}
              </p>
              <p className="accordionContent">
                {t("pageWatchlistAPICall2Description")}
              </p>
            </div>
          </IonAccordion>

          <IonAccordion value="news">
            <IonItem slot="header" color="light">
            <IonLabel className="pageLabel">
                <IonIcon icon={newspaperOutline} /> News
              </IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <p className="accordionHeaderText">{t("pageDescription")}</p>
              <p className="accordionContent">{t("pageNewsDescription")}</p>
              <p className="accordionHeaderText">{t("pageFeatures")}</p>
              <p className="accordionContent">{t("pageNewsFeatures")}</p>
              <p className="accordionHeaderText">{t("pageAPI")}</p>
              <p className="accordionContent bold">{t("pageNewsAPICall")}</p>
              <p className="accordionContent">
                {t("pageNewsAPICallDescription")}
              </p>
            </div>
          </IonAccordion>

          <IonAccordion value="ipos">
            <IonItem slot="header" color="light">
            <IonLabel className="pageLabel">
                <IonIcon icon={bagAddOutline} /> IPOs
              </IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <p className="accordionHeaderText">{t("pageDescription")}</p>
              <p className="accordionContent">{t("pageIPOsDescription")}</p>
              <p className="accordionHeaderText">{t("pageFeatures")}</p>
              <p className="accordionContent">{t("pageIPOsFeatures")}</p>
              <p className="accordionHeaderText">{t("pageAPI")}</p>
              <p className="accordionContent bold">{t("pageIPOsAPICall")}</p>
              <p className="accordionContent">
                {t("pageIPOsAPICallDescription")}
              </p>
            </div>
          </IonAccordion>

          <IonAccordion value="earnings">
            <IonItem slot="header" color="light">
            <IonLabel className="pageLabel">
                <IonIcon icon={cashOutline} /> Earnings
              </IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <p className="accordionHeaderText">{t("pageDescription")}</p>
              <p className="accordionContent">{t("pageEarningsDescription")}</p>
              <p className="accordionHeaderText">{t("pageFeatures")}</p>
              <p className="accordionContent">{t("pageEarningsFeatures")}</p>
              <p className="accordionHeaderText">{t("pageAPI")}</p>
              <p className="accordionContent bold">
                {t("pageEarningsAPICall")}
              </p>
              <p className="accordionContent">
                {t("pageEarningsAPICallDescription")}
              </p>
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
