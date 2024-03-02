import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";

import Text from "./Text";
import PreviewPost from "./PreviewPost";

export default function Message({obj, messageOptions, sender, id, navigation}){
	const username = useSelector((state) => state.auth.username);
	const password = useSelector((state) => state.auth.password);

	const [post, setPost] = useState([]);

	let content;

	if(obj.hasOwnProperty("text")) content = (<Text>{obj.text}</Text>);
	else if(obj.hasOwnProperty("post")){
		useEffect(() => {
			const data = new FormData();
			data.append("username", username);
			data.append("password", password);
			data.append("id", obj.post);
			
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: data
			};

			fetch('https://jahanrashidi.com/sm/api/get_post.php', requestOptions)
				.then(response => response.json()).then(data => setPost(data));
		}, []);

		content = (<Text><PreviewPost post={post} navigation={navigation} /></Text>);
	}
	else content = (<Text>Unknown message type</Text>);

	if(sender === username)
		return (
			<TouchableOpacity onLongPress={() => messageOptions(id)}>
				{content}
			</TouchableOpacity>
		);
	else return content;
}