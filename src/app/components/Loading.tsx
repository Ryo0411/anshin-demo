import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed', // 画面全体に固定
        top: 0,
        left: 0,
        width: '100vw', // ビューポートの幅いっぱい
        height: '100vh', // ビューポートの高さいっぱい
        display: 'flex',
        justifyContent: 'center', // 水平方向の中央揃え
        alignItems: 'center', // 垂直方向の中央揃え
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // 背景を暗いグレーの半透明に設定
        zIndex: 2000, // 他の要素より前面に表示
      }}
    >
      <CircularProgress style={{ color: '#ffffff' }} /> {/* インジケータの色を白に設定 */}
    </Box>
  );
};

export default LoadingScreen;
