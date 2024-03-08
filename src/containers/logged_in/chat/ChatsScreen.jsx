import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, SafeAreaView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSelector, useDispatch } from "react-redux";

import { setMessages } from "../../../slice";
import Text from "../../../components/Text";
import { styles, colors } from "../../../styles";

export default function ChatsScreen({route, navigation}){
	const [chats, setChats] = useState([]);
	const [query, setQuery] = useState("");
	const dispatch = useDispatch();
	
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

	useEffect(() => {
		if(chats[0] == undefined) return;

		let unread = 0;

		chats.forEach(chat => {
			unread += chat.unseen[username];
		});

		dispatch(setMessages(unread));
	}, [chats]);

	function results(){
		if(query == "") return;

		navigation.navigate("ChatResults", {query: query});
		setQuery("");
	}

	return (
	<SafeAreaView style={{margin: 10}}>
		<FlatList data={chats} style={{height: "100%"}} renderItem={({item}) => (
			<TouchableOpacity onPress={() => navigation.navigate("Chat", {chat_id: item.id, receiver: item.receiver.username})} style={styles.chat}>
				<Image source={item.receiver.pfp} style={{width: 36, height: 36, borderRadius: 18, marginRight: 10}} />
				<View>
					<Text style={styles.link}>{item.receiver.username}</Text>
					<Text style={{color: item.unseen[username] == 0 ? colors.faint2 : colors.text}}>{item.last_message}</Text>
				</View>
			</TouchableOpacity>
		)} keyExtractor={chat => chat.receiver.username} ListHeaderComponent={(
			<View style={{borderRadius: 8,
		height: 50,
		backgroundColor: colors.input,
		marginBottom: 10,
		flexDirection: "row"}}>
				<TextInput style={styles.searchInput} onChangeText={setQuery} value={query} keyboardAppearance="dark" onSubmitEditing={results} autoCorrect={false} />
				<TouchableOpacity style={styles.searchButton} onPress={results}>
					<Ionicons color="white" size={32} name="search" />
				</TouchableOpacity>
			</View>
		)} />
	</SafeAreaView>
	);
}