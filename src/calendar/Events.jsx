import { useEffect, useState } from "react";
import "./events.less";
import { isSameDay, toHour } from "./utils";
import link from "./../assets/link.svg";
import shiny from "./../assets/shiny.svg";
import bonus from "./../assets/bonus.svg";
import question from "./../assets/question.svg";
import spawns from "./../assets/spawns.svg";
import research from "./../assets/research.svg";

function blurb(date, event) {
    if (isSameDay([event.startTime, event.endTime])) {
        // event is on a single day => show only the start/end hours
        return `${toHour(event.startTime)} - ${toHour(event.endTime)}`;
    } else if (isSameDay([date, event.endTime])) {
        // event ends on this day => show only end hour
        return `until ${toHour(event.endTime)}`;
    } else if (isSameDay([date, event.startTime])) {
        // event starts on this day => show only start hour
        return `from ${toHour(event.startTime)}`;
    }
}

/**
 * @param {{events: []}} 
 */
export default function Events({ date, events }) {
    const [selectedEvent, setSelectedEvent] = useState();

    const selectEvent = (event) => {
        setSelectedEvent(event);
    }

    useEffect(() => {
        // reset selection when the date changes
        setSelectedEvent();
    }, [date])

    return (
        <div className="events">
            {
                events?.slice().reverse().map(event => (
                    event === selectedEvent
                        ? <Event key={event.eventID} event={selectedEvent} />
                        : <div key={event.eventID}
                            className={`event ${event.eventType}`}
                            onClick={() => selectEvent(event)}
                        >
                            <div className="name">
                                {event.name}
                            </div>
                            <div className="blurb">
                                {blurb(date, event)}
                            </div>
                        </div>
                ))
            }
        </div>
    )
}

function Event({ event }) {
    const start = new Date(event.start),
        end = new Date(event.end);

    return (
        <div className={`event ${event.eventType} expanded`}>
            <div className="name">{event.name}</div>
            <div className="timeline">
                <div className="time">
                    <label>Starts:</label>
                    <div>
                        {start.toLocaleDateString()} <br />
                        {start.toLocaleTimeString()}
                    </div>
                </div>
                <div className="time">
                    <label>Ends:</label>
                    <div>
                        {end.toLocaleDateString()} <br />
                        {end.toLocaleTimeString()}
                    </div>
                </div>
            </div>

            <label>Details:</label>
            <div className="details">
                <EventDetails eventType={event.eventType} extraData={event.extraData} />
                <a className="detail link" href={event.link} target="_blank"><img src={link} /> See more...</a>
            </div>
        </div>
    )
}

function EventDetails({ eventType, extraData }) {
    switch (eventType) {
        case "pokemon-spotlight-hour":
            return (
                <>
                    <CanBeShiny flag={extraData.spotlight?.canBeShiny} />
                    <Bonus text={extraData.spotlight?.bonus} />
                </>
            )
        case "raid-battles":
            return <CanBeShiny flag={extraData.raidbattles?.shinies?.length > 0} />
        case "community-day":
            return (
                <>
                    <CanBeShiny flag={extraData.communityday?.shinies?.length > 0} />
                    {
                        extraData.communityday?.bonuses?.map(bonus => <Bonus text={bonus.text} key={bonus.text} />)
                    }
                </>
            )
        default:
            const details = [];
            if (extraData.generic.hasSpawns) {
                details.push(
                    <div className="detail spawns" key="spawns">
                        <img src={spawns} />
                        Event spawns.
                    </div>
                );
            }
            if (extraData.generic.hasFieldResearchTasks) {
                details.push(
                    <div className="detail field-research-tasks" key="field-research-tasks">
                        <img src={research} />
                        Event field research tasks.
                    </div>
                );
            }
            if (details.length) {
                return details;
            }
            return (
                <div className="detail none">
                    <img src={question} />
                    None available.
                </div>
            )
    }
}

function CanBeShiny({ flag }) {
    return (
        <div className={`detail ${flag ? "can-be-shiny" : "cannot-be-shiny"}`}>
            <img src={shiny} />
            {
                flag ? "Can be shiny" : "Cannot be shiny"
            }
        </div>
    )
}

function Bonus({ text }) {
    return (
        <div className="detail bonus">
            <img src={bonus} />
            {text}
        </div>
    )
}