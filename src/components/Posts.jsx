import { View, TouchableOpacity, Dimensions, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";

import Text from "./Text";
import { styles } from "../styles";
import Post from "./Post";

export default function Posts({username, password, posts, navigation, user}){
	if(posts.map == undefined) return (<></>);

	const [shareOpen, setShareOpen] = useState(false);

	function sendPost(id){
		setShareOpen(true);
	}

	return (
	<View>{posts.map(post => (<Post username={username} password={password} post={post} navigation={navigation} user={user} sendPost={sendPost} key={post.id} />))}
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