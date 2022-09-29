import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addChannel, setChannels } from "."
import IrcClient from "./IrcClient"

export const IrcContext = createContext()
export const useIrcClient = () => useContext(IrcContext)

export const MessagesContext = createContext()
export const useMessages = () => useContext(MessagesContext)

export default ({children}) => {

    const dispatch = useDispatch()

    const nick = useSelector(state => state.nick.value)
    const pass = useSelector(state => state.pass.value)
    const server = useSelector(state => state.server.value)

    const ircClient = useMemo(() => new IrcClient({
        server,
        nickname: nick,
        pass
    }),[nick,server,pass])

    const messages = useState({})

    useEffect(() => {

        const handler = () => ircClient.quit()

        window.addEventListener('beforeunload',handler)


        return () => {
            ircClient.quit()
            window.removeEventListener('beforeunload',handler)
        }
    },[nick,server,pass])


    return (
        <IrcContext.Provider value={ircClient}>
            <MessagesContext.Provider value={messages}>
                {children}
            </MessagesContext.Provider>
        </IrcContext.Provider>
)}