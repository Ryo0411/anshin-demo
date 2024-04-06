import React from "react";
import Header from "../components/Header";
import { Box, Button, Grid } from "@mui/material";
import Link from "next/link";

function TopPage() {
  return (
    <div className="container">
      <div>
        <Header />
      </div>
      <div>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item xs={12}>
            <Box pt={3}>
              <Link href="/register/new" passHref>
                <Button variant="contained" color="info">
                  新規登録
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box pt={3}>
              <Link href="/register/list" passHref>
                <Button variant="contained" color="success">
                  登録一覧
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default TopPage;
