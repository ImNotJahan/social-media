import { openBrowserAsync } from "expo-web-browser";
import { TouchableOpacity } from "react-native";

import Text from "./Text";
import { styles } from "../styles";

export default function Link({href, navigation}){
	return (
		<TouchableOpacity onPress={() => openBrowserAsync(href)} >
			<Text style={styles.link}>{href}</Text>
		</TouchableOpacity>
	);
}