import { useState } from 'react'
import { useSelector } from 'react-redux'
import ChannelList from './components/ChannelList'
import Chat from './components/Chat'
import SearchBar from './components/SearchBar'
import Topbar from './components/Topbar'
import IrcProvider from './store/IrcProvider';
import './Dashboard.css'

export default ({pass}) => {
    //const url = "dev.monkey.imeguras.eu.org:8001"
    const nick = useSelector(state => state.nick.value)
    const server = useSelector(state => state.server.value)

    return (
        <IrcProvider server={server} nickname={nick} pass={pass}>
            <div className="dashboard">
                <SearchBar />
                <Topbar />
                <ChannelList />
                <Chat />
            </div>
        </IrcProvider>
    )
}