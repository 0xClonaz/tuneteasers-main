import { Button, Container, Grid, Typography, useTheme } from "@mui/material";
import React from "react";

import { DoorBack } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import LobbyLeaderboard from "../components/WaitingLobby/LobbyLeaderboard";

function Result() {
  const theme = useTheme();
  const { state } = useLocation();

  return (
    <Container>
      <Grid
        container
        flexDirection="column"
        justifyContent="space-between"
        height="100vh"
        spacing={4}
      >
        <Grid item>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item>
              <img src="/logo.svg" alt="Logo" style={{ maxWidth: "30px" }} />
            </Grid>
            <Grid item>
              <Typography
                variant="h5"
                textAlign="center"
                color={theme.palette.info.main}
              >
                Eredmény
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" color={"white"}>
                Kilépés
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <LobbyLeaderboard leaderboard={state} />

        <Grid
          item
          container
          justifyContent="space-around"
          alignItems={"center"}
        >
          <Button
            type="submit"
            variant="contained"
            color="warning"
            startIcon={<DoorBack />}
          >
            KILÉPÉS
          </Button>
        </Grid>
        <Grid item container justifyContent="space-between">
          <Grid item>
            <Typography>Játékosok</Typography>
          </Grid>
          <Grid item>
            <Typography>Válasz témát</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Result;
