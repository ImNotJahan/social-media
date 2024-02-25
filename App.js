import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, TextInput, Image, ScrollView, SafeAreaView, Dimensions, RefreshControl, TouchableOpacity, Text as RNText, KeyboardAvoidingView, Alert } from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight, HeaderBackButton } from '@react-navigation/elements'
import * as ImagePicker from "expo-image-picker";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator(); // unused
const SearchStack = createNativeStackNavigator();

const deviceWidth = Dimensions.get('window').width;
const icons = {"Home": "home", "Post": "add", "Notifications": "notifications", "ChatStack": "chatbubble", "UserStack": "person", "Settings": "settings-sharp", "SearchStack": "search"};

export default function App() {
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [user, setUser] = React.useState("");
	
	React.useEffect(() => {
		const firstLoad = async () => {
			await get("username").then(username => setUsername(username));
			await get("password").then(password => setPassword(password));
		};
		
		firstLoad();
    }, []);
	
	function LoginScreen({navigation}) {
		const [username, onChangeUsername] = React.useState("");
		const [password, onChangePassword] = React.useState("");
		const [message, setMessage] = React.useState("");
		
		function login(){
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: "username=" + username + "&password=" + password
			};
			
			fetch('https://jahanrashidi.com/sm/api/info_correct.php', requestOptions)
				.then(response => response.json())
				.then(data => {
					const response = data.response;
					
					if(data.response === "Correct info"){
						save("username", username.toLowerCase());
						save("password", password);
						setUsername(username.toLowerCase());
						setPassword(password);
					} else {
						setMessage(response);
					}
				});
		}
		
		return (
			<View style={{backgroundColor: "#282828", height: "100%"}}>
				<TextInput placeholder="Username" autoComplete="username" style={styles.authInput} autoCapitalize="none" autoFocus={true} onChangeText={onChangeUsername} value={username} keyboardAppearance="dark" />
				<TextInput placeholder="Password" secureTextEntry autoComplete="password" style={styles.authInput} onChangeText={onChangePassword} value={password} keyboardAppearance="dark" />
				
				<AuthButton onPress={login}>Log-in</AuthButton>
				
				<Text>{message}</Text>
			</View>
		);
	}
	
	function SignupScreen({navigation}) {
		const [username, onChangeUsername] = React.useState("");
		const [password, onChangePassword] = React.useState("");
		const [verify, onChangeVerify] = React.useState("");
		const [message, setMessage] = React.useState("");
		
		function verifyPassword(){
			if(verify !== password){
				setMessage("Passwords don't match");
				return false;
			}
			
			if(password.length < 8){
				setMessage("Password must be at least 8 characters");
				return false;
			}
			
			if(!password.match(/[a-z]/g)){
				setMessage("Password requires lowercase letter");
				return false;
			}
			
			if(!password.match(/[A-Z]/g)){
				setMessage("Password requires uppercase letter");
				return false;
			}
			
			if(!password.match(/[0-9]/g)){
				setMessage("Password requires number");
				return false;
			}
			
			if(username.length <= 3){
				setMessage("Username must be more than 3 characters");
				return false;
			} 
			
			if(username.length >= 20){
				setMessage("Username must be less than 20 characters");
				return false;
			}
			
			const regex = /^[a-z0-9_\.]+$/.exec(username);
			if(!regex){
				setMessage("Username can only have lowercase letters, numbers, underscores and periods.");
				return false
			}
			
			return true;
		}
		
		function signup(){
			if(verifyPassword()){
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: "username=" + username.toLowerCase() + "&password=" + password
				};
				fetch('https://jahanrashidi.com/sm/api/signup.php', requestOptions)
					.then(response => response.json())
					.then(data => {
						const response = data.response;
						
						if(response == "Success"){
							save("username", username);
							save("password", password);
							setUsername(username);
							setPassword(password);
							
							navigation.navigate("Splash");
						} else {
							setMessage(response);
						}
					});
			}
		}
		
		return (
			<View style={{backgroundColor: "#282828", height: "100%"}}>
				<TextInput placeholder="Username" autoComplete="username" style={styles.authInput} autoCapitalize="none" autoFocus={true} onChangeText={onChangeUsername} value={username} keyboardAppearance="dark" />
				<TextInput placeholder="Password" secureTextEntry autoComplete="password" style={styles.authInput} onChangeText={onChangePassword} value={password} keyboardAppearance="dark" />
				<TextInput placeholder="Verify password" secureTextEntry style={styles.authInput} onChangeText={onChangeVerify} value={verify} keyboardAppearance="dark" />
				
				<AuthButton onPress={signup}>Sign-up</AuthButton>
				
				<Text>{message}</Text>
			</View>
		);
	}
	
	return username === null ? (
		<NavigationContainer>
			<Stack.Navigator screenOptions={styles.stackNav}>
				<Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
				<Stack.Screen name="Sign-up" component={SignupScreen} />
				<Stack.Screen name="Log-in" component={LoginScreen} />
			</Stack.Navigator>
		</NavigationContainer>) :
		
		(<NavigationContainer theme={DarkTheme}>
			<Tab.Navigator screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
					return <Ionicons name={icons[route.name]} size={size} color={color} />;
				},
				tabBarActiveTintColor: '#D47386',
				tabBarInactiveTintColor: '#ddd',
				headerShown: false,
				tabBarShowLabel: false,
				tabBarActiveBackgroundColor: "#282828",
				tabBarInactiveBackgroundColor: "#282828"
			})} sceneContainerStyle={{backgroundColor: '#282828'}}>
				<Tab.Screen name="Home" component={HomeStackScreen}/>
				<Tab.Screen name="Post" component={PostScreen} />
				<Tab.Screen name="Notifications" component={NotificationsScreen} />
				<Tab.Screen name="SearchStack" component={SearchStackScreen} />
				<Tab.Screen name="ChatStack" component={ChatStackScreen} />
				<Tab.Screen name="UserStack" component={UserStackScreen} />
				<Tab.Screen name="Settings" component={SettingsScreen} />
			  </Tab.Navigator>
		</NavigationContainer>
	);
	
	function SearchScreen({navigation}){
		const [query, setQuery] = React.useState("");
		
		return (
		<View style={styles.searchContainer}>
			<TextInput style={styles.searchInput} onChangeText={setQuery} value={query} />
			<TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("Results", {query: query})}>
				<Ionicons color="white" size={32} name="search" />
			</TouchableOpacity>
		</View>
		);
	}
	
	function ResultsScreen({route, navigation}){
		const [results, setResults] = React.useState([]);
		
		async function refresh(){
			const data = new FormData();
			
			const requestOptions = {
				method: 'GET',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			};
			
			fetch('https://jahanrashidi.com/sm/api/search_users.php?query=' +  route.params?.query, requestOptions)
				.then(results => results.json())
				.then(data => setResults(data));
		}
		
		React.useEffect(() => {
			if(route.params?.query) navigation.setOptions({title: route.params.query}); 
		
			refresh();
		}, [route.params]);

		return (
		<ScrollView>
			<ListUsers users={results} navigation={navigation} />
		</ScrollView>
		);
	}
	
	function PostScreen({navigation}){
		const [image, setImage] = React.useState([]);
		const [description, setDescription] = React.useState("");
		
		async function post(){
			const data = new FormData();
			data.append("username", username);
			data.append("password", password);
			data.append("description", description);
			
			if(image[0] == undefined) return;
			
			image.forEach(img => {
				data.append("picture[]", {
					name: img.fileName,
					type: img.type,
					uri: img.uri.replace('file://', ''),});
			});
			
			const requestOptions = {
				method: 'POST',
				body: data
			};
			
			fetch('https://jahanrashidi.com/sm/api/post.php', requestOptions).then(response => response.json).then(data => console.log(data));;
			
			setDescription("");
			setImage("");
			
			navigation.navigate("UserStack", {screen: "User", params: {user: username, refresh: true}});
		}
		
		async function pickImage() { 
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); 

			if (status === "granted") {
				const result = await ImagePicker.launchImageLibraryAsync({allowsMultipleSelection: true}); 

				if (!result.cancelled) { 
					setImage(result.assets); 
				} 
			} 
		}
		
		return (
		<ScrollView style={{marginTop: 40}}>
			<TextInput placeholder="Description" value={description} multiline = {true} style={[styles.authInput, {height: 100}]} onChangeText={setDescription} keyboardAppearance="dark" />
			<AuthButton onPress={pickImage}>Select images</AuthButton>
			<AuthButton onPress={post}>Post</AuthButton>
		</ScrollView>);
	}

	function NotificationsScreen({navigation}){
		const [notifications, setNotifications] = React.useState([]);
		React.useEffect(() => {			
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: "username=" + username + "&password=" + password
			};
			
			fetch('https://jahanrashidi.com/sm/api/notifications.php', requestOptions)
				.then(response => response.json())
				.then(data => setNotifications(data.old));
		}, []);

		return (
		<ScrollView>
		{notifications.map(notification => (<Button title={notification} />))}
		</ScrollView>
		);
	}

	function ChatsScreen({navigation}){
		const [chats, setChats] = React.useState([]);
		
		async function refresh(){
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: "username=" + username + "&password=" + password
			};
			
			fetch('https://jahanrashidi.com/sm/api/chats.php', requestOptions)
				.then(response => response.json())
				.then(data => setChats(data));
		}
		
		React.useEffect(() => {
			refresh();
			
			const interval = setInterval(() => {
				refresh();
			}, 2000);
			return () => clearInterval(interval);
		}, []);

		return (
		<ScrollView>
		{chats.map(chat => (
			<TouchableOpacity key={chat.receiver.username} onPress={() => navigation.navigate("Chat", {chat_id: chat.id, receiver: chat.receiver.username})} style={styles.chat}>
				<Image source={{uri: chat.receiver.pfp}} style={{width: 36, height: 36, borderRadius: 18}} />
				<View>
					<Text style={styles.link}>{chat.receiver.username}</Text>
					<Text>{chat.last_message}</Text>
				</View>
			</TouchableOpacity>
		))}
		</ScrollView>
		);
	}
	
	function ChatScreen({route, navigation}){
		const chat_id = route.params?.chat_id;
		const [messages, setMessages] = React.useState([]);
		const [message, setMessage] = React.useState("");
		let lastId = -1;
		
		async function refresh(){
			const data = new FormData();
			data.append("username", username);
			data.append("password", password);
			data.append("id", chat_id);
			data.append("last_id", lastId);
			
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: data
			};
			
			fetch('https://jahanrashidi.com/sm/api/messages.php', requestOptions).then(response => response.json())
				.then(data => {
					if(data.length > 0){
						setMessages(messages => [...messages, ...data]);
						lastId = data[data.length - 1].id;
					}
				});
		}
		
		async function sendMessage(){
			const data = new FormData();
			data.append("username", username);
			data.append("password", password);
			data.append("id", chat_id);
			data.append("message", message);
			
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: data
			};
			
			setMessage("");
			
			fetch('https://jahanrashidi.com/sm/api/message.php', requestOptions);
		}
		
		React.useEffect(() => {	
			navigation.setOptions({ title: route.params?.receiver });
			
			refresh();
			
			const interval = setInterval(() => {
				refresh();
			}, 1000);
			return () => clearInterval(interval);
		}, [chat_id]);
		
		lastSender = "";
		
		function addUsername(sender, time){
			if(sender !== lastSender){
				lastSender = sender;
				return (
				<View style={{paddingTop: 16, flexDirection: "row"}}>
					<Username navigation={navigation}>{sender}</Username>
					<Text style={{color: "#555", paddingLeft: 5, fontSize: 12, paddingTop: 3}}>{time}</Text>
				</View>);
			} else{
				return (<></>);
			}
		}
		
		return (
		<KeyboardShift>
			<ScrollView ref={ref => {this.scrollView = ref}}
			onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})} style={{paddingHorizontal: 10}}>
				{messages.map(message => (
				<View key={message.id}>
					{addUsername(message.sender, message.sent)}
					<Text>{message.message.text}</Text>
				</View>))}
				
				<View style={{flexDirection: 'row', marginVertical: 10, backgroundColor: "#141414", borderRadius: 10}}>
					<TextInput style={styles.messageInput} value={message} onChangeText={setMessage} keyboardAppearance="dark" />
					<TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
						<Ionicons name="send-sharp" color="#ddd" size={32} style={{marginTop: 4, marginRight: 4}} />
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardShift>
		);
	}

	function UserScreen({route, navigation}){
		const [userData, setUserData] = React.useState([]);
		const [posts, setPosts] = React.useState([]);
		const [refreshing, setRefreshing] = React.useState(false);
		
		const onRefresh = React.useCallback(() => {
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
		
		React.useEffect(() => {	
			if(route.params?.user) setUser(route.params.user);
			if(user == "") setUser(username);
			
			navigation.setOptions({title: user});
			
			refresh();
		}, [route.params]);
		
		async function follow(){
			fetch('https://jahanrashidi.com/sm/api/follow.php', requestOptions);
			
			await refresh();
		}
		
		async function unfollow(){
			fetch('https://jahanrashidi.com/sm/api/unfollow.php', requestOptions);
			
			await refresh();
		}
		
		function followButton(){
			if(user === username) return (<></>);

			if(userData?.friends?.followers.includes(username)){
				return (
				<TouchableOpacity onPress={unfollow}>
					<Ionicons name="person-remove" color="white" size={32} />
				</TouchableOpacity>
				);
			} else{
				return (
				<TouchableOpacity onPress={follow}>
					<Ionicons name="person-add" color="white" size={32} />
				</TouchableOpacity>
				);
			}
		}
		
		return (
		<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />}>
			<View style={styles.profile}>
				<Image source={{uri: userData.pfp}} style={styles.pfp} />
				<View style={{marginVertical: 16, flexDirection: "row"}}>
					<Text style={{fontSize: 32, /*marginLeft: 34,*/ marginRight: 4}}>{userData.display_name}</Text>
					{followButton()}
				</View>
				<View style={{marginBottom: 10, flexDirection: "row"}}>
					<Button style={styles.link} color="#D47386" title={userData?.friends?.followers.length + " followers"} onPress={() => navigation.navigate("Followers", {followers: userData?.friends?.followers, referrerTitle: userData.display_name})} />
					<Button style={styles.link} color="#D47386" title={userData?.friends?.following.length + " following"} onPress={() => navigation.navigate("Following", {following: userData?.friends?.following, referrerTitle: userData.display_name})} />
				</View>
				<Text>{userData.bio?.text}</Text>
			</View>
			
			<Seperator />
			
			<View>
				<Posts posts={posts} navigation={navigation} />
			</View>
		</ScrollView>
		);
	}
	
	function logout(){
		AsyncStorage.getAllKeys()
			.then(keys => AsyncStorage.multiRemove(keys));
		
		setUser(null);
		setPassword(null);
	}
	
	function ProfileScreen({route, navigation}){
		const [userData, setUserData] = React.useState([]);
		const [posts, setPosts] = React.useState([]);
		const [refreshing, setRefreshing] = React.useState(false);
		
		const onRefresh = React.useCallback(() => {
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
		
		React.useEffect(() => {	
			refresh();
		}, []);
		
		return (
		<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />}>
			<View style={styles.profile}>
				<Image source={{uri: userData.pfp}} style={styles.pfp} />
				<View style={{marginVertical: 16, flexDirection: "row"}}>
					<Text style={{fontSize: 32, marginRight: 4}}>{userData.display_name}</Text>
				</View>
				<View style={{marginBottom: 10, flexDirection: "row"}}>
					<Button style={styles.link} color="#D47386" title={userData?.friends?.followers.length + " followers"} onPress={() => navigation.navigate("Followers", {followers: userData?.friends?.followers, referrerTitle: userData.display_name})} />
					<Button style={styles.link} color="#D47386" title={userData?.friends?.following.length + " following"} onPress={() => navigation.navigate("Following", {following: userData?.friends?.following, referrerTitle: userData.display_name})} />
				</View>
				<View style={{marginBottom: 10, flexDirection: "row"}}>
					<Button style={styles.link} color="#D47386" title="Edit profile" onPress={() => navigation.navigate("Edit profile")} />
					<Button style={styles.link} color="#D47386" title="Log-out" onPress={() => Alert.alert("Log-out", "Are you sure you want to log-out?",
								[{text: "Log-out", onPress: () => { logout(); }}, {text: "Cancel"}]
							)} />
				</View>
				<Text>{userData.bio?.text}</Text>
			</View>
			
			<Seperator />
			
			<View>
				<Posts posts={posts} navigation={navigation} />
			</View>
		</ScrollView>
		);
	}
	
	function FollowersScreen({route, navigation}){
		const followers = route.params?.followers;
		
		if(route.params?.referrerTitle) navigation.setOptions({headerBackTitle: route.params.referrerTitle}); 
		
		return (
		<ScrollView>
			{followers.map(follower => (<Username key={follower} navigation={navigation}>{follower}</Username>))}
		</ScrollView>
		);
	}
	
	function FollowingScreen({route, navigation}){
		const following = route.params?.following;
		
		if(route.params?.referrerTitle) navigation.setOptions({headerBackTitle: route.params.referrerTitle}); 
		
		return (
		<ScrollView>
			{following.map(following => (<Username key={following} navigation={navigation}>{following}</Username>))}
		</ScrollView>
		);
	}

	function EditingScreen({navigation}){
		return (<Text>editing</Text>);
	}

	function SettingsScreen({navigation}){
		return (
			<Button title="Clear all data" onPress={() => {
				AsyncStorage.getAllKeys()
					.then(keys => AsyncStorage.multiRemove(keys))
					.then(() => alert('success'));
			}}/>
		);
	}

	function SplashScreen({navigation}) {
	  return (
		<View style={{backgroundColor: "#282828", paddingTop: 20, height: "100%"}}>
			<AuthButton onPress={() => navigation.navigate("Sign-up")}>Sign-up</AuthButton>
		  
			<AuthButton onPress={() => navigation.navigate("Log-in")}>Log-in</AuthButton>
		</View>
	  );
	}

	function HomeScreen({navigation}){
		const [feed, setFeed] = React.useState([]);
		const [refreshing, setRefreshing] = React.useState(false);
		
		const onRefresh = React.useCallback(() => {
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

		React.useEffect(() => {			
			refresh();
		}, []);
		
		return (
			<View style={styles.home}>
				<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#bbb" />}>
					<Posts navigation={navigation} posts={feed} />
				</ScrollView>
			</View>
		);
	}
	
	function CommentsScreen({route, navigation}){
		const [comments, setComments] = React.useState([]);
		const [message, setMessage] = React.useState("");
		let post_id = route.params?.post_id;
		
		if(route.params?.referrerTitle) navigation.setOptions({headerBackTitle: route.params.referrerTitle}); 
		
		async function comment(){
			const data = new FormData();
			data.append("username", username);
			data.append("password", password);
			data.append("id", post_id);
			data.append("comment", message);
			
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: data
			};
			
			setMessage("");
			
			fetch('https://jahanrashidi.com/sm/api/comment.php', requestOptions);
			
			refresh();
		}
		
		async function refresh(){
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: "username=" + username + "&password=" + password + "&id=" + post_id
			};
			
			fetch('https://jahanrashidi.com/sm/api/comments.php', requestOptions)
				.then(response => response.json())
				.then(data => setComments(data));
		}
		
		React.useEffect(() => {			
			refresh();
		}, [post_id]);

		return (
		<ScrollView>
			<View>
			{comments.map(comment => (
			<View style={{marginBottom: 10}}>
				<Username navigation={navigation}>{comment.poster}</Username>
				<Text>{comment.text}</Text>
			</View>))}
			</View>
		
			<View style={{flexDirection: 'row', marginVertical: 10, backgroundColor: "#141414", borderRadius: 10}}>
				<TextInput style={styles.messageInput} value={message} onChangeText={setMessage} keyboardAppearance="dark" />
				<TouchableOpacity onPress={comment} style={styles.sendButton}>
					<Ionicons name="send-sharp" color="#ddd" size={32} style={{marginTop: 4, marginRight: 4}} />
				</TouchableOpacity>
			</View>
		</ScrollView>
		);
	}

	function HomeStackScreen(){
		return (
		<HomeStack.Navigator screenOptions={styles.stackNav}>
			<HomeStack.Screen name="Feed" component={HomeScreen} options={{headerShown: false}} />
			<HomeStack.Screen name="Comments" component={CommentsScreen} />
		</HomeStack.Navigator>
		);
	}
	
	function UserStackScreen(){
		return (
		<UserStack.Navigator screenOptions={styles.stackNav} initialRouteName="Profile">
			<UserStack.Screen name="Profile" options={{headerShown: false}} component={ProfileScreen} />
			<UserStack.Screen name="User" component={UserScreen} />
			<UserStack.Screen name="UserComments" options={{title: "Comments"}} component={CommentsScreen} />
			<UserStack.Screen name="Followers" component={FollowersScreen} />
			<UserStack.Screen name="Following" component={FollowingScreen} />
			<UserStack.Screen name="Edit profile" component={EditingScreen} />
		</UserStack.Navigator>
		);
	}
	
	function ChatStackScreen(){
		return (
		<ChatStack.Navigator screenOptions={styles.stackNav}>
			<ChatStack.Screen name="Chats" component={ChatsScreen} />
			<ChatStack.Screen name="Chat" component={ChatScreen} />
		</ChatStack.Navigator>
		);
	}

	function SearchStackScreen(){
		return (
		<ChatStack.Navigator screenOptions={styles.stackNav}>
			<ChatStack.Screen name="Search" component={SearchScreen} />
			<ChatStack.Screen name="Results" component={ResultsScreen} />
		</ChatStack.Navigator>
		);
	}

	function sendPost(id){
		
	}
	
	async function deletePost(id){
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: "username=" + username + "&password=" + password + "&id=" + id
		};
		
		fetch('https://jahanrashidi.com/sm/api/delete_post.php', requestOptions);
	}

	function Posts({posts, navigation}){
		if(posts.map == undefined) return (<></>);
		
		return posts.map(post => (
			<View key={post.id} style={styles.post.main}>
				<Username navigation={navigation}>{post.poster}</Username>
				{post.images.map(image => (
					<RemoteImage key={image} uri={image} desiredWidth={deviceWidth-20} style={{borderRadius: 5}} />
				))}
				<View style={styles.post.bottom}>
					<View style={{flexDirection: "row", justifyContent: "space-between"}}>
						<View style={{flexDirection: "row"}}>
							<TouchableOpacity onPress={() => navigation.navigate("Comments", {post_id: post.id})} style={{marginRight: 10}}>
								<Ionicons name="chatbox-ellipses" color="white" size={24} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => sendPost(post.id)}>
								<Ionicons name="send-sharp" color="white" size={24} />
							</TouchableOpacity>
						</View>
						<View>
							{username == post.poster ? (
							<TouchableOpacity onPress={() => Alert.alert("", "Are you sure you want to delete this post?",
								[{text: "Delete", onPress: () => { deletePost(post.id); }}, {text: "Cancel"}]
							)}>
								<Ionicons name="trash" color="white" size={24} />
							</TouchableOpacity>
							) : <></>}
						</View>
					</View>
					<RNText style={[styles.text, {flex: 1}]}>{post.description.desc}</RNText>
				</View>
			</View>
		))
	}
}

