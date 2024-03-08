import Carousel, { Pagination } from "react-native-snap-carousel";
import { useState } from "react";

import RemoteImage from "./RemoteImage";

export default function Album({images, deviceWidth, albumIndex, setAlbumIndex}){
	if(albumIndex == undefined) [albumIndex, setAlbumIndex] = useState(0);

	if(images.length > 1){
		return (
		<>
			<Carousel data={images} customContainerStyle= {{height: "min-content"}} sliderWidth={deviceWidth - 30} itemWidth={deviceWidth - 30} 
			onSnapToItem={setAlbumIndex} renderItem=
			{({itemIndex, item}) => (<RemoteImage key={itemIndex} uri={item} desiredWidth={deviceWidth - 30} style={{borderRadius: 2}} />)} />
			<Pagination dotsLength={images.length} activeDotIndex={albumIndex} containerStyle={{paddingVertical: 0, paddingTop: 10}} />
		</>
		);
	} else if(images.length == 1){
		return (
		<RemoteImage key={images[0]} uri={images[0]} desiredWidth={deviceWidth - 30} style={{borderRadius: 2, marginBottom: 17}} />
		);
	} else {
		return (<></>);
	}
}