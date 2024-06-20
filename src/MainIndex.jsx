import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements,  } from 'react-router-dom';
import './index.css';
import "./App.css";
import Posts, { loader as postsLoader } from './routes/Posts';
import NewPost, { action as newPostAction } from './routes/NewPost';
import PostDetails, { loader as postDetailsLoader } from './routes/PostDetails';
// import {action as approveAction} from './routes/ManagerApprove';
// import RootLayout from './routes/RootLayout';
// import MainHeader from './components/MainHeader';
import { CallbackPage } from './pages/callback-page';
import { Auth0ProviderWithNavigate } from './auth0-provider-with-navigate';
// import { Profile } from './routes/Profile';
import { AuthenticationGuard } from './components/authentication-guard';
import RootLayout from './routes/RootLayout';
import Timesheet from './pages/Timesheet';
import H1b from './pages/H1b';
import DashboardV3 from "./components/DashboardV3";



const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Auth0ProviderWithNavigate />} >
        <Route path='/' element={<RootLayout />}>
          <Route path='/posts' element={<AuthenticationGuard component={Posts} />}loader={postsLoader} >
            <Route path= 'create-post' element= {<AuthenticationGuard component={NewPost} />} action= {newPostAction}></Route>
            <Route path= ':postId' element= {<PostDetails />} loader= {postDetailsLoader}></Route>
          </Route>
          <Route path='/callback' element={<CallbackPage />}></Route>
          <Route path='/timesheet' element={<DashboardV3 />}></Route>
          <Route path='/h1bform' element={<H1b />}></Route>
        </Route>
        
      </Route>
    )
);

function Main(){

    return(
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      );
}

export default Main;
