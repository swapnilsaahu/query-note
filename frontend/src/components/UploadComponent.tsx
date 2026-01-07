import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import useUserStore from "../store/UserStore";
import { FaFileAlt } from "react-icons/fa";

const UploadComponent = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const accessToken = useUserStore(s => s.accessToken);
    const handlePreview = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        let image_as_base64 = URL.createObjectURL(files[0]);

        setPreview(image_as_base64);
        setImageFile(files[0]);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!imageFile) return;
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append("position", "end");
        const url = "/api/v1/users/uploadNote"
        try {
            const res = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            if (!res.data) {
                console.log("failed upload");
            }
        } catch (error) {
            console.error("error while uploading", error);
        }
    }
    return (
        <div className="flex flex-col justify-center items-center m-2 gap-8 text-lavender-grey-200">
            <img src={preview} alt="Image preview" height="600px" width="600px" className="border-4 rounded-2xl border-lavender-grey-400 mt-20" />
            <div className="flex gap-2">
                <FaFileAlt className="text-2xl mt-1" />
                <input type="file" onChange={handlePreview} className=" border-lavender-grey-900 hover:bg-lavender-grey-700" />
            </div>
            {loading ? <div>loading..</div> : <input type="submit" onClick={handleSubmit} value="Upload" className="border-2 bg-lavender-grey-500 text-lavender-grey-950 py-4 px-10 text-xl rounded-4xl border-black p-2 hover:bg-lavender-grey-400" />}
        </div>
    )
}
export default UploadComponent;
