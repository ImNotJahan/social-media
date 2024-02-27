import { useState } from "react";
import { ScrollView, TextInput, Dimensions } from "react-native";
import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } from "expo-image-picker";
import { useSelector } from "react-redux";

import RemoteImage from "../../components/RemoteImage";
import AuthButton from "../../components/AuthButton";
import { styles } from "../../styles";

const deviceWidth = Dimensions.get('window').width;

export default function PostScreen({route, navigation}){
	const [image, setImage] = useState([]);
	const [description, setDescription] = useState("");

	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);
	
	async function post(){
		const data = new FormData();
		data.append("username", username);
		data.append("password", password);
		data.append("description", description);
		
		if(image[0] == undefined) return;
		
		image.forEach(img => {
			data.append("picture[]", {
				name: img.fileName,
				type: img.type,
				uri: img.uri});
		});
		
		const requestOptions = {
			method: 'POST',
			body: data
		};
		
		fetch('https://jahanrashidi.com/sm/api/post.php', requestOptions);
		
		setDescription("");
		setImage("");
		
		navigation.navigate("UserStack", {screen: "Profile", params: {refresh: true}});
	}
	
	async function pickImage() { 
		const { status } = await requestMediaLibraryPermissionsAsync(); 

		if (status === "granted") {
			const result = await launchImageLibraryAsync({allowsMultipleSelection: true}); 

			if (!result.cancelled) {
				for(let i = 0; i < result.assets.length; i++){
					result.assets[i].uri = result.assets[i].uri.replace("file://", "");
				}
				
				setImage(result.assets); 
			} 
		} 
	}
	
	function DisplayImages({images}){
		if(images[0] == undefined) return (<></>);
		
		return images.map(img => 
			(<RemoteImage key={img.uri} uri={img.uri} desiredWidth={deviceWidth - 20} style={{margin: 10, borderRadius: 5}} />));
	}
	
	return (
	<ScrollView>
		<TextInput placeholder="Description" value={description} multiline={true} style={[styles.authInput, {height: 100}]} onChangeText={setDescription} keyboardAppearance="dark" />
		<DisplayImages images={image} />
		<AuthButton onPress={pickImage}>Select images</AuthButton>
		<AuthButton onPress={post}>Post</AuthButton>
	</ScrollView>);
}