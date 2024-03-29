import React, {useState, useEffect, createRef} from 'react';
import { auth, googleAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';
import {Button} from 'antd';
import { MailOutlined , GoogleOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom'
import { createOrUpdateUser } from '../../functions/auth';
import { async } from '@firebase/util';

const Login = () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const {user} = useSelector((state) => ({...state}));
    //const idTokenResult = user.getIdTokenResult();

    // createOrUpdateUser(idTokenResult.token).then((res) => console.log("CREATE OR UPDATE RES", res))
    // .catch();

    // useEffect(() => {
    //     if(user && user.token){
    //         navigate("/");
    //     } 
    // }, [user]);
    let dispatch = useDispatch();

    const roleBasedRedirect = (res) => {
        if(res.data.role === 'admin'){
            navigate("/admin/dashboard");
        }
        else{
            navigate("/user/history");
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault(); // just to prevent the browser from getting reloaded
        setLoading(true);
        //console.table(email,password);
        try{
            const result = await auth.signInWithEmailAndPassword(email, password);
            //console.log(result);
            const {user} = result
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token)
            .then((res) => {
                dispatch({
                    type: "LOGGED_IN_USER",
                    payload: {
                        name: res.data.name,
                        email : res.data.email,
                        token: idTokenResult.token,
                        role: res.data.role,
                        _id: res.data._id,
                    },
                });
                roleBasedRedirect(res);
            })
            .catch(err => console.log(err));

            //navigate('/');
        }catch(error){
            console.log(error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    const googleLogin = async () => {
        auth.signInWithPopup(googleAuthProvider).then(async(result) => {
            const {user} = result
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token)
            .then((res) => {
                dispatch({
                    type: "LOGGED_IN_USER",
                    payload: {
                        name: res.data.name,
                        email : res.data.email,
                        token: idTokenResult.token,
                        role: res.data.role,
                        _id: res.data._id,
                    },
                });
                roleBasedRedirect(res);
            })
            .catch(err => console.log(err));
            //navigate('/');
        })
        .catch((err) => {
            console.log(err);
            toast.error(err.message);
        });
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <input 
                type='email' 
                className='form-control' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                autoFocus
            />
            </div>
            <div className='form-group'>
                <input 
                type='password' 
                className='form-control' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Password"
                />
            </div>
        <br/>
        <Button onClick={handleSubmit}
            type = "primary"
            className='mb-3'
            block
            shape="round"
            icon={<MailOutlined/>}
            size="large"
            disabled={!email || password.length < 6}
        >Login with Email/Password</Button>
        </form>
    );

    return (
        <div className="container p-5">
            <div className='row'> 
                <div className='col-md-6 offset-md-3'>
                    {loading ? (<h4 className='text-danger'>Loading....</h4>) : (<h4>Login</h4>)}
                    {loginForm()}

                    <Button onClick={googleLogin}
                        type = "danger"
                        className='mb-3'
                        block
                        shape="round"
                        icon={<GoogleOutlined/>}
                        size="large"
                    >Login with Google</Button>

                    <Link to="/forgot/password" className='float-right text-danger'>Forgot Password</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;