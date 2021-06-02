import './Search.scss';
import React, {useState} from 'react'
import { Search as SearchIcon } from 'react-bootstrap-icons';
import SearchBar from './SearchBar';

function Search() {
    let [open, setOpen] = useState(false);
    return (
        <div className="search">
            <div className="search-wrap"  onClick={() => setOpen(!open)}>
                <SearchIcon size={'1rem'} />
            </div>
            {open && <SearchBar toggle={setOpen} />}
        </div>
    )
}

export default Search;
