// Identify.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { handleSendFile } from '@/api/animoApi';

// APIレスポンスデータと平均スコアデータの型定義
interface ScoreData {
  score: number;
  user_id: number;
  name: string;
  audio_name: string;
}

interface AverageScoreData {
  user_id: number;
  average_score: number;
  name: string;
  audio_name: string;
}

// スコアとユーザー名を user_id ごとに集計するための型定義
interface ScoresByUserId {
  [key: number]: {
    scores: number[];
    name: string;
    audio_name: string;
  };
}

// 平均スコアを計算する関数
const calculateAverageScores = (data: ScoreData[]): AverageScoreData[] => {
  const scoresByUserId: ScoresByUserId = data.reduce((acc, { user_id, score, name, audio_name }) => {
    if (!acc[user_id]) {
      acc[user_id] = { scores: [], name, audio_name };
    }
    acc[user_id].scores.push(score);
    return acc;
  }, {} as ScoresByUserId);

  // 平均スコアを計算し、その結果を一時配列に格納
  const averages = Object.entries(scoresByUserId).map(([userId, { scores, name, audio_name }]) => ({
    user_id: parseInt(userId),
    average_score: scores.reduce((total: number, current: number) => total + current, 0) / scores.length,
    name,
    audio_name: audio_name,
  }));

  // 平均スコアで降順にソート
  averages.sort((a, b) => b.average_score - a.average_score);

  return averages;
};


// スコアデータを表示するテーブルコンポーネント
interface ScoresTableProps {
  responseData: ScoreData[];
}

const ScoresTable: React.FC<ScoresTableProps> = ({ responseData }) => {
  const averageScores = calculateAverageScores(responseData);
  const allScores = responseData;
  const [audioInfo, setAudioInfo] = useState<any[]>([]);

  useEffect(() => {
    // APIを呼び出してオーディオ情報を取得する関数
    const fetchAudioInfo = async () => {
      // Promise.allを使用して、すべてのaudio_nameに対してAPIを並行して呼び出す
      const audioInfoPromises = responseData.map(async ({ user_id, audio_name }) => (
        await handleSendFile(user_id, audio_name).then(url => ({ user_id, audio_name, url }))
      ));

      console.log(audioInfoPromises);

      // すべてのプロミスが解決したら、結果を状態に設定
      const audioInfos = await Promise.all(audioInfoPromises);
      setAudioInfo(audioInfos);
    };

    // 関数を実行
    fetchAudioInfo();
  }, [responseData]);

  return (
    <>
      <TableContainer component={Paper} elevation={3} sx={{ marginTop: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>User Scores</Typography>
        <Table sx={{ minWidth: 350 }} aria-label="average scores table">
          <TableHead>
            <TableRow>
              <TableCell>Audio ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Average Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {averageScores.map(({ user_id, name, average_score }) => (
              <TableRow key={user_id}>
                <TableCell>{user_id}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell align="right">{average_score.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} elevation={3} sx={{ marginTop: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>User Scores All</Typography>
        <Table sx={{ minWidth: 350 }} aria-label="average scores table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Audio</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allScores.map(({ user_id, name, score, audio_name }) => {
              // audioInfoから対応するオーディオ情報（URL）を検索
              const audioItem = audioInfo.find(info => info.audio_name === audio_name);
              return (
                <TableRow key={user_id}>
                  <TableCell>{user_id}</TableCell>
                  <TableCell>{name}</TableCell>
                  {/* 対応するオーディオファイルのURLを表示。URLがない場合は"Loading..."を表示 */}
                  <TableCell>
                    <Box sx={{ mb: 2, overflow: 'hidden', borderRadius: '4px', maxWidth: '100%' }}>
                      {audioItem ? <audio controls src={audioItem.url} style={{ width: '100%' }} /> : "Loading..."}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{Math.round(score * 100) / 100}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ScoresTable;
