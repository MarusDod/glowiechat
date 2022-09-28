import { useSelector } from 'react-redux'
import Pepe from '../assets/pepe.jpeg'

const messageStyle = {
    width:"100%",
    margin:"10px",
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: "1em",
}

const messageContentStyle = {
    border:'2px dotted black',
    padding: ".5em 1em",
    display:'grid',
    gridTemplateAreas: `
        'author .'
        'message date'
    `,
    gridColumnGap: "2em",
    gridRowGap: "1em",
}

export default ({data}) => {
    const mynick = useSelector(state => state.nick.value)

    return (
        <div style={{...messageStyle,flexDirection: data.nick == mynick ? 'row-reverse' : 'row'}}>
            <img 
                src={Pepe}
                alt="profile"
                width="50px"
                height="50px"
            />
            <div style={messageContentStyle}>
                <span style={{gridArea:"author"}}>
                    {data.nick}
                </span>
                <span style={{gridArea:"message"}}>
                    {data.content}
                </span>
                <span style={{gridArea:"date"}}>
                    21:52
                </span>
            </div>
        </div>
    )
}