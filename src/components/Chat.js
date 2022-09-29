import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeChannel, setCurrentChannel } from "../store"
import { useIrcClient } from "../store/IrcProvider"
import Message from "./Message"

const inputStyle = {
    gridArea: 'input',
    backgroundColor: "#494949",
    display: 'flex',
    gap: '1em',
    padding: "0 .5em",
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'center',
}

const messageListStyle = {
    gridArea: 'messages',
    backgroundColor:"rgb(37,41,54)",
    width:"100%",
    display:'flex',
    flexFlow: 'column-reverse nowrap',
    justifyContent: 'flex-start',
    overflowY: "scroll",
    overflowX: "hidden",
    alignItems: 'flex-start',
}

export default () => {
    const ircClient = useIrcClient()

    const currentChannel = useSelector(state => state.currentChannel.value)
    const nick = useSelector(state => state.nick.value)
    const server = useSelector(state => state.server.value)
    const dispatch = useDispatch()

    const [messages,setMessages] = useState([])

    const [inputMessage,setInputMessage] = useState("")

    useEffect(() => {
        setMessages([])
        if(!currentChannel){
            return
        }

        ircClient.joinChannel(currentChannel.name,message => {
            setMessages(messages => [message,...messages])
        })

        const handler = ev => {
            if(!currentChannel)
                return
            console.log(ev)
            switch(ev.code){
                case "Escape":
                    ircClient.leaveChannel(currentChannel.name)

                    dispatch(removeChannel(currentChannel))
                    dispatch(setCurrentChannel(null))
                    break;
                default:
                    break;
            }
        }

        document.addEventListener('keydown',handler)

        return () => {
            document.removeEventListener('keydown',handler)
        }

    },[currentChannel,nick,server])


    const handleMessageSubmit = ev => {
        ev.preventDefault()
        if(!inputMessage)
            return

        const newMessage = {
            nick,
            content: inputMessage
        }

        setMessages([newMessage,...messages])

        ircClient.sendMessage(currentChannel.name,inputMessage)

        setInputMessage("")
    }

    return (
        <div className="chat">
            {currentChannel && (<>
            <div style={messageListStyle}>
                {messages.map((m,index) => (
                    <Message key={index} data={m} />
                ))}
            </div>
            <div style={inputStyle}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
                        <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                    </svg>
                </div>
                <form onSubmit={handleMessageSubmit} style={{flex:1}}>
                    <input 
                        type="text" 
                        value={inputMessage} 
                        onChange={ev => setInputMessage(ev.target.value)} 
                        {...(currentChannel ? {}:{'disabled':true})}
                        style={{width:"100%",fontSize:"1.2em",padding:"0.2em"}} />
                </form>
                <div style={{margin:'auto 10px'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
                    </svg>
                </div>
            </div></>)}
        </div>
    )
}