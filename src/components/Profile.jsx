import { TouchableOpacity, View, Alert, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { openBrowserAsync } from 'expo-web-browser';
import { Image } from "expo-image";
import { useState, useEffect } from "react";

import Text from "./Text";
import { styles, colors } from "../styles";

export default function Profile({navigation, userData, username, password}){
	const [following, setFollowing] = useState(false);

	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password + "&user=" + userData.username
	};

	useEffect(() => {setFollowing(userData?.friends?.followers.includes(username))})

	function followButton(){
		if(userData?.username === username) return (<></>);

		if(following){
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
		userData.friends.followers.push(username);
		setFollowing(true);
		fetch('https://jahanrashidi.com/sm/api/follow.php', requestOptions);
	}
	
	async function unfollow(){
		userData.friends.followers.splice(userData.friends.followers.indexOf(username));
		setFollowing(false);
		fetch('https://jahanrashidi.com/sm/api/unfollow.php', requestOptions);
	}

	function gotoChat(){
		fetch("https://jahanrashidi.com/sm/api/create_chat.php", requestOptions).then(response => response.json())
			.then(data => navigation.navigate("ChatStack", {screen: "Chat", initial: false, params: {chat_id: data.chat_id, receiver: userData.username}}));
	}
	
	if(userData.pfp == undefined) return (<></>);
	
	return (
	<View>
		{username == userData.username ? (
			<>
			<TouchableOpacity style={styles.settings} onPress={() => navigation.navigate("Settings")}>
				<Ionicons name="settings" size={32} color="white" />
			</TouchableOpacity>
			<TouchableOpacity style={styles.savedPostsButton} onPress={() => navigation.navigate("Saved")}>
				<Ionicons name="bookmark" size={32} color="white" />
			</TouchableOpacity>
			</>
		) : (
			<TouchableOpacity style={styles.settings} onPress={gotoChat}>
				<Ionicons name="chatbubble" size={32} color="white" />
			</TouchableOpacity>
		)}
		<View style={styles.profile}>
			<Image source={userData.pfp} style={styles.pfp} />
			<View style={{marginVertical: 16, flexDirection: "row"}}>
				<Text style={{fontSize: 32, marginRight: 4}}>{userData.display_name}</Text>
				{followButton()}
			</View>
			<View style={{marginBottom: 10, flexDirection: "row", gap: 16}}>
				<TouchableOpacity onPress={() => navigation.push("Followers", {user: userData.username, referrerTitle: userData.display_name})}>
					<Text style={styles.link}>{userData?.friends?.followers.length + " followers"}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.push("Following", {user: userData.username, referrerTitle: userData.display_name})}>
					<Text style={styles.link}>{userData?.friends?.following.length + " following"}</Text>
				</TouchableOpacity>
			</View>
			{userData.bio?.link == "" ? (<></>) : 
				(<TouchableOpacity onPress={() => openBrowserAsync(userData.bio?.link)} >
					<Text style={styles.link}>{userData.bio?.link}</Text>
				</TouchableOpacity>)
			}
			
			<Text>{userData.bio?.text}</Text>
			
			{userData.username == username ? (
				<View style={{marginVertical: 10, flexDirection: "row"}}>
					<TouchableOpacity onPress={() => navigation.navigate("Edit profile", {userData: userData})}>
						<Text style={styles.link}>Edit profile</Text>
					</TouchableOpacity>
				</View>) : (<></>)
			}
		</View>
	</View>);
}