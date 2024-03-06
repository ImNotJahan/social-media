import { Image } from "expo-image";
import { useState } from "react";

export default function RemoteImage({uri, desiredWidth, style}) {
    return (
        <Image
            source={uri.uri}
            style={[{
                width: desiredWidth,
                height: desiredWidth,// / uri.width * uri.height, damn carousel
                backgroundColor: uri.color
            }, style]}
        />
    )
}