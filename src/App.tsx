import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { list, search, bagAddOutline, cashOutline, information, informationCircle } from 'ionicons/icons';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import StockDetail from './pages/StockDetail'; // You'll create this component next
import IPOs from './pages/Ipos';
import Earnings from './pages/Earnings';
import Info from './pages/Info';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { Suspense } from 'react';

setupIonicReact();

const App: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab0">
            <Info />
          </Route>
          <Route exact path="/tab1">
          <Home />
          </Route>
          <Route exact path="/tab2">
            <Watchlist />
          </Route>
          <Route exact path="/tab3">
            <IPOs />
          </Route>
          <Route exact path="/tab4">
            <Earnings />
          </Route>
          <Route path="/stock/:ticker">
            <StockDetail />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
          <Route>
  <div>Route not found</div>
</Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab0" href="/tab0">
            <IonIcon aria-hidden="true" icon={informationCircle} />
            <IonLabel>Info</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={search} />
            <IonLabel>Stock Search</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={list} />
            <IonLabel>Watchlist</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon aria-hidden="true" icon={bagAddOutline} />
            <IonLabel>IPOs</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/tab4">
            <IonIcon aria-hidden="true" icon={cashOutline} />
            <IonLabel>Earnings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  </Suspense>
);

export default App;
