import { View, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

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
		const requestOptions = {
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
		<View style={styles.home}>
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />}>
				<Posts navigation={navigation} posts={feed} username={username} password={password} />
			</ScrollView>
		</View>
	);
}