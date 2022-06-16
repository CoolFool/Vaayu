import React,{memo} from "react";
import Marker from "react-map-gl/dist/esm/components/marker";
import {useRecoilState} from "recoil";
import {MapMarkers} from "../../utils/atoms";

function MapMarker(props){
    const [_,setMapMarkers] = useRecoilState(MapMarkers);

    return (
        <Marker longitude={props.longitude}
                latitude={props.latitude}
                onClick={(evt) => {
                   evt.originalEvent.stopPropagation();
                   setMapMarkers((markers)=>{
                       markers = JSON.parse(JSON.stringify(markers));
                       markers.markers[props.markerKey].showPopup = true
                       return markers
                   });
               }}
        />
    )
}
export default memo(MapMarker)