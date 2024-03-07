import { StyleSheet } from "react-native";

export const colors = {
	background: "#2a2b2a", //"#464e47s", // 282828 606c38
	text: "#ddd",
	link: "#0a8754", // D47386
	foreground: "#3a3b3a", // 262626
	input: "#141414",
	faint: "#777",
	faint2: "#999"
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
		marginBottom: 8,
		backgroundColor: colors.foreground,
		padding: 8,
		borderRadius: 4
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
		backgroundColor: "#006635",
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
		margin: 10,
		zIndex: 1 // required so TouchableOpacity can be interacted with when position: "absolute"
	},
	savedPostsButton: {
		position: "absolute",
		right: 40,
		margin: 10,
		zIndex: 1 // required so TouchableOpacity can be interacted with when position: "absolute"
	},
	headerIcons: {
		flexDirection: "row",
		gap: 10,
	},
	header: {
		marginHorizontal: 10,
		flexDirection: "row",
		justifyContent: "space-between",
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