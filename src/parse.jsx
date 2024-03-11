import { View } from "react-native";

import Username from "./components/Username";
import Text from "./components/Text";
import Link from "./components/Link";

export default function parse(text, navigation){
	let tokens = [];

	text.split(" ").forEach(word => {
		if(word.slice(0, 8) == "https://" || word.slice(0, 7) == "http://")
			tokens.push({type: "link", content: word});
		else if(word.slice(0, 1) == "@")
			tokens.push({type: "username", content: word.slice(1)});
		else{
			if(tokens.length > 0 && tokens[tokens.length - 1].type == "text")
				tokens[tokens.length - 1].content += word + " ";
			else
				tokens.push({type: "text", content: word + " "});
		}

		if(tokens[tokens.length - 1].type != "text")
			tokens.push({type: "text", content: " "});
	});

	let id = 0;
	return (
	<View style={{flexDirection: "row"}}>
		{tokens.map(token => {
			id++;

			switch(token.type){
			case "text":
				return (<Text key={id}>{token.content}</Text>);

			case "link":
				return (<Link href={token.content} navigation={navigation} key={id}/>);

			case "username":
				return (<Username navigation={navigation} at={true} key={id}>{token.content}</Username>)
			}
		})}
	</View>
	);
}