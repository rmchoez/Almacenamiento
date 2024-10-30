import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../actions';

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector(state => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
};

export default PostList;