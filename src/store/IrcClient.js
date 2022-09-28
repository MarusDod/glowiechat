class IrcClient {
    #listeners
    #counter
    #hostname
    #ready
    #pending

    constructor({server,nickname,username = nickname}) {
        this.#counter = 0
        this.#ready = false
        this.#pending = []
        this.#listeners = new Map()
        this.#hostname = new URL(server).hostname

        const socket = new WebSocket(server)
        this.socket = socket

        socket.onopen = () => {
            console.log("connected")


            socket.send(`USER ${nickname} 0 * : ${username}`)
            socket.send(`NICK ${nickname}`)

            setTimeout(() => {
                if(!this.isConnected())
                    return

                this.#ready = true
                this.#pending.forEach(msg => socket.send(msg))
            },8 * 1000)
        }

        socket.onclose = () => console.log("closed")

        socket.onerror = err => console.error(err)

        socket.addEventListener('message',message => {
            if(message.data.startsWith('PING')){
                const cookie = message.data.split(' ')[1]
                const reply = `PONG ${cookie}`
                this.socket.send(reply)
                return
            }

            if(message.data.startsWith('ERROR'))
                return

            const splitmsg = message.data.split(' ')

            console.log(message.data)
            const match = splitmsg[0].match(/:(.*)!/)
            if(!match)
                return

            const nick = match[1]

            //const username = splitmsg[0].match(/!(.*)@/)[1]
            const command = splitmsg[1]

            this.#listeners.forEach(({event,fn}) => {
                if(command === event.toUpperCase()){
                    fn({
                        nick,
                        args: splitmsg.splice(2)
                    })
                }
            })
        })

    }

    joinChannel(channel,fn){
        this.send(`JOIN ${channel}`)
        const id = this.onMessage(channel,fn)

        return () => {
            this.leaveChannel(channel)
            this.off(id)
        }
    }

    leaveChannel(channel){
        this.send(`PART ${channel}`)
    }

    sendMessage(channel,message){
        this.send(`PRIVMSG ${channel} ${message}`)
    }

    on(event,fn){

        const id = this.#counter++
        this.#listeners.set(id,{
            event,
            fn
        })

        return id
    }

    off(id){
        this.#listeners.delete(id)
    }

    onJoin(fn){
        return this.on('join',fn)
    }

    onPart(fn){
        return this.on('part',fn)
    }

    onMessage(channel,fn){
        return this.on('privmsg',({nick,args}) => {
            if(args[0] === channel){
                fn({
                    nick,
                    content:args.splice(1).join(' ').substring(1)
                })
            }
        })
    }

    listChannels(fn){
        let channels = []

        const callback = message => {
            const splitmsg = message.data.split(' ')

            if(splitmsg[0] !== `:${this.#hostname}`)
                return

            
            switch(parseInt(splitmsg[1])){
                case 321:
                    break;
                case 322:
                    console.log("list",splitmsg[1])
                    channels.push({
                        name: splitmsg[3],
                        description: splitmsg.splice(6).join(' ')
                    })

                    break;
                case 323:
                    this.socket.removeEventListener('message',callback)
                    fn(channels)
                    break;
                default:
                    break;
            }
        }

        this.send('LIST')
        this.socket.addEventListener('message',callback)
    }

    send(msg){
        if(this.isConnected() && this.#ready){
            this.socket.send(msg)
            return
        }

        this.#pending.push(msg)
    }

    quit(){
        this.socket.send('QUIT')
        this.socket.close()
    }

    isConnected(){
        return this.socket.readyState === this.socket.OPEN
    }

}


export default IrcClient