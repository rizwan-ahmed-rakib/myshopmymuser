import React from 'react';
import {SetupProvider} from './SetupContext';
import {AboutProvider} from './AboutContext';
import {CartProvider} from "./CartContext";
import {CategoryProvider} from "./CategoryContext";
import {ProductsProvider} from "./ProductsContext";
// import {ContactWithMeProvider} from './ContactContext';
// import {ServiceProvider} from './ServiceContext';
// import {ImageGalleryProvider} from './GalleryContext';
// import {MessageProvider} from './MessageContext';
// import {QRcodeProvider} from "./QRcodeContext";
// import {VideoProvider} from "./VideoContext";

const RootProvider = ({children}) => {
    return (
        <AboutProvider>
            <SetupProvider>
                <CategoryProvider>
                    <ProductsProvider>
                        <CartProvider>
                            {/*<ContactWithMeProvider>*/}
                            {/*    <ServiceProvider>*/}
                            {/*<VideoProvider>*/}
                            {/*<ImageGalleryProvider>*/}
                            {/*<MessageProvider>*/}
                            {/*<QRcodeProvider>*/}
                            {children}
                            {/*</QRcodeProvider>*/}
                            {/*</MessageProvider>*/}
                            {/*</ImageGalleryProvider>*/}
                            {/*</VideoProvider>*/}
                            {/*</ServiceProvider>*/}
                            {/*</ContactWithMeProvider>*/}
                        </CartProvider>
                    </ProductsProvider>
                </CategoryProvider>
            </SetupProvider>
        </AboutProvider>

    )
        ;
};

export default RootProvider;
