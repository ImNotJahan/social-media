import { useEffect, useState, useCallback } from "react";
import { ScrollView, View, RefreshControl, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";

import Seperator from "../../../components/Seperator";
import Profile from "../../../components/Profile";
import Posts from "../../../components/Posts";
import { styles } from "../../../styles";

export default function UserScreen({route, navigation}){
	const [user, setUser] = useState(route.params.user);
	const [userData, setUserData] = useState([]);
	const [posts, setPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refresh().then(() => setRefreshing(false));
	}, []);

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
	
	useEffect(() => {	
		setUser(route.params.user);
 		navigation.setOptions({title: route.params.user});
		
		refresh();
	}, [route.params.user, user]);
	
	return (
	<SafeAreaView>
		<Posts posts={posts} navigation={navigation} username={username} password={password} header={(<>
			<Profile navigation={navigation} userData={userData} username={username} password={password} />

			<Seperator />
		</>)} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />}/>
	</SafeAreaView>
	);
}