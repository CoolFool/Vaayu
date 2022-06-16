import React, {memo} from "react";
import UtilityButton from "../../components/button/Buttons";
import {
    Box,
    Button, Divider, Heading, HStack,  Link,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,  Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {useRecoilState} from "recoil";
import {MapMarkers} from "../../utils/atoms";
import {MdLayersClear} from "@react-icons/all-files/md/MdLayersClear";
import {MdLayers} from "@react-icons/all-files/md/MdLayers"
import {MdDelete} from "@react-icons/all-files/md/MdDelete"
import {HiLockClosed} from "@react-icons/all-files/hi/HiLockClosed";
import {HiLockOpen} from "@react-icons/all-files/hi/HiLockOpen"
import {BsInfoSquareFill} from "@react-icons/all-files/bs/BsInfoSquareFill";
import {FaGithub} from "@react-icons/all-files/fa/FaGithub";

function UtilityPanel(){
    const [mapMarkers,setMapMarkers] = useRecoilState(MapMarkers)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const togglePopup=()=>{
        setMapMarkers({
        ...mapMarkers,
        showDefaultPopup: !mapMarkers.showDefaultPopup,
    })}
    const lockPopup = ()=>{
        setMapMarkers({
        ...mapMarkers,
        hidePopupOnClick: !mapMarkers.hidePopupOnClick,
    })}
    const clearMarkers = ()=>{
        setMapMarkers({
        ...mapMarkers,
        totalMapMarkers: 0,
        markers:{},
    })}

    return(
        <Box>
            <VStack
                zIndex={1}
                position={"fixed"}
                bottom={0}
                left={0}
                margin={"2rem"}
                spacing={3}
            >
                <UtilityButton
                    key={'lock-popup-on-click-and-move'}
                    aria-label='Lock Popup'
                    icon={mapMarkers.hidePopupOnClick ? <HiLockOpen /> : <HiLockClosed/> }
                    onClick={lockPopup}
                    colorScheme={mapMarkers.hidePopupOnClick ? "green" : "red"}
                    tooltip-label={"Lock Popup while moving and clicking on map"}
                />
                <UtilityButton
                    icon={mapMarkers.showDefaultPopup ? <MdLayers /> : <MdLayersClear /> }
                    onClick={togglePopup}
                    key={'toggle-popups'}
                    aria-label='Toggle Popup'
                    tooltip-label={"Toggle Popups while preserving existing states"}
                    colorScheme={mapMarkers.showDefaultPopup ? "green" : "red"}
                />
                <UtilityButton
                    icon={<MdDelete />}
                    onClick={clearMarkers}
                    key={'clear-markers'}
                    aria-label='Clear Markers'
                    tooltip-label={"Delete all markers"}
                    colorScheme={"red"}
                />
                <UtilityButton
                    icon={<BsInfoSquareFill />}
                    onClick={onOpen}
                    key={'about'}
                    aria-label='about'
                    tooltip-label={"About and Usage"}
                    colorScheme={"telegram"}
                />
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose} isCentered={true} preserveScrollBarGap={true}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>About & Usage</ModalHeader>
                    <ModalCloseButton />
                    <Divider />
                    <ModalBody>
                        <HStack>
                            <Heading as={'h3'} size={"md"}>Vaayu</Heading>
                            <Heading as={'h5'} size={"sm"}>- Visualize air quality index interactively</Heading>
                        </HStack>
                        <HStack  paddingTop={'1rem'}>
                            <Heading as={'h6'} size={"sm"}>Usage:</Heading>
                            <Text as={'h6'} size={"xs"} > Click anywhere on the map</Text>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack>
                            <Text>Created by
                                <Link href={'https://github.com/coolfool'} isExternal={true} color={"gray.500"} paddingLeft={'0.2rem'}>
                                    CoolFool
                                </Link>
                            </Text>
                            <Link href={'https://github.com/coolfool/vaayu'} isExternal={true} paddingRight={'1rem'}>
                                <Button rightIcon={<FaGithub/>} aria-label={'github-logo'} >
                                    Source
                                </Button>
                            </Link>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default memo(UtilityPanel)