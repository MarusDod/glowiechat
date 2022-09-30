import { useState } from "react"
import { useDispatch } from "react-redux"
import { addChannel, setCurrentChannel } from "../store"
import IrcClient from "../store/IrcClient"
import { useIrcClient } from "../store/IrcProvider"


export default () => {
    const [val,setVal] = useState("")
    const dispatch = useDispatch()
    const ircClient = useIrcClient()

    const handleChange = ev => {
        setVal(ev.target.value)
    }

    const handleSubmit = ev => {
        ev.preventDefault()

        const newchannel = {
            name: val,
            description: "",
        }

        dispatch(addChannel(newchannel))
        dispatch(setCurrentChannel(newchannel))

        ircClient.joinChannel(newchannel.name)

        setVal("")
    }

    return (
        <div className="searchbar">
            <div style={{margin:"auto 5px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
            </div>
            <form onSubmit={handleSubmit}>
                <input className="dontfocus" type="text" value={val} onChange={handleChange} style={{boxSizing:"border-box",width:"90%",margin:"auto 10px",padding:".3em",fontSize:"1.2em",borderRadius:"10px",backgroundColor:"rgb(73, 73, 73)",border:"none",color:"white"}} />
            </form>
        </div>
    )
}