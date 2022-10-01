import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { removeChannel, setCurrentChannel } from "../store"
import { useIrcClient, useMessages } from "../store/IrcProvider"

const currChannelStyle = {
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap",
    fontSize: "1em",
    cursor:'pointer',
    justifyContent: "space-evenly",
    marginRight: "auto",
    marginLeft: "10px"
}

const ModalChannel = ({channel,active,setInactive}) => {
    const modalref = useRef()

    useEffect(() => {
        if(!active)
            return


        const handler = ev => {
            if(modalref.current && !modalref.current.contains(ev.target)){
                setInactive()
            }
        }

        const keyhandler = ev => {
            switch(ev.code){
                case "Escape":
                    setInactive()
                    break;
                default:
                    break;
            }
        }

        document.addEventListener('keydown',keyhandler)

        const timer = setTimeout(() => document.addEventListener('click',handler),500)

        return () => {
            clearTimeout(timer)
            document.removeEventListener('click',handler)
        }
    },[active])

    return (
        <div className="modalchannel" style={{display: active ? 'flex' : 'none'}}>
            <div ref={modalref} className={"modalcontent fadein"} style={{opacity: active ? 1 : 0}}>
                <p>
                    Channel: {channel.name}
                </p>
                <p>
                    Description: {channel.description}
                </p>
                <p>
                    Members:
                </p>
                <div className="modalmembers">
                    {channel.members.map(m => (
                        <div key={m}>{m}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default () => {
    const currentChannel = useSelector(state => state.currentChannel.value)
    const [messages,setMessages] = useMessages()
    const [members,setMembers] = useState([])
    const [showModal,setShowModal] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const ircClient = useIrcClient()

    useEffect(() => {
        if(!currentChannel)
            return 

        ircClient.listMembers(currentChannel.name,names => setMembers(names))
    },[currentChannel])

    const [showDropdown,setShowDropdown] = useState(false)

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const logoutClick = () => {
        setShowDropdown(false)
        navigate('/')
    }

    const leaveChannel = () => {
        ircClient.leaveChannel(currentChannel.name)

        setMessages(messages => ({...messages,[currentChannel.name]: {}}))
        dispatch(removeChannel(currentChannel))
        dispatch(setCurrentChannel(null))
    }

    return (
        <div className="topbar">
            {currentChannel && (<><div style={currChannelStyle} onClick={() => setShowModal(true)}>
                <div>
                    {currentChannel.name}
                </div>
                {members.length != 0 && (<div>
                    {members.length} {currChannelStyle.members == 1 ? 'member' : 'members'}
                </div>)}
            </div>
            <div style={{margin:"auto 0px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </div></>)}
            <div 
                onMouseEnter={() => setShowDropdown(true)} 
                onMouseLeave={() => setShowDropdown(false)} 
                style={{cursor:"pointer",position:"relative",display:'inline-block',margin:`auto 0px auto ${currentChannel ? "0px":"auto"}`}}>
                <svg onClick={toggleDropdown} xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
                {showDropdown && (<div className="dropbeat" >
                    <button className="dropbutton" onClick={leaveChannel}>
                        Leave Channel
                    </button>
                    <button className="dropbutton"  onClick={logoutClick}>
                        Logout
                    </button>
                </div>)}
            </div>
            {currentChannel && (<ModalChannel channel={{...currentChannel,members}} active={showModal} setInactive={() => setShowModal(false)} />)}
        </div>
    )
}