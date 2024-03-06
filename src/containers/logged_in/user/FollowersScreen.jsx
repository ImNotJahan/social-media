import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";

import ListUsers from "../../../components/ListUsers";

export default function FollowersScreen({route, navigation}){
	const [followers, setFollowers] = useState([]);

	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);
	
	async function refresh(){
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password + "&user=" + route.params?.user
		};
		
		fetch('https://jahanrashidi.com/sm/api/followers.php', requestOptions)
			.then(response => response.json())
			.then(data => setFollowers(data));
	}
	
	useEffect(() => {	
		if(route.params?.referrerTitle) navigation.setOptions({headerBackTitle: route.params.referrerTitle}); 
		
		refresh();
	}, [route.params]);
	
	return (
	<ScrollView>
		<ListUsers users={followers} navigation={navigation} push={true} />
	</ScrollView>
	);
}