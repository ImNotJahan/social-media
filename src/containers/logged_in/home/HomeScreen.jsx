import { View, SafeAreaView, RefreshControl, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { useScrollToTop } from "@react-navigation/native";
import { requestPermissionsAsync, getExpoPushTokenAsync } from "expo-notifications";

import Posts from "../../../components/Posts";
import Badge from "../../../components/Badge";
import { styles, colors } from "../../../styles";

export default function HomeScreen({route, navigation}){
	const [feed, setFeed] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [notificationsCount, setNotificationsCount] = useState(0);
	const [loadingMore, setLoadingMore] = useState(false);

	const username = useSelector((state) => state.auth.username);
	const password = useSelector((state) => state.auth.password);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refresh().then(() => setRefreshing(false));
	}, []);

	async function refreshNotifications(){
		let requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password
		};
		
		fetch('https://jahanrashidi.com/sm/api/notifications.php', requestOptions)
			.then(response => response.json())
			.then(data => setNotificationsCount(data.new.length));
	}

	async function refresh(){
		let requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password + "&new=1"
		};
		
		fetch('https://jahanrashidi.com/sm/api/feed.php', requestOptions)
			.then(response => response.json())
			.then(data => setFeed(data));
	}

	async function loadMore(){
		let requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password + "&offset=" + feed.length + "&new=1"
		};
		
		if(loadingMore) return;
		setLoadingMore(true);

		fetch('https://jahanrashidi.com/sm/api/feed.php', requestOptions)
			.then(response => response.json())
			.then(data => {
				setFeed([...feed, ...data]);
				setLoadingMore(false);
			});
	}

	useEffect(() => {
		requestPermissionsAsync().then(status => {
			if(status.granted){
				getExpoPushTokenAsync({projectId: "2bb968e4-c704-40c2-8248-68a3862b431a"}).then(token => {			
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						body: "username=" + username + "&password=" + password
					};

					requestOptions.body += "&token=" + token.data;

					fetch("https://jahanrashidi.com/sm/api/set_notification_token.php", requestOptions);
				});
			}
		});

		refresh();
		refreshNotifications();

		const interval = setInterval(() => {
			refreshNotifications();
		}, 10000);
		return () => clearInterval(interval);
	}, []);
	
	return (
		<SafeAreaView>
			<Posts navigation={navigation} posts={feed} username={username} password={password} loadMore={loadMore}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />} header={(
				<View style={styles.header}>
					<FontAwesome6 name="people-roof" size={32} color={colors.link} />
					<View style={styles.headerIcons}>
						<TouchableOpacity styles={{zIndex: 1}} onPress={() => navigation.navigate("Post")}>
							<Ionicons name="add" size={32} color="white" />
						</TouchableOpacity>
						<TouchableOpacity styles={{zIndex: 1}} onPress={() => navigation.navigate("Notifications")}>
							<Ionicons name="notifications" size={32} color="white" />
							<Badge value={notificationsCount} style={{position: "absolute", right: 0}} />
						</TouchableOpacity>
					</View>
				</View>
			)} footer={<ActivityIndicator size="large" color="#ffffff" animating={loadingMore} />}/>
		</SafeAreaView>
	);
}