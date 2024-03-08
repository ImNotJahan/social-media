import { FlatList, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Image } from "expo-image";

import ListUsers from "../../../components/ListUsers";
import Text from "../../../components/Text";
import { styles, colors } from "../../../styles";

export default function ResultsScreen({route, navigation}){
	const [results, setResults] = useState([]);

	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);
	
	async function refresh(){
		const data = new FormData();
		
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		};
		
		fetch('https://jahanrashidi.com/sm/api/search_users.php?query=' +  route.params?.query, requestOptions)
			.then(results => results.json())
			.then(data => setResults(data));
	}

	function gotoChat(user){
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password + "&user=" + user
		};

		fetch("https://jahanrashidi.com/sm/api/create_chat.php", requestOptions).then(response => response.json())
			.then(data => navigation.navigate("Chat", {chat_id: data.chat_id, receiver: user}));
	}
	
	useEffect(() => {
		if(route.params?.query) navigation.setOptions({title: route.params.query}); 
	
		refresh();
	}, [route.params]);

	return (
	<FlatList data={results} style={{height: "100%"}} keyExtractor={user => user.username} renderItem={({item}) => {
	if(item.username != username) return (
		<TouchableOpacity style={{flexDirection: "row", paddingVertical: 4, marginVertical: 4, backgroundColor: colors.foreground}} 
		onPress={() => {gotoChat(item.username)}}>
			<Image source={item.pfp} style={{width: 36, height: 36, borderRadius: 18, marginRight: 10}} />
			<Text style={[{marginTop: 10}, styles.link]}>{item.username}</Text>
		</TouchableOpacity>
	)}} />
	);
}