import React from 'react';
import MainMap from "../map/MainMap";
import {Box} from "@chakra-ui/react";
import UtilityPanel from "../utilityPanel/utilityPanel";
import {createStandaloneToast} from "@chakra-ui/toast";
export const { ToastContainer, toast } = createStandaloneToast()

function App(){
    return(
        <Box>
            <UtilityPanel/>
            <ToastContainer />
            <MainMap />
        </Box>
    )}


export default App