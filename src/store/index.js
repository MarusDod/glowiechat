import { configureStore, createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'nick',
    initialState: {
        value: null,
    },
    reducers: {
        setNick: (state,{payload}) => {state.value = payload},
    }
})

const passSlice = createSlice({
    name: 'pass',
    initialState: {
        value: null,
    },
    reducers: {
        setPass: (state,{payload}) => {state.value = payload},
    }
})

const serverSlice = createSlice({
    name: 'server',
    initialState: {
        value: null,
    },
    reducers: {
        setServer: (state,{payload}) => {state.value = payload},
    }
})

const currentChannelSlice = createSlice({
    name: 'currentChannel',
    initialState: {
        value: null,
    },
    reducers: {
        setCurrentChannel: (state,{payload}) => {state.value = payload},
    }
})

const channelsSlice = createSlice({
    name: 'channels',
    initialState: {
        value: [],
    },
    reducers: {
        setChannels: (state,{payload}) => {state.value = payload},
        addChannel: (state,{payload}) => {
            if(state.value.find(c => c.name === payload.name))
                return
            state.value.push(payload)
        },
        removeChannel: (state,{payload}) => ({value: state.value.filter(c => c.name !== payload.name)}),
    }
})

export function saveToLocalStorage(state){
    localStorage.setItem('persistenceState',JSON.stringify(state))
}

export function loadLocalStorage(){
    return JSON.parse(localStorage.getItem('persistenceState'))
}

export const {setNick,setServer,setPass,setCurrentChannel,addChannel,removeChannel,setChannels} = {...userSlice.actions,...currentChannelSlice.actions,...channelsSlice.actions,...serverSlice.actions,...passSlice.actions}

const store = configureStore({
    reducer: {
        nick: userSlice.reducer,
        pass: passSlice.reducer,
        server: serverSlice.reducer,
        currentChannel: currentChannelSlice.reducer,
        channels: channelsSlice.reducer
    },
    preloadedState: loadLocalStorage() ?? {}
})

export default store