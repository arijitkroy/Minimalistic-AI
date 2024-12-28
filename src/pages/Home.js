import React, { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./Home.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Home = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState([]);
    const [error, setError] = useState("");
    const [btnToggle, setButtonToggle] = useState(false);
    const myRef = useRef(null);
    
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);     
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    useEffect(() => {
        alert("Message will be forgotten");
        setButtonToggle(false);
    }, [])
              
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };
              
    const Run = async () => {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });
              
        const result = await chatSession.sendMessage(prompt);
        setResponse([...response, [prompt, (result.response.text())]]);
        setButtonToggle(false);
    }

    const scrollToElement = () => myRef.current?.scrollIntoView({ behavior: 'smooth'});
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonToggle(true);
        if (!prompt) {
            setError("Prompt cannot be empty!");
            setButtonToggle(false);
        }
        else {
            Run();
            scrollToElement();
            setPrompt("");
        }
    }

    return (
        <div className="container">
            <h1>Minimalistic AI</h1>
            <div className="response-body">
                {response.map((e, i, arr) => {
                    return (
                        <div ref={myRef} id="response" className="response-text">
                            <div className="prompt">
                                {arr[i][0]}
                            </div>
                            <div className="response">
                                <Markdown remarkPlugins={remarkGfm}>{arr[i][1]}</Markdown>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="form-body">
                <input name="prompt" type="text" value={prompt} placeholder={error ? error : "Enter your prompt here"} onChange={e => (setPrompt(e.target.value), setError(""))}/>
                <button id="btn_send" onClick={handleSubmit} disabled={btnToggle} >{btnToggle == false ? "Send" : "Wait..."}</button>
            </div>
        </div>
    )
}

export default Home;