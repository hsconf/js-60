import React from "react";
import './ChatItem.css'

interface Props {
    message: string;
    author: string;
    datetime: string;
}

const ChatItem: React.FC<Props> = ({message, author, datetime}) => {
    const date = new Date(datetime);
    const formattedDate = `Date: ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} Time: ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    return (
        <div className="chat-item">
            <div className="info">
                <span className="author">{author}</span>
                <span className="datetime">{formattedDate}</span>
            </div>
                <p className="message">{message}</p>
        </div>
    );
};

export default ChatItem;