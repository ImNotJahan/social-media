import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles";

export default function AuthButton(props){
	return (
		<TouchableOpacity style={styles.authButton} onPress={props?.onPress}>
			<Text style={[styles.text, {fontFamily: "Montserrat_700Bold"}]}>{props.children}</Text>
		</TouchableOpacity>
	);
}