import { useEffect, useState } from "react";
import { FaBinoculars } from "react-icons/fa6";
import { GiHighGrass } from "react-icons/gi";
import { HiOutlineExternalLink } from "react-icons/hi";
import { HiOutlineGift, HiOutlineQuestionMarkCircle, HiOutlineSparkles } from "react-icons/hi2";
import Collapses from "../layout/Collapses";
import "./events.less";
import { isSameDay, toHour } from "./utils";

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
            {/* {
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
            } */}
            <Collapses>
                {
                    events?.slice().reverse().map(event => (
                        <Collapses.Segment
                            key={event.eventID}
                            id={event.eventID}
                            tag={event.eventType}
                            title={event.name}
                            blurb={blurb(date, event)}
                        >
                            <Event key={event.eventID} event={event} />
                        </Collapses.Segment>
                    ))
                }
            </Collapses>
        </div>
    )
}

function Event({ event }) {
    const start = new Date(event.start),
        end = new Date(event.end);

    return (
        <div className="event">
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
                <a className="detail link" href={event.link} target="_blank"><HiOutlineExternalLink /> See more...</a>
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
                        <GiHighGrass />
                        Event spawns.
                    </div>
                );
            }
            if (extraData.generic.hasFieldResearchTasks) {
                details.push(
                    <div className="detail field-research-tasks" key="field-research-tasks">
                        <FaBinoculars />
                        Event field research tasks.
                    </div>
                );
            }
            if (details.length) {
                return details;
            }
            return (
                <div className="detail none">
                    <HiOutlineQuestionMarkCircle />
                    None available.
                </div>
            )
    }
}

function CanBeShiny({ flag }) {
    return (
        <div className={`detail ${flag ? "can-be-shiny" : "cannot-be-shiny"}`}>
            <HiOutlineSparkles />
            {
                flag ? "Can be shiny" : "Cannot be shiny"
            }
        </div>
    )
}

function Bonus({ text }) {
    return (
        <div className="detail bonus">
            <HiOutlineGift />
            {text}
        </div>
    )
}