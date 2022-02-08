import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from './modules/saga/actions';
import { store } from './modules/redux';

const App = () => {
  // const selector = useSelector();
  const dispatch = useDispatch();

  // const getPost = () => {
  //   debugger
  //   // debugger
  //   // dispatch(getPosts());
  //   store.dispatch({"PUT"});
  // }

  // const getPostResolve = () => {
  //   debugger

  //   store.dispatch({"PUT_RESOLVE"});
  // }


  const action = e => {
    store.dispatch({type:e });
  }
  return (
    <div>
      <button onClick={()=>action("PUT")}>Put</button>
      <button onClick={()=>action("PUT_RESOLVE")}>PutResolve</button>
      <button onClick={()=>action("PUT_RESOLVE")}>All</button>
      <button onClick={()=>action("PUT_RESOLVE")}>Race</button>
    </div>
  )
}

export default App;