import { useSelector } from "react-redux"

const currChannelStyle = {
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap",
    fontSize: "1.2em",
    justifyContent: "space-evenly",
    marginRight: "auto",
    marginLeft: "10px"
}

export default () => {
    const currentChannel = useSelector(state => state.currentChannel.value)

    return (
        <div className="topbar">
            {currentChannel && (<><div style={currChannelStyle}>
                <div>
                    {currentChannel.name}
                </div>
                <div>
                    8346 members
                </div>
            </div>
            <div style={{margin:"auto 0px"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </div>
            <div style={{margin:"auto 0 auto 0"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </div></>)}
        </div>
    )
}