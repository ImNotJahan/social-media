import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";

import ListUsers from "../../../components/ListUsers";

export default function FollowingScreen({route, navigation}){
	const [following, setFollowing] = useState([]);
	
	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);

	async function refresh(){
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password + "&user=" + route.params?.user
		};
		
		fetch('https://jahanrashidi.com/sm/api/following.php', requestOptions)
			.then(response => response.json())
			.then(data => setFollowing(data));
	}
	
	useEffect(() => {	
		if(route.params?.referrerTitle) navigation.setOptions({headerBackTitle: route.params.referrerTitle}); 
		
		refresh();
	}, [route.params]);
	
	return (
	<ScrollView>
		<ListUsers users={following} navigation={navigation} push={true} />
	</ScrollView>
	);
}