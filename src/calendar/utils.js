/**
 * Returns the first Monday/Sunday before the given date.
 * @param {number | string | Date} date 
 * @param {'monday' | 'sunday'} startOfWeek
 */
function getFirstDayOfTheWeek(date, startOfWeek) {
    const first = startOfWeek === 'monday' ? 1 : 0;
    let day = new Date(date);
    do {
        if (first === day.getDay()) {
            return day;
        }

        // contrary to appearance, this works because setDate(0) 
        // will in fact set the date to the last day of the prev month
        day.setDate(day.getDate() - 1);
    } while (true);
}

function goToStart(date) {
    date.setHours(0, 0, 0, 0);
}

function goToEnd(date) {
    date.setHours(23, 59, 59, 999);
}

/**
 * 
 * @param {Date} day 
 * @param {number} start 
 * @param {number} end 
 */
function isBetween(day, start, end) {
    const date = new Date(day);
    goToStart(date);
    if (end < date.getTime()) {
        // range ends before the start of the day
        return false;
    }
    goToEnd(date);
    if (start > date.getTime()) {
        // range starts after the end of the day
        return false;
    }
    return true;
}

function isSameDay([first, ...rest]) {
    const date = new Date(first);
    goToStart(date);
    for (let t of rest) {
        const d = new Date(t);
        goToStart(d);
        if (date.getTime() !== d.getTime()) {
            return false;
        }
    }
    return true;
}

function toHour(date) {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export { getFirstDayOfTheWeek, goToEnd, goToStart, isBetween, isSameDay, toHour };
