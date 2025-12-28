import axios from "axios";
import { useState, type ChangeEvent } from "react";
import { IoMdSend } from "react-icons/io";
import useUserStore from "../store/UserStore";

const SearchBot = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [chatHistory, setChatHistory] = useState<Array<string>>([]);
    const accessToken = useUserStore(s => s.accessToken);
    const updateChat = async () => {
        const url = `/api/v1/llm/userQuery/`
        try {
            const res = await axios.post(url, {
                userQuery: searchQuery
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!res.data) return;
            setChatHistory(prev => [...prev, searchQuery, res.data.responseText]);
            setSearchQuery('');
        } catch (error) {
            console.error(error, "error while fetching llmresponse");
        }
    }
    return (
        <div>
            <div className="mb-50">
                {chatHistory.map((chat, index) => <pre key={index} className="text-wrap mx-40 my-10 border-black border-2 p-2 ">{chat}</pre>)}
            </div>
            <div className="flex rounded-2xl bg-gray-400 text-black text-2xl h-16 fixed bottom-0 left-1/5 w-3/4 mb-8 shadow-xl">
                <input defaultValue="query chatbot" onChange={e => setSearchQuery(e.target.value)} value={searchQuery} className="w-full mx-2 focus:outline-none p-4 rounded-2xl"></input>
                <IoMdSend className="text-4xl mt-3 mx-2" onClick={updateChat} />
            </div>
        </div>
    )
}
export default SearchBot;
