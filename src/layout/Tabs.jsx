import { useEffect, useState } from "react";
import './tabs.less';

/**
 * 
 * @param {{tabs: [], onSelect: (id) => {}}}
 * @returns 
 */
export default function Tabs({ tabs, defaultTab, onSelect }) {

    // select the first tab by default
    const [selection, setSelection] = useState(defaultTab || tabs[0].id);

    useEffect(() => {
        onSelect(selection)
    }, [selection]);

    return (
        <div className="tabs">
            {
                tabs.map(({ id, icon }) =>
                    <div
                        className="tab"
                        key={id}
                        onClick={() => setSelection(id)}>
                        {icon}
                    </div>
                )
            }
        </div>
    )
}

Tabs.EVENTS = 'events';
Tabs.RESEARCH = 'research';
Tabs.RAIDS = 'raids';