import ChatItem from "./ChatItem";
import { useEffect, useState, useRef } from "react";
import { Message } from "../../types";
import './Chat.css';

const Chat = () => {
    const [getUrl, setGetUrl] = useState("http://146.185.154.90:8000/messages");
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [sendMessageTrigger, setSendMessageTrigger] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const fetchData = async (url: string) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages, ...data];
                    if (updatedMessages.length !== 0) {
                        const lastMessage = updatedMessages[updatedMessages.length - 1];
                        setGetUrl(`http://146.185.154.90:8000/messages?datetime=${lastMessage.datetime}`);
                    }
                    return updatedMessages;
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData(getUrl);
        intervalRef.current = setInterval(() => fetchData(getUrl), 3000);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [getUrl]);

    useEffect(() => {
        const sendMessage = async () => {
            if (!sendMessageTrigger) return;
            if (newMessage.trim() === "") {
                setSendMessageTrigger(false);
                return;
            }

            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }

            const data = new URLSearchParams();
            data.set('message', newMessage);
            data.set('author', 'User');

            try {
                const response = await fetch("http://146.185.154.90:8000/messages", {
                    method: "POST",
                    body: data
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setMessages(prevMessages => [...prevMessages, responseData]);
                    setNewMessage("");
                    setGetUrl(`http://146.185.154.90:8000/messages?datetime=${responseData.datetime}`);
                    intervalRef.current = setInterval(() => fetchData(getUrl), 3000);
                } else {
                    console.error('Error sending message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }

            setSendMessageTrigger(false);
        };

        sendMessage();
    }, [sendMessageTrigger]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSendMessageTrigger(true);
    };

    return (
        <>
            <div className="chat-container">
                {messages.slice().reverse().map(item => (
                    <ChatItem key={item.id} message={item.message} author={item.author} datetime={item.datetime}/>
                ))}
            </div>
            <div className="sendMessage">
                <form onSubmit={onSubmit}>
                    <input type="text" value={newMessage} onChange={handleChange} placeholder="Type your message here" />
                    <button type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-send-fill" viewBox="0 0 16 16">
                            <path
                                d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                        </svg>
                    </button>
                </form>
            </div>
        </>
    );
};

export default Chat;
