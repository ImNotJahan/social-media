import { createSlice } from "@reduxjs/toolkit";

const initialState = {username: "", password: ""};

export const slice = createSlice({name: "auth", initialState, reducers: {
	setUsername: (state, action) => {state.username = action.payload},
	setPassword: (state, action) => {state.password = action.payload},
}});

export const { setUsername, setPassword } = slice.actions;
export default slice.reducer;