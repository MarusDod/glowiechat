import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentChannel } from "../store"
import { useIrcClient } from "../store/IrcProvider"
import ChannelEntry from "./ChannelEntry"

const channelListStyle = {
    gridArea: "channels",
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "flex-start",
    flexWrap: "nowrap",
    overflowY: "scroll",
}

export default () => {
    const channels = useSelector(state => state.channels.value)
    const currentChannel = useSelector(state => state.currentChannel.value)
    const dispatch = useDispatch()

    const setActive = ch => {
        dispatch(setCurrentChannel(ch))
    }

    return (
            <div style={channelListStyle}>
                {channels.map(c => (
                    <ChannelEntry 
                        {...(currentChannel?.name === c.name ? {'active':true} : {})} 
                        key={c.name} 
                        data={c}
                        setActiveHandler={setActive}
                    />
                ))}
            </div>
    )
}