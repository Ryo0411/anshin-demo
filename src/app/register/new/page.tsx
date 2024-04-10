"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Header from "@/app/components/Header";
import { CreateOnseiData, CreateUser } from "@/api/dbCurd";
import { AddAudio } from "@/api/animoApi";
import { useWavConverter } from "@/app/components/useWavConverter";
import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert";
import AudioOptions from "@/app/components/AudioOptions";

type FormType = {
  name: string;
  sex: number;
};

type UserType = {
  id: number;
  name: string;
  sex: number;
  del_flg: number;
  wanderer_flg: number;
};

function RegisterNew() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormType>({
    defaultValues: {
      sex: 0,
    }
  });
  const [sexValue, setSexValue] = useState<number>(0);
  const [resetAudio, setResetAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { convertToWav, wavBlobUrl, resetWavUrl } = useWavConverter();
  const [user, setUser] = useState<UserType | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");

  const resetAudioData = () => {
    setSexValue(0);
    setResetAudio(prev => !prev);
  };

  useEffect(() => {
    // wavBlobUrlが設定され、かつuser情報が利用可能な場合にのみAPIを呼び出す
    if (wavBlobUrl && user) {
      (async () => {
        try {
          const response = await AddAudio(user.id, wavBlobUrl);
          console.log(response);
          await CreateOnseiData(response.id, response.audio_name);
          resetWavUrl();

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
  }, [wavBlobUrl]);

  // 登録処理
  const submit = async (data: FormType) => {
    try {
      const newUser = await CreateUser(data);
      setUser(newUser);
      console.log(newUser);

      // 音声ファイルがある場合、変換処理を行う
      if (audioUrl) {
        await convertToWav(audioUrl);
        // ファイル選択状態や録音状態もリセットする
        resetAudioData();
        // フォームの入力値をリセット
        reset();
        return;
      } else {
        // 成功した場合の処理
        setMessage("Success");
        setShowSuccess(true);

        // フォームの入力値をリセット
        reset();
        // ファイル選択状態や録音状態もリセットする
        resetAudioData();
        return;
      }
    } catch (error) {
      console.error("User creation or audio conversion failed:", error);
      setMessage("Error");
      setShowError(true);
      return;
    }
  };

  const handleAudioUrlChange = (url: string | null) => {
    setAudioUrl(url);
  };

  return (
    <div className="container">
      <Header />
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        <form onSubmit={handleSubmit(submit)}>
          <Stack spacing={3}>
            {/* TextField */}
            <TextField
              label="名前"
              {...register("name", {
                required: "必須項目です",
              })}
            />
            {errors.name && (
              <Typography
                color="error"
                style={{ marginTop: "0", marginBottom: "auto" }}
              >
                {errors.name.message}
              </Typography>
            )}

            {/* RadioButton for Sex */}
            <FormControl>
              <FormLabel>性別</FormLabel>
              <RadioGroup row value={sexValue}>
                <FormControlLabel
                  value={0}
                  control={<Radio {...register('sex')} />}
                  label="男"
                />
                <FormControlLabel
                  value={1}
                  control={<Radio {...register("sex")} />}
                  label="女"
                />
              </RadioGroup>
            </FormControl>

            <AudioOptions
              resetAudio={resetAudio}
              onAudioUrlChange={handleAudioUrlChange}
            />
            <Button type="submit" color="primary" variant="contained">
              登録
            </Button>
          </Stack>
        </form>
        {showSuccess && <SuccessAlert message={message} onClose={() => setShowSuccess(false)} />}
        {showError && <ErrorAlert message={message} onClose={() => setShowError(false)} />}
      </Container>
    </div>
  );
}

export default RegisterNew;
