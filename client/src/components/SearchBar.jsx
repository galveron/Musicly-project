import { useState } from 'react';

function SearchBar(props) {
    const { setSongResults, setArtistResults } = props;
    const [keyword, setKeyword] = useState(null);

    const handleSearch = async () => {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'c18aab72cemsh9613fced188ba47p1fc6eejsn19d245c27794',
                'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
            }
        };

        const response = await fetch(`https://shazam.p.rapidapi.com/search?term=${keyword}&limit=20`, options);
        const results = await response.json();

        setSongResults(results.tracks.hits);
        setArtistResults(results.artists.hits);
    };

    const handleTyping = event => {
        setKeyword(event.target.value);
    }

    return (
        <div id="search-bar">
            <input id='search-input' type='text' name='search-bar' placeholder='Start typing...' onChange={handleTyping} />
            <button id='search-button' type='button' onClick={handleSearch} >Search</button>
        </div>
    )
}

export default SearchBar;