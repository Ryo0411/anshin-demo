// Identify.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

// APIレスポンスデータと平均スコアデータの型定義
interface ScoreData {
  score: number;
  user_id: number;
  name: string;
}

interface AverageScoreData {
  user_id: number;
  average_score: number;
  name: string;
}


// スコアとユーザー名を user_id ごとに集計するための型定義
interface ScoresByUserId {
  [key: number]: {
    scores: number[];
    name: string;
  };
}

// 平均スコアを計算する関数
const calculateAverageScores = (data: ScoreData[]): AverageScoreData[] => {
  const scoresByUserId: ScoresByUserId = data.reduce((acc, { user_id, score, name }) => {
    if (!acc[user_id]) {
      acc[user_id] = { scores: [], name };
    }
    acc[user_id].scores.push(score);
    return acc;
  }, {} as ScoresByUserId);

  return Object.entries(scoresByUserId).map(([userId, { scores, name }]) => ({
    user_id: parseInt(userId),
    average_score: scores.reduce((total: number, current: number) => total + current, 0) / scores.length,
    name
  }));
};


// スコアデータを表示するテーブルコンポーネント
interface ScoresTableProps {
  responseData: ScoreData[];
}

const ScoresTable: React.FC<ScoresTableProps> = ({ responseData }) => {
  const averageScores = calculateAverageScores(responseData);
  const allScores = responseData;

  return (
    <>
      <TableContainer component={Paper} elevation={3} sx={{ marginTop: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>User Scores</Typography>
        <Table sx={{ minWidth: 350 }} aria-label="average scores table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
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
              <TableCell align="right">Average Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allScores.map(({ user_id, name, score }) => (
              <TableRow key={user_id}>
                <TableCell>{user_id}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell align="right">{Math.round(score * 100) / 100}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ScoresTable;
