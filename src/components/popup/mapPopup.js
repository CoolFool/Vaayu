import React, {memo} from "react";
import {Popup} from "react-map-gl";
import {useRecoilState} from "recoil";
import {MapMarkers} from "../../utils/atoms";
import {
    Container, Heading, HStack, IconButton, Link,
    Popover,
    PopoverArrow, PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverFooter,
    PopoverHeader,
    PopoverTrigger, Portal, SimpleGrid,
    Stat,
    StatNumber, Text,
    Tooltip
} from "@chakra-ui/react";

import axios from "axios";
import {toast} from "../../layouts/app/app";
import {FaInfoCircle} from "@react-icons/all-files/fa/FaInfoCircle";
import {FaTimes} from "@react-icons/all-files/fa/FaTimes"
const AQI_ACCESS_TOKEN = process.env.REACT_APP_AQI_ACCESS_TOKEN

function MapPopup(props){
    const [mapMarkers,setMapMarkers] = useRecoilState(MapMarkers);
    const getAQI = ()=>{
        if (Object.keys(mapMarkers.markers[props.markerKey].aqiData).length === 0) {
            axios
                .get(`https://api.waqi.info/feed/geo:${props.latitude};${props.longitude}/?token=${AQI_ACCESS_TOKEN}`)
                .then(response => {
                    setMapMarkers((markers)=>{
                        markers = JSON.parse(JSON.stringify(markers));
                        markers.markers[props.markerKey].aqiData = response.data.data
                        return markers
                    })
                })
                .catch(err => {
                    console.log(err);
                    toast({
                        title: 'An error occurred.',
                        description: err.message,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                })
        }
        return mapMarkers.markers[props.markerKey]
    }
    const marker = getAQI()
    const markerProps = {}
    const aqiData = marker.aqiData
    const aqi = parseInt(aqiData.aqi)

    if (aqi <= 50){
        markerProps["background"] = '#38A169'
        markerProps["tooltipLabel"] = 'Good'
    }else if (aqi <= 100){
        markerProps["background"] = '#D69E2E'
        markerProps["tooltipLabel"] = 'Moderate'
    }else if (aqi <= 150){
        markerProps["background"] = '#DD6B20'
        markerProps["tooltipLabel"] = 'Unhealthy for Sensitive Groups'
    }else if (aqi <= 200){
        markerProps["background"] = '#E53E3E'
        markerProps["tooltipLabel"] = 'Unhealthy'
    }else if (aqi <= 300){
        markerProps["background"] = '#805AD5'
        markerProps["tooltipLabel"] =  'Very Unhealthy'
    }else if(aqi > 300){
        markerProps["background"] = '#822727'
        markerProps["tooltipLabel"] = 'Hazardous'
    }

    return (
           <Popup
               latitude={props.latitude}
               longitude={props.longitude}
               closeOnClick={mapMarkers.hidePopupOnClick}
               closeOnMove={mapMarkers.hidePopupOnClick}
               onClose={() =>{
                   setMapMarkers((markers)=>{
                       markers = JSON.parse(JSON.stringify(markers));
                       markers.markers[props.markerKey].showPopup = false
                       return markers
                   });
               }}
               closeButton={false}
               offset={0}
               focusAfterOpen={false}
           >
               <Container alignContent={"center"} padding={'6px'} background={`${markerProps.background}`} borderRadius={'8px'}>
                   {!isNaN(aqiData.aqi)?
                       <HStack>
                           <Tooltip label={`${markerProps.tooltipLabel}`} hasArrow>
                               <Stat>
                                   <StatNumber>{aqiData.aqi}</StatNumber>
                               </Stat>
                           </Tooltip>
                           <Popover
                                trigger={'hover'} isLazy
                                placement='top-start'
                                defaultIsOpen={false}
                           >
                               <PopoverTrigger>
                                   <IconButton icon={<FaInfoCircle />}
                                               size={"xs"}
                                               colorScheme={"blackAlpha"}
                                               aria-label={"more info"}
                                               isRound={true}
                                   />
                               </PopoverTrigger>
                               <Portal>
                                   <PopoverContent>
                                       <PopoverHeader fontWeight='semibold'>
                                            Station: {aqiData.city.name}
                                       </PopoverHeader>
                                       <PopoverArrow />
                                       <PopoverCloseButton />
                                       <PopoverBody>
                                           <SimpleGrid columns={3} spacing='2px'>
                                           {Object.entries(aqiData.iaqi).map(([key,value])=>{
                                               return(
                                                    <HStack spacing={"0.2rem"} key={key}>
                                                        <Heading as={"h6"} size={"xs"}>{key}:</Heading>
                                                        <Text>{parseFloat(value.v).toFixed(2)}</Text>
                                                    </HStack>
                                               )
                                           })}
                                           </SimpleGrid>
                                       </PopoverBody>
                                       <PopoverFooter>
                                              <Link href={aqiData.attributions[0].url} isExternal>{aqiData.attributions[0].name}</Link>
                                       </PopoverFooter>
                                   </PopoverContent>
                               </Portal>
                           </Popover>
                       </HStack>
                       :<Tooltip label={'Data not found'} hasArrow>
                           <span>
                               <FaTimes />
                           </span>
                        </Tooltip>
                   }
               </Container>
           </Popup>
   )
}

export default memo(MapPopup)