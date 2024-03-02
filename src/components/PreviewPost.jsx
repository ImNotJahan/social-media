import { TouchableOpacity, View, Dimensions } from "react-native";

import Text from "./Text";
import { styles } from "../styles";
import RemoteImage from "./RemoteImage";

const deviceWidth = Dimensions.get('window').width;

export default function PreviewPost({post, navigation}){
	if(post.description == null) return (<></>);

	return (
	<View style={{paddingVertical: 10}}>
		<TouchableOpacity style={styles.post.previewMain} onPress={() => 
			{navigation.navigate("PostView", {post: post})}}>
			<View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 2}}>
				<View style={{flexDirection: "row"}}>
					<Text style={styles.link}>{post.poster}</Text>
					{post.private ? <Text style={styles.time}>private</Text> : <></>}
				</View>
				<Text style={styles.time}>{post.posted == "0000-00-00 00:00:00" ? "" : post.posted}</Text>
			</View>

			<RemoteImage desiredWidth={deviceWidth - 40} uri={post.images[0]} />

			<Text>{post.description.desc}</Text>
		</TouchableOpacity>
	</View>
	);
}