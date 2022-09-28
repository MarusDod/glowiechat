import { useEffect, useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import store, { setNick, setPass, setServer } from './store'
import IrcClient from './store/IrcClient'

const Input = props => {

    return (
        <input 
            type={props.password ? "password": "text" }
            className='textInput'
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
        />
    )
}

export default () => {
    
    const [nick,setNickLocal] = useState(useSelector(state => state.nick.value) ?? "")
    const [pass,setPassLocal] = useState(useSelector(state => state.pass.value) ?? "")
    const [server,setServerLocal] = useState(useSelector(state => state.server.value) ?? "")

    const [showModal,setShowModal] = useState(false);
    const [modalColor,setModalColor] = useState("");
    const [modalText,setModalText] = useState("");

    const dispatch = useDispatch()

    const navigate = useNavigate()

    useEffect(() => {
        if(showModal !== true)
            return

        setTimeout(() => {
            setShowModal(false)
            setModalText("")
        },2 * 1000)
    },[showModal])

    const submit = () => {
        dispatch(setNick(nick))
        dispatch(setPass(pass))
        dispatch(setServer(server))

        IrcClient.connect({
            nick,
            pass,
            server
        })
            .then(msg => {
                setShowModal(true)
                setModalText(msg)
                setModalColor("green")
                setTimeout(() => navigate("/client"),2 * 1000)
            })
            .catch(err => {
                setShowModal(true)
                setModalText(err)
                setModalColor("crimson")
            })
    }

    return (
        <div id="back">
            {showModal && (
            <div id="modal" style={{backgroundColor:modalColor}}>
                {modalText}
            </div>)}
            <div id="loginform">
                <div id="logintext">
                    Login
                </div>
            
                <div id="nickname">
                    <Input value={nick} onChange={ev => setNickLocal(ev.target.value)} placeholder="Nickname" />
                </div>
            
                <div id="password">
                    <Input value={pass} onChange={ev => setPassLocal(ev.target.value)} placeholder="Password" />
                </div>
            
                <div id="server">
                    <Input value={server} onChange={ev => setServerLocal(ev.target.value)} placeholder="Server" />
                </div>
            
                <button onClick={submit} id="connect">
                    Connect
                </button>
            </div>
        </div>
    )
}