import React, { useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonSegment,
  IonSegmentButton 
} from '@ionic/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Home.css';

interface HistoricalData {
  close: number;
  label: string;
  // Add other properties as needed
}

const Home: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [exchange, setExchange] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  //const [marketCap, setMarketCap] = useState<string>('');
  const [employees, setEmployees] = useState<number>(0);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [minCloseValue, setMinCloseValue] = useState<number | null>(null);
  const [maxCloseValue, setMaxCloseValue] = useState<number | null>(null);

  const [timeFrame, setTimeFrame] = useState<string>('1y'); // Default time frame

  const apiToken = 'pk_90c984e91d784fc090c398a3ded5f759';
  const baseUrl = 'https://cloud.iexapis.com/stable';

  /*
  const formatMarketCap = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  */

  const fetchStockData = async (tickerSymbol: string) => {
    try {
      //const response = await fetch(`${baseUrl}/stock/${tickerSymbol}/stats?token=${apiToken}`);
      const response = await fetch(`${baseUrl}/stock/${tickerSymbol}/company?token=${apiToken}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCompanyName(data.companyName);
      setExchange(data.exchange);
      setIndustry(data.industry);
      setDescription(data.description);
      //setMarketCap(formatMarketCap(data.marketcap));
      setEmployees(data.employees);
    } catch (error) {
      console.error('Fetch error:', error);
      setCompanyName('Error fetching data');
      //setMarketCap('');
      setEmployees(0);
    }
  };

  const fetchHistoricalData = async (tickerSymbol: string, selectedTimeFrame: string) => {
    try {
      const response = await fetch(`${baseUrl}/stock/${tickerSymbol}/chart/${selectedTimeFrame}?token=${apiToken}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setHistoricalData(data);

      if (data.length > 0) {
        const minClose = Math.min(...data.map((item: { close: any; }) => item.close));
        const maxClose = Math.max(...data.map((item: { close: any; }) => item.close));
        setMinCloseValue(minClose);
        setMaxCloseValue(maxClose);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const form = event.target as HTMLFormElement;
    const currentTicker = form.elements.namedItem('tickerInput') as HTMLInputElement;
    if (currentTicker) {
      const tickerValue = currentTicker.value;
      console.log('Form submitted with ticker:', tickerValue);
      handleSearch(tickerValue);
    }
  };
  
  const handleSearch = (tickerSymbol: string) => {
    console.log('Searching for:', tickerSymbol);
    fetchStockData(tickerSymbol);
    fetchHistoricalData(tickerSymbol, timeFrame);
  };

  const handleTimeFrameChange = (newTimeFrame: string | undefined) => {
    const timeFrameValue = newTimeFrame || '1y'; // Fallback to '1y' if undefined
    setTimeFrame(timeFrameValue);
    fetchHistoricalData(ticker, timeFrameValue);
  };

   // Custom formatter function for Y-axis ticks
  const formatYAxisTick = (value: number) => {
    return value.toFixed(2);
  };

  const StockChart = () => {
    const isUpwardTrend = historicalData.length > 0 && historicalData[0].close < historicalData[historicalData.length - 1].close;
    const TrendColorStroke = isUpwardTrend ? "#36e35b" : "#f04e43";
    const TrendColorFill = isUpwardTrend ? "#61ff83" : "#ff6b61";
    const minYValue = minCloseValue ? minCloseValue - 0.1 * minCloseValue : 0;
    const maxYValue = maxCloseValue ? maxCloseValue + 0.05 * maxCloseValue : 0;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={historicalData}>
          <Area type="monotone" dataKey="close" stroke={TrendColorStroke} fill={TrendColorFill} />
          <XAxis dataKey="label" />
          <YAxis type="number" domain={[minYValue, maxYValue]} tickFormatter={formatYAxisTick} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Stock Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Stock</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="container">
        <form onSubmit={handleFormSubmit}>
          <IonItem>
            <IonLabel position="floating">Enter Stock Ticker:</IonLabel>
            <IonInput 
              name="tickerInput"
              value={ticker} 
              onIonChange={e => setTicker(e.detail.value!)} 
              type="text"
            />
          </IonItem>

          <IonButton expand="block" type="submit">Search</IonButton>
        </form>

          <IonCard>
            <IonCardContent>
              {companyName && <p><b>Company Name:</b> {companyName}</p>}
              {/* {marketCap && <p>Market Cap: {marketCap}</p>} */}
              {exchange && <p><b>Exchange:</b> {exchange}</p>}
              {industry && <p><b>Industry:</b> {industry}</p>}
              {description && <p><b>Description:</b> {description}</p>}
              {employees > 0 && <p><b>Number of Employees:</b> {employees.toLocaleString()}</p>}
              {!companyName && <p><b>Enter a ticker symbol and click Search.</b></p>}
            </IonCardContent>
          </IonCard>
          
          <IonSegment value={timeFrame} onIonChange={e => handleTimeFrameChange(e.detail.value as string)} class="vertical-segment">
  <IonSegmentButton value="1m">1M</IonSegmentButton>
  <IonSegmentButton value="3m">3M</IonSegmentButton>
  <IonSegmentButton value="6m">6M</IonSegmentButton>
  <IonSegmentButton value="1y">1Y</IonSegmentButton>
  <IonSegmentButton value="2y">2Y</IonSegmentButton>
  <IonSegmentButton value="5y">5Y</IonSegmentButton>
  <IonSegmentButton value="max">Max</IonSegmentButton>
</IonSegment>

          <IonCard>
            <IonCardContent>
              <StockChart />
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
