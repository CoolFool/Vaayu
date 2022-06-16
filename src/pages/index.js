//import * as React from 'react'
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "../layouts/app/app";
import {RecoilRoot} from "recoil";
import {ChakraProvider} from "@chakra-ui/react";
const container = document.getElementById('root');
const root = createRoot(container);
import '../assets/index.css'


root.render(
    <React.StrictMode>
        <RecoilRoot>
            <ChakraProvider >
                <App />
            </ChakraProvider>
        </RecoilRoot>
    </React.StrictMode>
);