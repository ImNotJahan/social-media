import { Image } from "react-native";
import { useState } from "react";

export default function RemoteImage({uri, desiredWidth, style}) {
    return (
        <Image
            source={{uri: uri.uri}}
            style={[{
                width: desiredWidth,
                height: desiredWidth / uri.width * uri.height,
                backgroundColor: uri.color
            }, style]}
        />
    )
}