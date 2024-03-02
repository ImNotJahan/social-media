import { useState } from "react";
import { ScrollView, TextInput, Dimensions, View, Switch, Image, ActivityIndicator } from "react-native";
import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } from "expo-image-picker";
import { useSelector } from "react-redux";

import AuthButton from "../../components/AuthButton";
import { styles, colors } from "../../styles";
import Text from "../../components/Text";

const deviceWidth = Dimensions.get('window').width;

export default function PostScreen({route, navigation}){
	const [image, setImage] = useState([]);
	const [description, setDescription] = useState("");
	const [privatePost, setPrivatePost] = useState(false);
	const [uploading, setUploading] = useState(false);

	username = useSelector(state => state.auth.username);
	password = useSelector(state => state.auth.password);
	
	async function post(){
		const data = new FormData();
		data.append("username", username);
		data.append("password", password);
		data.append("description", description);
		data.append("private", privatePost ? 1 : 0);

		if(image[0] == undefined) return;
		
		image.forEach(img => {
			data.append("picture[]", {
				name: img.fileName,
				type: img.type,
				uri: img.uri
			});
		});
		
		const requestOptions = {
			method: 'POST',
			body: data
		};
		
		setUploading(true);
		setDescription("");
		setImage("");
		setPrivatePost(false);

		await fetch('https://jahanrashidi.com/sm/api/post.php', requestOptions);

		setUploading(false);
		
		navigation.navigate("Feed");
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
			(<Image key={img.uri} source={{uri: img.uri}} width={deviceWidth - 64} height={deviceWidth / img.width * img.height} 
					style={{marginHorizontal: 32, marginVertical: 10, borderRadius: 5}} />));
	}
	
	if(uploading) return (
	<View style={{flex: 1, justifyContent: "space-around"}}>
		<ActivityIndicator size="large" color={colors.link} />
	</View>
	);
	else return (
	<ScrollView>
		<TextInput placeholder="Description" value={description} multiline={true} style={[styles.authInput, {height: 100}]} onChangeText={setDescription} keyboardAppearance="dark" />
		<DisplayImages images={image} />
		<AuthButton onPress={pickImage}>Select images</AuthButton>
		<View style={{flexDirection: "row", marginHorizontal: 30, marginBottom: 20, alignItems: "center", gap: 10}}>
			<Switch value={privatePost} onValueChange={setPrivatePost} />
			<Text>Private post</Text>
		</View>
		<AuthButton onPress={post}>Post</AuthButton>
	</ScrollView>);
}