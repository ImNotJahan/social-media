import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, Image, View, SafeAreaView } from "react-native";
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
	<SafeAreaView style={{margin: 10}}>
		<FlatList data={chats} renderItem={({item}) => (
			<TouchableOpacity onPress={() => navigation.navigate("Chat", {chat_id: item.id, receiver: item.receiver.username})} style={styles.chat}>
				<Image source={{uri: item.receiver.pfp}} style={{width: 36, height: 36, borderRadius: 18, marginRight: 10}} />
				<View>
					<Text style={styles.link}>{item.receiver.username}</Text>
					<Text>{item.last_message}</Text>
				</View>
			</TouchableOpacity>
		)} keyExtractor={chat => chat.receiver.username} />
	</SafeAreaView>
	);
}