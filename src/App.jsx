import { useEffect, useState } from 'react';
import './App.css';
import Calendar from './calendar/Calendar';

import leek from "./assets/leek.svg";
import gh from "./assets/gh.svg";

const DEFAULT = {
  startOfWeek: 'monday',
  hidden: [
    'research-breakthrough',
    'raid-battles',
    'go-battle-league',
    'season'
  ]
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
