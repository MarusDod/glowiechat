import { createContext, useContext, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addChannel, setChannels } from "."
import IrcClient from "./IrcClient"

export const IrcContext = createContext()
export const useIrcClient = () => useContext(IrcContext)

export default ({children}) => {

    const dispatch = useDispatch()

    const nick = useSelector(state => state.nick.value)
    const pass = useSelector(state => state.pass.value)
    const server = useSelector(state => state.server.value)

    const ircClient = useMemo(() => new IrcClient({
        server: `ws://${server}`,
        nickname: nick,
        pass
    }),[nick,server,pass])

    useEffect(() => {
        ircClient.listChannels(channels => {
            console.log('channels',channels)
            dispatch(setChannels(channels))
        })

        return () => ircClient.quit()
    },[nick,server,pass])

    useEffect(() => () => ircClient.quit(),[])

    return (
        <IrcContext.Provider value={ircClient}>
            {children}
        </IrcContext.Provider>
)}