import {Routes, Route} from 'react-router-dom';
import { useEffect } from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Header from './components/nav/Header';
import RegisterComplete from './pages/auth/RegisterComplete';
import ForgotPassword from './pages/auth/ForgotPassword';
import 'antd/dist/reset.css';

import { auth } from './firebase';
import {useDispatch} from 'react-redux';

const App = () => {
  const dispatch = useDispatch();

  // check firebase auth state
  useEffect(()=> {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if(user){
        const idTokenResult = await user.getIdTokenResult();
        console.log("user", user);
        dispatch({
          type: "LOGGD_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
      }
    });

    // cleanup
    return () => unsubscribe();
  }, []);

  return (
    <>
    <Header/>
    <ToastContainer/>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/register" element={<Register/>} />
        <Route exact path="/register/complete" element={<RegisterComplete/>} />
        <Route exact path="/forgot/password" element={<ForgotPassword/>}/>
      </Routes>
    </>
  );
};

export default App;
