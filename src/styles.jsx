import { StyleSheet } from "react-native";

export const colors = {
	background: "#2a2b2a", //"#464e47s", // 282828 606c38
	text: "#ddd",
	link: "#0a8754", // D47386
	foreground: "#3a3b3a", // 262626
	input: "#141414",
	faint: "#777",
};

export const styles = StyleSheet.create({
	pfp: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
	post: {
		main: {
			marginBottom: 20,
			padding: 10,
			backgroundColor: colors.foreground,
			borderRadius: 5,
			margin: 5
		},
		bottom: {
		},
		previewMain: {
			padding: 10,
			backgroundColor: colors.foreground,
			borderRadius: 5
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
		color: colors.link,
		fontWeight: 600,
		fontFamily: "Montserrat_700Bold"
	},
	tabBar: {
		color: colors.background
	},
	stackNav: { 
		contentStyle: {backgroundColor: colors.background}, 
		headerStyle: {
			backgroundColor: colors.background,
		},
		headerTintColor: colors.text,
	},
	messageInput: {
		color: colors.text,
		fontSize: 16,
		flex: 1,
		padding: 10,
		height: 40,
		fontFamily: "Montserrat_500Medium"
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
		backgroundColor: colors.input,
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
		color: colors.text,
		height: 50,
		fontSize: 16,
		paddingHorizontal: 16,
		flex: 1
	},
	searchContainer: {
		borderRadius: 8,
		height: 50,
		backgroundColor: colors.input,
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
		backgroundColor: colors.foreground
	},
	settings: {
		position: "absolute",
		right: 0,
		margin: 20,
		zIndex: 1 // required so TouchableOpacity can be interacted with when position: "absolute"
	},
	headerIcons: {
		flexDirection: "row-reverse",
		gap: 10,
		marginHorizontal: 10
	},
	time: {
		color: colors.faint, 
		paddingLeft: 5, 
		fontSize: 12, 
		paddingTop: 3
	},
	modal: {
		backgroundColor: colors.background,
		position: "absolute",
		bottom: 0,
		height: "30%",
		width: "100%"
	}
});