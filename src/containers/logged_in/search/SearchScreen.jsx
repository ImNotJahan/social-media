import { ScrollView, View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { styles } from "../../../styles";

export default function SearchScreen({navigation}){
	const [query, setQuery] = useState("");
	
	function results(){
		navigation.navigate("Results", {query: query});
	}

	return (
	<ScrollView scrollEnabled={false}>
		<View style={styles.searchContainer}>
			<TextInput style={styles.searchInput} onChangeText={setQuery} value={query} keyboardAppearance="dark" onSubmitEditing={results} />
			<TouchableOpacity style={styles.searchButton} onPress={results}>
				<Ionicons color="white" size={32} name="search" />
			</TouchableOpacity>
		</View>
	</ScrollView>
	);
}