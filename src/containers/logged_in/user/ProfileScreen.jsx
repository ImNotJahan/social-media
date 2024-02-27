import { useCallback, useEffect, useState } from "react";
import { ScrollView, View, RefreshControl, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Profile from "../../../components/Profile";
import Seperator from "../../../components/Seperator";
import Posts from "../../../components/Posts";
import { styles } from "../../../styles";

export default function ProfileScreen({route, navigation}){
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
		body: "username=" + username + "&password=" + password + "&user=" + username
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
		refresh();
	}, []);
	
	return (
	<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />}>
		<TouchableOpacity style={styles.settings} onPress={() => navigation.navigate("Settings")}>
			<Ionicons name="settings" size={32} color="white" />
		</TouchableOpacity>

		<Profile userData={userData} navigation={navigation} username={username} password={password} />
		
		<Seperator />
		
		<View>
			<Posts posts={posts} navigation={navigation} user={true} username={username} password={password} />
		</View>
	</ScrollView>
	);
}