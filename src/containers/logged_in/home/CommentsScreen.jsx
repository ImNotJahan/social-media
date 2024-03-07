import { View, FlatList, TextInput, TouchableOpacity, SafeAreaView, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import Username from "../../../components/Username";
import Text from "../../../components/Text";
import { styles } from "../../../styles";
import parse from "../../../parse";

export default function CommentsScreen({route, navigation}){
	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);

	const [comments, setComments] = useState([]);
	const [message, setMessage] = useState("");
	const [optionsOpen, setOptionsOpen] = useState(false);
	const [commentFocus, setCommentFocus] = useState(-1);

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

	function remove(arr, index){
		let newArr = [];

		for(let i = 0; i < arr.length; i++){
			if(i != index) newArr.push(arr[i]);
		}

		return newArr;
	}

	async function deleteComment(){
		const data = new FormData();
		data.append("username", username);
		data.append("password", password);
		data.append("cid", commentFocus);
		data.append("id", post_id)

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: data
		};
				
		fetch('https://jahanrashidi.com/sm/api/delete_comment.php', requestOptions);

		setOptionsOpen(false);
		setComments(remove(comments, commentFocus));
	}
	
	function commentOptions(id){
		setOptionsOpen(true);
		setCommentFocus(id);
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

	let i = 0;

	return (
	<SafeAreaView>
		<FlatList data={comments} extractKey={comment => i++} renderItem={({item}) => (
			<TouchableOpacity style={styles.comment} key={i} onLongPress={() => commentOptions(i)}>
				<Username navigation={navigation}>{item.poster}</Username>
				{parse(item.text)}
			</TouchableOpacity>
		)} ListFooterComponent={(
			<View style={{flexDirection: 'row', margin: 5, backgroundColor: "#141414", borderRadius: 10}}>
				<TextInput style={styles.messageInput} value={message} onChangeText={setMessage} keyboardAppearance="dark" onSubmitEditing={comment} />
				<TouchableOpacity onPress={comment} style={styles.sendButton}>
					<Ionicons name="send-sharp" color="#ddd" size={32} style={{marginTop: 4, marginRight: 4}} />
				</TouchableOpacity>
			</View>
		)} />
		<Modal visible={optionsOpen} animationType="slide" transparent={true}>
			<View style={[styles.modal, {padding: 5}]}>
				<View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 5}}>
					<Text style={{fontSize: 26}}>Options</Text>
					<TouchableOpacity onPress={() => setOptionsOpen(false)}>
						<Ionicons name="close" color="white" size={30} />
					</TouchableOpacity>
				</View>

				<View>
					<TouchableOpacity onPress={deleteComment}>
						<Text style={styles.link}>Delete comment</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	</SafeAreaView>
	);
}