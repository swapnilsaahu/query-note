import axios from "axios";
import { useEffect, useReducer, useRef, useState, type PropsWithChildren } from "react";
import { useParams } from "react-router";
import useUserStore from "../store/UserStore";
import NavBar from "./NavBar";


const NoteDisplay = () => {
    const { tag } = useParams();
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState<string[]>([]);
    const [largestTimestamp, setLargestTimestamp] = useState("");
    const [smallestTimestamp, setSmallestTimestamp] = useState("");
    const mountRef = useRef(false);
    const accessToken = useUserStore(state => state.accessToken);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const url = `/api/v1/notes/getNotes/${tag}`
                console.log(accessToken);
                console.log(tag);
                const res = await axios.get(url, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (res) {
                    setLinks([...res.data.rows]);
                    setLargestTimestamp(res.data.largestTimestamp);
                    setSmallestTimestamp(res.data.smallestTimestamp);
                }
            } catch (error) {
                console.error("error while fetching")
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [tag])
    if (loading) return <div>loading...</div>
    return (
        <>
            <div className="flex justify-center items-center">
                <div>{links.map((x) => (
                    <div key={x}>{x}</div>
                ))}</div>
            </div>
        </ >
    )
}
export default NoteDisplay;
