import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Withnavbar from './layouts/WithNavbar';
import PublicRoute from './components/routeHelper/PublicRoute'
import HomePage from './pages/HomePage';

import setAuthToken from './utils/setAuthToken'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setHomeSetting, setUser, setWidgetbotIndex } from './store/appSlice';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import ChatBot from './components/ChatBot';
import PrivateRoute from './components/routeHelper/PrivateRoute';
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  const dispatch = useDispatch()
  const loading = useSelector(state => state.app.loading)
  useEffect(() => {
    (async function () {
      if (localStorage.token) {
        try {
          const { data: user } = await axios.get(process.env.REACT_APP_API_URL + '/api/auth/me')
          dispatch(setUser(user))
        } catch (err) {
          setAuthToken(null)
        }
      }
    })()
  }, [])

  return (
    <>
      <Router>
        <Toaster position='top-center' reverseOrder={false} />
        <Routes>
          <Route path='/' element={<Withnavbar />}>
            <Route exact path='/' element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route exact path='/login' element={<PublicRoute><LoginPage /></PublicRoute>}/>
          </Route>
        </Routes>
      </Router>
      {loading &&
        <div className='fixed inset-0 z-50' style={{ backdropFilter: 'blur(5px)' }}>
          <div className='flex w-full h-full justify-center items-center'>
            <div
              className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-orange-700 motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default App;
