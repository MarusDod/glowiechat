class IrcClient {
    #hostname
    #ready
    #pending

    constructor({server,nickname,username = nickname,pass=""}) {
        this.#ready = false
        this.#pending = []
        this.#hostname = new URL(`wss://${server}`).hostname

        const socket = new WebSocket(`wss://${server}`)
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

        })
    }

    static connect({nick,user = nick,pass = "",server}){
        return new Promise((resolve,reject) => {
            const socket = new WebSocket(`wss://${server}`)

            const hostname = new URL('ws://' + server).hostname

            socket.onopen = () => {
                console.log("connected")

                if(pass)
                    socket.send(`PASS ${pass}`)

                socket.send(`USER ${user} 0 * :${user}`)
                socket.send(`NICK ${nick}`)
            }

            socket.onmessage = message => {
                console.log(message.data)

                if(message.data.startsWith('PING')){
                    const cookie = message.data.split(' ')[1]
                    const reply = `PONG ${cookie}`
                    socket.send(reply)
                    return
                }

                const splitmsg = message.data.split(' ')

                if(splitmsg[0] !== `:${hostname}`)
                    return

                const code = splitmsg[1]

                switch(code){
                    case "433":
                        socket.close()
                        reject("nickname already in use")
                        break;
                    case "001":
                        socket.close()
                        const welcome = splitmsg.slice(3,splitmsg.length-1).join(' ').slice(1)
                        resolve(welcome)
                        break;
                    default:
                        break;
                }
            }

            socket.onerror = err => {
                console.error(err)
                reject("failed to connect to server")
            }

            socket.onclose = () => console.log("closed")
        })
    }

    joinChannel(channel){
        this.send(`JOIN ${channel}`)
        //return this.onMessage(channel,fn)
    }

    leaveChannel(channel){
        this.send(`PART ${channel}`)
    }

    sendMessage(channel,message){
        this.send(`PRIVMSG ${channel} ${message}`)
    }

    onUser(event,fn){
        const callback = message => {
            const splitmsg = message.data.split(' ')

            console.log(message.data)
            const match = splitmsg[0].match(/:(.*)!/)
            if(!match)
                return

            const nick = match[1]

            //const username = splitmsg[0].match(/!(.*)@/)[1]
            const command = splitmsg[1]

            if(command.toUpperCase() === event.toUpperCase())
                fn(nick,splitmsg.slice(2))
        }
        this.socket.addEventListener('message',callback)

        return () => this.socket.removeEventListener('message',callback)
    }

    onJoin(channel,fn){
        return this.onUser('join',(nick,args) => {
            if(args[0].startsWith(':'))
                args[0] = args[0].substring(1)

            if(args[0] === channel){
                fn({
                    nick,
                    type: 'join',
                    timestamp: new Date().getTime(),
                    content: ""
                })
            }
        })
    }

    onPart(channel,fn){
        return this.onUser('part',(nick,args) => {
            if(args[0] === channel){
                fn({
                    nick,
                    type: 'part',
                    timestamp: new Date().getTime(),
                    content: ""
                })
            }
        })
    }

    onMessage(channel,fn){

        const d1 = this.onUser('privmsg',(nick,args) => {
            if(args[0] === channel){
                fn({
                    nick,
                    type: 'message',
                    content:args.slice(1).join(' ').substring(1),
                    timestamp: new Date().getTime()
                })
            }
        })

        const d2 = this.onJoin(channel,fn)
        const d3 = this.onPart(channel,fn)

        return () => {
            d1()
            d2()
            d3()
        }
    }

    callCommand(command,initialState,fn){
        const quit = () => this.socket.removeEventListener('message',callback)

        const callback = message => {
            const splitmsg = message.data.split(' ')

            if(splitmsg[0] !== `:${this.#hostname}`)
                return

            const code = splitmsg[1]

            fn(initialState,{code,args: splitmsg.splice(2)},quit)
        }



        this.send(command)
        this.socket.addEventListener('message',callback)
    }

    listChannels(fn){
        this.callCommand('LIST',[],(channels,{code,args},quit) => {
            switch(parseInt(code)){
                case 321:
                    break;
                case 322:
                    channels.push({
                        name: args[1],
                        members: parseInt(args[2]),
                        description: args.splice(4).join(' ')
                    })

                    break;
                case 323:
                    fn(channels)
                    quit()
                    break;
                default:
                    break;
            }
        })
    }

    listMembers(channel,fn){
        this.callCommand(`names ${channel}`,{},(state,{code,args},quit) => {
            switch(code){
                case '353':
                    const names = args.slice(3).join(' ').substring(1).split(' ')
                    fn(names)
                    break;
                case '366':
                    quit()
                    break;
            }
        })
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