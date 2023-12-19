import React, { useEffect, useState } from 'react';
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
import { API_TOKEN, BASE_URL } from '../config/config';

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
  const [displayText, setDisplayText] = useState<string>('');
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  //const [marketCap, setMarketCap] = useState<string>('');
  const [employees, setEmployees] = useState<number>(0);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [minCloseValue, setMinCloseValue] = useState<number | null>(null);
  const [maxCloseValue, setMaxCloseValue] = useState<number | null>(null);

  const [timeFrame, setTimeFrame] = useState<string>('1y'); // Default time frame
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [percentChange, setPercentChange] = useState<number>(0);
  const [firstCloseValue, setFirstCloseValue] = useState<number | null>(null);
  const [lastCloseValue, setLastCloseValue] = useState<number | null>(null);

  const [translation, setTranslation] = useState<string>('');

  /*
  const formatMarketCap = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  */

  useEffect(() => {
    // Update displayText whenever the description changes
    setDisplayText(description);
  }, [description]);
  
  const fetchStockData = async (tickerSymbol: string) => {
    try {
      //const response = await fetch(`${baseUrl}/stock/${tickerSymbol}/stats?token=${apiToken}`);
      const response = await fetch(`${BASE_URL}/stock/${tickerSymbol}/company?token=${API_TOKEN}`);
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

  useEffect(() => {
    calculatePercentChange();
  }, [firstCloseValue, lastCloseValue]);

  const calculatePercentChange = () => {
    if (firstCloseValue !== null && lastCloseValue !== null) {
      const change = ((lastCloseValue - firstCloseValue) / firstCloseValue) * 100;
      setPercentChange(change);
    } else {
      setPercentChange(0);
    }
  };
  

  const fetchOneDayData = async (tickerSymbol: string) => {
    try {
      setIsLoading(true);
      console.log("1");
      const response = await fetch(`${BASE_URL}/stock/${tickerSymbol}/chart/1d?token=${API_TOKEN}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log("2");
      const rawData = await response.json();

      // Filter out entries with null values and map the data for the chart
      const processedData = rawData
        .filter((item: { close: null; }) => item.close !== null)
        .map((item: { close: any; date: any; minute: any; }) => ({
          close: item.close,
          label: `${item.date} ${item.minute}`
        }));
      console.log("3");
      // Find the minimum and maximum close values
      const closes = processedData.map((item: { close: any; }) => item.close);
      const minClose = Math.min(...closes);
      const maxClose = Math.max(...closes);

      setHistoricalData(processedData);
      setMinCloseValue(minClose);
      setMaxCloseValue(maxClose);
      
      const firstClose = processedData[0].close;
      const lastClose = processedData[processedData.length - 1].close;
      setFirstCloseValue(firstClose);
      setLastCloseValue(lastClose);
      setIsLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setIsLoading(false);
    }
  };



  const fetchHistoricalData = async (tickerSymbol: string, selectedTimeFrame: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/stock/${tickerSymbol}/chart/${selectedTimeFrame}?token=${API_TOKEN}`);
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
        const firstClose = data[0].close;
        const lastClose = data[data.length - 1].close;
        setFirstCloseValue(firstClose);
        setLastCloseValue(lastClose);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setIsLoading(false);
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
      setIsTranslated(false);
    }
  };

  const translateText = async (text: string) => {
    const url = 'https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=cs&api-version=3.0&profanityAction=NoAction&textType=plain';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '721adc032emsh786ad32a1fac73fp1a34f2jsnaa15b152caa1',
        'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
      },
      body: JSON.stringify([{ Text: text }])
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setDisplayText(result[0].translations[0].text); // Update displayText with the translation
      setIsTranslated(true); // Update the state to indicate that translation is done
    } catch (error) {
      console.error('Translation error:', error);
      setIsTranslated(false); // In case of an error, reset the translation state
    }
  };


  const handleSearch = (tickerSymbol: string) => {
    console.log('Searching for:', tickerSymbol);
    fetchStockData(tickerSymbol);
    //fetchHistoricalData(tickerSymbol, timeFrame);
    handleTimeFrameChange(timeFrame);
  };

  const handleTimeFrameChange = (newTimeFrame: string | undefined) => {
    const timeFrameValue = newTimeFrame || '1y'; // Fallback to '1y' if undefined
    setTimeFrame(timeFrameValue);

    if (timeFrameValue === 'dynamic') {
      fetchOneDayData(ticker); // Call the new function for 1-day data
    } else {
      fetchHistoricalData(ticker, timeFrameValue); // Call the original function for other time frames
    }
  };

  // Custom formatter function for Y-axis ticks
  const formatYAxisTick = (value: number) => {
    return value.toFixed(2);
  };

  const StockChart = () => {
    const isUpwardTrend = historicalData.length > 0 && historicalData[0].close < historicalData[historicalData.length - 1].close;
    const TrendColorStroke = isUpwardTrend ? "#36e35b" : "#f04e43";
    const TrendColorFill = isUpwardTrend ? "#61ff83" : "#ff6b61";
    let minYValue, maxYValue;
    if (timeFrame === 'dynamic') {
      // Adjust calculations for dynamic data
      minYValue = minCloseValue ? minCloseValue - 0.0005 * minCloseValue : 0;
      maxYValue = maxCloseValue ? maxCloseValue + 0.0005 * maxCloseValue : 0;
    } else {
      // Calculations for other time frames
      minYValue = minCloseValue ? minCloseValue - 0.1 * minCloseValue : 0;
      maxYValue = maxCloseValue ? maxCloseValue + 0.1 * maxCloseValue : 0;
    }

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
            <IonTitle size="large">Stock Search</IonTitle>
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

            <IonButton type="submit" expand='block'>Search</IonButton>
          </form>

          <IonCard>
            <IonCardContent>
              {companyName && <p><b>Company Name:</b> {companyName}</p>}
              {/* {marketCap && <p>Market Cap: {marketCap}</p>} */}
              {exchange && <p><b>Exchange:</b> {exchange}</p>}
              {industry && <p><b>Industry:</b> {industry}</p>}
              {displayText && <p><b>Description:</b> {displayText}</p>}
            {!isTranslated && description && (
              <button className = "translateBtn" onClick={() => translateText(description)}>Přeložit popis</button>
            )}
              {translation && <p><b>Translation:</b> {translation}</p>}
              {employees > 0 && <p><b>Number of Employees:</b> {employees.toLocaleString()}</p>}
              {!companyName && <p><b>Enter a ticker symbol and click Search.</b></p>}
            </IonCardContent>
          </IonCard>

          <IonSegment value={timeFrame} onIonChange={e => handleTimeFrameChange(e.detail.value as string)} class="vertical-segment">
            <IonSegmentButton value="dynamic">1D</IonSegmentButton>
            <IonSegmentButton value="1m">1M</IonSegmentButton>
            <IonSegmentButton value="3m">3M</IonSegmentButton>
            <IonSegmentButton value="6m">6M</IonSegmentButton>
            <IonSegmentButton value="1y">1Y</IonSegmentButton>
            <IonSegmentButton value="2y">2Y</IonSegmentButton>
            <IonSegmentButton value="5y">5Y</IonSegmentButton>
            <IonSegmentButton value="max">Max</IonSegmentButton>
          </IonSegment>
</div>
{isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : historicalData.length > 0 ? (
            <IonCard>
              <IonCardContent>
                {timeFrame === 'dynamic' && (
                  <p className='graphWarning'>Warning: the time in the chart is in the time zone of the stock exchange</p>
                )}

                <StockChart />

                {minCloseValue !== null && <p><b>Minimum Value:</b> {minCloseValue.toFixed(2)}</p>}
                {maxCloseValue !== null && <p><b>Maximum Value:</b> {maxCloseValue.toFixed(2)}</p>}
                <div className='top-border'>
                  {firstCloseValue !== null && <p><b>First Value:</b> {firstCloseValue.toFixed(2)}</p>}
                  {lastCloseValue !== null && <p><b>Last Value:</b> {lastCloseValue.toFixed(2)}</p>}
                  <b>Stock Performance Change ({timeFrame}): </b> 
            <span style={{ color: percentChange >= 0 ? 'green' : 'red' , fontWeight: 'bold', fontSize: '20px'}}>
              {percentChange.toFixed(2)}%
            </span>
                </div>
              </IonCardContent>
            </IonCard>
          ) : (
            <div className="loading-container">
            <p>No graph data available.</p>
            </div>
          )}


      </IonContent>
    </IonPage >
  );
};

export default Home;
