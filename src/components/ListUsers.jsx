import {TouchableOpacity, Image} from "react-native";
import Text from "./Text";
import { styles, colors } from "../styles";

export default function ListUsers(props){
	if(props.users.map == undefined) return (<Text>Missing users prop</Text>);
	
	return props.users.map(user => (
		<TouchableOpacity style={{flexDirection: "row", paddingVertical: 4, marginVertical: 4, backgroundColor: colors.foreground}} 
		key={user.username} onPress={() => props.navigation.navigate("UserStack", {screen: "User", initial: false, params: {user: user.username}})}>
			<Image source={{uri: user.pfp}} style={{width: 36, height: 36, borderRadius: 18, marginRight: 10}} />
			<Text navigation={props?.navigation} style={[{marginTop: 10}, styles.link]}>{user.username}</Text>
		</TouchableOpacity>
	));
}