import { toBePartiallyChecked } from "@testing-library/jest-dom/dist/matchers"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setChannels, setCurrentChannel } from "../store"
import { useIrcClient } from "../store/IrcProvider"
import ChannelEntry from "./ChannelEntry"

const channelListStyle = {
    gridArea: "channels",
    display: "flex",
    flexFlow: "column nowrap",
    border: "2px solid black",
    justifyContent: "flex-start",
    overflowY: "scroll",
}

const channelEmptyStyle = {
    gridArea: "channels",
    border: "3px solid black",
    display: "flex",
    justifyContent:"center",
    alignItems:"center",
}

export default () => {
    const channels = useSelector(state => state.channels.value)
    const currentChannel = useSelector(state => state.currentChannel.value)
    const dispatch = useDispatch()

    const ircClient = useIrcClient()

    const setActive = (ch,active) => {
        if(active){
            dispatch(setCurrentChannel(null))
            return
        }

        dispatch(setCurrentChannel(ch))
    }

    const joinChannels = () => {
        ircClient.listChannels(channels => {
            console.log('channels',channels)
            dispatch(setChannels(channels))
        })
    }

    return (
        <>
            {channels.length > 0 && (<div style={channelListStyle}>
                {channels.map(c => (
                    <ChannelEntry 
                        {...(currentChannel?.name === c.name ? {'active':true} : {})} 
                        key={c.name} 
                        data={c}
                        setActiveHandler={setActive}
                    />
                ))}
            </div>)}
            {channels.length == 0 && (
                <div style={channelEmptyStyle}>
                    <button 
                        onClick={joinChannels}
                        style={{backgroundClip:"blue",padding:"2px",cursor:"pointer",fontSize:"1.2em"}}
                    >
                        auto-join
                    </button>
                </div>
            )}
        </>
    )
}