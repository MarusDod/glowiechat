import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Pepe from '../assets/pepe.jpeg'

const messageStyle = {
    color:"white",
    display: 'flex',
    boxSizing:"border-box",
    flexWrap: 'nowrap',
    overflowX:'hidden',
    justifyContent: 'flex-start',
    margin:"0.5em",
    flexDirection:"row",
    alignItems: 'flex-end',
    gap: "1em",
}

const messageContentStyle = {
    border:'2px dotted black',
    borderRadius:"20px",
    backgroundColor:"#0b0c0d",
    padding: ".5em 1em",
    width:"80%",
    wordWrap: "break-word",
    overflowX:'hidden',
    display:'grid',
    gridTemplate: `
        'author date' auto
        'message message' 1fr
        / 1fr auto
    `,
    gridColumnGap: "2em",
    gridRowGap: "1em",
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
        {type === "text" && <p style={{gridArea:"message",wordWrap:"break-word"}}>{text}</p>}
        {type === "url" && (<a href={text}>{text}</a>)}
        {type === "media" && (<img src={text} alt="mofo" style={{maxWidth:"500px",objectFit:"contain"}} />)}
    </>)
}

export default ({data}) => {
    const mynick = useSelector(state => state.nick.value)

    return (
        <div style={{...messageStyle,...(data.nick == mynick ? {flexDirection: 'row-reverse',alignSelf:"flex-end"} : {})}}>
            <img 
                src={Pepe}
                alt="profile"
                width="50px"
                height="50px"
                style={{borderRadius:"50%"}}
            />
            <div style={messageContentStyle}>
                <span style={{gridArea:"author",textAlign:"right",fontWeight:"bold"}}>
                    {data.nick}
                </span>
                
                <span style={{gridArea:"date",textAlign:'right'}}>
                    {new Date(parseInt(data.timestamp)).toLocaleTimeString('pt-PT',{hour:'numeric',minute:'numeric'})}
                </span>
                
                <Content text={data.content} />
            </div>
        </div>
    )
}