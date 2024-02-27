import React from "react";
import { useFonts, Montserrat_500Medium, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { useSelector, useDispatch } from "react-redux";

import { store } from "./store";
import { setUsername, setPassword } from "./slice";

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

	// wait for fonts to load
	if (!fontsLoaded) {
		return null;
	}
	
	return username == "" || password == "" ? 
		(<SplashStackScreen />) 
		:
		(<TabScreen />);
}