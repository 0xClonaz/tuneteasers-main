import { Button, Grid, TextField, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import socket from "../../app/socket";

const SignInForm = () => {
  const theme = useTheme();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  const [isJoinRoom, setIsJoinRoom] = useState(false);
  const [noRoomFound, setNoRoomFound] = useState(false);


  const JoinRoomSchema = Yup.object().shape({
    name: Yup.string().required("Név megadása kötelező"),
    roomNumber: Yup.number().required("Szoba száma megadása kötelező"),
  });

  const CreateRoomSchema = Yup.object().shape({
    name: Yup.string().required("Név megadása kötelező"),
  });

  const formik = useFormik({
    initialValues: {
      name: playerName,
      roomNumber: "",
    },
    validationSchema: isJoinRoom ? JoinRoomSchema : CreateRoomSchema,
    onSubmit: (values) => {
      const data = { name: values.name, roomId: parseInt(values.roomNumber) };
      if (isJoinRoom) {
        socket.emit("join_room", data);
      } else {
        let roomId = Math.floor(Math.random() * 50);
        socket.emit("create_room", { name: values.name, roomId: roomId });
        window.localStorage.setItem(
          "userInfo",
          JSON.stringify({
            roomId,
            isOwner: true,
          })
        );
        navigate(`/lobby/${roomId}`, {
          replace: true,
          state: data,
        });
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleCreateRoom = () => {
    setIsJoinRoom(false);
  };

  useEffect(() => {
    socket.on("join_room_error", ({ message }) => {
      formik.setFieldError("roomNumber", message); // Set error for the roomNumber field
      setNoRoomFound(true);
    });

    socket.on("join_room_success", (data) => {
      navigate(`/lobby/${data.roomId}`, {
        replace: true,
        state: data,
      });
    });

    return () => {
      socket.off("join_room_error");
      socket.off("join_room_success");
    };
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      component={"form"}
      onSubmit={formik.handleSubmit}
      spacing={2}
    ><a href="https://www.instagram.com/0xclonaz/">Fejlesző: Clonaz  |  Verzió 1.0  | Megjelenés: 2024.06.12</a>


    
      <Grid item xs={12}>
        <TextField
        
          error={formik.touched.name && Boolean(formik.errors.name)}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.name}
          helperText={formik.touched.name && formik.errors.name}
          variant="filled"
          fullWidth
          placeholder="Válasz becenevet"
          hiddenLabel
          id="name"
          name="name"
          autoComplete="off"
          color="warning"
          sx={{
            backgroundColor: theme.palette.background.paper,
            "& .MuiInputBase-input": {
              textAlign: "center",
              color: "white",
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={formik.touched.roomNumber && Boolean(formik.errors.roomNumber)}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.roomNumber}
          helperText={formik.touched.roomNumber && formik.errors.roomNumber}
          variant="filled"
          fullWidth
          id="roomNumber"
          placeholder="Írd be a szoba számát."
          hiddenLabel
          name="roomNumber"
          autoComplete="off"
          color="info"
          sx={{
            backgroundColor: theme.palette.background.paper,
            "& .MuiInputBase-input": {
              textAlign: "center",
              color: "white",
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="warning"
              onClick={handleCreateRoom}
            >
              Saját szoba készítése
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="info"
              onClick={() => setIsJoinRoom(true)}
            >
              Csatlakozás
            </Button>
            
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignInForm;
