import React from 'react';

import SearchPanel from '../../../share/SearchPanel/SearchPanel';
import '../LessonPage.scss';
import './Search.scss';

const Search = (props) => {
    const { setTerm, group } = props;

    return (
        <>
            {group.id && (
                <div className="search-lesson">
                    <SearchPanel forLessons SearchChange={setTerm} />
                </div>
            )}
        </>
    );
};

export default Search;
