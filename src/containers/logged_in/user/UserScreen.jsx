import { useEffect, useState, useCallback } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { useSelector } from "react-redux";

import Seperator from "../../../components/Seperator";
import Profile from "../../../components/Profile";
import Posts from "../../../components/Posts";
import { styles } from "../../../styles";

export default function UserScreen({route, navigation}){
	const [user, setUser] = useState("");
	const [userData, setUserData] = useState([]);
	const [posts, setPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refresh().then(() => setRefreshing(false));
	}, []);
	
	if(route.params?.refresh) {
		route.params.refresh = false;
		onRefresh();
	}

	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: "username=" + username + "&password=" + password + "&user=" + user
	};
	
	async function refresh(){
		fetch('https://jahanrashidi.com/sm/api/user.php', requestOptions)
			.then(response => response.json())
			.then(data => setUserData(data));
		
		fetch('https://jahanrashidi.com/sm/api/user_posts.php', requestOptions)
			.then(response => response.json())
			.then(data => setPosts(data));
	}
	
	if(route.params?.user && user != route.params.user) setUser(route.params.user);

	useEffect(() => {	
		//if(route.params?.user) setUser(route.params.user);
		//if(user == "") setUser(username);
		
		navigation.setOptions({title: user});
		
		refresh();
	}, [route.params?.user]);
	
	return (
	<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />}>
		<Profile navigation={navigation} userData={userData} username={username} password={password} />
		
		<Seperator />
		
		<View>
			<Posts posts={posts} navigation={navigation} username={username} password={password} />
		</View>
	</ScrollView>
	);
}