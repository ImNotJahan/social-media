import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles";

export default function AuthButton(props){
	return (
		<TouchableOpacity style={styles.authButton} onPress={props?.onPress}>
			<Text style={{fontSize: 16, fontWeight: 600, color: "white"}}>{props.children}</Text>
		</TouchableOpacity>
	);
}