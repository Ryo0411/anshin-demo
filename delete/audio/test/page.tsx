"use client";
import React, { useState } from "react";

const RecordAudio: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [chunks, setChunks] = useState<Array<ArrayBuffer>>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [context, setContext] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const [worklet, setWorklet] = useState<AudioWorkletNode | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setLocalStream(stream);
      const audioCtx = new AudioContext();
      setContext(audioCtx);
      const audioSource = audioCtx.createMediaStreamSource(stream);
      setSource(audioSource);

      await audioCtx.audioWorklet.addModule("./processor.js");
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

  const stopRecording = () => {
    if (localStream && context && source && worklet) {
      localStream.getTracks().forEach((track) => track.stop());
      source.disconnect();
      worklet.disconnect();

      const wavRawData = [getWAVHeader(), ...chunks];
      const blob = new Blob(wavRawData, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setChunks([]);

      // 録音した音声の再生用のaudio要素を作成し、再生します
      setAudioUrl(url);
      setRecording(false);
    }
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
      <h1>音声録音と再生・ダウンロード</h1>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop" : "Record"}
      </button>
      {audioUrl && <audio controls src={audioUrl} />}
    </div>
  );
};

export default RecordAudio;
