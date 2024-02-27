import { View, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import Username from "./Username";
import Text from "./Text";
import RemoteImage from "./RemoteImage";
import { styles } from "../styles";

export default function Posts({username, password, posts, navigation, user}){
	if(posts.map == undefined) return (<></>);
	
	const deviceWidth = Dimensions.get('window').width;

	return posts.map(post => (
		<View key={post.id} style={styles.post.main}>
			<Username navigation={navigation}>{post.poster}</Username>
			{post.images.map(image => (
				<RemoteImage key={image} uri={image} desiredWidth={deviceWidth - 20} style={{borderRadius: 5}} />
			))}
			<View style={styles.post.bottom}>
				<View style={{flexDirection: "row", justifyContent: "space-between"}}>
					<View style={{flexDirection: "row"}}>
						<TouchableOpacity onPress={() => navigation.navigate(user ? "UserComments" : "Comments", {post_id: post.id})} style={{marginRight: 10}}>
							<Ionicons name="chatbox-ellipses" color="white" size={24} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => sendPost(post.id)}>
							<Ionicons name="send-sharp" color="white" size={24} />
						</TouchableOpacity>
					</View>
					<View>
						{username == post.poster ? (
						<TouchableOpacity onPress={() => Alert.alert("", "Are you sure you want to delete this post?",
							[{text: "Delete", onPress: () => { deletePost(username, password, post.id); }}, {text: "Cancel"}]
						)}>
							<Ionicons name="trash" color="white" size={24} />
						</TouchableOpacity>
						) : <></>}
					</View>
				</View>
				<Text style={{flex: 1}}>{post.description.desc}</Text>
			</View>
		</View>
	))
}

export async function deletePost(username, password, id){
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password + "&id=" + id
	};
	
	fetch('https://jahanrashidi.com/sm/api/delete_post.php', requestOptions);
}

export function sendPost(id){
	
}