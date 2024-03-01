import { Text as RNText } from "react-native";
import { styles } from "../styles";

export default function Text(props) {
  return (
    <RNText style={[styles.text, props?.style]} numberOfLines={props?.numberOfLines}>
      {props.children}
    </RNText>
  );
}