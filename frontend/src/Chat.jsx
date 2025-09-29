import "./Chat.css";
//import { useContext, useRef, useEffect,useState } from "react";
import { useContext, useEffect,useState } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighLight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats,reply } = useContext(MyContext);
  //const [latestReply,setLatestReply]=useState(null);
  //const [latestReply, setLatestReply] = useState(null);
  //const chatEndRef = useRef(null);

  // Auto-scroll when new message is added
    // useEffect(() => {
    //   if(reply=== null){
    //     setLatestReply(reply);
    //   }
    
    // }, [reply]);

  //   useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //  }, [prevChats]);

  return (
    <>
      {newChat && <h1>Start a New Chat!</h1>}

      <div className="Chats">
        {prevChats && Array.isArray(prevChats) && prevChats.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighLight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {/*  keeps scroll at bottom */}
        {/* <div ref={chatEndRef} /> */}
      </div>
    </>
  );
}

export default Chat;
