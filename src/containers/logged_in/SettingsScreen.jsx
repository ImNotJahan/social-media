import { Button } from "react-native";

import { clearAll } from "../../storage";

export default function SettingsScreen({navigation}){
	return (
		<Button title="Clear all data" onPress={() => clearAll()}/>
	);
}