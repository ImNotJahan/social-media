import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { styles } from "../../../styles";

export default function SearchScreen({navigation}){
	const [query, setQuery] = useState("");
	
	return (
	<View style={styles.searchContainer}>
		<TextInput style={styles.searchInput} onChangeText={setQuery} value={query} keyboardAppearance="dark" />
		<TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("Results", {query: query})}>
			<Ionicons color="white" size={32} name="search" />
		</TouchableOpacity>
	</View>
	);
}