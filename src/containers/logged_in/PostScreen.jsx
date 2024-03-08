import { useState } from "react";
import { ScrollView, TextInput, Dimensions, View, Switch, Image, ActivityIndicator } from "react-native";
import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } from "expo-image-picker";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import AuthButton from "../../components/AuthButton";
import { styles, colors } from "../../styles";
import Text from "../../components/Text";
import Album from "../../components/Album";

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
			const result = await launchImageLibraryAsync({allowsMultipleSelection: true, orderedSelection: true, aspect: [1, 1]}); 

			if (!result.cancelled) {
				if(result.assets == null) return;
				for(let i = 0; i < result.assets.length; i++){
					result.assets[i].uri = result.assets[i].uri.replace("file://", "");
				}
				
				setImage(result.assets); 
			} 
		} else{
			Alert.alert("Camera roll access denied.");
		}
	}
	
	function DisplayImages({images}){
		if(images[0] == undefined) return (<></>);
		
		return (
			<View style={styles.post.main}>
				<View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 2}}>
					<View style={{flexDirection: "row"}}>
						<Text style={styles.link}>{username}</Text>
						{privatePost ? <Text style={styles.time}>private</Text> : <></>}
					</View>
					<Text style={styles.time}>1234-56-67 08:09:10</Text>
				</View>

				<Album deviceWidth={deviceWidth} images={images} />
				
				<View style={styles.post.bottom}>
					<View style={{flexDirection: "row", justifyContent: "space-between"}}>
						<View style={{flexDirection: "row", marginBottom: 10, gap: 15}}>
							<Ionicons name="chatbox-ellipses" color="white" size={30} />
							<Ionicons name="send" color="white" size={30} />
							<Ionicons name="repeat" color="white" size={30} />
						</View>
						<View style={{flexDirection: "row", marginBottom: 10, gap: 15}}>
							<Ionicons name="bookmark-outline" color="white" size={30} />

							<Ionicons name="trash" color="white" size={30} />
						</View>
					</View>
					<Text>{description}</Text>
				</View>
			</View>
		);
	}
	
	if(uploading) return (
	<View style={{flex: 1, justifyContent: "space-around"}}>
		<ActivityIndicator size="large" color="#ffffff" />
	</View>
	);
	else return (
	<ScrollView>
		<DisplayImages images={image} />
		<AuthButton onPress={pickImage}>Select images</AuthButton>
		<TextInput placeholder="Description" value={description} multiline={true} style={[styles.authInput, {height: 100}]} onChangeText={setDescription} keyboardAppearance="dark" />
		<View style={{flexDirection: "row", marginHorizontal: 30, marginBottom: 20, alignItems: "center", gap: 10}}>
			<Switch value={privatePost} onValueChange={setPrivatePost}/>
			<Text>Private post</Text>
		</View>
		<AuthButton onPress={post}>Post</AuthButton>
	</ScrollView>);
}