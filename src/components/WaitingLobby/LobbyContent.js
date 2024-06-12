import { Share } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Paper,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React from "react";
import socket from "../../app/socket";

function LobbyContent({
  playerList,
  roomId,
  songNumbers,
  gameMode,
  checkIsOwner,
  handleStartPickingMusic,
  handleChangeGameMode,
  handleShareClick,
  setSongNumbers,
  handleChangeSongNumbers,
}) {
  const GAME_MODES = ["Chill(Lassú)", "Normális(Közepes)", "Nehéz(Gyors)"];

  return (
    <Stack spacing={3}>
      <Paper elevation={3}>
        <Stack spacing={3} p={3} alignItems="flex-start">
          <Typography variant="subtitle1">
            Barátokkal viccesebb, de ha nincsnek barátaid játszhatsz egyedül is. :)
          </Typography>
          <Typography variant="body2">
            Fejlesztő: Clonaz    |   Verzió 1.0
          </Typography>
          <AvatarGroup>
            {playerList.map((player) => (
              <Avatar key={player.id} src={player.image} sizes="40" />
            ))}
          </AvatarGroup>
          <Button
            type="submit"
            variant="contained"
            size="large"
            color="info"
            startIcon={<Share />}
            onClick={handleShareClick}
            sx={{ alignSelf: "center" }}
          >
            Room: {roomId}
          </Button>
        </Stack>
      </Paper>
      <Paper elevation={3}>
        <Stack spacing={3} p={3}>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            width="100%"
          >
            <Typography variant="subtitle1">Játék hossza</Typography>
            <Typography variant="subtitle2">{songNumbers} zene</Typography>
          </Stack>
          <Box width="100%">
            <Slider
              value={songNumbers}
              color="info"
              aria-label="Default"
              step={1}
              min={5}
              max={50}
              onChange={handleChangeSongNumbers}
              disabled={!checkIsOwner(playerList, socket.id)}
            />
          </Box>
          <Typography variant="subtitle1">Nehézség</Typography>
          <ToggleButtonGroup
            color="info"
            value={gameMode}
            exclusive
            onChange={handleChangeGameMode}
            fullWidth
            disabled={!checkIsOwner(playerList, socket.id)}
          >
            {GAME_MODES.map((mode, index) => (
              <ToggleButton key={index} value={mode}>
                {mode}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Button
              onClick={() => {
                handleStartPickingMusic();
              }}
              type="submit"
              variant="contained"
              color="warning"
              disabled={!checkIsOwner(playerList, socket.id)}
            >
              Játék indítása
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default LobbyContent;
