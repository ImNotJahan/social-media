import { View, TouchableOpacity, Alert, Dimensions, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";

import Username from "./Username";
import Text from "./Text";
import RemoteImage from "./RemoteImage";
import { styles } from "../styles";

const deviceWidth = Dimensions.get('window').width;

export default function Posts({username, password, posts, navigation, user}){
	if(posts.map == undefined) return (<></>);

	const [shareOpen, setShareOpen] = useState(false);

	function sendPost(id){
		setShareOpen(true);
	}

	return (
	<View>{posts.map(post => (
		<View key={post.id} style={styles.post.main}>
			<View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 2}}>
				<View style={{flexDirection: "row"}}>
					<Username navigation={navigation}>{post.poster}</Username>
					{post.private ? <Text style={styles.time}>private</Text> : <></>}
				</View>
				<Text style={styles.time}>{post.posted == "0000-00-00 00:00:00" ? "" : post.posted}</Text>
			</View>
			{post.images.map(image => (
				<RemoteImage key={image} uri={image} desiredWidth={deviceWidth - 30} style={{borderRadius: 2}} />
			))}
			<View style={styles.post.bottom}>
				<View style={{flexDirection: "row", justifyContent: "space-between"}}>
					<View style={{flexDirection: "row", marginBottom: 10, gap: 15}}>
						<TouchableOpacity onPress={() => navigation.navigate(user ? "UserComments" : "Comments", {post_id: post.id})}>
							<Ionicons name="chatbox-ellipses" color="white" size={30} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => sendPost(post.id)}>
							<Ionicons name="send-sharp" color="white" size={30} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => repost(post.id)}>
							<Ionicons name="repeat" color="white" size={30} />
						</TouchableOpacity>
					</View>
					<View>
						{post.can_delete ? (
						<TouchableOpacity onPress={() => Alert.alert("", "Are you sure you want to delete this post?",
							[{text: "Delete", onPress: () => { deletePost(username, password, post.id); }}, {text: "Cancel"}],
							{userInterfaceStyle: "dark"}
						)}>
							<Ionicons name="trash" color="white" size={30} />
						</TouchableOpacity>
						) : <></>}
					</View>
				</View>
			</View>
		</View>))}
		<Modal visible={shareOpen} animationType="slide" transparent={true}>
			<View style={styles.modal}>
				<View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 5}}>
					<Text style={{fontSize: 26}}>Share</Text>
					<TouchableOpacity onPress={() => setShareOpen(false)}>
						<Ionicons name="close" color="white" size={30} />
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	</View>);
}

async function deletePost(username, password, id){
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password + "&id=" + id
	};
	
	fetch('https://jahanrashidi.com/sm/api/delete_post.php', requestOptions);
}

function repost(id){

}