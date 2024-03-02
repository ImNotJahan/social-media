import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import Username from "../../../components/Username";
import Text from "../../../components/Text";
import KeyboardShift from "../../../components/KeyboardShift";
import { styles } from "../../../styles";
import Message from "../../../components/Message";

export default function ChatScreen({route, navigation}){
	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);

	const chat_id = route.params?.chat_id;
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [optionsOpen, setOptionsOpen] = useState(false);
	const [messageFocus, setMessageFocus] = useState(-1);
	let lastId = -1;

	async function refresh(){
		const data = new FormData();
		data.append("username", username);
		data.append("password", password);
		data.append("id", chat_id);
		data.append("last_id", lastId);
		
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: data
		};
		
		fetch('https://jahanrashidi.com/sm/api/messages.php', requestOptions).then(response => response.json())
			.then(data => {
				if(data.length > 0){
					setMessages(messages => [...messages, ...data]);
					lastId = data[data.length - 1].id;
				}
			});
	}
	
	async function sendMessage(){
		const data = new FormData();
		data.append("username", username);
		data.append("password", password);
		data.append("id", chat_id);
		data.append("message", message);
		
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: data
		};
		
		setMessage("");
		
		fetch('https://jahanrashidi.com/sm/api/message.php', requestOptions);
	}
	
	async function deleteMessage(){
		const data = new FormData();
		data.append("username", username);
		data.append("password", password);
		data.append("id", messageFocus);

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: data
		};
				
		fetch('https://jahanrashidi.com/sm/api/delete_message.php', requestOptions);

		setOptionsOpen(false);
		setMessages(messages.filter(obj => {return obj.id !== messageFocus}));
	}

	useEffect(() => {	
		navigation.setOptions({ title: route.params?.receiver });
		
		refresh();
		
		const interval = setInterval(() => {
			refresh();
		}, 1000);
		return () => clearInterval(interval);
	}, [chat_id]);
	
	lastSender = "";
	
	function addUsername(sender, time){
		if(sender !== lastSender){
			lastSender = sender;
			return (
			<View style={{paddingTop: 16, flexDirection: "row"}}>
				<Username navigation={navigation}>{sender}</Username>
				<Text style={styles.time}>{time}</Text>
			</View>);
		} else{
			return (<></>);
		}
	}

	function messageOptions(id){
		setOptionsOpen(true);
		setMessageFocus(id);
	}
	
	return (
	<View>
		<KeyboardShift>
			<ScrollView ref={ref => {this.scrollView = ref}}
			onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})} style={{paddingHorizontal: 10, height: "100%"}}>
				{messages.map(message => (
				<View key={message.id}>
					{addUsername(message.sender, message.sent)}
					<Message obj={message.message} messageOptions={messageOptions} sender={message.sender} id={message.id} navigation={navigation} />
				</View>))}
				
				<View style={{flexDirection: 'row', marginVertical: 10, backgroundColor: "#141414", borderRadius: 10}}>
					<TextInput style={styles.messageInput} value={message} onChangeText={setMessage} keyboardAppearance="dark" onSubmitEditing={sendMessage} />
					<TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
						<Ionicons name="send-sharp" color="#ddd" size={32} style={{marginTop: 4, marginRight: 4}} />
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardShift>
		<Modal visible={optionsOpen} animationType="slide" transparent={true}>
			<View style={[styles.modal, {padding: 5}]}>
				<View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 5}}>
					<Text style={{fontSize: 26}}>Options</Text>
					<TouchableOpacity onPress={() => setOptionsOpen(false)}>
						<Ionicons name="close" color="white" size={30} />
					</TouchableOpacity>
				</View>

				<View>
					<TouchableOpacity onPress={deleteMessage}>
						<Text style={styles.link}>Delete message</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	</View>
	);
}