import { useEffect, useRef } from "react";
import "./timeline.less";

export default function Timeline({ data }) {
    const events = data
        // convert to dates
        .map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        }))
        // sort by start date
        .sort((event1, event2) => event1.start.getTime() - event2.start.getTime());

    // group the events in lines
    // TODO move the events wherever there is room
    //      to use less lines?
    const lines = new Lines();
    events.map(event => {
        lines.addEvent(event);
    });

    // find the start date of the earliest event
    // and the end date of the latest event
    const start = events[0].start.getTime();
    const end = (() => {
        let end = start;
        events.forEach(event => {
            end = Math.max(end, event.end.getTime());
        });
        return end;
    })();

    // compute the days that will be displayed in the timeline
    // TODO worth making a week/month option?
    const days = [];
    const firstDay = new Date(start);
    const lastDay = new Date(end);

    let day = firstDay;
    day.setHours(0, 0, 0, 0);
    do {
        // Date is mutable, so we keep a copy
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    } while (day <= lastDay);

    // create a marker which will be scrolled into view
    // when the timeline is loaded
    const marker = useRef();
    useEffect(() => {
        marker.current?.scrollIntoView({
            behavior: 'smooth',
            inline: 'start'
        });
    }, [marker.current]);

    // const grid = useRef();
    // const gridPos = useRef(0);
    // const [scrollMode, setScrollMode] = useState(false);

    // function handleMouseDown(e) {
    //     setScrollMode(true);
    //     gridPos.current = e.pageX - grid.current.offsetLeft;
    // }

    // function handleMouseUp() {
    //     setScrollMode(false);
    // }

    // function handleMouseLeave() {
    //     setScrollMode(false);
    // }

    // function handleMouseMove(e) {
    //     if (!scrollMode) {
    //         return;
    //     }

    //     e.preventDefault();
    //     const pos = e.pageX - grid.current.offsetLeft;
    //     const walk = (pos - gridPos.current) * 5;
    //     console.log(walk);
    //     grid.current.scrollLeft -= walk;
    //     console.log(grid.current.scrollLeft);
    // }

    return (
        <div className="timeline-container">
            <div className="timeline"
                // onMouseDown={handleMouseDown}
                // onMouseUp={handleMouseUp}
                // onMouseLeave={handleMouseLeave}
                // onMouseMove={handleMouseMove}
                // ref={grid}
                style={{ gridTemplateColumns: `repeat(${days.length}, 124px)` }}
            >
                {
                    // show the days in the timeline as the X-axis
                    days.map((day, index) => (
                        <div key={index} className="day">
                            {
                                // show the month on the first of each month
                                // and the very first day of the timline
                                (index == 0 || day.getDate() == 1) &&
                                <span className="month">{day.toLocaleString('default', { month: 'short' })}</span>
                            }
                            {day.getDate()}
                        </div>
                    ))
                }
                {
                    lines.lines.map((line, index) => (
                        line.events.map(event => (
                            // use the grid system to position each event
                            <div key={event.eventID} className={`event ${event.eventType}`} style={{
                                gridRow: index + 2,
                                gridColumnStart: 1 + daysBetween(start, event.start),
                                gridColumnEnd: 1 + daysBetween(start, event.end)
                            }}>
                                <Event event={event} />
                            </div>
                        ))
                    ))
                }

                <div className="today marker"
                    ref={marker}
                    style={{
                        gridRow: 1,
                        gridColumn: 1 + daysBetween(start, new Date().setHours(0, 0, 0, 0))
                    }}>
                    <Marker label='TODAY' />
                </div>
            </div>
        </div>
    )
}

function Marker({ label }) {
    return (
        <div>
            <div className="label">{label}</div>
        </div>
    )
}

const COLORS = {
    "event": "#27ae60",
    "community-day": "#1660a9",
    "live-event": "#d63031",
    "pokemon-go-fest": "#153d94",
    "global-challenge": "#0a64b5",
    "safari-zone": "#3d7141",
    "city-safari": "#3d7141",
    "wild-area": "#015b63",
    "ticketed-event": "#de3e9b",
    "location-specific": "#284b92",
    "bonus-hour": "#40407a",
    "pokemon-spotlight-hour": "#e58e26",
    "potential-ultra-unlock": "#2c3e50",
    "update": "#2980b9",
    "season": "#38ada9",
    "pokemon-go-tour": "#1d3a74",
    "pokestop-showcase": "#3ca392",

    // Research

    "research": "#1abc9c",
    "timed-research": "#1abc9c",
    "limited-research": "#159e83",
    "research-day": "#159e83",
    "research-breakthrough": "#795548",
    "special-research": "#13a185",

    // Raids/Battle

    "raid-day": "#e74c3c",
    "raid-battles": "#c0392b",
    "raid-hour": "#c0392b",
    "raid-weekend": "#6f1e51",
    "go-battle-league": "#8e44ad",
    "elite-raids": "#a21416",
    "max-battles": "#811356",
    "max-mondays": "#690342",

    // GO Rocket

    "go-rocket-takeover": "#1e1e1e",
    "team-go-rocket": "#1e1e1e",
    "giovanni-special-research": "#1e272e",
}

// TODO this needs to come from the parent
function Event({ event }) {
    return (
        <div style={{
            position: 'relative',
            height: '100%',
            borderRadius: 'inherit'
        }}>
            <div className="sticky"
                style={{
                    flex: "1"
                }}>
                {event.name}
            </div>
            <img src={event.image}
                style={{
                    position: 'absolute',
                    height: '100%',
                    top: 0,
                    right: 0,
                    borderTopRightRadius: 'inherit',
                    borderBottomRightRadius: 'inherit'
                }} />
            {/* <div style={{
                height: '100%',
                backgroundImage: `url(${event.image})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '124px',
                backgroundPosition: 'right',
                borderRadius: 'inherit'
            }}> 
            </div>*/}
        </div>
    )
}

class Lines {

    /**
     * @type {Line[]}
     */
    lines = [];

    /**
     * Find a line with the same type of event, and try to add it there.
     * Create a new line if necessary (first time we encountered this event type,
     * or it overlaps with events in the existing line).
     */
    addEvent(event) {
        const line = this.lines
            .filter(line => line.isSameEventType(event))
            .find(line => line.canFitEvent(event));
        if (line) {
            // found a spot to fit in the event
            line.addEvent(event);
        } else {
            // create a new line and it to the list
            this.lines.push(new Line(event));
        }
    }
}

class Line {
    events = [];
    endTime = 0;
    startTime = 0;
    eventType;

    constructor(firstEvent) {
        this.addEvent(firstEvent);
        this.eventType = firstEvent.eventType;
        this.startTime = firstEvent.start.getTime();
    }

    addEvent(event) {
        this.events.push(event);
        this.endTime = event.end.getTime();
    }

    isSameEventType(event) {
        return this.eventType === event.eventType;
    }

    canFitEvent(event) {
        return this.endTime <= event.start.getTime();
    }
}

/**
 * 
 * @param {number | string | Date} first 
 * @param {number | string | Date} second 
 */
function daysBetween(first, second) {
    return Math.round((new Date(second).getTime() - new Date(first).getTime()) / (1000 * 60 * 60 * 24));
}