import { useState } from "react";
import { ScrollView, TextInput, View, Image } from "react-native";
import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } from "expo-image-picker";
import { useSelector } from "react-redux";

import Text from "../../../components/Text";
import AuthButton from "../../../components/AuthButton";
import { styles } from "../../../styles";

export default function EditingScreen({route, navigation}){
	const [displayName, setDisplayName] = useState(route.params.userData?.display_name);
	const [website, setWebsite] = useState(route.params.userData?.bio.link);
	const [bio, setBio] = useState(route.params.userData?.bio.text);
	const [pfp, setPFP] = useState([]);

	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);
	
	async function pickPFP(){
		const { status } = await requestMediaLibraryPermissionsAsync(); 

		if (status === "granted") {
			const result = await launchImageLibraryAsync(); 

			if (!result.cancelled) { 
				const pfp = result.assets[0];
				pfp.uri = pfp.uri.replace("file://", "");
				
				setPFP(pfp);
			} 
		} 
	}
	
	async function saveChanges(){
		const data = new FormData();
		data.append("username", username);
		data.append("password", password);
		data.append("bio", bio);
		data.append("website", website);
		data.append("display_name", displayName);
		
		// crashes if append entire object
		if(pfp?.uri) data.append("pfp", {name: pfp.fileName, type: pfp.type, uri: pfp.uri});
		
		const requestOptions = {
			method: 'POST',
			body: data
		};
		
		fetch('https://jahanrashidi.com/sm/api/edit_profile.php', requestOptions).then(response => response.json).then(data => console.log(data));;
		
		navigation.navigate("UserStack", {screen: "Profile", params: {refresh: true}});
	}
	
	return (
	<ScrollView>
		<Text style={styles.inputLabel}>Display name</Text>
		<TextInput style={styles.authInput} value={displayName} onChangeText={setDisplayName} keyboardAppearance="dark" />
		
		<Text style={styles.inputLabel}>Website</Text>
		<TextInput style={styles.authInput} value={website} onChangeText={setWebsite} keyboardAppearance="dark" />
		
		<Text style={styles.inputLabel}>Bio</Text>
		<TextInput style={[styles.authInput, {height: 100}]} multiline={true} onChangeText={setBio} value={bio} keyboardAppearance="dark" />
		
		<View style={{alignItems: "center", marginTop: 30}}><Image style={styles.pfp} source={{uri: pfp?.uri ? pfp.uri : route.params.userData?.pfp}} /></View>
		<AuthButton onPress={()=> {pickPFP()}}>Choose profile picture</AuthButton>
		
		<AuthButton onPress={()=> {saveChanges()}}>Save changes</AuthButton>
	</ScrollView>
	);
}