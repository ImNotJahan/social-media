import { View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import Username from "../../../components/Username";
import Text from "../../../components/Text";
import { styles } from "../../../styles";

export default function CommentsScreen({route, navigation}){
	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);

	const [comments, setComments] = useState([]);
	const [message, setMessage] = useState("");
	let post_id = route.params?.post_id;
	
	if(route.params?.referrerTitle) navigation.setOptions({headerBackTitle: route.params.referrerTitle}); 
	
	async function comment(){
		const data = new FormData();
		data.append("username", username);
		data.append("password", password);
		data.append("id", post_id);
		data.append("comment", message);
		
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: data
		};
		
		setMessage("");
		
		fetch('https://jahanrashidi.com/sm/api/comment.php', requestOptions);
		
		refresh();
	}
	
	async function refresh(){
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password + "&id=" + post_id
		};
		
		fetch('https://jahanrashidi.com/sm/api/comments.php', requestOptions)
			.then(response => response.json())
			.then(data => setComments(data));
	}
	
	useEffect(() => {	
		refresh();
	}, [post_id]);

	return (
	<ScrollView>
		<View>
		{comments.map(comment => (
		<View style={{marginBottom: 10}}>
			<Username navigation={navigation}>{comment.poster}</Username>
			<Text>{comment.text}</Text>
		</View>))}
		</View>
	
		<View style={{flexDirection: 'row', marginVertical: 10, backgroundColor: "#141414", borderRadius: 10}}>
			<TextInput style={styles.messageInput} value={message} onChangeText={setMessage} keyboardAppearance="dark" />
			<TouchableOpacity onPress={comment} style={styles.sendButton}>
				<Ionicons name="send-sharp" color="#ddd" size={32} style={{marginTop: 4, marginRight: 4}} />
			</TouchableOpacity>
		</View>
	</ScrollView>
	);
}