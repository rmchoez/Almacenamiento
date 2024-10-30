export const fetchPostsRequest = () => ({
    type: 'FETCH_POSTS_REQUEST'
  });
  
  export const fetchPostsSuccess = (posts) => ({
    type: 'FETCH_POSTS_SUCCESS',
    payload: posts
  });
  
  export const fetchPostsFailure = (error) => ({
    type: 'FETCH_POSTS_FAILURE',
    payload: error
  });
  
  export const fetchPosts = () => {
    return (dispatch) => {
      dispatch(fetchPostsRequest());
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(posts => {
          dispatch(fetchPostsSuccess(posts));
        })
        .catch(error => {
          dispatch(fetchPostsFailure(error));
        });
    };
  };