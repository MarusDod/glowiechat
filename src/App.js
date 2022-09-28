import './App.css';
import {HashRouter, Route, Routes} from 'react-router-dom'
import Dashboard from './Dashboard';
import Login from './Login';
import store, { loadLocalStorage, saveToLocalStorage } from './store'
import {throttle} from 'lodash'
import {Provider as ReduxProvider} from 'react-redux'

function App() {

  store.subscribe(throttle(() => {
    saveToLocalStorage(store.getState())
  }))

  return (
    <ReduxProvider store={store}>
      <div className="App">
        <HashRouter basename="/">
          <Routes>
            <Route path={"/"} element={<Login />} />
            <Route path={"/client"} element={<Dashboard />} />
          </Routes>
        </HashRouter>
      </div>
    </ReduxProvider>
  );
}

export default App;
