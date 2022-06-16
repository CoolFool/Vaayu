import React, {useEffect} from 'react';
import Map, {NavigationControl, GeolocateControl, FullscreenControl} from 'react-map-gl'
import axios from 'axios';
import {useRecoilState, useRecoilValue} from "recoil";
import {InitialRun, MapLoaded, MapMarkers, Theme, ViewState} from '../../utils/atoms';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapMarker from "../../components/marker/mapMarker";
import {Box} from "@chakra-ui/react";
import MapPopup from "../../components/popup/mapPopup";
import GeocoderControl from "../../components/geocoder/geocoder";
import {toast} from "../app/app";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

export default function MainMap() {
    const [viewState,setViewState] = useRecoilState(ViewState)
    const [initialRun,setInitialRun] = useRecoilState(InitialRun)
    const [mapMarkers,setMapMarkers] = useRecoilState(MapMarkers);
    const [mapLoaded,setMapLoaded] = useRecoilState(MapLoaded)
    const globalTheme = useRecoilValue(Theme)

    useEffect(()=>{
        if (initialRun){
            axios
                .get('https://api.bigdatacloud.net/data/reverse-geocode-client')
                .then((response)=>{
                    const {latitude,longitude} = response.data
                    setViewState({
                        ...viewState,
                        latitude:latitude ,
                        longitude: longitude
                    })
                    setInitialRun(false)
                    addMarker(longitude,latitude,true)

                })
                .catch((err)=>{
                    console.log(err)
                    toast({
                        title: 'An error occurred.',
                        description: err.message,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    })
                })
        }
    },[initialRun])

    useEffect(()=>{
        if (!mapLoaded){
            setMapLoaded(true)
            toast({
                title: 'Map Loaded Successfully',
                description: 'Click anywhere on the map for Air quality index stats',
                status: 'success',
                duration: 8000,
                isClosable: true,
            })
        }
    },[mapLoaded])



    const addMarker = (lng,lat,removeZero=false)=>{
        let index = Object.keys(mapMarkers.markers).length
        if (removeZero){
            index = 0
        }
        setMapMarkers((markers)=>{
            markers = JSON.parse(JSON.stringify(markers));
            markers.markers[index] = {
                key:index,
                longitude: lng,
                latitude: lat,
                showPopup:true,
                aqiData:{}
            }
            markers.totalMapMarkers = markers.totalMapMarkers+=1
            return markers
        });

    }

    return (
        <Box>
            <Map
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                {...viewState}
                style={{width:"100vw", height: "100vh",zIndex:0,position: "absolute"}}
                mapStyle={globalTheme.mapStyle}
                onMove={event => {setViewState(event.viewState)}}
                onClick={event => {
                    addMarker(event.lngLat.lng,event.lngLat.lat,false)
                }}
            >
                {mapLoaded && Object.entries(mapMarkers.markers).map(([key,value])=>{
                    return (
                        <Box key={key}>
                            <MapMarker longitude={value.longitude}
                                       latitude={value.latitude}
                                       markerKey={key}
                            />
                            {mapMarkers.markers[key].showPopup && mapMarkers.showDefaultPopup &&
                                <MapPopup
                                    latitude={value.latitude}
                                    longitude={value.longitude}
                                    markerKey={key}
                                />
                            }
                        </Box>
                    )
                })}
                <GeocoderControl
                    mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                    position="top-left"
                    addMarker={addMarker}
                    viewState={setViewState}/>
                <GeolocateControl
                    showAccuracyCircle={false}
                    showUserLocation={false}
                    onGeolocate={event => {addMarker(event.coords.longitude,event.coords.latitude,false)}}
                    position={"bottom-right"}
                />
                <FullscreenControl
                    position={"bottom-right"}
                />
                <NavigationControl />
            </Map>
        </Box>
    );
}
