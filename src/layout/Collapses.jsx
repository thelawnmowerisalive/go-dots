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
export default function Collapses({ defaultTag, multi, children }) {
    const [selection, setSelection] = useState([]);
    useEffect(() => {
        setSelection([defaultTag]);
    }, [defaultTag]);

    const toggle = (tag) => {
        setSelection(prev => {
            const index = prev.indexOf(tag);
            if (index < 0) {
                // open it (also check multi flag)
                return multi ? prev.concat(tag) : [tag];
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
function Segment({ tag, children }) {

    // don't show empty segments
    const notEmpty = children?.reduce((all, crt) => {
        return all || crt;
    }, false);

    if (!notEmpty) {
        return false;
    }

    const { selection, toggle } = useContext(CollapsesContext);

    const isSelected = selection.indexOf(tag) >= 0;

    return (
        <div className={`segment ${tag}`}>
            <div
                className="title"
                onClick={() => { toggle(tag) }}
            >
                {tag}
                {isSelected ? <FaCaretUp className="caret up" /> : <FaCaretDown className="caret down" />}
            </div>
            {isSelected && children}
        </div>
    )
}

Collapses.Segment = Segment;