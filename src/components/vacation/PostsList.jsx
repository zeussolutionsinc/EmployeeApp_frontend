
import {useAuth0} from '@auth0/auth0-react'

import Post from "./Post";

import styles from "./PostsList.module.css";
import { useEffect, useState } from 'react';


function PostsList(){
    const {user} = useAuth0();
    const [posts, setPosts] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
          try{
            const response = await fetch(`https://zeusemployeeportalbackend.azurewebsites.net/api/VacationAppItems/authid/${user.sub.substring(6)}`);
          if (!response.ok) { 
            throw new Error('Network response was not ok');
          }
          const newData = await response.json();
          console.log("Data:",newData)
          setPosts(newData);
          }catch (err) {
            console.log(err.message);
          }
        };
        fetchData();
      }, [user,posts]);
      return (
        <>
          {!posts && (
            <h2>Welcome... Create Leave application to get approved!!!</h2>
          )}
          {posts && (
            <ul className={styles.posts}>
              {posts.map((post) => (
                <Post 
                  key={post.Id} 
                  id={post.Id} 
                  body={post.Body} 
                  name={post.Name} 
                  vacationStartdate={post.VacationStartdate} 
                  vacationEnddate={post.VacationEnddate}  
                  approvalStatus={post.ApprovalStatus} // Use the correct property name
                  isManager={post.isManager} 
                  imageUrl={post.ImageUrl} 
                />
              ))}
            </ul>
          )}
        </>
      );
      
      
}
export default PostsList;