import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Pepe from '../assets/pepe.jpeg'

const messageStyle = {
    color:"white",
    display: 'flex',
    maxWidth:"80%",
    boxSizing:"border-box",
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    margin:"0.5em",
    flexDirection:"row",
    alignItems: 'flex-end',
    gap: "1em",
}

const messageContentStyle = {
    borderRadius:"20px",
    backgroundColor:"#0b0c0d",
    padding: ".5em 1em",
    wordWrap: "break-word",
    overflowX:'hidden',
    display:'grid',
    gridTemplate: `
        'author author' auto
        'message date' 1fr
        / minmax(0,1fr) 1em
    `,
    gridColumnGap: "2em",
}

const checkURL = text => {
    try{
        const url = new URL(text)
        return url.protocol === "http:" || url.protocol === "https:"
    }
    catch{
        return false
    }
}

const checkMedia = url => {
    return new Promise(resolve => fetch(url)
        .then(
            res => res.blob().then( res => resolve(res.type.startsWith('image/'))),
            err => resolve(false)))
}

const Content = ({text}) => {
    const [type,setType] = useState("text")

    useEffect(() => {
        if(checkURL(text) === true){
            setType("url")

            checkMedia(text)
                .then(res => res === true ? setType("media"): {})
        }
    },[text])

    return (<>
        {type === "text" && <p style={{gridArea:"message",overflowWrap:"break-word"}}>{text}</p>}
        {type === "url" && (<a href={text}>{text}</a>)}
        {type === "media" && (<img src={text} alt="mofo" style={{maxWidth:"500px",objectFit:"cover"}} />)}
    </>)
}

const DateShow = ({time}) => 
    <span style={{gridArea:"date",display:"flex",alignSelf:"flex-end",justifySelf:"flex-start",fontSize:"0.6em",opacity:".8"}}>
        {new Date(parseInt(time)).toLocaleTimeString('pt-PT',{hour:'numeric',minute:'numeric'})}
    </span>

export default ({data}) => {
    const mynick = useSelector(state => state.nick.value)
    console.log(data)

    return (
        <div style={{...messageStyle,...(data.nick == mynick ? {flexDirection: 'row-reverse',alignSelf:"flex-end"} : {})}}>
            { data.type === 'message' && (<><img 
                src={Pepe}
                alt="profile"
                width="50px"
                height="50px"
                style={{borderRadius:"50%"}}
            />
            <div style={messageContentStyle}>
                <span style={{gridArea:"author",textAlign: data.nick == mynick ? "right" : "left",fontWeight:"bold"}}>
                    {data.nick}
                </span>
                
                <DateShow time={data.timestamp} />
                
                <Content text={data.content} />
            </div></>)}
            {['join','part'].includes(data.type) && (
            <div style={messageContentStyle}>
                <p style={{gridArea:"message"}}>User {data.nick} has {data.type}ed</p>
                <DateShow time={data.timestamp} />
            </div>)}
        </div>
    )
}