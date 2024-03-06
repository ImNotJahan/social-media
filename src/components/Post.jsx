import { View, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";

import Username from "./Username";
import Text from "./Text";
import { styles, colors } from "../styles";
import Album from "./Album"

const deviceWidth = Dimensions.get('window').width;


export default function Post({username, password, post, navigation, user, sendPost, deletePost}){
	if(deletePost === undefined) deletePost = defaultDeletePost;

	function Comments(){
		if(post.comment_count == 0) return (<></>);

		return (
		<TouchableOpacity onPress={() => navigation.navigate(user ? "UserComments" : "Comments", {post_id: post.id})}>
			<Text style={{color: colors.faint, fontSize: 14}}>View {post.comment_count} comment{post.comment_count == 1 ? "" : "s"}</Text>
		</TouchableOpacity>
		);
	}

	return (
	<View style={styles.post.main}>
		<View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 2}}>
			<View style={{flexDirection: "row"}}>
				{post.repost_id != null ? (
				<>
					<Username navigation={navigation}>{post.og_poster}</Username>
					<Text style={styles.time}>reposted by {post.poster}</Text>
				</>) : (
				<>
					<Username navigation={navigation}>{post.poster}</Username>
					{post.private ? <Text style={styles.time}>private</Text> : <></>}
				</>
				)}
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
					<TouchableOpacity onPress={() => sendPost(post.repost_id != null ? post.repost_id : post.id)}>
						<Ionicons name="send" color="white" size={30} />
					</TouchableOpacity>
					{post.poster == username || post.private || post.repost_id != null ? (<></>) : (
					<TouchableOpacity onPress={() => repost(username, password, post.id)}>
						<Ionicons name="repeat" color="white" size={30} />
					</TouchableOpacity>
					)}
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
			<Comments />
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

async function repost(username, password, id){
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password + "&id=" + id
	};
	
	fetch('https://jahanrashidi.com/sm/api/repost.php', requestOptions).then(response => response.json())
		.then(data => {
			switch(data.response){
			case "Success":
				Alert.alert("Reposted", "", [], {userInterfaceStyle: "dark"});
				break;

			default :
				Alert.alert(data.response, "", [], {userInterfaceStyle: "dark"});
				break;
			}
		});
}