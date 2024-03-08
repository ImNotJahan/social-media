import { useState, useEffect, useCallback } from "react";
import { RefreshControl, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

import Posts from "../../../components/Posts";

export default function SavedScreen({route, navigation}){
	const [posts, setPosts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	
	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);

	async function refresh(){
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password
		};
		
		fetch('https://jahanrashidi.com/sm/api/saved_posts.php', requestOptions)
			.then(response => response.json())
			.then(data => setPosts(data));
	}

	async function loadMore(){
		let requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password + "&offset=" + posts.length
		};
		
		if(loadingMore) return;
		setLoadingMore(true);

		fetch('https://jahanrashidi.com/sm/api/saved_posts.php', requestOptions)
			.then(response => response.json())
			.then(data => {
				setPosts([...posts, ...data]);
				setLoadingMore(false);
			});
	}
	
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refresh().then(() => setRefreshing(false));
	}, []);

	useEffect(() => {			
		refresh();
	});
	
	return (
	<Posts posts={posts} navigation={navigation} username={username} password={password} loadMore={loadMore} user={true}
	refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />} 
	footer={<ActivityIndicator size="large" color="#ffffff" animating={loadingMore} />} />
	);
}