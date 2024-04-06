"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Header from "@/app/components/Header";

// 型定義
type OnseiType = {
  id: number;
  user_id: number;
  audio_path: string;
  create_at: string;
  del_flg: number;
};

// 仮のAPIからのデータ取得関数
async function fetchOnseiLists() {
  // API呼び出しのシミュレーション
  return [
    {
      id: 1,
      user_id: 1,
      audio_path: "1",
      create_at: "2023-03-05T21:34:37.707825+09:00",
      del_flg: 0,
    },
    {
      id: 2,
      user_id: 1,
      audio_path: "1",
      create_at: "2023-03-05T21:34:37.707825+09:00",
      del_flg: 0,
    },
  ];
}

const OnseiListPage = () => {
  const [onseiLists, setOnseiLists] = useState<OnseiType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchOnseiLists();
      setOnseiLists(data); // データを状態にセット
    };

    fetchData();
  }, []);

  // 削除ボタンの処理
  const handleDelete = (id: number) => {
    // ここでは、del_flgを更新する処理をシミュレーションしています。
    // 実際には、APIを呼び出してサーバー側のデータを更新する必要があります。
    setOnseiLists(
      onseiLists.map((item) =>
        item.id === id ? { ...item, del_flg: 1 } : item
      )
    );
  };

  return (
    <div className="container">
      <Header />
      <Box sx={{ maxWidth: 1200, mx: "auto", my: 4 }}>
        <Grid container spacing={2}>
          {onseiLists
            .filter((item) => item.del_flg === 0)
            .map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    mb: 2,
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ display: "flex", flexGrow: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={2}>
                        <Typography variant="body2">ID: {item.id}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          Audio Path: {item.audio_path}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          Creation Date: {item.create_at}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </div>
  );
};

export default OnseiListPage;
