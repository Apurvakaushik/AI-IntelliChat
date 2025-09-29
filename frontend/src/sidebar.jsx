import"./sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";
//import { useContext, useEffect } from "react";
function Sidebar(){
  const {allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats}=useContext(MyContext);

  const getAllThreads=async()=>{
    try{
     const response=await fetch("http://localhost:8080/api/Thread");
     const res=await response.json();
     const filteredData=res.map(thread=>({threadId:thread.threadId,title: thread.title }));
     console.log(filteredData);
     setAllThreads(filteredData);
     
     //setAllThreads(res);

    }catch(err){
      console.log(err);

    }

  };
 


  useEffect(()=>{
    getAllThreads();
  },[currThreadId])
  const createNewChat=()=>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  }

  // 
  const changeThread = async (newThreadId) => {
  setCurrThreadId(newThreadId);
  setNewChat(false);
  setReply(null);

    try{
      // const response=await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
      // const res=await response .json();
      // console.log(res);
      // setPrevChats(res);
      // setNewChat(false);
      // setReply(null);
      const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
    const res = await response.json();
    console.log("Thread data:", res);

    
    // Update prevChats using the correct key from API
if (Array.isArray(res.messages)) {   // <-- replace 'messages' with the actual key from your backend
  setPrevChats(res.messages);
} else {
  setPrevChats([]);
}



    }catch(err){
      console.log(err);
      setPrevChats([]);

    }

  }

  const deleteThread=async(threadId)=>{
    try{
      const response=await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"DELETE"});
      const res = await response.json();
      console.log(res);
      //updatedthreads re-enter
      setAllThreads(prev=> prev.filter(thread=>thread.threadId !== threadId));

      if(threadId=== currThreadId){
        createNewChat();
      }
    }catch(err){
      console.log(err);
    }
  }

//   //try this
//   const deleteThread = async (threadId) => {
//   try {
//     const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
//       method: "DELETE",
//     });

//     if (response.ok) {
//       // Remove deleted thread from allThreads
//       setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

//       // If deleted thread is currently open, reset chat
//       if (currThreadId === threadId) {
//         setPrevChats([]);
//         setNewChat(true);
//         setCurrThreadId(uuidv1());
//         setPrompt("");
//         setReply(null);
//       }
//     } else {
//       console.log("Failed to delete thread");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
//try

  
    return(
        <section className="sidebar">
          <button onClick={createNewChat}>
            <img src="src/assets/download.png" alt="gpt logo"className="logo" ></img>
           <span> <i className="fa-solid fa-pen-to-square"></i></span>
          </button>
          {/* chat history */ }
          <ul className="history">
           {
            allThreads?.map((thread,idx)=>(
              <li key={idx}
              onClick={()=>changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted":" "}
              >{thread.title}
              <i className="fa-solid fa-trash"
              onClick={(e)=>{
              e.stopPropagation();//stop even bubbling
               deleteThread(thread.threadId);
              }}
              ></i>
                
       
        </li>
     

            ))
};
        </ul> 
         {/* signs*/}
         < div className="sign">
         <p>By Apurva kaushik &hearts;</p>
         </div>

        </section>
)
}
export default Sidebar;