import { KeyboardAvoidingView } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements'

export default function KeyboardShift({ children }) {
  const height = useHeaderHeight()

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={height} behavior="padding" enabled>
      {children}
    </KeyboardAvoidingView>
  );
}