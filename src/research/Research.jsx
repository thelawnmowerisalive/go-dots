import { useEffect, useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi2";
import Search from "../components/Search";
import Collapses from "../layout/Collapses";
import './research.less';

/**
 * 
 * @param {{data: []}} 
 * @returns 
 */
export default function Research({ data }) {
    const [research, setResearch] = useState({});
    const [types, setTypes] = useState(['']);

    // run only on first render
    // group tasks by type
    useEffect(() => {
        const research = {};
        const types = [];
        data.map(task => {
            const { text, type = 'event', rewards } = task;
            if (!research[type]) {
                types.push(type);
                research[type] = [];
            }
            research[type].push({
                text,
                rewards: rewards.map(({ name, canBeShiny }) => ({ name, canBeShiny }))
            });
        });

        setResearch(research);
        setTypes(types);
    }, []);

    const [filter, setFilter] = useState();

    /**
     * If filter is active, only show the tasks that give a reward that matches the filter.
     * @param {[string]} rewards 
     */
    const isVisible = (rewards) => {
        if (!filter) {
            return true;
        }
        const found = rewards.find(({ name }) => {
            return name.toLowerCase().indexOf(filter) >= 0;
        });
        return !!found;
    }

    return (
        <div className="research">
            {/* Search input */}
            <Search onChange={setFilter} />

            <Collapses defaultTag={types[0]} multi>
                {
                    types.map(type => (
                        <Collapses.Segment tag={type} key={type}>
                            {
                                research[type]?.map(({ text, rewards }) => {
                                    return isVisible(rewards) &&
                                        <Task
                                            key={text}
                                            text={text}
                                            rewards={rewards}
                                            visible={isVisible(rewards)}
                                        />
                                })
                            }
                        </Collapses.Segment>
                    ))
                }
            </Collapses>
        </div>
    )
}

function Task({ text, rewards }) {
    return (
        <div key={text} className="task">
            {text}

            <div className="rewards">
                {rewards?.map(({ name, canBeShiny }) =>
                    <div key={name}>
                        {name}
                        {canBeShiny && <HiOutlineSparkles className="shiny" />}
                    </div>
                )}
            </div>
        </div>
    )
}