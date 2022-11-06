import React, { useState, useEffect, useContext } from 'react';
import "./Home.css";
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Home = () => {
    const [todoData, setTodoData] = useState([]);
    const [start, setStart] = useState(false);
    const [pause, setPause] = useState(false);
    const [end, setEnd] = useState(false);
    const [startTime, setStartTime] = useState(0)
    const [totalTime, setTotalTime] = useState(null);
    const [ongoing, setOngoing] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [activity, setActivity] = useState({ activity: "" });

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();
    useEffect(() => {
        !user && navigate("/login", { replace: true });
    }, []);

    const { user } = useContext(UserContext);
    useEffect(() => {
        fetch("http://localhost:8080/todo", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((res) => setTodoData(res))
            .catch((err) => console.log(err));
    }, []);



    const handleStart = (e,id) => {
        console.log(id);
        var current = new Date();
        let timer = 3600 * current.getHours() + 60 * current.getMinutes() + current.getSeconds();
        console.log(timer)
        setStartTime(timer);
        setStart(true);
        setOngoing(true);
    }

    const handlePause = () => {
        var currentTime = new Date();
        let timer3 = 3600 * currentTime.getHours() + 60 * currentTime.getMinutes() + currentTime.getSeconds();
        console.log(timer3)
        let coveredtime = elapsed + timer3 - startTime
        setElapsed(coveredtime);
        setPause(true)
    }
    const handleResume = () => {
        var resumeTime = new Date();
        let timer4 = 3600 * resumeTime.getHours() + 60 * resumeTime.getMinutes() + resumeTime.getSeconds();
        console.log(timer4)
        setStartTime(timer4);
        setPause(false)
    }

    const handleEnd = () => {
        var current2 = new Date()
        let timer2 = 3600 * current2.getHours() + 60 * current2.getMinutes() + current2.getSeconds();
        console.log(timer2);
        console.log(elapsed)
        let allTime = timer2 - startTime + elapsed;
        var time;
        let hr = Math.floor((allTime) / 3600);
        let min = Math.floor((allTime - (hr * 3600)) / 60);
        let sec = (allTime - (hr * 3600) - (min * 60))
        // console.log(hr, min, sec)
        if (hr === 0) {
            if (min < 10) {
                if (sec < 10) {
                    time = `0${min}:0${sec}`
                } else {
                    time = `0${min}:${sec}`
                }
            }
            else {
                if (sec < 10) {
                    time = `${min}:0${sec}`
                } else {
                    time = `${min}:${sec}`
                }
            }
        } else {
            if (hr < 10) {
                if (min < 10) {
                    if (sec < 10) {
                        time = `0${hr}:0${min}:0${sec}`
                    } else {
                        time = `0${hr}:0${min}:${sec}`
                    }
                }
                else {
                    if (sec < 10) {
                        time = `0${hr}:${min}:0${sec}`
                    } else {
                        time = `0${hr}:${min}:${sec}`
                    }
                }
            } else {
                if (min < 10) {
                    if (sec < 10) {
                        time = `${hr}:0${min}:0${sec}`
                    } else {
                        time = `${hr}:0${min}:${sec}`
                    }
                }
                else {
                    if (sec < 10) {
                        time = `${hr}:${min}:0${sec}`
                    } else {
                        time = `${hr}:${min}:${sec}`
                    }
                }
            }
        }
        setTotalTime(time)
        setEnd(true);
        setCompleted(true);
        setActivity({ ...activity });
    }

    const handleActivity = (e) => {
        e.preventDefault();

        fetch("http://localhost:8080/todo/addtodo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify(activity),
        })
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                setTodoData(res);
            })
            .catch((err) => console.log(err));
        setShow(false);
    }

    const handleLogout = () => {
            localStorage.clear();
            navigate("/login", { replace: true });
    }

    return (
        <>
            <div className='mainBox'>
                <div className="head">
                    <div className="name">
                        <h2>{user ? user.username : "Welcome"}</h2>
                    </div>
                </div>
                <div className="bottom">
                    <div className="sidebar">
                        <div className="upper">
                            <div className="title">
                                To do list
                            </div>
                            <div className="history">
                                History
                            </div>
                        </div>
                        <div className="logout" onClick={handleLogout}>
                            Logout
                        </div>
                    </div>
                    <div className="innercontent">
                        <div className="addActivity">
                            {/* <button className='activityBtn'>Add Activity</button> */}
                            <Button className='activityBtn' variant="primary" onClick={handleShow}>
                                Add Activity
                            </Button>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Activity</th>
                                    <th>Status</th>
                                    <th>Time Taken</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    todoData.map((ele, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{ele.activity}</td>
                                                <td>{completed ? "Completed" : ongoing ? "Ongoing" : `${ele.status}`}</td>
                                                <td>{end ? totalTime : ""}</td>
                                                <td>
                                                    {
                                                        end === true ? "" :
                                                            start === false ? <button onClick={(e)=>handleStart(e,ele._id)}>Start</button> :
                                                                <div>
                                                                    <button onClick={(e)=>handleEnd(e,ele._id)}>End</button>
                                                                    {
                                                                        pause ? <button onClick={(e)=>handleResume(e,ele._id)}>Resume</button> : <button onClick={(e)=>handlePause(e,ele._id)}>Pause</button>
                                                                    }
                                                                    {/* <button onClick={handlePause}>{pause ? "Resume" : "Pause"}</button> */}
                                                                </div>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Activity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleActivity}>
                        <div className="activityInput">
                            <input type="text" placeholder='Activity' onChange={(e) => setActivity({ ...activity, activity: e.target.value })} />
                        </div>
                        <div className="activitySubmitBtn">
                            <button type='submit' style={{ margin: "10px" }}>Save</button>
                        </div>
                    </form>
                </Modal.Body>
                
            </Modal>
        </>
    )
}

export default Home