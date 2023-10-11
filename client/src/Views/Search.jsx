import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import AudioPlayer from '../components/AudioPlayer';

function Search() {
    const [songResults, setSongResults] = useState(null);
    const [artistResults, setArtistResults] = useState(null);
    const [playSong, setPlaySong] = useState(null)
    const [audio, setAudio] = useState(null)
    const [currentPLaylist, setCurrentPlaylist] = useState([{src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/fa/c6/23/fac62369-02ae-6451-1942-76f38e2a61b0/mzaf_1964475913263690754.plus.aac.p.m4a", name: "Doja"},{src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/6b/0b/21/6b0b219c-8f51-95cb-3e8f-11492d521421/mzaf_5836981206976882775.plus.aac.ep.m4a", name:"Woman"}])

    useEffect(() => {
        if (playSong) {
            console.log(playSong);
            const song = new Audio(playSong)
            setAudio(song)
        }
    }, [playSong])


    return (
        <>
            <section id="section" className='col'>
                <SearchBar setSongResults={setSongResults} setArtistResults={setArtistResults} />
                <SearchResults songResults={songResults} artistResults={artistResults} setPlaySong={setPlaySong} />
            </section>
            {
                
                    <section id="audioplayer" className='row'>
                        <AudioPlayer tracks={currentPLaylist} />
                    </section >
                    
            }
        </>
    )
}

export default Search;