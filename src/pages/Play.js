import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Container,
  Grid,
  Hidden,
  LinearProgress,
  List,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import QuizQuestions from "../components/PlayLobby/QuizQuestions"
import socket from "../app/socket"
import { useNavigate, useParams } from "react-router-dom"
import { DoorBack } from "@mui/icons-material"
import LobbyLeaderboard from "../components/WaitingLobby/LobbyLeaderboard"
import VolumeSlider from "../components/PlayLobby/VolumeSlider"
import ChatBox from "../components/ChatBox/ChatBox"
import theme from "../theme/theme"
import MyConfetti from "../components/PlayLobby/MyConfetti"

function Play() {
  const [question, setQuestion] = useState(null)
  const [isGameEnded, setIsGameEnded] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [countDownTimer, setCountDownTimer] = useState(null)
  const [delayCountdown, setDelayCountdown] = useState(null)
  const [gameMode, setGameMode] = useState(null)
  const isOwner = () => {
    const userInfo = window.localStorage.getItem("userInfo")
    const parsedUserInfo = JSON.parse(userInfo)

    if (roomId == parsedUserInfo.roomId && parsedUserInfo.isOwner) {
      return true
    }
    return false
  }
  useEffect(() => {
    const updateLeaderboard = (data) => {
      setLeaderboard(data)
    }
    const newQuestion = (data) => {
      setQuestion(data)
      setDelayCountdown(null)

      if (isOwner()) {
        socket.emit("next_question", parseInt(roomId))
      }
    }

    const gameEnded = () => {
      setIsGameEnded(true)
      setCountDownTimer(null)
      setDelayCountdown(null)
    }
    socket.on("question_init", (data) => {
      setGameMode(data)

      if (isOwner()) {
        socket.emit("next_question", parseInt(roomId))
      }
    })
    const handleCountDownToNextQuestion = (delayCountdown) => {
      setDelayCountdown(delayCountdown)
      setCountDownTimer(null)
    }
    socket.on("going_to_next_question", handleCountDownToNextQuestion)
    socket.on("countdown_to_next_question", (time) => {
      setCountDownTimer(time)
    })
    socket.emit("room_game_init", parseInt(roomId))
    socket.on("new_question", newQuestion)
    socket.on("leaderboard_updated", updateLeaderboard)
    socket.on("correct_answer", updateLeaderboard)
    socket.on("game_ended", gameEnded)
    // Clean up the event listeners when component unmounts
    return () => {
      socket.off("going_to_next_question", handleCountDownToNextQuestion)

      socket.off("room_game_init")
      socket.off("new_question", newQuestion)
      socket.off("leaderboard_updated", updateLeaderboard)
      socket.off("correct_answer", updateLeaderboard)
      socket.off("game_ended", gameEnded)
      socket.off("next_question", parseInt(roomId))
    }
  }, [roomId])

  const handleQuit = (roomId) => {
    socket.emit("leave_room", parseInt(roomId))
    navigate("/", { replace: true })
  }
  let progressMultiplyValue
  let delayProgressMultiplyValue = 100 / 3
  switch (gameMode) {
    case "Fast":
      progressMultiplyValue = 33 // 20
      break
    case "Slow":
      progressMultiplyValue = 5 // 3
      break
    default:
      progressMultiplyValue = 20 // 5
      break
  }
  return (
    <Container maxWidth="md" style={{ height: "100vh", padding: "2rem" }}>
      <Stack
        spacing={4}
        direction="column"
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={"flex-end"}
          spacing={5}
        >
          <img src="/logo.svg" alt="Logo" style={{ maxWidth: "30px" }} />
          <Box sx={{ width: "100%" }}>
            {delayCountdown ? (
              <>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="white"
                >
                  KÖVETKEZŐ KÉRDÉS
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={delayCountdown * delayProgressMultiplyValue}
                  color="info"
                />
              </>
            ) : (
              <>
                <LinearProgress
                  variant="determinate"
                  value={countDownTimer * progressMultiplyValue}
                  color="error"
                />
              </>
            )}
          </Box>
          <Button
            type="text"
            color="error"
            onClick={() => {
              handleQuit(roomId)
            }}
          >
            <Typography>KILÉPÉS</Typography>
          </Button>
        </Stack>

        <Stack spacing={3} justifyContent={"space-between"} flex={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} alignSelf={"flex-start"}>
              <LobbyLeaderboard leaderboard={leaderboard} />
            </Grid>
            <Hidden smDown>
              <Grid item sm={6}>
                <ChatBox play={true} />
              </Grid>
            </Hidden>
          </Grid>
          {!isGameEnded && (
            <QuizQuestions
              delayCountdown={delayCountdown}
              question={question}
              setCountDownTimer={setCountDownTimer}
              timer={countDownTimer}
            />
          )}
          {!isGameEnded && !question ? (
            <Stack spacing={1}>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                color={theme.palette.error.main}
              >
                Játék szabályok:
              </Typography>
              <List>
                <ListItemText>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.primary}
                  >
                    <b>Az első ember</b> aki helyesen válaszol kap{" "}
                    <b>2 pontot</b>.
                  </Typography>
                </ListItemText>
                <ListItemText>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.primary}
                  >
                    Új kérdés jön, ha:
                  </Typography>
                </ListItemText>

                <ListItemText inset>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.primary}
                  >
                    <b>- Letelt az idő</b>
                  </Typography>
                </ListItemText>
                <ListItemText inset>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.primary}
                  >
                    <b>- Mindenki válaszolt</b>
                  </Typography>
                </ListItemText>
              </List>
            </Stack>
          ) : (
            ""
          )}
          {isGameEnded ? (
            <Stack
              direction="row"
              width="100%"
              justifyContent={"center"}
              alignItems={"center"}
              mt={3}
            >
              <MyConfetti />
              <Button
                type="submit"
                variant="contained"
                color="info"
                startIcon={<DoorBack />}
                onClick={() => {
                  handleQuit(roomId)
                }}
              >
                KILÉPÉS
              </Button>
            </Stack>
          ) : (
            ""
          )}
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <VolumeSlider question={question} />
          {countDownTimer ? (
            <Typography color={theme.palette.info.main}>
              {countDownTimer}
            </Typography>
          ) : (
            ""
          )}
        </Stack>
      </Stack>
    </Container>
  )
}

export default Play
