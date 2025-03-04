import { useEffect, useState } from 'react';
import { BsCalendar3 } from 'react-icons/bs';
import { FaBinoculars } from 'react-icons/fa6';
import { GiFishMonster } from 'react-icons/gi';
import './App.css';
import gh from "./assets/gh.svg";
import leek from "./assets/leek.svg";
import Calendar from './calendar/Calendar';
import Tabs from './layout/Tabs';
import Research from './research/Research';

const BASE_URL = "https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/";

const DEFAULT = {
  startOfWeek: 'monday'
}

function App() {
  const [view, setView] = useState();

  useEffect(() => {
    const onMessage = (message) => {
      console.log(message.data);
    }
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
    }
  }, []);

  const requestData = (id) => {
    const request = new Request(BASE_URL + id + ".min.json");
    fetch(request)
      .then((response) => response.text())
      .then((text) => {
        const data = JSON.parse(text);
        switch (id) {
          case Tabs.EVENTS:
            setView(<Calendar data={data} settings={DEFAULT} />)
            break;
          case Tabs.RESEARCH:
            setView(<Research data={data} />);
            break;
          default:
            setView(<>HOW DID YOU EVEN GET HERE</>)
            break;
        }
      });
  }

  const handleSelectTab = (id) => {
    // retrieve data and show content
    console.log(id);
    requestData(id);
  }

  return (
    <>
      <header>
        <Tabs
          onSelect={handleSelectTab}
          defaultTab={Tabs.EVENTS}
          tabs={[
            { id: Tabs.EVENTS, icon: <BsCalendar3 /> },
            { id: Tabs.RESEARCH, icon: <FaBinoculars /> },
            { id: Tabs.RAIDS, icon: <GiFishMonster style={{ fontSize: '1.3em' }} /> }
          ]}
        />
      </header>

      <main>
        {view}
      </main>


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
