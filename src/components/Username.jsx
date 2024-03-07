import { Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";

export default function Username(props){
	return (
		<TouchableOpacity onPress={() => props.navigation.navigate("UserStack", {screen: "User", initial: false, params: {user: props.children}})}>
			<Text style={[styles.text, styles.link, props?.style]}>{(props?.at ? "@" : "") + props.children}</Text>
		</TouchableOpacity>
	);
}