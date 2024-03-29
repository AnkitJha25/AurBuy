import React, {useState, useEffect} from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');

    const {user} = useSelector((state) => ({...state}));

    useEffect(() => {
        if(user && user.token){
            navigate("/");
        } 
    }, [user]);

    const handleSubmit = async(e) => {
        e.preventDefault(); // just to prevent the browser from getting reloaded
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true
        };
        await auth.sendSignInLinkToEmail(email, config);
        toast.success(
            `Email is sent to ${email}. Click the link to complete the registration.`
        );
        // save user email in local storage
        window.localStorage.setItem("emailForRegistration", email);
        // clear state
        setEmail("");
    };

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <input 
            type='email' 
            className='form-control' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            autoFocus
        />
        <br/>
        <button type="submit" className='btn btn-raised'>
            Register
        </button>
        </form>
    );

    return (
        <div className="container p-5">
            <div className='row'> 
                <div className='col-md-6 offset-md-3'>
                    <h4>Register</h4>
                    
                    {registerForm()}
                </div>
            </div>
        </div>
    );
};

export default Register;