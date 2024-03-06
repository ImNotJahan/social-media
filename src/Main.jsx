import React from "react";
import { useFonts, Montserrat_500Medium, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { useSelector, useDispatch } from "react-redux";
import { View } from "react-native";

import { store } from "./store";
import {clearAll} from "./storage"
import { setUsername, setPassword, setMessages } from "./slice";

import { colors } from "./styles";

import { get } from './storage';
import { SplashStackScreen, TabScreen } from "./containers/Stacks";

export default function Main() {
	const [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_500Medium });
	const username = useSelector((state) => state.auth.username);
	const password = useSelector(state => state.auth.password);
	const dispatch = useDispatch();


	React.useEffect(() => {
		const firstLoad = async () => {
			await get("username").then(username => dispatch(setUsername(username)))
				.then(() => get("password").then(password => dispatch(setPassword(password))));
		};

		firstLoad();
    }, []);

    React.useEffect(() => {
    	const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password
		};

		if(username == "") return;

		fetch("https://jahanrashidi.com/sm/api/chats.php", requestOptions).then(response => response.json())
			.then(data => {
				let unread = 0;

				data.forEach(chat => {
					unread += chat.unseen[username];
				});

				dispatch(setMessages(unread));
			});
		}, [password])

	// wait for fonts to load
	if (!fontsLoaded) {
		return null;
	}
	
	return (<View style={{height: "100%", backgroundColor: colors.background}}>{username == "" || password == "" || username == null ? 
		(<SplashStackScreen />) 
		:
		(<TabScreen />)}</View>);
}