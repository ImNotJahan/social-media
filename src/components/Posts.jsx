import { View, TouchableOpacity, Dimensions, Modal, Image, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from "react";
import { useScrollToTop } from "@react-navigation/native";
import { shareAsync } from "expo-sharing";

import Text from "./Text";
import { styles } from "../styles";
import Post from "./Post";

export default function Posts({username, password, posts, navigation, user, header, refreshControl, loadMore, footer}){
	const [shareOpen, setShareOpen] = useState(false);
	const [shareId, setShareId] = useState(-1);
	const [recents, setRecents] = useState([]);

	const ref = useRef(null);
	useScrollToTop(ref);

	if(posts == undefined || posts.map == undefined) return (<></>);

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

	async function deletePost(username, password, id){
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password + "&id=" + id
		};
		
		fetch('https://jahanrashidi.com/sm/api/delete_post.php', requestOptions);

		//posts = posts.filter(obj => obj.id !== id);
	}

	async function shareSheet(){
		await shareAsync("https://jahanrashidi.com/sm/comments/?id=" + shareId);
	}

	return (
	<View>
		<FlatList data={posts} keyExtractor={post => post.id} ref={ref} ListHeaderComponent={header} refreshControl={refreshControl} renderItem={({item}) => (
			<Post username={username} password={password} post={item} navigation={navigation} user={user} sendPost={sendPost} deletePost={deletePost} />
		)} onEndReached={({distanceFromEnd}) => {
			// so loadMore isn't called when initial posts are loading
			if(distanceFromEnd >= 0 && posts.length > 0) {loadMore();}
		}} initialNumToRender={5} onEndThreshold={0.5} ListFooterComponent={footer} style={{height: "100%"}} />
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
				<TouchableOpacity onPress={shareSheet} style={{alignItems: "center", margin: 5}}>
					<Ionicons name="share" color="white" size={60} />
				</TouchableOpacity>
			</View>
		</Modal>
	</View>);
}