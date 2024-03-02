import Carousel, { Pagination } from "react-native-snap-carousel";
import { useState } from "react";

import RemoteImage from "./RemoteImage";

export default function Album({images, deviceWidth}){
	const [albumIndex, setAlbumIndex] = useState(0);

	if(images.length > 1){
		return (
		<>
			<Carousel data={images} sliderWidth={deviceWidth - 30} itemWidth={deviceWidth - 30} onSnapToItem={setAlbumIndex} renderItem=
			{({itemIndex, item}) => (<RemoteImage key={itemIndex} uri={item} desiredWidth={deviceWidth - 30} style={{borderRadius: 2}} />)} />
			<Pagination dotsLength={images.length} activeDotIndex={albumIndex} containerStyle={{marginVertical: -15}} />
		</>
		);
	} else if(images.length == 1){
		return (
		<RemoteImage key={images[0]} uri={images[0]} desiredWidth={deviceWidth - 30} style={{borderRadius: 2}} />
		);
	} else {
		return (<></>);
	}
}