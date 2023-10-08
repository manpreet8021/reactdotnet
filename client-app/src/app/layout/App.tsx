import { Container } from 'semantic-ui-react';
import Navbar from './Navbar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoaderComponent from './LoaderComponent';
import ModalContainer from '../common/modal/ModalContainer';

function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(()=>{
    if(commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded())
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  return (
    <>
      {!commonStore.appLoaded ? <LoaderComponent content='Loading Application'/> : (
        <>
          <ModalContainer />
          <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
          {
            location.pathname === '/' ? <HomePage /> : 
            <>
              <Navbar />
              <Container style={{ marginTop: '7em' }}>
                <Outlet />
              </Container>
            </>
          }
        </>
      )}
    </>
  );
}

export default observer(App);
