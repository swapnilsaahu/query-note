import api from "../lib/api";
import { useState } from "react";
import { IoMdSend } from "react-icons/io";
import useUserStore from "../store/UserStore";

interface responseType {
    id: string,
    query: string,
    responseText: string,
    imgLink: string
}
const SearchBot = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [chatHistory, setChatHistory] = useState<Array<responseType>>([]);
    const accessToken = useUserStore(s => s.accessToken);
    const updateChat = async () => {
        const url = `/api/v1/llm/userQuery/`
        try {
            const res = await api.post(url, {
                userQuery: searchQuery
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!res.data) return;
            setChatHistory(prev => [...prev, res.data]);
            setSearchQuery('');
        } catch (error) {
            console.error(error, "error while fetching llmresponse");
        }
    }
    return (
        <div>
            <div className="mb-50 text-lavender-grey-200">
                {chatHistory.map((chat) => <div key={chat.id}>
                    <pre className="text-wrap sm:text-2xl mx-4 sm:mx-40 sm:my-10 border-lavender-grey-600 border-2 p-2 ">{chat.query}</pre>
                    <div className="text-wrap mx-4 sm:mx-40 my-4 sm:my-10 border-lavender-grey-600 border-2 p-2 ">
                        <p className="text-wrap sm:text-2xl whitespace-pre-line">{chat.responseText}</p>
                        <a href={chat.imgLink} target="_blank" rel="noopener noreferrer" className="text-lavender-grey-300 underline font-bold"> Refernce image </a>
                    </div>
                </div>)}
            </div>
            {(chatHistory.length === 0) ? <div className="flex justify-center items-center text-lavender-grey-200">
                <div className="flex flex-col relative items-center mr-4 sm:">
                    <h2 className="text-3xl sm:text-6xl font-bold m-2 sm:m-8 mb-4 sm:">Query Your Note</h2>
                    <textarea defaultValue="Query your notes.." onChange={e => setSearchQuery(e.target.value)} value={searchQuery} className="text-lavender-grey-200 p-4 sm:text-xl border-2 rounded-2xl bg-lavender-grey-900 sm:w-180 h-40 shadow-md shadow-lavender-grey-400" />
                    <IoMdSend className=" text-2xl sm:text-4xl mx-6 sm:mx-4 my-4 absolute right-0 bottom-0 hover:text-lavender-grey-900" onClick={updateChat} />

                </div>
            </div> : <div className="flex rounded-2xl bg-lavender-grey-700 text-black sm:text-2xl fixed bottom-0  sm:left-1/4 sm:w-1/2 mb-8 shadow-xl">
                <textarea defaultValue="query chatbot" onChange={e => setSearchQuery(e.target.value)} value={searchQuery} className="w-full sm:mx-2 focus:outline-none p-4 rounded-2xl field-sizing-content resize-none text-lavender-grey-200"></textarea>
                <IoMdSend className="text-4xl mx-4 mt-6 hover:text-lavender-grey text-lavender-grey-200 hover:text-lavender-grey-900" onClick={updateChat} />
            </div>
            }
        </div>
    )
}
export default SearchBot;
