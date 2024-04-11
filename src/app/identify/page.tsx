"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Stack,
} from "@mui/material";
import Header from "@/app/components/Header";
import SuccessAlert from "@/app/components/SuccessAlert";
import { useWavConverter } from "@/app/components/useWavConverter";
import ErrorAlert from "@/app/components/ErrorAlert";
import { identifyAudio } from "@/api/animoApi";
import { GetUser } from "@/api/dbCurd";
import ScoresTable from "./ScoresTable";
import AudioOptions from "@/app/components/AudioOptions";
import LoadingScreen from "@/app/components/Loading";

interface ScoreItem {
  score: number;
  user_id: number;
  audio_name: string;
}

interface User {
  id: number;
  name: string;
  sex: number;
  del_flg: number;
  wanderer_flg: number;
}

interface ScoreData {
  score: number;
  user_id: number;
  name: string;
  audio_name: string;
}

function Identify() {
  const [resetAudio, setResetAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { convertToWav, wavBlobUrl, resetWavUrl } = useWavConverter();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");

  const [response, setResponse] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // wavBlobUrlが設定されたらAPIを呼び出す
    if (wavBlobUrl) {
      (async () => {
        try {
          setResponse([]);
          const getScore: ScoreItem[] = await identifyAudio(wavBlobUrl);
          const getUser: User[] = await GetUser();
          resetWavUrl();

          const combinedResponse: ScoreData[] = getScore.map((scoreItem) => {
            console.log(scoreItem)
            const user = getUser.find((user) => user.id === scoreItem.user_id);
            console.log(user)
            return {
              ...scoreItem,
              name: user?.name ?? 'Unknown',
              id: user?.id,
            };
          });

          setResponse(combinedResponse);
          setLoading(false);

          // 成功した場合の処理
          setMessage("Success");
          return;
        } catch (error) {
          setLoading(false);
          console.error("API call failed:", error);
          // 失敗した場合の処理
          setMessage("録音時間が短すぎます。");
          setShowError(true);
          throw error;
        }
      })();
    }
  }, [wavBlobUrl]);

  const submit = async () => {
    try {
      setLoading(true);
      if (audioUrl) {
        await convertToWav(audioUrl);
        setShowSuccess(false);
        return;
      } else {
        setShowSuccess(false);
        // 失敗した場合の処理

        setMessage("音声を録音してください。");
        setShowError(true);
        setLoading(false);

        // ファイル選択状態や録音状態もリセットする
        setResetAudio(prev => !prev);
        return;
      }
    } catch (error) {
      setShowSuccess(false);
      console.error("Error:", error);
      setMessage("Error");
      setShowError(true);
      setLoading(false);
      throw error;
    }
  };

  const handleAudioUrlChange = (url: string | null) => {
    setAudioUrl(url);
  };

  return (
    <div className="container">
      <Header />
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        <Stack spacing={3}>
          <AudioOptions
            resetAudio={resetAudio}
            onAudioUrlChange={handleAudioUrlChange}
          />
          <Button type="submit" color="primary" variant="contained" onClick={submit}>
            識別
          </Button>
        </Stack>
        {loading && <LoadingScreen />}
        <ScoresTable responseData={response} />
        {showSuccess && <SuccessAlert message={message} onClose={() => setShowSuccess(false)} />}
        {showError && <ErrorAlert message={message} onClose={() => setShowError(false)} />}
      </Container>
    </div>
  );
}

export default Identify;
