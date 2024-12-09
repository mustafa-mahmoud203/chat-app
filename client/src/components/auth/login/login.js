import React, { useState, useContext } from 'react';
import UserContext from '../../../UserContext';
import { Navigate } from 'react-router-dom';  // استيراد Navigate بدلاً من Redirect

const Login = () => {
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        console.log(email, password);
        try {
            const res = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                // credentials: 'include',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('res ', res);

            const data = await res.json();
            console.log(data);
            if (data.errors) {
                setEmailError(data.errors.email);
                setPasswordError(data.errors.password);
            }
            if (data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <div className="row valign-wrapper" style={{ minHeight: '100vh' }}>
            <div className="col s12 m6 offset-m3">
                <div className="card z-depth-3">
                    <div className="card-content">
                        <span className="card-title center-align">Login</span>
                        <form onSubmit={submitHandler}>
                            <div className="input-field">
                                <input
                                    id="email"
                                    type="email"
                                    className="validate"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="red-text">{emailError}</div>
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input
                                    id="password"
                                    type="password"
                                    className="validate"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="red-text">{passwordError}</div>
                                <label htmlFor="password">Password</label>
                            </div>

                            <div className="center-align">
                                <button className="btn waves-effect waves-light" type="submit">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
