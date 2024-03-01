import { View, TextInput } from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { requestPermissionsAsync, getExpoPushTokenAsync } from "expo-notifications";

import AuthButton from "../../components/AuthButton";
import Text from "../../components/Text";
import { styles } from "../../styles";
import { save } from "../../storage";
import { setUsername, setPassword } from "../../slice";

export default function LoginScreen({route, navigation}) {
	const [username, onChangeUsername] = useState("");
	const [password, onChangePassword] = useState("");
	const [message, setMessage] = useState("");
	const dispatch = useDispatch();
	
	function login(){
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password
		};
		
		fetch('https://jahanrashidi.com/sm/api/info_correct.php', requestOptions)
			.then(response => response.json())
			.then(data => {
				const response = data.response;
				
				if(data.response === "Correct info"){
					save("username", username.toLowerCase());
					save("password", password);

					requestPermissionsAsync().then(status => {
						if(status.granted){
							getExpoPushTokenAsync({projectId: "2bb968e4-c704-40c2-8248-68a3862b431a"}).then(token => {
								requestOptions.body += "&token=" + token.data;
								
								fetch("https://jahanrashidi.com/sm/api/set_notification_token.php", requestOptions);
							});
						}
					});

					dispatch(setUsername(username.toLowerCase()));
					dispatch(setPassword(password));
				} else {
					setMessage(response);
				}
			});
	}
	
	return (
		<View style={{backgroundColor: "#282828", height: "100%"}}>
			<TextInput placeholder="Username" autoComplete="username" style={styles.authInput} autoCapitalize="none" autoFocus={true} onChangeText={onChangeUsername} value={username} keyboardAppearance="dark" />
			<TextInput placeholder="Password" secureTextEntry autoComplete="password" style={styles.authInput} onChangeText={onChangePassword} value={password} keyboardAppearance="dark" />
			
			<AuthButton onPress={login}>Log-in</AuthButton>
			
			<Text>{message}</Text>
		</View>
	);
}