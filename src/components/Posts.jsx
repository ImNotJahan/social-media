import { View, TouchableOpacity, Dimensions, Modal, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from "react";

import Text from "./Text";
import { styles } from "../styles";
import Post from "./Post";

export default function Posts({username, password, posts, navigation, user}){
	if(posts.map == undefined) return (<></>);

	const [shareOpen, setShareOpen] = useState(false);
	const [shareId, setShareId] = useState(-1);
	const [recents, setRecents] = useState([]);

	useEffect(() => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password
		};
		
		fetch('https://jahanrashidi.com/sm/api/chats.php', requestOptions)
			.then(response => response.json())
			.then(data => setRecents(data.slice(0, 3)));
	}, []);

	function sendPost(id){
		setShareOpen(true);
		setShareId(id);
	}

	function msgPost(chatId){
		const data = new FormData();
		data.append("username", username);
		data.append("password", password);
		data.append("id", chatId);
		data.append("post", shareId);
		
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: data
		};
		
		setShareOpen(false);

		fetch('https://jahanrashidi.com/sm/api/send_post.php', requestOptions);
	}

	return (
	<View>{posts.map(post => (<Post username={username} password={password} post={post} navigation={navigation} user={user} sendPost={sendPost} key={post.id} />))}
		<Modal visible={shareOpen} animationType="slide" transparent={true}>
			<View style={styles.modal}>
				<View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 5}}>
					<Text style={{fontSize: 26}}>Share</Text>
					<TouchableOpacity onPress={() => setShareOpen(false)}>
						<Ionicons name="close" color="white" size={30} />
					</TouchableOpacity>
				</View>

				<View style={{flexDirection: "row", gap: 5}}>
					{recents.map(recent => (
					<TouchableOpacity key={recent.receiver.username} style={{width: "23%", alignItems: "center"}} onPress={() => msgPost(recent.id)}>
						<Image style={{width: 60, height: 60, borderRadius: 30}} source={{uri: recent.receiver.pfp}} />
						<Text numberOfLines={1}>{recent.receiver.username}</Text>
					</TouchableOpacity>
					))}
					<View style={{width: "23%", alignItems: "center", justifyContent: "center"}}>
						<Text>View more</Text>
					</View>
				</View>
			</View>
		</Modal>
	</View>);
}