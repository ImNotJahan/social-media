import { View, Button, Alert } from "react-native";
import { useDispatch } from "react-redux";

import { clearAll } from "../../storage";
import { styles, colors } from "../../styles";
import { setUsername, setPassword } from "../../slice";

export default function SettingsScreen({navigation}){
	const dispatch = useDispatch();

	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password
	};

	function logout(){
		clearAll();
				
		fetch("https://jahanrashidi.com/sm/api/set_notification_token.php", requestOptions);

		dispatch(setUsername(""));
		dispatch(setPassword(""));
	}

	return (
		<View>
			<Button style={styles.link} color={colors.link} title="Log-out" onPress={() => Alert.alert("Log-out", "Are you sure you want to log-out?",
				[{text: "Log-out", onPress: () => { logout(); }}, {text: "Cancel"}],
				{userInterfaceStyle: "dark"}
			)} />
		</View>
	);
}