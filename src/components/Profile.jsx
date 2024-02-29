import { TouchableOpacity, View, Image, Button, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { openBrowserAsync } from 'expo-web-browser';
import { useDispatch } from "react-redux";

import Text from "./Text";
import { styles, colors } from "../styles";
import { clearAll } from "../storage";
import { setUsername, setPassword } from "../slice";

export default function Profile({navigation, userData, username, password}){
	const dispatch = useDispatch();

	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password + "&user=" + userData.username
	};

	function logout(){
		clearAll();
		
		dispatch(setUsername(""));
		dispatch(setPassword(""));
	}

	function followButton(){
		if(userData?.username === username) return (<></>);

		if(userData?.friends?.followers.includes(username)){
			return (
			<TouchableOpacity onPress={unfollow}>
				<Ionicons name="person-remove" color="white" size={32} />
			</TouchableOpacity>
			);
		} else{
			return (
			<TouchableOpacity onPress={follow}>
				<Ionicons name="person-add" color="white" size={32} />
			</TouchableOpacity>
			);
		}
	}
	
	async function follow(){
		fetch('https://jahanrashidi.com/sm/api/follow.php', requestOptions);
	}
	
	async function unfollow(){
		fetch('https://jahanrashidi.com/sm/api/unfollow.php', requestOptions);
	}
	
	if(userData.pfp == undefined) return (<></>);
	
	return (
	<View style={styles.profile}>
		<Image source={{uri: userData.pfp}} style={styles.pfp} />
		<View style={{marginVertical: 16, flexDirection: "row"}}>
			<Text style={{fontSize: 32, marginRight: 4}}>{userData.display_name}</Text>
			{followButton()}
		</View>
		<View style={{marginBottom: 10, flexDirection: "row"}}>
			<Button style={styles.link} color={colors.link} title={userData?.friends?.followers.length + " followers"} 
				onPress={() => navigation.navigate("Followers", {user: userData.username, referrerTitle: userData.display_name})} />
			<Button style={styles.link} color={colors.link} title={userData?.friends?.following.length + " following"} 
				onPress={() => navigation.navigate("Following", {user: userData.username, referrerTitle: userData.display_name})} />
		</View>
		{userData.bio?.link == "" ? (<></>) : (<Button style={styles.link} color={colors.link} title={userData.bio?.link} onPress={() => openBrowserAsync(userData.bio?.link)} />)}
		
		<Text>{userData.bio?.text}</Text>
		
		{userData.username == username ? (
			<View style={{marginVertical: 10, flexDirection: "row"}}>
				<Button style={styles.link} color={colors.link} title="Edit profile" onPress={() => navigation.navigate("Edit profile", {userData: userData})} />
				<Button style={styles.link} color={colors.link} title="Log-out" onPress={() => Alert.alert("Log-out", "Are you sure you want to log-out?",
							[{text: "Log-out", onPress: () => { logout(); }}, {text: "Cancel"}]
						)} />
			</View>) : (<></>)
		}
	</View>
	);
}