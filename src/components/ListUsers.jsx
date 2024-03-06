import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Text from "./Text";
import { styles, colors } from "../styles";

export default function ListUsers({navigation, users, push}){
	if(users.map == undefined) return (<Text>Missing users prop</Text>);
	
	return users.map(user => (
		<TouchableOpacity style={{flexDirection: "row", paddingVertical: 4, marginVertical: 4, backgroundColor: colors.foreground}} 
		key={user.username} onPress={() => {
				if(push) navigation.push("User", {user: user.username});
				else navigation.navigate("UserStack", {screen: "User", initial: false, params: {user: user.username}});
			}}>
			<Image source={user.pfp} style={{width: 36, height: 36, borderRadius: 18, marginRight: 10}} />
			<Text style={[{marginTop: 10}, styles.link]}>{user.username}</Text>
		</TouchableOpacity>
	));
}