import { ScrollView } from "react-native";
import { useState, useEffect } from "react";

import ListUsers from "../../../components/ListUsers";

export default function ResultsScreen({route, navigation}){
	const [results, setResults] = useState([]);
	
	async function refresh(){
		const data = new FormData();
		
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		};
		
		fetch('https://jahanrashidi.com/sm/api/search_users.php?query=' +  route.params?.query, requestOptions)
			.then(results => results.json())
			.then(data => setResults(data));
	}
	
	useEffect(() => {
		if(route.params?.query) navigation.setOptions({title: route.params.query}); 
	
		refresh();
	}, [route.params]);

	return (
	<ScrollView>
		<ListUsers users={results} navigation={navigation} />
	</ScrollView>
	);
}