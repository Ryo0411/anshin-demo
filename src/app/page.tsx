import React from "react";
import { Box, Button, Grid } from "@mui/material";
import Link from "next/link";
import Header from "@/app/components/Header";

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
              <Link href="/register" passHref>
                <Button variant="contained" color="success">
                  徘徊者情報
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box pt={3}>
              <Link href="/identify" passHref>
                <Button variant="contained" color="warning">
                  識別
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
