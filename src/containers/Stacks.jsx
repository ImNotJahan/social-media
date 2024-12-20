import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { Linking, View } from "react-native";
import { useSelector } from "react-redux";
import { getLastNotificationResponseAsync, addNotificationResponseReceivedListener } from "expo-notifications";
import { Image } from "expo-image";

// logged out

import SplashScreen from "./logged_out/SplashScreen";
import SignupScreen from "./logged_out/SignupScreen";
import LoginScreen from "./logged_out/LoginScreen";


// logged in

import SearchScreen from "./logged_in/search/SearchScreen";
import ResultsScreen from "./logged_in/search/ResultsScreen";

import PostScreen from "./logged_in/PostScreen";
import NotificationsScreen from "./logged_in/NotificationsScreen";
import SettingsScreen from "./logged_in/SettingsScreen";

import ChatsScreen from "./logged_in/chat/ChatsScreen";
import ChatScreen from "./logged_in/chat/ChatScreen";
import PostViewScreen from "./logged_in/chat/PostViewScreen";
import ChatResultsScreen from "./logged_in/chat/ChatResultsScreen";

import UserScreen from "./logged_in/user/UserScreen";
import ProfileScreen from "./logged_in/user/ProfileScreen";
import FollowersScreen from "./logged_in/user/FollowersScreen";
import FollowingScreen from "./logged_in/user/FollowingScreen";
import EditingScreen from "./logged_in/user/EditingScreen";
import SavedScreen from "./logged_in/user/SavedScreen";

import HomeScreen from "./logged_in/home/HomeScreen";
import CommentsScreen from "./logged_in/home/CommentsScreen";


import { styles, colors } from "../styles";


const Tabs = createBottomTabNavigator();

const SplashStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator(); // unused
const SearchStack = createNativeStackNavigator();

export function SplashStackScreen(){
	return (
	<NavigationContainer>
		<SplashStack.Navigator screenOptions={styles.stackNav}>
			<SplashStack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
			<SplashStack.Screen name="Sign-up" component={SignupScreen} />
			<SplashStack.Screen name="Log-in" component={LoginScreen} />
		</SplashStack.Navigator>
	</NavigationContainer>
	);
}

const linking = {
	prefixes: ["agur://"],
	config: {
		screens: {
			Home: {
				initialRouteName: "Feed",
				screens: {
					Feed: "feed",
					Notifications: "notifications"
				}
			},
			ChatStack: {
				initialRouteName: "Chats",
				screens: {
					Chat: "chat/:chat_id",
					PostView: "post/:post_id"
				}
			},
			UserStack: {
				initialRouteName: "Profile",
				screens: {
					User: "user/:user"
				}
			}
		}
	},
	async getInitialURL(){
		const url = await Linking.getInitialURL();

		if(url != null) return url;

		const response = await getLastNotificationResponseAsync();
		return response?.notification.request.content.data.url;
	},
	subscribe(listener) {
		const onReceiveURL = ({url}) => listener(url);
		const eventListenerSubscription = Linking.addEventListener("url", onReceiveURL);

		const subscription = addNotificationResponseReceivedListener(response => {
			const url = response.notification.request.content.data.url;
			listener(url);
		});

		return () => {
			eventListenerSubscription.remove();
			subscription.remove();
		}
	}
}

const tabIcons = {"Home": "home-sharp", "ChatStack": "chatbubble", "UserStack": "person", "SearchStack": "search"};
export function TabScreen(){
	const [uri, setURI] = useState("https://jahanrashidi.com/sm/images/profile.png");
	const username = useSelector(state => state.auth.username);
	const messages = useSelector(state => state.auth.messages);

	useEffect(() => {
		fetch("https://jahanrashidi.com/sm/api/get_pfp.php?user=" + username)
			.then(result => result.json())
			.then(data => setURI(data.uri));
	}, []);

	return (
	<NavigationContainer linking={linking}>
		<Tabs.Navigator screenOptions={({ route }) => ({
			tabBarIcon: ({ color, size }) => {
				return <Ionicons name={tabIcons[route.name]} size={32} color={color} />;
			},
			tabBarActiveTintColor: colors.link,
			tabBarInactiveTintColor: colors.text,
			tabBarStyle: {backgroundColor: colors.background},
			headerShown: false,
			tabBarShowLabel: false,
			tabBarActiveBackgroundColor: colors.background,
			tabBarInactiveBackgroundColor: colors.background,
			autoHideHomeIndicator: true
		})} sceneContainerStyle={{backgroundColor: colors.background}}>
			<Tabs.Screen name="Home" component={HomeStackScreen} />
			<Tabs.Screen name="SearchStack" component={SearchStackScreen} />
			<Tabs.Screen name="ChatStack" component={ChatStackScreen} options={messages != 0 ? {tabBarBadge: messages, tabBarBadgeStyle: {backgroundColor: "#dd0000"}} : {}} />
			<Tabs.Screen name="UserStack" component={UserStackScreen} options={{tabBarIcon: ({focused}) => {
				return (<Image source={uri} style={{width: 32, height: 32, borderRadius: 16, borderWidth: focused ? 2 : 0, borderColor: colors.link}} />)
			}}} />
		  </Tabs.Navigator>
	</NavigationContainer>
	);
}

export function HomeStackScreen(){
	return (
	<HomeStack.Navigator screenOptions={styles.stackNav} initialRouteName="Feed">
		<HomeStack.Screen name="Feed" component={HomeScreen} options={{headerShown: false}} />
		<HomeStack.Screen name="Comments" component={CommentsScreen} />
		<HomeStack.Screen name="Post" component={PostScreen} />
		<HomeStack.Screen name="Notifications" component={NotificationsScreen} />
	</HomeStack.Navigator>
	);
}

export function UserStackScreen(){
	return (
	<UserStack.Navigator screenOptions={styles.stackNav} initialRouteName="Profile">
		<UserStack.Screen name="Profile" options={{headerShown: false}} component={ProfileScreen} />
		<UserStack.Screen name="User" component={UserScreen} />
		<UserStack.Screen name="UserComments" options={{title: "Comments"}} component={CommentsScreen} />
		<UserStack.Screen name="Followers" component={FollowersScreen} />
		<UserStack.Screen name="Following" component={FollowingScreen} />
		<UserStack.Screen name="Edit profile" component={EditingScreen} />
		<UserStack.Screen name="Settings" component={SettingsScreen} />
		<UserStack.Screen name="Saved" component={SavedScreen} />
	</UserStack.Navigator>
	);
}

export function ChatStackScreen(){
	return (
	<ChatStack.Navigator screenOptions={styles.stackNav} initialRouteName="Chats">
		<ChatStack.Screen name="Chats" options={{headerShown: false}} component={ChatsScreen} />
		<ChatStack.Screen name="Chat" component={ChatScreen} />
		<ChatStack.Screen name="PostView" options={{title: "View Post"}} component={PostViewScreen} />
		<ChatStack.Screen name="ChatResults" options={{title: "Results"}} component={ChatResultsScreen} />
	</ChatStack.Navigator>
	);
}

export function SearchStackScreen(){
	return (
	<ChatStack.Navigator screenOptions={styles.stackNav} initialRouteName="Search">
		<ChatStack.Screen name="Search" options={{headerShown: false}} component={SearchScreen} />
		<ChatStack.Screen name="Results" component={ResultsScreen} />
	</ChatStack.Navigator>
	);
}