import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./search.less";

export default function Search({ placeholder, onChange }) {

    const [text, setText] = useState('');

    useEffect(() => {
        onChange(text);
    }, [text])

    return (
        <div className="search">
            <input
                value={text}
                placeholder={placeholder || 'Search'}
                onChange={({ target }) => { setText(target.value) }}
            />
            <button 
                className="clear"
                onClick={() => setText('')}
            >
                <IoCloseCircleOutline />
            </button>
        </div>
    )
}