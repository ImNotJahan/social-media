import { View, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import Username from "./Username";
import Text from "./Text";
import { styles } from "../styles";
import Album from "./Album"

const deviceWidth = Dimensions.get('window').width;


export default function Post({username, password, post, navigation, user, sendPost, deletePost}){
	if(deletePost === undefined) deletePost = defaultDeletePost;

	return (
	<View style={styles.post.main}>
		<View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 2}}>
			<View style={{flexDirection: "row"}}>
				<Username navigation={navigation}>{post.poster}</Username>
				{post.private ? <Text style={styles.time}>private</Text> : <></>}
			</View>
			<Text style={styles.time}>{post.posted == "0000-00-00 00:00:00" ? "" : post.posted}</Text>
		</View>

		<Album deviceWidth={deviceWidth} images={post.images} />

		<View style={styles.post.bottom}>
			<View style={{flexDirection: "row", justifyContent: "space-between"}}>
				<View style={{flexDirection: "row", marginBottom: 10, gap: 15}}>
					<TouchableOpacity onPress={() => navigation.navigate(user ? "UserComments" : "Comments", {post_id: post.id})}>
						<Ionicons name="chatbox-ellipses" color="white" size={30} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => sendPost(post.id)}>
						<Ionicons name="send" color="white" size={30} />
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
			<Text style={{flex: 1}}>{post.description.desc}</Text>
		</View>
	</View>
	);
}

async function defaultDeletePost(username, password, id){
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password + "&id=" + id
	};
	
	fetch('https://jahanrashidi.com/sm/api/delete_post.php', requestOptions);
}

function repost(id){

}