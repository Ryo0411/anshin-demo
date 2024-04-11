"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Header from "@/app/components/Header";
import { AddAudio, RemoveAudio, getFindAudio, handleSendFile } from "@/api/animoApi";
import { CreateOnseiData, DeleteOnseiData, GetOnseiData } from "@/api/dbCurd";
import AudioOptions from "@/app/components/AudioOptions";
import { useWavConverter } from "@/app/components/useWavConverter";
import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";

// 型定義
type updateOnseiType = {
  id: number;
  user_id: number;
  audio_name: string;
  create_at: string;
  del_flg: number;
  blobUrl: string;
};

const OnseiListPage = () => {
  const { handleSubmit, formState: { errors } } = useForm();

  const pathname = usePathname();
  const id = pathname.split('/')[3];
  const [onseiLists, setOnseiLists] = useState<updateOnseiType[]>([]);

  const [resetAudio, setResetAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { convertToWav, wavBlobUrl, resetWavUrl } = useWavConverter();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");

  // fetchOnseiLists関数を調整して、idをパラメータとして受け取るようにする
  async function fetchOnseiLists(id: number) {
    const result = await getFindAudio(Number(id));
    const res = await GetOnseiData(Number(id));

    // result.audio_names に含まれる audio_name と del_flg が 0 のものだけをフィルタリング
    const filteredData = res.filter((item: { del_flg: number; audio_name: string; }) =>
      item.del_flg === 0 && result.audio_names.includes(item.audio_name)
    );
    // Blob URL を取得して onseiLists に追加
    const promises = filteredData.map(async (item: { id: number; audio_name: string; }) => ({
      ...item,
      blobUrl: await handleSendFile(Number(id), item.audio_name),
    }));
    const onseiListsWithBlobUrl = await Promise.all(promises);

    setOnseiLists(onseiListsWithBlobUrl);
    return [filteredData as updateOnseiType];
  }

  useEffect(() => {
    const fetchData = async () => {
      // ルーターが準備完了し、idが定義されていることを確認してからデータを取得する
      if (id) {
        const data = await fetchOnseiLists(Number(id));
        console.log(data);
      }
    };

    fetchData();
  }, [id]);

  // 削除ボタンの処理
  const handleDelete = async (id: number, audio_name: string) => {
    // ここでは、del_flgを更新する処理をシミュレーションしています。
    await DeleteOnseiData(id);
    setOnseiLists(
      onseiLists.map((item) =>
        item.id === id ? { ...item, del_flg: 1 } : item
      )
    );
    await RemoveAudio(id, audio_name);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);

    // 日付をローカルタイムゾーンでフォーマット
    const formattedDate = date.toLocaleDateString('ja-JP');
    const formattedTime = date.toLocaleTimeString('ja-JP', { hour12: false });

    return `${formattedDate} ${formattedTime}`;
  };

  const handleAudioUrlChange = (url: string | null) => {
    setAudioUrl(url);
  };

  useEffect(() => {
    // wavBlobUrlが設定された場合にのみAPIを呼び出す
    if (wavBlobUrl) {
      (async () => {
        try {
          const response = await AddAudio(Number(id), wavBlobUrl);
          console.log(response);
          await CreateOnseiData(response.id, response.audio_name);
          resetWavUrl();

          await fetchOnseiLists(Number(id));

          // 成功した場合の処理
          setMessage("Success");
          setShowSuccess(true);
          return;
        } catch (error) {
          console.error("API call failed:", error);
          // 失敗した場合の処理
          setMessage("Error");
          setShowError(true);
          throw error;
        }
      })();
    }
  }, [wavBlobUrl, id]);

  // 登録処理
  const submit = async () => {
    try {
      // 音声ファイルがある場合、変換処理を行う
      if (audioUrl) {
        await convertToWav(audioUrl);
        // ファイル選択状態や録音状態もリセットする
        setResetAudio(prev => !prev);
        fetchOnseiLists(Number(id));
        return;
      } else {
        setMessage("Error");
        setShowError(true);
        // ファイル選択状態や録音状態もリセットする
        setResetAudio(prev => !prev);
        return;
      }
    } catch (error) {
      console.error("User creation or audio conversion failed:", error);
      setMessage("Error");
      setShowError(true);
      return;
    }
  };

  return (
    <div className="container">
      <Header />
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        <form onSubmit={handleSubmit(submit)}>
          <Stack spacing={3}>
            <AudioOptions
              resetAudio={resetAudio}
              onAudioUrlChange={handleAudioUrlChange}
            />
            <Button type="submit" color="primary" variant="contained">
              追加登録
            </Button>
          </Stack>
        </form>
        <Box sx={{ maxWidth: 1200, mx: "auto", my: 4 }}>
          <Grid container spacing={2}>
            {onseiLists
              .filter((item) => item.del_flg === 0)
              .map((item) => (
                // Grid itemのxsプロパティを調整して要素の幅を小さくする
                <Grid item xs={12} sm={6} md={6} key={item.id}> {/* グリッドアイテムのサイズを調整 */}
                  <Card
                    sx={{
                      mb: 2,
                      overflow: "visible",
                      p: 2,
                      boxShadow: 3, // カードのシャドウを追加
                      ':hover': {
                        boxShadow: 5, // ホバー時のシャドウを強調
                      },
                      borderRadius: 2, // カードの角を丸くする
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" component="div" gutterBottom>
                        ID: {item.id}
                      </Typography>
                      <Box sx={{ mb: 2, overflow: 'hidden', borderRadius: '4px', maxWidth: '100%' }}>
                        <audio controls src={item.blobUrl} style={{ width: '100%' }}></audio>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        作成日: {formatDate(item.create_at)}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(item.id, item.audio_name)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
        {showSuccess && <SuccessAlert message={message} onClose={() => setShowSuccess(false)} />}
        {showError && <ErrorAlert message={message} onClose={() => setShowError(false)} />}
      </Container>
    </div>
  );
};

export default OnseiListPage;
