import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    // const [error, setError] = useState(false);

    useEffect(() => {
        verifyUserLogin();
        // eslint-disable-next-line
    }, []);

    const userLogin = async (data) => {
        try {
            fetch("http://localhost:8080/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.error) {
                        localStorage.setItem("token", data.token);
                        setUser(data.user);
                        navigate("/", { replace: true });
                    } else {
                        window.alert("Enter correct mail or password");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            // navigate("/", { replace: true });
        } catch (error) {
            // window.alert("Enter correct mail or password");
            console.log(error);
        }
    };

    const userRegister = async (data) => {
        try {
            fetch("http://localhost:8080/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Success:", data);
                    if (!data.error) {
                        navigate("/login", { replace: true });
                    }
                    else {
                        window.alert("Email Already exists")
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } catch (error) {
            console.log(error);
            // setError
        }
    };

    const verifyUserLogin = async () => {
        try {
            const res = await fetch("http://localhost:8080/user/check", {
                method: "GET",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            const result = await res.json();
            if (!result.error) {
                if (
                    location.pathname === "/login" ||
                    location.pathname === "/register"
                ) {
                    setTimeout(() => {
                        navigate("/", { replace: true });
                    }, 100);
                } else {
                    navigate(location.pathname ? location.pathname : "/");
                }
                setUser(result);
            } else {
                navigate("/login", { replace: true });
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, userLogin, userRegister }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
