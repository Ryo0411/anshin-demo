import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import StartRec from "@/app/components/startRec";

interface AudioOptionsProps {
  onAudioUrlChange: ((value: string | null) => void);
  resetAudio: boolean;
}

const AudioOptions: React.FC<AudioOptionsProps> = ({ onAudioUrlChange, resetAudio }) => {
  const [selectedOption, setSelectedOption] = useState<string>("record");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 録音したURL
  const handleAudioReady = (url: string) => {
    setAudioUrl(null);
    console.log("Recorded audio URL: ", url);
    setAudioUrl(url);
  };

  const handleClick = () => {
    // .currentがnullでないことを確認してからclickイベントを発火
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setAudioUrl(null);
    setFileName(null);
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioUrl(fileUrl);
      setFileName(file.name);
    }
  };

  // onAudioUrlChange 関数が変更されるたびに実行される
  useEffect(() => {
    if (audioUrl) {
      onAudioUrlChange(audioUrl);
    } else if (fileName) {
      onAudioUrlChange(fileName);
    } else {
      onAudioUrlChange(null);
    }
  }, [audioUrl, fileName]);

  useEffect(() => {
    setAudioUrl(null);
    setFileName(null);
    onAudioUrlChange(null);
    setSelectedOption('record');
  }, [resetAudio]);

  return (
    <Stack spacing={3}>
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
      {/* ラジオボタンとその他の要素 */}
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
    </Stack>
  );
};

export default AudioOptions;
