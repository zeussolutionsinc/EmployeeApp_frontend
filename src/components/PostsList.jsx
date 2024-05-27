
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
            const response = await fetch(`/api/VacationAppItems/authid/${user.sub.substring(6)}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const newData = await response.json();
          console.log(newData)
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
            {posts && (<ul className={styles.posts}>
                {posts.map((post)=>(
                    <Post key={post.id} id={post.id} body={post.body} name={post.name} 
                    vacationStartdate = {post.vacationStartdate} vacationEnddate = {post.vacationEnddate}  
                    approvedStatus = {post.approvedStatus?<p className={styles.approvedStatus}>Approved</p>:<p>Not Approved</p>}
                    isManager = {post.isManager} imageUrl = {post.imageUrl} />)
                )}
                
            </ul>)}
            {/* {posts.length === 0 && (
                <div style={{ textAlign: 'center', color: '#72519d' }} >
                    <h1>Nothing is here, please add</h1>
                    </div>
            )} */}
        </>
    );
}
export default PostsList;