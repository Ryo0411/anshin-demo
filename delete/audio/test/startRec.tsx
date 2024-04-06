"use client";
import React, { useState } from "react";
import { Button, Box } from "@mui/material";

// Propsの型定義に従って関数コンポーネントを作成
function StartRec() {
  const [recording, setRecording] = useState<boolean>(false);
  const [chunks, setChunks] = useState<Array<ArrayBuffer>>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [context, setContext] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const [worklet, setWorklet] = useState<AudioWorkletNode | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const startRecording = async () => {
    if (recording) return;
    try {
      setAudioUrl(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setLocalStream(stream);
      const audioCtx = new AudioContext();
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 1.0;
      gainNode.connect(audioCtx.destination);
      setContext(audioCtx);
      const audioSource = audioCtx.createMediaStreamSource(stream);
      setSource(audioSource);
      await audioCtx.audioWorklet.addModule("/processor.js");
      const audioWorklet = new AudioWorkletNode(audioCtx, "worklet-processor");
      setWorklet(audioWorklet);

      audioWorklet.port.onmessage = (e) => {
        if (e.data.eventType === "data") {
          setChunks((prevChunks) => [...prevChunks, e.data.audioBuffer]);
        }
      };

      audioSource.connect(audioWorklet);
      audioWorklet.connect(audioCtx.destination);

      setRecording(true);
    } catch (error) {
      console.error("録音が許可されませんでした:", error);
    }
  };

  const stopRecording = async () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (context) {
      context.close();
    }

    // ヘッダを取得
    const header = getWAVHeader();
    // ArrayBufferのリストをBlobの引数に直接渡す
    const blob = new Blob([header, ...chunks], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

    // 状態をリセット
    setRecording(false);
    setChunks([]);
    setLocalStream(null);
    setContext(null);
    setSource(null);
    setWorklet(null);
  };

  const getWAVHeader = () => {
    const BYTES_PER_SAMPLE = Int16Array.BYTES_PER_ELEMENT;
    const channel = 1;
    const sampleRate = context?.sampleRate || 44100;

    const dataLength = chunks.reduce((acc, cur) => acc + cur.byteLength, 0);
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    writeString(view, 0, "RIFF"); // RIFF identifier 'RIFF'
    view.setUint32(4, 36 + dataLength, true); // file length minus RIFF identifier length and file description length
    writeString(view, 8, "WAVE"); // RIFF type 'WAVE'
    writeString(view, 12, "fmt "); // format chunk identifier 'fmt '
    view.setUint32(16, 16, true); // format chunk length
    view.setUint16(20, 1, true); // sample format (raw)
    view.setUint16(22, channel, true); // channel count
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * BYTES_PER_SAMPLE * channel, true); // byte rate (sample rate * block align)
    view.setUint16(32, BYTES_PER_SAMPLE * channel, true); // block align (channel count * bytes per sample)
    view.setUint16(34, 8 * BYTES_PER_SAMPLE, true); // bits per sample
    writeString(view, 36, "data"); // data chunk identifier 'data'
    view.setUint32(40, dataLength, true); // data chunk length

    return header;
  };

  const writeString = (dataView: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      dataView.setUint8(offset + i, string.charCodeAt(i));
    }
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
          録音停止
        </Button>
      )}
      {audioUrl && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="top"
          justifyContent="top"
          my={2}
        >
          <audio controls src={audioUrl} />
        </Box>
      )}
    </div>
  );
}

export default StartRec;
