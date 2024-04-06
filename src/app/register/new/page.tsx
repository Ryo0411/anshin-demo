"use client";
import React, { useState, useRef, useEffect } from "react";
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
  Box,
  Typography,
} from "@mui/material";
import Header from "@/app/components/Header";
import StartRec from "@/app/components/startRec";
import { CreateUser } from "@/api/dbCurd";
import { AddAudio } from "@/api/animoApi";
import { useWavConverter } from "@/app/components/useWavConverter";
import SuccessAlert from "@/app/components/SuccessAlert";
import ErrorAlert from "@/app/components/ErrorAlert ";

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
  } = useForm<FormType>();
  const [selectedOption, setSelectedOption] = useState<string>("record");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { convertToWav, wavBlobUrl, resetWavUrl } = useWavConverter();
  const [user, setUser] = useState<UserType | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");

  // 録音したURL
  const handleAudioReady = (url: string) => {
    setAudioUrl(null);
    console.log("Recorded audio URL: ", url);
    setAudioUrl(url);
    // ここで録音された音声の URL を使用した処理を行う
  };

  // オプションの変更をハンドル
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setAudioUrl(null);
    setFileName(null);
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      // audioUrlを更新
      setAudioUrl(fileUrl);
      setFileName(file.name);
    }
  };

  const handleClick = () => {
    // .currentがnullでないことを確認してからclickイベントを発火
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClose = () => {
    setShowSuccess(false); // ポップアップを閉じる
  };

  useEffect(() => {
    // wavBlobUrlが設定され、かつuser情報が利用可能な場合にのみAPIを呼び出す
    if (wavBlobUrl && user) {
      (async () => {
        try {
          const response = await AddAudio(user.id, wavBlobUrl);
          console.log(response);
          resetWavUrl();

          // 成功した場合の処理
          setMessage("Success");
          setShowSuccess(true);
        } catch (error) {
          console.error("API call failed:", error);
          // 失敗した場合の処理
          setMessage("Error");
          setShowError(true);
          return;
        }
      })();
    }
    // }, [wavBlobUrl, user]);
  });

  // 登録処理
  const submit = async (data: FormType) => {
    try {
      const newUser = await CreateUser(data);
      setUser(newUser);
      console.log(newUser);

      // 音声ファイルがある場合、変換処理を行う
      if (audioUrl) {
        await convertToWav(audioUrl);
      } else {
        // 成功した場合の処理
        setMessage("Success");
        setShowSuccess(true);

        // フォームの入力値をリセット
        reset();
        // ファイル選択状態や録音状態もリセットする
        setAudioUrl(null);
        setFileName(null);
      }
    } catch (error) {
      console.error("User creation or audio conversion failed:", error);
      return;
    }
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
              <RadioGroup row defaultValue={0}>
                <FormControlLabel
                  value={0}
                  control={<Radio {...register("sex")} />}
                  label="男"
                />
                <FormControlLabel
                  value={1}
                  control={<Radio {...register("sex")} />}
                  label="女"
                />
              </RadioGroup>
            </FormControl>

            {/* Option RadioButtons */}
            <FormControl>
              <FormLabel>オプション</FormLabel>
              <RadioGroup
                row
                value={selectedOption}
                onChange={handleOptionChange}
              >
                <FormControlLabel
                  value="record"
                  control={<Radio />}
                  label="音声録音"
                />
                <FormControlLabel
                  value="upload"
                  control={<Radio />}
                  label="音声アップロード"
                />
              </RadioGroup>
            </FormControl>

            {/* Conditional content based on selected option */}
            {selectedOption === "record" && (
              <>
                <StartRec onAudioReady={handleAudioReady} />
                {audioUrl && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="top"
                    justifyContent="top"
                    my={2}
                  >
                    <audio controls src={audioUrl} />
                  </Box>
                )}
              </>
            )}

            {selectedOption === "upload" && (
              <>
                <Box
                  display="flex"
                  sx={{
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                  }}
                >
                  <input
                    accept=".wav"
                    style={{ display: "none" }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleChangeFile}
                    ref={fileInputRef}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      variant="contained"
                      color="info"
                      onClick={handleClick}
                      size="small"
                    >
                      ファイル選択
                    </Button>
                  </label>
                  <Box
                    marginLeft={1}
                    fontSize="0.7rem"
                    sx={{
                      mt: {
                        xs: 1,
                        sm: 0,
                      },
                    }}
                  >
                    アップロードする音声形式はwav。
                    <br />
                    質の悪い音声ファイルはアップロードしないでください。
                  </Box>
                </Box>
                {fileName && (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    ファイル名: {fileName}
                  </Typography>
                )}
                {audioUrl && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="top"
                    justifyContent="top"
                    my={2}
                  >
                    <audio controls src={audioUrl} />
                  </Box>
                )}
              </>
            )}
            <Button type="submit" color="primary" variant="contained">
              登録
            </Button>
          </Stack>
        </form>
        <div>
          {/* フォームや他のUI要素 */}
          {showSuccess && (
            <SuccessAlert message={message} onClose={handleClose} />
          )}
        </div>
        <div>
          {/* エラーをトリガーする何らかのUI要素 */}
          {showError && (
            <ErrorAlert message={message} onClose={() => setShowError(false)} />
          )}
        </div>
      </Container>
    </div>
  );
}

export default RegisterNew;
