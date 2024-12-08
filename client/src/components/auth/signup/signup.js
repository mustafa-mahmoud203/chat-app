import React, { useState } from 'react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImg, setProfileImg] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        // Validate the form before submitting
        // if (password !== confirmPassword) {
        //     setConfirmPasswordError("Passwords do not match");
        //     return;
        // }
        // if (password.length < 6) {
        //     setPasswordError("Password must be at least 6 characters");
        //     return;
        // }

        try {
            const res = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, confirmPassword, phone }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={submitHandler} className="signup-form">
                <div className="input-field">
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label htmlFor="name">Name</label>
                    {nameError && <div className="error-text">{nameError}</div>}
                </div>

                <div className="input-field">
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email">Email</label>
                    {emailError && <div className="error-text">{emailError}</div>}
                </div>

                <div className="input-field">
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <label htmlFor="password">Password</label>
                    {passwordError && <div className="error-text">{passwordError}</div>}
                </div>

                <div className="input-field">
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    {confirmPasswordError && <div className="error-text">{confirmPasswordError}</div>}
                </div>

                <div className="input-field">
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <label htmlFor="phone">Phone (Optional)</label>
                </div>

                {/* <div className="input-field">
                    <input
                        id="profileImg"
                        type="url"
                        value={profileImg}
                        onChange={(e) => setProfileImg(e.target.value)}
                    />
                    <label htmlFor="profileImg">Profile Image URL (Optional)</label>
                </div> */}

                <button className="btn waves-effect waves-light">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
