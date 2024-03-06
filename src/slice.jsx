import { createSlice } from "@reduxjs/toolkit";

const initialState = {username: "", password: "", messages: 0};

export const slice = createSlice({name: "auth", initialState, reducers: {
	setUsername: (state, action) => {state.username = action.payload},
	setPassword: (state, action) => {state.password = action.payload},
	setMessages: (state, action) => {state.messages = action.payload},
}});

export const { setUsername, setPassword, setMessages } = slice.actions;
export default slice.reducer;