import { View, TouchableOpacity, Alert, Dimensions, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import ImageView from "react-native-image-viewing";

import Username from "./Username";
import Text from "./Text";
import { styles, colors } from "../styles";
import Album from "./Album"
import parse from "../parse";

const deviceWidth = Dimensions.get('window').width;


export default function Post({username, password, post, navigation, user, sendPost, deletePost}){
	if(deletePost === undefined) deletePost = defaultDeletePost;

	const [saved, setSaved] = useState(post.saved);
	const [readMore, setReadMore] = useState(false);
	const [focused, setFocused] = useState(false);
	let saveProcessing = false;

	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password + "&id=" + post.id
	};

	async function savePost(){
		if(!saveProcessing){
			saveProcessing = true;

			try{
				if(!saved){	
					fetch('https://jahanrashidi.com/sm/api/save_post.php', requestOptions)
						.then(response => response.json())
						.then(data => {
							switch(data.response){
							case "Success":
								setSaved(true);
								break;

							default:
								Alert.alert("", data.response);
								break;
							}

							saveProcessing = false;
						});
				} else {
					fetch('https://jahanrashidi.com/sm/api/unsave_post.php', requestOptions)
						.then(response => response.json())
						.then(data => {
							switch(data.response){
							case "Success":
								setSaved(false);
								break;

							default:
								Alert.alert("", data.response);
								break;
							}

							saveProcessing = false;
						});
				}
			} catch(e){
				saveProcessing = false;
			}
		}
	}

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
			<View style={{flexDirection: "row", flex: 1}}>
				{post.repost_id != null ? (
				<>
					<Username style={{color: colors.reposted}} navigation={navigation}>{post.og_poster}</Username>
					<TouchableOpacity style={{flexShrink: 1}} onPress={() => navigation.navigate("UserStack", {screen: "User", initial: false, params: {user: post.poster}})}>
						<Text style={styles.time} numberOfLines={1}>reposted by {post.poster}</Text>
					</TouchableOpacity>
				</>) : (
				<>
					<Username navigation={navigation}>{post.poster}</Username>
					{post.private ? <Text style={styles.time}>private</Text> : <></>}
				</>
				)}
			</View>
			<Text style={styles.time}>{post.posted == "0000-00-00 00:00:00" ? "" : post.posted.split(" ")[0]}</Text>
		</View>

		<Album deviceWidth={deviceWidth} images={post.images} onPress={() => setFocused(true)}/>

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
				<View style={{flexDirection: "row", marginBottom: 10, gap: 15}}>
					<TouchableOpacity onPress={savePost}>
						<Ionicons name={saved ? "bookmark" : "bookmark-outline"} color="white" size={30} />
					</TouchableOpacity>
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

			
				
			{post.description.desc == "" ? (<></>) : (
				<Pressable onPress={() => setReadMore(!readMore)}>
					<Text numberOfLines={readMore ? undefined : 3}>
						{parse(post.description.desc, navigation)}
					</Text>
				</Pressable>
			)}

			<Comments />
		</View>

		<ImageView images={post.images} imageIndex={0} visible={focused} onRequestClose={() => setFocused(false)} />
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