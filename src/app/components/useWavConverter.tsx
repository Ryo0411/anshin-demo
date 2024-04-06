"use client";
import { useState } from "react";

export const useWavConverter = () => {
  const [wavBlobUrl, setWavBlobUrl] = useState<string | null>(null);

  const convertToWav = async (blobUrl: string) => {
    try {
      const audioBuffer = await loadAudio(blobUrl);
      const convertedBuffer = await convertToMonoAndChangeSampleRate(
        audioBuffer,
        16000
      );
      const wavBlob = encodeWAV(convertedBuffer);
      const url = URL.createObjectURL(wavBlob);
      setWavBlobUrl(url); // 変換後のWAVファイルのURLを状態として保持
    } catch (error) {
      console.error("音声ファイルの変換処理に失敗しました。", error);
      setWavBlobUrl(null);
    }
  };

  const resetWavUrl = () => {
    setWavBlobUrl(null);
  };

  return { convertToWav, resetWavUrl, wavBlobUrl };
};

async function loadAudio(blobUrl: string): Promise<AudioBuffer> {
  const response = await fetch(blobUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new (window.AudioContext || window.AudioContext)();
  return audioContext.decodeAudioData(arrayBuffer);
}

async function convertToMonoAndChangeSampleRate(
  audioBuffer: AudioBuffer,
  targetSampleRate: number
): Promise<AudioBuffer> {
  const numberOfChannels = 1;
  const length =
    (audioBuffer.length * targetSampleRate) / audioBuffer.sampleRate;
  const offlineAudioContext = new OfflineAudioContext(
    numberOfChannels,
    length,
    targetSampleRate
  );

  const source = offlineAudioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineAudioContext.destination);
  source.start();

  return offlineAudioContext.startRendering();
}

function encodeWAV(audioBuffer: AudioBuffer): Blob {
  const numChannels = 1; // モノラルに変換
  const sampleRate = 16000; // サンプリングレートを16000Hzに設定
  const formatLength = audioBuffer.length * numChannels * 2 + 44;

  let buffer = new ArrayBuffer(formatLength);
  let view = new DataView(buffer);

  // WAVヘッダの書き込み
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + audioBuffer.length * numChannels * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2 * numChannels, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, audioBuffer.length * numChannels * 2, true);

  // PCMデータの書き込み
  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    const sample = audioBuffer.getChannelData(0)[i]; // モノラル変換後はチャネル0のみ
    const x = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, x < 0 ? x * 0x8000 : x * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
