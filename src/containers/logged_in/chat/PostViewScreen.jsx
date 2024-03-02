import { ScrollView, View } from "react-native";

import Post from "../../../components/Post";
import Username from "../../../components/Username";
import Text from "../../../components/Text";

export default function PostViewScreen({route, navigation}){
	let i = 0;

	return (
	<ScrollView>
		<Post post={route.params?.post} navigation={navigation} />

		<View style={{margin: 10}}>
			{route.params?.post.interactions.comments.map(comment => {
			i++;
			return (<View style={{marginBottom: 10}} key={i}>
				<Username navigation={navigation}>{comment.poster}</Username>
				<Text>{comment.text}</Text>
			</View>)})}
		</View>
	</ScrollView>
	);
}