import { ScrollView, SafeAreaView, View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { styles } from "../../../styles";

export default function SearchScreen({navigation}){
	const [query, setQuery] = useState("");
	
	function results(){
		if(query == "") return;

		navigation.navigate("Results", {query: query});
		setQuery("");
	}

	return (
	<SafeAreaView>
		<ScrollView scrollEnabled={false} style={{height: "100%"}}>
			<View style={styles.searchContainer}>
				<TextInput style={styles.searchInput} onChangeText={setQuery} value={query} keyboardAppearance="dark" onSubmitEditing={results} autoCorrect={false} />
				<TouchableOpacity style={styles.searchButton} onPress={results}>
					<Ionicons color="white" size={32} name="search" />
				</TouchableOpacity>
			</View>
		</ScrollView>
	</SafeAreaView>
	);
}