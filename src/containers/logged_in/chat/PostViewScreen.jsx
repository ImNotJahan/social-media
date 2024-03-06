import { ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Post from "../../../components/Post";
import Username from "../../../components/Username";
import Text from "../../../components/Text";

export default function PostViewScreen({route, navigation}){
	const username = useSelector(state => state.auth.username);
	const password = useSelector(state => state.auth.password);

	const [post, setPost] = useState([]);
	let i = 0;

	useEffect(() => {
		if(route.params?.post_id){
			const data = new FormData();
			data.append("username", username);
			data.append("password", password);
			data.append("id", route.params.post_id);
			
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: data
			};

			fetch('https://jahanrashidi.com/sm/api/get_post.php', requestOptions)
				.then(response => response.json())
				.then(data => setPost(data));
		} else if(route.params?.post) setPost(route.params.post);
	}, [route.params])

	if(post.interactions == undefined) return (<></>);

	return (
	<ScrollView>
		<Post post={post} navigation={navigation} />

		<View style={{margin: 10}}>
			{post.interactions.comments.map(comment => {
			i++;
			return (<View style={{marginBottom: 10}} key={i}>
				<Username navigation={navigation}>{comment.poster}</Username>
				<Text>{comment.text}</Text>
			</View>)})}
		</View>
	</ScrollView>
	);
}