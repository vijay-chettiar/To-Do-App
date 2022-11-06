import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './components/Login';
import Register from './components/Register';
import { UserContextProvider } from './context/UserContext';
import Home from './components/Home';

function App() {
  return (
    <>
    <BrowserRouter>
    <UserContextProvider>
      <Routes>

        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />

        {/* <Route path='/' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/> */}
        {/* <Route path='/' element={<Home/>} /> */}
      </Routes>
    </UserContextProvider>
    </BrowserRouter>
    {/* <Register /> */}
    {/* <Login /> */}
    </>
  );
}

export default App;
