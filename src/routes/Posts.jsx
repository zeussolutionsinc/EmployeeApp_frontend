import { Outlet } from 'react-router-dom';
import PostsList from '../components/vacation/PostsList';
import Sidebar from '../components/Sidebar';

function Posts() {

  return (
    <>
    <Outlet />
      <main>
        <Sidebar />
        <PostsList />
      </main>
    </>
  );
}

export default Posts;

export async function loader({params}){
  const response = await fetch(`/api/VacationAppItems`)
  const resData = await response.json()
  return(resData)
}
