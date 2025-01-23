import { createContext, useContext, useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import "./collapses.less";

const CollapsesContext = createContext({
    selection: [],
    toggle: () => { /* no-op */ }
});

/**
 * 
 * @param {{defaultTag: string, multi: boolean, children: []}}  
 * @returns 
 */
export default function Collapses({ defaultTag: defaultSelection, multi, children }) {
    const [selection, setSelection] = useState([]);
    useEffect(() => {
        setSelection([defaultSelection]);
    }, [defaultSelection]);

    const toggle = (selection) => {
        setSelection(prev => {
            const index = prev.indexOf(selection);
            if (index < 0) {
                // open it (also check multi flag)
                return multi ? prev.concat(selection) : [selection];
            } else {
                // already open => hide it
                const result = prev.concat();
                result.splice(index, 1);
                return result;
            }
        })
    }

    return (
        <div className="collapses">
            <CollapsesContext.Provider value={{ selection, toggle }}>
                {children}
            </CollapsesContext.Provider>
        </div>
    )
}

/**
 * 
 * @param {{tag: string, children: []}}  
 * @returns 
 */
function Segment({ id, tag, title, blurb, children }) {

    // don't show empty segments
    // make sure that we also don't receive an array of falsy values
    const arr = Array.isArray(children) ? children : [children];
    const notEmpty = arr.reduce((all, crt) => {
        return all || crt;
    }, false);

    if (!notEmpty) {
        return false;
    }

    const { selection, toggle } = useContext(CollapsesContext);

    const isSelected = selection.indexOf(id || tag) >= 0;

    return (
        <div className={`segment ${tag}`}>
            <div
                className="title"
                onClick={() => { toggle(id || tag) }}
            >
                <div>
                    {title || tag}
                    {blurb && <span className="blurb">{blurb}</span>}
                </div>

                {isSelected ? <FaCaretUp className="caret up" /> : <FaCaretDown className="caret down" />}
            </div>
            {isSelected && children}
        </div>
    )
}

Collapses.Segment = Segment;