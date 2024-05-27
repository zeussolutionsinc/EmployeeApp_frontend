import { useAuth0 } from "@auth0/auth0-react";
import MainHeader  from "../components/MainHeader";
import { Outlet } from "react-router-dom";
import LandingPage from '../components/LandingPage';

function RootLayout(){
    const {user} = useAuth0();
    return(
        <>
            <MainHeader />
            <Outlet /> 
            {!user && (<LandingPage />)}
        </>
    )
}

export default RootLayout;