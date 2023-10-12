import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

function Search() {
    const [songResults, setSongResults] = useState(null);
    const [artistResults, setArtistResults] = useState(null);

    return (
        <section id="section" className='col'>
            <SearchBar setSongResults={setSongResults} setArtistResults={setArtistResults} />
            <SearchResults songResults={songResults} artistResults={artistResults} />
        </section>
    );
};

export default Search;
