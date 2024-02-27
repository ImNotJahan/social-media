import { useState, useCallback, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useSelector } from "react-redux";

import Username from "../../components/Username";
import Text from "../../components/Text";
import { styles } from "../../styles";

export default function NotificationsScreen({route, navigation}){
	const [notifications, setNotifications] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);
	
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
		
		fetch("https://jahanrashidi.com/sm/api/read_notifications.php", requestOptions).then(() => {
			fetch('https://jahanrashidi.com/sm/api/notifications.php', requestOptions)
				.then(response => response.json())
				.then(data => setNotifications(data.old));
		});
	}
	
	function parseNotification(notification){
		switch(notification.type){
			case "new_follower":
				return (<View style={styles.notification}><Username navigation={navigation}>{notification.user}</Username><Text> followed you.</Text></View>);
			
			case "commented_on_post":
				return (
				<View style={styles.notification}><Username navigation={navigation}>{notification.user}</Username><Text> commented on</Text>
					<TouchableOpacity onPress={() => navigation.navigate("Comments", {post_id: notification.id})}>
						<Text style={styles.link}> your post.</Text>
					</TouchableOpacity>
				</View>
				);
		}
		
		return (<Text>Unknown notification type</Text>);
	}
	
	useEffect(() => {			
		refresh();
	}, []);

	return (
	<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" style={{paddingTop: 25}} />}>
	{notifications.map(notification => parseNotification(notification))}
	</ScrollView>
	);
}