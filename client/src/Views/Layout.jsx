import React, { useContext, createContext, useState } from 'react';
import Side from '../components/Side';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';

export const GlobalContext = createContext(null);

export const useGlobalContext = () => {
    const globalContext = useContext(GlobalContext);
    if (!globalContext) {
        throw new Error('error');
    };
    return globalContext;
};

export function Layout() {
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [logged, setLogged] = useState(false);

    return (
        <>
            <div className='col-12' id='outer-box'>
                <div className='row' id='main'>
                    <GlobalContext.Provider value={{ currentPlaylist, setCurrentPlaylist, logged, setLogged }}>
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
    );
};
