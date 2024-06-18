import './App.css'
import Chat from "./container/Chat/Chat";
import {useEffect} from "react";

const App = () => {
    useEffect(() => {
        document.body.style.backgroundColor = '#ccc';
    }, []);
    return (
        <>
            <Chat/>
        </>
    );
};

export default App
