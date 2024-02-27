import { Image } from "react-native";
import { useState } from "react";

export default function RemoteImage({uri, desiredWidth, style}) {
    const [desiredHeight, setDesiredHeight] = useState(0)

    Image.getSize(uri, (width, height) => {
        setDesiredHeight(desiredWidth / width * height)
    })

    return (
        <Image
            source={{uri}}
            style={[{
                width: desiredWidth,
                height: desiredHeight
            }, style]}
        />
    )
}