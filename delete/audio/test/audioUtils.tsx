import React from "react";

interface StartRecordingProps {
  setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
}

export const startRecording = async ({
  setAudioUrl,
  setIsRecording,
  mediaRecorderRef,
}: StartRecordingProps) => {
  setAudioUrl(null);
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, sampleRate: 16000 },
    });
    mediaRecorderRef.current = new MediaRecorder(stream);
    const audioChunks: BlobPart[] = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  }
  console.log(setIsRecording);
  console.log(mediaRecorderRef);
};

interface StopRecordingProps {
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
}

export const stopRecording = ({
  setIsRecording,
  mediaRecorderRef,
}: StopRecordingProps) => {
  mediaRecorderRef.current?.stop();
  setIsRecording(false);

  console.log(setIsRecording);
  console.log(mediaRecorderRef);
};

export const handleFileChange = async (
  event: React.ChangeEvent<HTMLInputElement>,
  onSuccess: (file: File) => void,
  onError: (message: string) => void
) => {
  const file = event.target.files ? event.target.files[0] : null;
  if (!file) {
    onError("ファイルが選択されていません。");
    return;
  }

  if (file.type !== "audio/wav") {
    onError("ファイルはWAV形式である必要があります。");
    return;
  }

  const audioContext = new AudioContext();
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const isMono = audioBuffer.numberOfChannels === 1;
    const is16kHz = audioBuffer.sampleRate === 16000;

    if (isMono && is16kHz) {
      onSuccess(file);
    } else {
      onError(
        "ファイルはモノラルでサンプルレートが16kHzである必要があります。"
      );
    }
  } catch (error) {
    onError("ファイルの読み込みに失敗しました。");
  }
};

// "use client";
// import React from "react";
// // Utility functions for recording audio
// interface StartRecordingParams {
//   setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
//   setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
//   setChunks: React.Dispatch<React.SetStateAction<Array<ArrayBuffer>>>;
//   setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
//   setContext: React.Dispatch<React.SetStateAction<AudioContext | null>>;
//   setSource: React.Dispatch<
//     React.SetStateAction<MediaStreamAudioSourceNode | null>
//   >;
//   setWorklet: React.Dispatch<React.SetStateAction<AudioWorkletNode | null>>;
// }

// // stopRecording関数に渡すパラメータの型を定義
// interface StopRecordingParams {
//   setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
//   setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
//   localStream: MediaStream | null;
//   context: AudioContext | null;
//   source: MediaStreamAudioSourceNode | null;
//   worklet: AudioWorkletNode | null;
//   chunks: Array<ArrayBuffer>;
//   setChunks: React.Dispatch<React.SetStateAction<Array<ArrayBuffer>>>;
// }

// export const startRecording = async ({
//   setAudioUrl,
//   setIsRecording,
//   setChunks,
//   setLocalStream,
//   setContext,
//   setSource,
//   setWorklet,
// }: StartRecordingParams) => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: false,
//     });
//     setLocalStream(stream);
//     const audioCtx = new AudioContext();
//     setContext(audioCtx);
//     const audioSource = audioCtx.createMediaStreamSource(stream);
//     setSource(audioSource);

//     await audioCtx.audioWorklet.addModule("./processor.js");
//     const audioWorklet = new AudioWorkletNode(audioCtx, "worklet-processor");
//     setWorklet(audioWorklet);

//     audioWorklet.port.onmessage = (e) => {
//       if (e.data.eventType === "data") {
//         setChunks((prevChunks) => [...prevChunks, e.data.audioBuffer]);
//       }
//     };

//     audioSource.connect(audioWorklet);
//     audioWorklet.connect(audioCtx.destination);

//     setIsRecording(true);
//   } catch (error) {
//     console.error("Failed to start recording:", error);
//   }
// };

// export const stopRecording = ({
//   setIsRecording,
//   setAudioUrl,
//   localStream,
//   context,
//   source,
//   worklet,
//   chunks,
//   setChunks,
// }: StopRecordingParams) => {
//   if (localStream && context && source && worklet) {
//     localStream.getTracks().forEach((track) => track.stop());
//     source.disconnect();
//     worklet.disconnect();

//     const wavHeader = getWAVHeader(chunks, context.sampleRate);
//     const wavBlob = new Blob([wavHeader, ...chunks], { type: "audio/wav" });
//     const url = URL.createObjectURL(wavBlob);
//     setAudioUrl(url);
//     setIsRecording(false);
//     setChunks([]);
//   }
// };

// const getWAVHeader = (chunks: Array<ArrayBuffer>, sampleRate: number) => {
//   const BYTES_PER_SAMPLE = Int16Array.BYTES_PER_ELEMENT;
//   const channel = 1;

//   const dataLength = chunks.reduce((acc, cur) => acc + cur.byteLength, 0);
//   const header = new ArrayBuffer(44);
//   const view = new DataView(header);
//   writeString(view, 0, "RIFF");
//   view.setUint32(4, 36 + dataLength, true);
//   writeString(view, 8, "WAVE");
//   writeString(view, 12, "fmt ");
//   view.setUint32(16, 16, true);
//   view.setUint16(20, 1, true);
//   view.setUint16(22, channel, true);
//   view.setUint32(24, sampleRate, true);
//   view.setUint32(28, sampleRate * BYTES_PER_SAMPLE * channel, true);
//   view.setUint16(32, BYTES_PER_SAMPLE * channel, true);
//   view.setUint16(34, 8 * BYTES_PER_SAMPLE, true);
//   writeString(view, 36, "data");
//   view.setUint32(40, dataLength, true);

//   return header;
// };

// const writeString = (dataView: DataView, offset: number, string: string) => {
//   for (let i = 0; i < string.length; i++) {
//     dataView.setUint8(offset + i, string.charCodeAt(i));
//   }
// };
