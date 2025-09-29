


import { createContext, useState } from "react";

// 1️⃣ Create Context
export const MyContext = createContext({
  prompt: '',
  setPrompt: () => {},
  reply: '',
  prevChats: [],
  setPrevChats: () => {},
  newChat: false,
  setNewChat: () => {},
  allThreads: [],
  setAllThreads: () => {},
  theme: 'light',
  setTheme: () => {},
});

// 2️⃣ Create MyProvider component
export const MyProvider = ({ children }) => {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(false);
  const [allThreads, setAllThreads] = useState([]);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <MyContext.Provider
      value={{
        prompt,
        setPrompt,
        reply,
        setReply,
        prevChats,
        setPrevChats,
        newChat,
        setNewChat,
        allThreads,
        setAllThreads,
        theme,
        setTheme: toggleTheme,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};




