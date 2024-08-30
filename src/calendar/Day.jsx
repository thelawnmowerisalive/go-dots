import { memo } from "react";
import { isSameDay } from "./utils";

function eventClassNames(event, date) {
    const names = ['dot', event.eventType];
    if (isSameDay([date, event.startTime])) {
        // event starts on this day
        names.push('starts-on-this-day');
    }
    if (isSameDay([date, event.endTime])) {
        // event end on this day
        names.push('ends-on-this-day');
    }
    return names.join(' ');
}

/**
 * 
 * @param {{date: Date, events: [], onSelect: Function}} 
 * @returns 
 */
function Day({ date, events, onSelect, ...classNames }) {
    const names = ['day'];
    for (let name in classNames) {
        if (classNames[name]) {
            names.push(name);
        }
    }

    // filter out hidden events,
    // and map them by index
    const indexes = {};
    let max = 0;
    events?.forEach(event => {
        if (!event.hidden) {
            indexes[event.index] = event;
            max = Math.max(max, event.index);
        }
    });

    return (
        <div className={names.join(' ')} onClick={() => onSelect(date)}>
            <div className="date">{date.getDate()}</div>
            <div className="dots">
                {
                    // make sure to add empty slots 
                    // in order to preserve the index of each event
                    [...Array(max)].map((_x, index) => {
                        const event = indexes[index + 1] || { eventID: index };
                        return (
                            <div
                                className={eventClassNames(event, date)}
                                key={event.eventID}>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default memo(Day);