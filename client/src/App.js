import TextEditor from "./TextEditor";
import "./index.css";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom"
import {v4 as uuidV4} from "uuid"
import Login from "./components/Login";
import Signup from "./components/signup";
import Home from "./components/home";

function App() {
    return (
        <Router basename="/">
            <Routes>
                {/*<Route path="/" exact element={<Navigate to={`/documents/${uuidV4()}`}/>} />*/}
                {/*<Route path="/documents/:id" element={<TextEditor/>}/>*/}
                <Route path="/" exact element={<Navigate to={`/login`}/>}/>
                <Route path="/doc/edit/:DOCID" element={<TextEditor/>}/>
                <Route path="/login" exact element={<Login/>}/>
                <Route path="/signup" exact element={<Signup/>}/>
                <Route path="/home" exact element={<Home/>}/>
            </Routes>
        </Router>
    )
}

export default App
