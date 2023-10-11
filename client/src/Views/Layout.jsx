import React, { useContext, createContext, useState } from 'react'
import Side from '../components/Side'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import AudioPlayer from '../components/AudioPlayer'

export const GlobalContext = createContext(null)

export const useGlobalContext = () => {
    const globalContext = useContext(GlobalContext)
    if (!globalContext) {
        throw new Error('error')
    }
    return globalContext
}

export function Layout() {
    const [currentPlaylist, setCurrentPlaylist] = useState([{ src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/fa/c6/23/fac62369-02ae-6451-1942-76f38e2a61b0/mzaf_1964475913263690754.plus.aac.p.m4a", name: "Doja" }, { src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/6b/0b/21/6b0b219c-8f51-95cb-3e8f-11492d521421/mzaf_5836981206976882775.plus.aac.ep.m4a", name: "Woman" }])


    return (
        <>
            <div className='col-12' id='outer-box'>
                <div className='row' id='main'>
                    <GlobalContext.Provider value={{ currentPlaylist, setCurrentPlaylist }}>
                        <Navbar />
                        <Side />
                        <section id="audioplayer" className='row'>
                            <AudioPlayer tracks={currentPlaylist} />
                        </section>
                        <Outlet />
                    </GlobalContext.Provider>
                </div>
            </div>
        </>
    )
}
