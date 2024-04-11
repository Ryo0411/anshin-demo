import React, { useState } from "react";
import { Button, Box } from "@mui/material";

interface StartRecProps {
  onAudioReady: (url: string) => void; // 録音完了時に親コンポーネントにURLを渡すためのコールバック関数
}

const StartRec: React.FC<StartRecProps> = ({ onAudioReady }) => {
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startRecording = async () => {
    if (recording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/wav";

      // ビットレートを指定
      const options = { mimeType, bitsPerSecond: 256000 };

      const recorder = new MediaRecorder(stream, options);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        // コールバックを使用してURLを親コンポーネントに渡す
        onAudioReady(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Audio recording failed:", error);
    }
  };

  const stopRecording = () => {
    if (!recording || !mediaRecorder) return;
    mediaRecorder.stop();
    setRecording(false);
  };

  return (
    <div>
      {!recording && (
        <Button onClick={startRecording} variant="contained" color="info">
          録音開始
        </Button>
      )}
      {recording && (
        <Button onClick={stopRecording} variant="contained" color="error">
          停止
        </Button>
      )}
    </div>
  );
};

export default StartRec;
