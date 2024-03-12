import { ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { useDispatch } from "react-redux";

import { clearAll } from "../../storage";
import { styles, colors } from "../../styles";
import { setUsername, setPassword } from "../../slice";
import Text from "../../components/Text";

export default function SettingsScreen({navigation, route}){
	const dispatch = useDispatch();

	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password
	};

	function logout(){
		clearAll();

		// unassociate app instance notification token with previous account when logged out		
		fetch("https://jahanrashidi.com/sm/api/set_notification_token.php", requestOptions);

		dispatch(setUsername(""));
		dispatch(setPassword(""));
	}

	return (
		<ScrollView>
			<Title>Account</Title>
			<Setting title="Edit profile" onPress={() => navigation.navigate("Edit profile", {userData: route.params.userData})} />
			<Setting title="Account management" onPress={() => navigation.navigate("Account management")} />
			<Setting onPress={() => Alert.alert("Log-out", "Are you sure you want to log-out?",
				[{text: "Log-out", onPress: () => { logout(); }}, {text: "Cancel"}],
				{userInterfaceStyle: "dark"}
			)} title="Log-out" />
		</ScrollView>
	);
}

function Setting({onPress, title}){
	return (
	<TouchableOpacity onPress={onPress} style={styles.setting}>
		<Text>{title}</Text>
	</TouchableOpacity>
	);
}

function Title(props){
	return (
	<Text style={{fontFamily: "Montserrat_700Bold", marginTop: 8, marginLeft: 8}}>{props.children}</Text>
	);
}