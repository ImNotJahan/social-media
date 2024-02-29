import { View, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import Username from "./Username";
import Text from "./Text";
import RemoteImage from "./RemoteImage";
import { styles } from "../styles";

const deviceWidth = Dimensions.get('window').width;

export default function Posts({username, password, posts, navigation, user}){
	if(posts.map == undefined) return (<></>);

	return posts.map(post => (
		<View key={post.id} style={styles.post.main}>
			<View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 2}}>
				<Username navigation={navigation}>{post.poster}</Username>
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
							[{text: "Delete", onPress: () => { deletePost(username, password, post.id); }}, {text: "Cancel"}]
						)}>
							<Ionicons name="trash" color="white" size={30} />
						</TouchableOpacity>
						) : <></>}
					</View>
				</View>
				<Text style={{flex: 1}}>{post.description.desc}</Text>
			</View>
		</View>
	))
}

async function deletePost(username, password, id){
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password + "&id=" + id
	};
	
	fetch('https://jahanrashidi.com/sm/api/delete_post.php', requestOptions);
}

function sendPost(id){
	
}

function repost(id){

}