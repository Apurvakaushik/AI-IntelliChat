import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);

  const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats,theme, setTheme } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    const userMessage = prompt; // ✅ Save before clearing

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        threadId: currThreadId || "default-thread", // ✅ dynamic later
      }),
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);

      if (!response.ok) {
        console.log("Server error:", response.status);
        return;
      }

      const data = await response.json();

      // ✅ Add user + assistant messages immediately
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: data.reply },
      ]);

      setReply(data.reply);
      setPrompt(""); // clear input
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };
  const handleProfileClick=()=>{
    setIsOpen(!isOpen);
  }

  return (
    //<div className="chatWindow">
    <div className={`chatWindow ${theme}`}>
      <div className="navbar" onClick={() => setIsOpen(!isOpen)}>
      {/* <div className="userIconDiv" onClick={handleProfileClick}> */}

        <span>
          ChatBot <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {
        isOpen &&(
        <div className="dropDown">
          
          <div className="dropDownItem" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
  {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
</div>

          <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i>upgrade</div>
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i>setting</div>
          <div className="dropDownItem"><i className="fa-solid fa-right-from-bracket"></i>Log Out</div>
          
        </div>
         ) }

      {/* Chat Messages */}
      <Chat />

      {/* Loading Spinner */}
      <ScaleLoader color="#fff" loading={loading} />

      {/* Input Section */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()} // ✅ Enter to send
          />
          <div id="Submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGpt can make mistakes. Check important info, see cookies
          preference.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
