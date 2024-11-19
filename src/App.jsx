import { useEffect, useState } from 'react';
import './App.css';
import gh from "./assets/gh.svg";
import leek from "./assets/leek.svg";
import Calendar from './calendar/Calendar';

const DEFAULT = {
  startOfWeek: 'monday'
}

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    const request = new Request("https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json");
    fetch(request)
      .then((response) => response.text())
      .then((text) => {
        setData(JSON.parse(text));
      });

    const onMessage = (message) => {
      console.log(message.data);
    }
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
    }
  }, []);


  
  if (!data) {
    return <>DATA NOT READY</>
  }

  return (
    <>
      <Calendar settings={DEFAULT} events={data} />

      <footer>powered by
        <a className="link" target="_blank" href='https://leekduck.com/'>
          <img src={leek} /> LeekDuck
        </a>
        &
        <a className="link" target="_blank" href='https://github.com/bigfoott/ScrapedDuck'>
          <img src={gh} /> ScrapedDuck
        </a>
      </footer>
    </>
  )
}

export default App;
