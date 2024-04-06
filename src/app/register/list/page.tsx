"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import Header from "@/app/components/Header";
import { GetUser, PatchUser } from "@/api/dbCurd";

type UserType = {
  id: number;
  name: string;
  sex: number;
  del_flg: number;
  wanderer_flg: number;
};

function RegisterList() {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const getUser = await GetUser();
      const data = {
        users: getUser,
      };
      setUsers(data.users.filter((user: UserType) => user.del_flg === 0));
    };

    fetchUsers();
  }, []);

  // 徘徊者フラグを更新するための関数
  const handleWandererChange = async (id: number, checked: boolean) => {
    try {
      // 徘徊者フラグの更新APIを呼び出す
      await PatchUser(id, checked ? 1 : 0);

      // ユーザーリストの更新
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, wanderer_flg: checked ? 1 : 0 } : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="container">
      <Header />
      <Box sx={{ maxWidth: 600, mx: "auto", my: 4 }}>
        {users.map((user) => (
          <Card key={user.id} sx={{ mb: 2 }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>{user.id}</Typography>
              <Link href={`/register/list/${user.id}`} passHref>
                <Typography
                  variant="h6"
                  component="a"
                  style={{ cursor: "pointer" }}
                >
                  {user.name}
                </Typography>
              </Link>
              <Typography>{user.sex === 0 ? "男" : "女"}</Typography>
              <FormControlLabel
                label="徘徊者フラグ"
                control={
                  <Checkbox
                    checked={user.wanderer_flg === 1}
                    onChange={(e) =>
                      handleWandererChange(user.id, e.target.checked)
                    }
                  />
                }
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}

export default RegisterList;
