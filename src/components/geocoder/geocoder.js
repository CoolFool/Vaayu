import React from "react"
//import useControl from "react-map-gl/dist/esm/components/use-control"
import {useControl} from "react-map-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
import {toast} from "../../layouts/app/app";

export default function GeocoderControl(props) {
    useControl(
        ()=>{
            const ctrl = new MapboxGeocoder({
                ...props,
                marker: false,
                accessToken: props.mapboxAccessToken
            })
            ctrl.on("loading", props.onLoading)
            ctrl.on("results", props.onResults)
            ctrl.on("result", evt => {
                    props.onResult(evt)
                const {result} = evt
                const location = result && (result.center || (result.geometry?.type === "Point" && result.geometry.coordinates))
                if (location && props.marker){
                    props.addMarker(location[0],location[1],false)
                    props.viewState({
                        latitude : location[1],
                        longitude: location[0],
                        zoom: 5.5
                    })
                }else {
                    toast({
                        title: 'An error occurred.',
                        description: "Couldn't add marker to specified location",
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    })
                }
            })
            ctrl.on("error", props.onError)
            return ctrl
        }
        ,{
            position: props.position
        }
    )
}

const noop = () => {}

GeocoderControl.defaultProps = {
    marker: true,
    onLoading: noop,
    onResults: noop,
    onResult: noop,
    onError: noop
}
