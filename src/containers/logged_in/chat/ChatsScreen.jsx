import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, Image, View } from "react-native";
import { useSelector } from "react-redux";

import Text from "../../../components/Text";
import { styles } from "../../../styles";

export default function ChatsScreen({route, navigation}){
	const [chats, setChats] = useState([]);
	
	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);
	
	async function refresh(){
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password
		};
		
		fetch('https://jahanrashidi.com/sm/api/chats.php', requestOptions)
			.then(response => response.json())
			.then(data => setChats(data));
	}
	
	useEffect(() => {
		refresh();
		
		const interval = setInterval(() => {
			refresh();
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	return (
	<ScrollView>
	{chats.map(chat => (
		<TouchableOpacity key={chat.receiver.username} onPress={() => navigation.navigate("Chat", {chat_id: chat.id, receiver: chat.receiver.username})} style={styles.chat}>
			<Image source={{uri: chat.receiver.pfp}} style={{width: 36, height: 36, borderRadius: 18}} />
			<View>
				<Text style={styles.link}>{chat.receiver.username}</Text>
				<Text>{chat.last_message}</Text>
			</View>
		</TouchableOpacity>
	))}
	</ScrollView>
	);
}