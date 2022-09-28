import { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import store, { setNick, setPass, setServer } from './store'

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

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const submit = () => {
        dispatch(setNick(nick))
        dispatch(setPass(pass))
        dispatch(setServer(server))
        
        navigate("/client")
    }

    return (
        <div id="back">
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