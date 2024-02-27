import { View } from "react-native";
import AuthButton from "../../components/AuthButton";

export default function SplashScreen({navigation}) {
  return (
	<View style={{backgroundColor: "#282828", paddingTop: 20, height: "100%"}}>
		<AuthButton onPress={() => navigation.navigate("Sign-up")}>Sign-up</AuthButton>
	  
		<AuthButton onPress={() => navigation.navigate("Log-in")}>Log-in</AuthButton>
	</View>
  );
}