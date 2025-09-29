 import express from "express";
 import Thread from "../models/Thread.js";
 import getOpenAIAPIResponse from "../utils/openai.js";
 

 const router = express.Router();
// // ✅ chat route

//get all thread
router.get("/Thread",async(req,res)=>{
  //const {threadId}=req.params;
  try{
     const threads=await Thread.find({}).sort({updatedAt:-1});
     res.json(threads);

  }catch(err){
     console.error("Fetch Threads Error:", err);
    res.status(500).json({ error: "failed to fetch thread" });
  
  }
});
// get single thread by ID
router.get("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread);
  } catch (err) {
    console.error("Fetch single thread error:", err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

 router.post("/chat", async (req, res) => {
   const { threadId, message } = req.body;
   //remove later
   //const { threadId, message, provider } = req.body; // ✅ add provider

     if (!threadId || !message) {
        res.status(400).json({ error: "missing required field" });
    }

   try {
     let thread = await Thread.findOne({ threadId });

     if (!thread) {
      // create a new thread in db
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }
    //change occure here
     let assistantReply = await getOpenAIAPIResponse(message);
   
//after

    // Safety check to prevent Mongoose validation errors
    if (!assistantReply) {
      assistantReply = "Sorry, I couldn't get a response.";
    }

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();

    return res.json({ reply: assistantReply });
  } catch (err) {
    console.error("Chat route error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

 //✅ Delete a thread by threadId
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json({ message: "Thread deleted successfully" });
  } catch (err) {
    console.error("Delete Thread Error:", err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});
export default router;














