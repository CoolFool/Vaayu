import React, {memo} from "react";
import {IconButton} from "@chakra-ui/react";
import { Tooltip } from '@chakra-ui/react'

function UtilityButton(props) {
    return (
        <Tooltip label={props['tooltip-label']} hasArrow>
            <IconButton
                aria-label='Default Vaayu Button'
                colorScheme={"gray"}
                variant='solid'
                size='md'
                {...props}
            />
        </Tooltip>
    )
}

export default memo(UtilityButton)