import './ChannelEntry.css'
import MoneroLogo from '../assets/monero.jpeg'

const exampleProps = {
    logo: MoneroLogo,
    name: "Monero XMR",
    peek: "yo waddup waddup",
    date: "19:51",
    read: 2
}

export default props => {
    const channel = props.data
    return (
            <div className={props.active ? 'channel light': 'channel'} onClick={() => props.setActiveHandler(channel,props.active)} >
                <img 
                    className='logo' 
                    src={exampleProps.logo}
                    alt="logo"
                    width="80%"
                />
                <div className='name overflow' >
                    {channel.name}
                </div>
                <div className='peek overflow' >
                    {channel.description}
                </div>
                <div className='date' >
                    {exampleProps.date}
                </div>
                <div className='read' >
                    {/* TODO!!! exampleProps.read*/}
                </div>
            </div>
    )
}