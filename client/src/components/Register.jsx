import React, { useState, useContext } from 'react';
import "./Register.css";
import UserContext from '../context/UserContext';

const Register = () => {
    const { userRegister } = useContext(UserContext);

    const [inputData, setInputData] = useState({ username: "", password: "" });
    const [confirmpassword, setconfirmpassword] = useState({
        confirmPassword: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !inputData.username ||
            !inputData.password ||
            !confirmpassword.confirmPassword
        ) {
            window.alert("please provide all the fields");
            return;
        }

        if (confirmpassword.confirmPassword !== inputData.password) {
            window.alert("Password does not match")
            return;
        } else {
            userRegister(inputData);
        }
    }
    return (
        <>
            <div className="container">
                <div className="register">
                    <div>
                        <h2>Register</h2>
                    </div>
                    <form onSubmit={handleSubmit} className='form'>
                        <div>
                            <input type="text" required={true} placeholder="Username" onChange={(e) => { setInputData({ ...inputData, username: e.target.value }) }} />
                        </div>
                        <div>
                            <input type="password" required={true} placeholder="Password" onChange={(e) => { setInputData({ ...inputData, password: e.target.value }) }} />
                        </div>
                        <div>
                            <input type="password" required={true} placeholder="Confirm Password" onChange={(e) => { setconfirmpassword({ ...confirmpassword, confirmPassword: e.target.value }) }} />
                        </div>
                        <div className='btnDiv'>
                            <button className='registerBtn' type='submit'>Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register