async function save(key, value) {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (e) {
		console.log(e);
	}
}

async function get(key) {
	try {
		const value = await AsyncStorage.getItem(key);
		return value;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export const KeyboardShift = ({ children }: Props) => {
  const height = useHeaderHeight()

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={height}
      behavior="padding"
      enabled>
      {children}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
	pfp: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
	home: {
		flex: 1,
		marginTop: 20
	},
	post: {
		main: {
			marginBottom: 20,
			padding: 10,
			backgroundColor: "#262626"
		},
		bottom: {
		}
	},
	profile: {
		marginTop: 25,
		alignItems: "center",
		borderBottom: 1,
		marginHorizontal: 10
	},
	text: {
		color: "#ddd",
		fontSize: 16
	},
	link: {
		color: "#D47386",
		fontWeight: 500
	},
	tabBar: {
		color: "#282828"
	},
	stackNav: { 
		contentStyle: {backgroundColor: '#282828'}, 
		headerStyle: {
			backgroundColor: '#282828',
		},
		headerTintColor: '#eee',
	},
	messageInput: {
		color: "#ddd",
		fontSize: 16,
		flex: 1,
		padding: 10,
		height: 40
	},
	sendButton: {
		marginLeft: 10
	},
	chat: {
		flexDirection: "row",
		marginBottom: 16
	},
	authInput: {
		color: "#ddd",
		borderRadius: 8,
		height: 50,
		backgroundColor: "#141414",
		fontSize: 16,
		paddingHorizontal: 16,
		marginHorizontal: 32,
		marginVertical: 16
	},
	authButton: {
		borderRadius: 8,
		height: 50,
		backgroundColor: "rgb(93, 95, 222)",
		fontSize: 16,
		paddingHorizontal: 16,
		marginHorizontal: 32,
		marginVertical: 16,
		justifyContent: 'center',
		alignItems: "center"
	},
	searchInput: {
		color: "#ddd",
		height: 50,
		fontSize: 16,
		paddingHorizontal: 16,
		flex: 1
	},
	searchContainer: {
		borderRadius: 8,
		height: 50,
		backgroundColor: "#141414",
		marginHorizontal: 32,
		marginVertical: 30,
		flexDirection: "row"
	},
	searchButton:{
		margin: 9
	}
});

function Text(props) {
  return (
    <RNText style={[styles.text, props?.style]}>
      {props.children}
    </RNText>
  );
}

function Username(props){
	return (
		<TouchableOpacity onPress={() => props.navigation.navigate("UserStack", {screen: "User", initial: false, params: {user: props.children}})}>
			<RNText style={[styles.text, styles.link, props?.style]}>{props.children}</RNText>
		</TouchableOpacity>
	);
}

function Seperator(){
	return (<View style={{height: 1, backgroundColor: "#888", flex: 1, marginVertical: 10}}></View>)
}

function AuthButton(props){
	return (
		<TouchableOpacity style={styles.authButton} onPress={props?.onPress}>
			<RNText style={{fontSize: 16, fontWeight: 600, color: "white"}}>{props.children}</RNText>
		</TouchableOpacity>
	);
}

function ListUsers(props){
	if(props.users.map == undefined) return (<Text>Missing users prop</Text>);
	console.log(props.users);
	return props.users.map(user => (
		<TouchableOpacity style={{flexDirection: "row", paddingVertical: 4, marginVertical: 4, backgroundColor: "#262626"}} 
		key={user.username} onPress={() => props.navigation.navigate("UserStack", {screen: "User", initial: false, params: {user: user.username}})}>
			<Image source={{uri: user.pfp}} style={{width: 36, height: 36, borderRadius: 18, marginRight: 10}} />
			<Text navigation={props?.navigation} style={[{marginTop: 10}, styles.link]}>{user.username}</Text>
		</TouchableOpacity>
	));
}

const RemoteImage = ({uri, desiredWidth, style}) => {
	
    const [desiredHeight, setDesiredHeight] = React.useState(0)

    Image.getSize(uri, (width, height) => {
        setDesiredHeight(desiredWidth / width * height)
    })

    return (
        <Image
            source={{uri}}
            style={[{
                width: desiredWidth,
                height: desiredHeight
            }, style]}
        />
    )
}