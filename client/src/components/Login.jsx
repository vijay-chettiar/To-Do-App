import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

const Login = () => {
    const { userLogin } = useContext(UserContext);

    const [login, setLogin] = useState({ username: "", password: "" });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!login.username || !login.password) {
            window.alert("Please provide all the required fields");
            return;
        }
        userLogin(login);
    };

    return (
        <>
            <div className="container">
                <div className="register">
                    <div>
                        <h2>Login</h2>
                    </div>
                    <form onSubmit={handleSubmit} className='form'>
                        <div>
                            <input  type="text" required={true} placeholder="Username" onChange={(e) => { setLogin({ ...login, username: e.target.value }) }} />
                        </div>
                        <div>
                            <input type="password" required={true} placeholder="Password" onChange={(e) => { setLogin({ ...login, password: e.target.value }) }} />
                        </div>
                        <div className='btnDiv'>
                            <button className='registerBtn' type='submit'>Login</button>
                        </div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Link style={{
                                        textDecoration: "none",
                                        color: "#7D8CC4",
                                        fontSize: "16px",
                                    }} to={"/register"}>Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login