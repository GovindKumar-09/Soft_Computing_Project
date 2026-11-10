import { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import axios from 'axios';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const ffmpeg = new FFmpeg();

    const handleUpload = async () => {
        if (!file) return;
        setStatus('Extracting audio locally...');

        await ffmpeg.load();
        await ffmpeg.writeFile('input.mp4', await fetchFile(file));
        
        // Extract audio as mp3
        await ffmpeg.exec(['-i', 'input.mp4', '-q:a', '0', '-map', 'a', 'output.mp3']);
        const audioData = await ffmpeg.readFile('output.mp3');
        const audioBlob = new Blob([audioData.buffer], { type: 'audio/mp3' });

        setStatus('Uploading audio to server...');
        const formData = new FormData();
        formData.append('audio', audioBlob, 'lecture.mp3');

        // Send to Express Backend
        await axios.post('http://localhost:5000/api/videos/upload', formData, {
            withCredentials: true // For JWT cookies[cite: 3]
        });
        
        setStatus('Uploaded & Processing started!');
    };

    return (
        <div className="p-4">
            <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 mt-2">Upload Lecture</button>
            <p>{status}</p>
        </div>
    );
}