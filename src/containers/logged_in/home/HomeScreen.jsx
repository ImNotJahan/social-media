import { View, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

import Posts from "../../../components/Posts";
import { styles } from "../../../styles";

export default function HomeScreen({route, navigation}){
	const [feed, setFeed] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	const username = useSelector((state) => state.auth.username);
	const password = useSelector((state) => state.auth.password);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refresh().then(() => setRefreshing(false));
	}, []);

	async function refresh(){
		let requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password
		};
		
		fetch('https://jahanrashidi.com/sm/api/feed.php', requestOptions)
			.then(response => response.json())
			.then(data => setFeed(data));
	}

	useEffect(() => {			
		refresh();
	}, []);
	
	return (
		<ScrollView style={{paddingTop: 20}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />}>
			<View style={styles.headerIcons}>
				<TouchableOpacity styles={{zIndex: 1}} onPress={() => navigation.navigate("Notifications")}>
					<Ionicons name="notifications" size={32} color="white" />
				</TouchableOpacity>
				<TouchableOpacity styles={{zIndex: 1}} onPress={() => navigation.navigate("Post")}>
					<Ionicons name="add" size={32} color="white" />
				</TouchableOpacity>
			</View>
			<Posts navigation={navigation} posts={feed} username={username} password={password} />
		</ScrollView>
	);
}