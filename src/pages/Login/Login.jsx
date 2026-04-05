import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import ClipLoader from "react-spinners/ClipLoader";
import { BsExclamationTriangleFill } from 'react-icons/bs';

import shape1 from '../../assets/images/shape1.svg';
import shape2 from '../../assets/images/shape2.svg';
import shape3 from '../../assets/images/shape3.svg';
import loginImage from '../../assets/images/login.png';
import logo from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google.svg';

const BackgroundShapes = React.memo(() => (
    <div className="absolute inset-0 z-0">
        <img src={shape1} alt="" className="absolute top-0 left-0 opacity-50 -translate-x-1/3 -translate-y-1/3" />
        <img src={shape2} alt="" className="absolute bottom-0 left-0 opacity-50 translate-x-1/3 translate-y-1/3" />
        <img src={shape3} alt="" className="absolute top-0 right-0 opacity-50 translate-x-1/3 -translate-y-1/3" />
    </div>
));

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null); // Tracks the backend error msg
    const navigate = useNavigate();
    const { loginAction } = useAuth();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
        
        // Hide the error alert box as soon as the user starts typing again
        if (loginError) setLoginError(null); 
    }, [loginError]);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email);
    const isPasswordValid = credentials.password.length >= 6; 
    const isFormValid = isEmailValid && isPasswordValid;

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        setLoginError(null); // Reset before new attempt

        try {
            const userData = await loginAction(credentials);
            await Swal.fire({
                toast: true, position: 'top-end', icon: 'success',
                title: `Welcome back, ${userData.firstName}!`,
                showConfirmButton: false, timer: 2000, timerProgressBar: true,
            });
            navigate('/feed');
        } catch (err) {
            // Set the specific message from the backend to show in the UI
            setLoginError(err.message);
        } finally {
            setLoading(false);
        }
    }, [credentials, loginAction, navigate, isFormValid]);

    return (
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
            <div className="px-6 py-10 bg-white rounded-xl shadow-2xl md:px-10">
                <img src={logo} alt="Logo" className="mb-7" />
                
                {/* ── ATTENTION ALERT BOX ── */}
                {loginError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <BsExclamationTriangleFill className="text-red-500 mt-0.5 shrink-0" size={18} />
                        <div>
                            <h5 className="font-bold text-red-800 text-[15px]">Attention</h5>
                            <p className="text-red-700 text-sm mt-1">{loginError}</p>
                        </div>
                    </div>
                )}

                <p className="mb-2 text-gray-500">Welcome back</p>
                <h4 className="mb-10 text-4xl font-bold text-gray-800">Login to your account</h4>
                
                <button type="button" className="flex items-center justify-center w-full py-3 mb-8 font-semibold text-gray-600 transition duration-300 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                    <img src={googleIcon} alt="Google" className="mr-3" />
                    <span>Or sign-in with google</span>
                </button>
                <div className="flex items-center mb-8"><hr className="flex-grow" /><span className="mx-4 text-gray-400">Or</span><hr className="flex-grow" /></div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Email address</label>
                        <input type="email" name="email" value={credentials.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-gray-700">Password</label>
                        <input type="password" name="password" value={credentials.password} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between mb-8">
                        <div className="flex items-center">
                            <input type="checkbox" id="rememberMe" className="w-4 h-4 text-blue-600" defaultChecked />
                            <label htmlFor="rememberMe" className="ml-2 text-gray-600">Remember me</label>
                        </div>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                    </div>
                    <button type="submit" disabled={loading || !isFormValid} className={`flex items-center justify-center w-full py-3 mb-12 text-lg font-bold text-white transition duration-300 rounded-lg ${(!isFormValid || loading) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {loading ? <ClipLoader color="#ffffff" size={24} /> : 'Login'}
                    </button>
                </form>
                <p className="text-center text-gray-600">Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create New Account</Link></p>
            </div>
        </div>
    );
};

const Login = () => {
    return (
        <section className="relative min-h-screen bg-[#F3F5F9] flex items-center justify-center p-4 overflow-hidden">
            <BackgroundShapes />
            <div className="container relative z-10 w-full max-w-6xl">
                <div className="grid items-center grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="hidden lg:block">
                        <img src={loginImage} alt="Login" className="w-full h-auto" />
                    </div>
                    <LoginForm />
                </div>
            </div>
        </section>
    );
};
export default Login;