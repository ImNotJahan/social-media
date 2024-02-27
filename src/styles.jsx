import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
		marginHorizontal: 10
	},
	text: {
		color: "#ddd",
		fontSize: 16,
		fontFamily: "Montserrat_500Medium",
		fontWeight: 500
	},
	link: {
		color: "#D47386",
		fontWeight: 600,
		fontFamily: "Montserrat_700Bold"
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
	},
	inputLabel: {
		marginHorizontal: 40,
		marginTop: 15,
		marginBottom: -10
	},
	notification: {
		flexDirection: "row",
		paddingVertical: 4, 
		marginVertical: 4, 
		backgroundColor: "#262626"
	}
});