import { SafeAreaView } from "react-native";
import AuthButton from "../../components/AuthButton";

export default function SplashScreen({navigation}) {
  return (
	<SafeAreaView>
		<AuthButton onPress={() => navigation.navigate("Sign-up")}>Sign-up</AuthButton>
	  
		<AuthButton onPress={() => navigation.navigate("Log-in")}>Log-in</AuthButton>
	</SafeAreaView>
  );
}