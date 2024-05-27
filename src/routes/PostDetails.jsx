import { useLoaderData, Link } from 'react-router-dom';

import Modal from '../components/Modal';

import styles from './PostDetails.module.css'
import stylesPost from '../components/Post.module.css';

function PostDetails(){
    const weeks = ['Mon','Tue', 'Wed', 'Thur', 'Fri', 'Sat','Sun']
    const post = useLoaderData();
    if (!post) {
        return (
          <Modal>
            <main className={styles.details}>
              <h1>Could not find post</h1>
              <p>Unfortunately, the requested post could not be found.</p>
              <p>
                <Link to=".." className={styles.btn}>
                  Okay
                </Link>
              </p>
            </main>
          </Modal>
        );
      }
        return(
            <Modal>
                <main className={styles.details}>
                <h2 className={stylesPost.author}> {post.name}</h2>
            <h6 className={stylesPost.astatus}> {post.approvedStatus}</h6>
            <div className={stylesPost.dateandweek}>
                <p className={stylesPost.vdata}> {post.vacationStartdate}</p>
                <p className={stylesPost.vdata}> {weeks[new Date(post.vacationStartdate).getDay()]}</p>
            </div>
            <div className={stylesPost.dateandweek}>
                <p className={stylesPost.vdata}> {post.vacationEnddate}</p>
                <p className={stylesPost.vdata}> {weeks[new Date(post.vacationEnddate).getDay()]}</p>
            </div>
            <p className={stylesPost.text}>  {post.body}</p>
                </main>
            </Modal>
        )
}

export default PostDetails;

export async function loader({params}) {
   const response = await fetch('/api/VacationAppItems/'+ Number(params.postId));
   const resData = await response.json();
   return resData
}