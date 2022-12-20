import { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Start from './pages/Start';
import NotFound from './pages/NotFound';
import './globals.scss';
import Registration from './pages/Registration';
import Recovery from './pages/Recovery';
function App() {
  
  const navigate = useNavigate();
  const currentLocation = useLocation().pathname;

  const tokenMissingHandler = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  useEffect(()=>{
    if (currentLocation !== "/login"){
      !localStorage.getItem("token") && tokenMissingHandler()
    }
  }, [currentLocation])

  return (
    <div className={'light-theme'}>
      <Routes>
        <Route path='/' element={<Navigate to='/start'/>}/>
        <Route path='/start' element={<Start />}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path='/registration/:name' element={<Registration/>}/>
        <Route path='/recovery' element={<Recovery/>}/>
        <Route path='/recovery/:name' element={<Recovery/>}/>
        <Route path='/notfound' element={<NotFound/>} />
        <Route path='*' element={<Navigate to="/notfound"/>}/>
      </Routes>
    </div>
  );
}

export default App;


