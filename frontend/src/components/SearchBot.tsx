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
        } catch (error) {
            console.error(error, "error while fetching llmresponse");
        }
    }
    return (
        <div>
            <div>
                {chatHistory.map((chat, index) => <div key={index}>{chat}</div>)}
            </div>
            <div className="flex rounded-2xl bg-gray-400 text-black text-2xl h-16 fixed bottom-0 left-1/6 w-3/4 mb-8">
                <input defaultValue="query chatbot" onChange={e => setSearchQuery(e.target.value)} value={searchQuery} className="w-full mx-2"></input>
                <IoMdSend className="text-4xl mt-3 mx-2" onClick={updateChat} />
            </div>
        </div>
    )
}
export default SearchBot;
