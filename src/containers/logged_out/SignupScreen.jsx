import { View, TextInput } from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";

import AuthButton from "../../components/AuthButton";
import Text from "../../components/Text";
import { styles } from "../../styles";
import { save } from "../../storage";
import { setUsername, setPassword } from "../../slice";

export default function SignupScreen({route, navigation}) {
	const [username, onChangeUsername] = useState("");
	const [password, onChangePassword] = useState("");
	const [verify, onChangeVerify] = useState("");
	const [message, setMessage] = useState("");
	const dispatch = useDispatch();
	
	function verifyPassword(){
		if(verify !== password){
			setMessage("Passwords don't match");
			return false;
		}
		
		if(password.length < 8){
			setMessage("Password must be at least 8 characters");
			return false;
		}
		
		if(!password.match(/[a-z]/g)){
			setMessage("Password requires lowercase letter");
			return false;
		}
		
		if(!password.match(/[A-Z]/g)){
			setMessage("Password requires uppercase letter");
			return false;
		}
		
		if(!password.match(/[0-9]/g)){
			setMessage("Password requires number");
			return false;
		}
		
		if(username.length <= 3){
			setMessage("Username must be more than 3 characters");
			return false;
		} 
		
		if(username.length >= 20){
			setMessage("Username must be less than 20 characters");
			return false;
		}
		
		const regex = /^[a-z0-9_\.]+$/.exec(username);
		if(!regex){
			setMessage("Username can only have lowercase letters, numbers, underscores and periods.");
			return false
		}
		
		return true;
	}
	
	function signup(){
		if(verifyPassword()){
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: "username=" + username.toLowerCase() + "&password=" + password
			};
			fetch('https://jahanrashidi.com/sm/api/signup.php', requestOptions)
				.then(response => response.json())
				.then(data => {
					const response = data.response;
					
					if(response == "Success"){
						save("username", username);
						save("password", password);
						dispatch(setUsername(username.toLowerCase()));
						dispatch(setPassword(password));
					} else {
						setMessage(response);
					}
				});
		}
	}
	
	return (
		<View style={{backgroundColor: "#282828", height: "100%"}}>
			<TextInput placeholder="Username" autoComplete="username" style={styles.authInput} autoCapitalize="none" autoFocus={true} onChangeText={onChangeUsername} value={username} keyboardAppearance="dark" />
			<TextInput placeholder="Password" secureTextEntry autoComplete="password" style={styles.authInput} onChangeText={onChangePassword} value={password} keyboardAppearance="dark" />
			<TextInput placeholder="Verify password" secureTextEntry style={styles.authInput} onChangeText={onChangeVerify} value={verify} keyboardAppearance="dark" />
			
			<AuthButton onPress={signup}>Sign-up</AuthButton>
			
			<Text>{message}</Text>
		</View>
	);
}