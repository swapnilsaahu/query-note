import axios from "axios";
import { useState, type ChangeEvent, type EventHandler, type FormEvent, type InputEvent } from "react";
import useUserStore from "../store/UserStore";

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
        <>
            <img src={preview} alt="image preview" />
            <input type="file" onChange={handlePreview} />
            <label>Upload file</label>
            {loading ? <div>loading..</div> : <input type="submit" onClick={handleSubmit} value="submit" />}
        </>
    )
}
export default UploadComponent;
