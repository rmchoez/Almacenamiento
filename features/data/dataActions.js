import axios from 'axios';
import { fetchDataStart, fetchDataSuccess, fetchDataFailure } from './dataSlice';

export const fetchData = () => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    dispatch(fetchDataSuccess(response.data));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};
