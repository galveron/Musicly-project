import React from 'react'
import { useState, useEffect } from 'react'
import Songs from '../components/Songs'
import Cookies from 'js-cookie'
import AudioPlayer from '../components/AudioPlayer'
const url = 'https://shazam.p.rapidapi.com/'

const song = {
    artists: [{
        alias: 'doja-cat',
        id: '42',
        adamid: '830588310'
    }],
    images: {
        background: 'https://is4-ssl.mzstatic.com/image/thumb/AMCArtist…023-06-16T14-02-41.627Z_cropped.png/800x800cc.jpg',
        coverart: '/albumcover.png',
    },
    key: "673557639",
    subtitle: "Doja Cat",
    title: "Paint The Town Red",
    type: "MUSIC",
    url: "https://www.shazam.com/track/673557639/paint-the-town-red",
    actions: [{}, { uri: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/cb/24/ac/cb24ac75-128c-f817-7d81-7fbffbdaafe3/mzaf_1522770279362005862.plus.aac.ep.m4a" }]
}


export default function Home() {
    const [topTenByCountry, setTopTenByCountry] = useState([])
    const [topTenHipHop, setTopTenHipHop] = useState([song, song, song])
    const [randomTen, setRandomTen] = useState([song, song, song])
    const [favorites, setFavorites] = useState([])
    const [favSongKey, setFavSongKey] = useState(null)
    const [favArtistId, setFavArtistId] = useState(null)
    const [recTen, setRecTen] = useState([song])
    const [recArtistId, setRecArtistId] = useState(null)
    const [recArtistTop, setRecArtistTop] = useState(null)
    const [location, setLocation] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [user, setUser] = useState(Cookies.get('username'));
    const [playSong, setPlaySong] = useState(null)
    const [currentPLaylist, setCurrentPlaylist] = useState([{src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/fa/c6/23/fac62369-02ae-6451-1942-76f38e2a61b0/mzaf_1964475913263690754.plus.aac.p.m4a", name: "Doja"},{src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/6b/0b/21/6b0b219c-8f51-95cb-3e8f-11492d521421/mzaf_5836981206976882775.plus.aac.ep.m4a", name:"Woman"}])

    // useEffect(() => {
    //     try {
    //         fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=4df7fe498720447289870fc8b787ad73")
    //             .then(response => response.json())
    //             .then(result => setLocation(location => [...location, result.country.languages[0].iso_code, `Top 10 songs in ${result.country.name}`]))
    //     }
    //     catch (error) { console.log(error) }
    // }, [])

    useEffect(() => {
        try {
            console.log(user);
            if (user) {
                fetch(`http://localhost:3000/api/v1/${user}/favoriteSongs`)
                    .then(response => response.json())
                    .then(result => setFavorites(() => result))
            }
        }
        catch (error) { console.log(error) }

    }, [user])

    // async function fetchData(end, setVar) {
    //     try {
    //         const response = await fetch((url + end),
    //             {
    //                 method: 'GET',
    //                 headers: {
    //                     // 'X-RapidAPI-Key': 'afa85eef4cmsh155012efac6de0ap192459jsn58b3965d483a',
    //                     'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
    //                 }
    //             })
    //         const result = await response.json()
    //         end.includes("search") ?
    //             setVar(await result.tracks.hits)
    //             : end.includes("related-artist") ?
    //                 setVar(await result.data ? result.data : [song])
    //                 : setVar(await result.tracks ? result.tracks : [song])
    //     }
    //     catch (error) { console.log(error) }
    // }

    useEffect(() => {
        if (location) {
            //fetchData(`charts/track?locale=${location[0] ? location[0] : 'en-US'}&pageSize=10&startFrom=0`, setTopTenByCountry)

            // setTimeout(() => {
            //     fetchData('charts/track?locale=HU&listId=genre-global-chart-2&pageSize=10&startFrom=0', setTopTenHipHop)
            // }, 500)

            // setTimeout(() => {
            //     fetchData('search?term=pop&locale=en-US&offset=10&limit=10', setRandomTen)
            // }, 1000)
        }
    }, [location])

    useEffect(() => {
        if (favorites.length > 0) {
            const randomNumber = Math.floor(Math.random() * favorites.length)
            setFavSongKey(favorites[randomNumber].key)
            setFavArtistId(favorites[randomNumber].artists[0].adamid)
        }

        if (favSongKey) {
            //console.log(favSongKey);
            //fetchData(`songs/list-recommendations?key=${favSongKey}`, setRecTen)
        }

        // fetchData(`songs/get-related-artist?id=${favArtistId}`, setRecArtistId)


        // setTimeout(() => {
        //     fetchData(`songs/get-related-artist?id=${favArtistId}`, setRecArtistId)
        // }, 1000)


    }, [favSongKey, favorites])

    //console.log(topTenByCountry);
    console.log(currentPLaylist);

    //console.log(recTen);
    return (
        <>
            {isLoggedIn ?
                <section id='section' className='col'>
                    <div id='scroll-section'></div>
                    <Songs
                        title={location[1] ? location[1] : `Top 10 songs in the US`}
                        topTen={topTenByCountry}
                        setPlaySong={setPlaySong}
                        setCurrentPlaylist={setCurrentPlaylist}
                    />
                    <Songs
                        title='Songs for you'
                        topTen={recTen}
                        setPlaySong={setPlaySong}
                        setCurrentPlaylist={setCurrentPlaylist}
                    />
                    <Songs
                        title='Find something new to listen'
                        topTen={randomTen}
                        setPlaySong={setPlaySong}
                        setCurrentPlaylist={setCurrentPlaylist}
                    />
                </section>
                : <section id='section' className='home-main-section'>
                    <div id='scroll-section'>
                        <Songs
                            title={location[1]}
                            topTen={topTenByCountry}
                            setPlaySong={setPlaySong}
                            setCurrentPlaylist={setCurrentPlaylist}
                        />
                        <Songs
                            title='Top 10 Hip-Hop/Rap songs'
                            topTen={topTenHipHop}
                            setPlaySong={setPlaySong}
                            setCurrentPlaylist={setCurrentPlaylist}
                        />
                        <Songs
                            title='Find something new to listen'
                            topTen={randomTen}
                            setPlaySong={setPlaySong}
                            setCurrentPlaylist={setCurrentPlaylist}
                        />
                    </div>
                </section>}
            {
                    <section id="audioplayer" className='row'>
                        <AudioPlayer tracks={currentPLaylist} />
                    </section>
            }
        </>
    )
}
