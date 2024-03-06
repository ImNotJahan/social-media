import { View } from "react-native";
import Text from "./Text";

export default function Badge({value, style}){
	if(value == 0) return (<></>);

	return (
	<View style={[{borderRadius: 9, backgroundColor: "#dd0000", height: 18, width: 18, justifyContent: "center", alignItems: "center"}, style]}>
		<Text style={{fontSize: 10, textAlign: "center"}}>{value}</Text>
	</View>);
}