import { useCallback, useReducer } from "react";
import "./calendar.less";
import Day from "./Day";
import DayOfTheWeek from "./DayOfTheWeek";
import Events from "./Events";
import { getFirstDayOfTheWeek, goToStart, isBetween } from "./utils";

/**
 * @param {{events: []}} 
 * @returns 
 */
function createInitialState({ date, events, settings: {startOfWeek, hidden} }) {
    // find first day of the week
    const today = date ? new Date(date) : new Date();
    goToStart(today);
    const first = getFirstDayOfTheWeek(today, startOfWeek);

    // compute start time and end time for each event,
    // and sort by end time
    events = events.map(event => ({
        ...event,
        startTime: new Date(event.start).getTime(),
        endTime: new Date(event.end).getTime(),
        hidden: hidden.includes(event.eventType)
    }));
    events.sort((e1, e2) => {
        // sort by start time;
        // for events starting at the same time, the shortest one will be shown first
        const startDiff = e1.startTime - e2.startTime;
        if (startDiff === 0) {
            return e2.endTime - e1.endTime;
        }
        return startDiff;
    });

    const days = [];
    let selectedDay;
    for (let i = 0; i < 28; i++) {
        const date = new Date(first);
        date.setDate(first.getDate() + i);
        goToStart(date);
        const time = date.getTime();
        const todayIsTheDay = time === today.getTime();
        const day = {
            date,
            time,
            events: [],
            selected: todayIsTheDay,
            today: todayIsTheDay
        }
        if (todayIsTheDay) {
            selectedDay = day;
        }

        // add events to day
        let lastIndex = 0;
        for (let event of events) {
            if (isBetween(date, event.startTime, event.endTime)) {
                day.events.push(event);

                if (event.hidden) {
                    // ignore hidden events for index logic
                    continue;
                }

                // preserve the index of the event from the previous day(s)
                if (!event.index) {
                    event.index = ++lastIndex;
                } else {
                    lastIndex = event.index;
                }
            }
        }

        days.push(day);
    }
    return { days, selectedDay };
}

function reducer(state, action) {
    switch (action.type) {
        // iterate days to set the selected flag, 
        // and find the selected day
        case 'select':
            const selectedTime = action.day.getTime();
            let selectedDay;
            const days = state.days.map(day => {
                const selected = selectedTime === day.time;
                if (selected) {
                    selectedDay = day;
                }
                return {
                    ...day,
                    selected
                }
            });
            return { days, selectedDay }
        default:
            break;
    }
}

export default function Calendar({ date, events, settings }) {
    const [state, dispatch] = useReducer(reducer, { date, events, settings }, createInitialState);

    /**
     * @param {Date} day
     */
    const handleClick = useCallback((day) => {
        dispatch({ type: 'select', day });
    }, []);

    // create header
    const sunday = <DayOfTheWeek key={0} label={DAYS_OF_THE_WEEK[0]} />;
    const header = 'sunday' === settings.startOfWeek ? [sunday] : [];
    for (let i = 1; i < 7; i++) {
        header.push(<DayOfTheWeek key={i} label={DAYS_OF_THE_WEEK[i]} />);
    }
    if (settings.startOfWeek === 'monday') {
        header.push(sunday);
    }

    return (
        <>
            <div className="calendar">
                {header}
                {
                    state.days.map(({ date, time, events, ...classNames }) =>
                        <Day key={time}
                            date={date}
                            events={events}
                            onSelect={handleClick}
                            {...classNames}
                        />)
                }
            </div>

            <b>{new Date(state.selectedDay.date).toLocaleDateString()}</b>

            <Events {...state.selectedDay} />
        </>
    )

}

const DAYS_OF_THE_WEEK = [
    'Su',
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa'
];