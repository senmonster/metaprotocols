import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Protocol from './pages/Protocol';
import Home from './pages/Home';
import EditProtocol from './pages/EditProtocol';
import { ToastContainer, toast } from 'react-toastify';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { MetaletWalletForBtc, btcConnect } from '@metaid/metaid';
import { BtcConnector } from '@metaid/metaid/dist/core/connector/btc';

import { useAtom, useSetAtom } from 'jotai';
import {
  btcConnectorAtom,
  connectedAtom,
  userInfoAtom,
  walletAtom,
} from './store/user';
import { protocolEntityAtom } from './store/protocol';
import { errors } from './utils/errors';
import { isNil } from 'ramda';
import { checkMetaletInstalled, conirmMetaletTestnet } from './utils/wallet';
import CreateMetaIDModal from './components/MetaIDFormWrap/CreateMetaIDModal';
import EditMetaIDModal from './components/MetaIDFormWrap/EditMetaIDModal';
import { useEffect } from 'react';

function App() {
  const setConnected = useSetAtom(connectedAtom);
  const setWallet = useSetAtom(walletAtom);
  const [btcConnector, setBtcConnector] = useAtom(btcConnectorAtom);
  const setProtocolEntity = useSetAtom(protocolEntityAtom);
  const setUserInfo = useSetAtom(userInfoAtom);

  const onLogout = () => {
    setConnected(false);
    setBtcConnector(null);
    setProtocolEntity(null);
    setUserInfo(null);
    window.metaidwallet.removeListener('accountsChanged');
    window.metaidwallet.removeListener('networkChanged');
  };

  const onWalletConnectStart = async () => {
    await checkMetaletInstalled();
    const _wallet = await MetaletWalletForBtc.create();
    setWallet(_wallet);
    await conirmMetaletTestnet();
    if (isNil(_wallet?.address)) {
      toast.warn(errors.NO_METALET_LOGIN);
      throw new Error(errors.NO_METALET_LOGIN);
    }

    // add event listenr
    window.metaidwallet.on('accountsChanged', () => {
      onLogout();
      toast.warn(
        'Wallet Account Changed ---- You have been automatically logged out of your current BitProtocol account. Please login again...'
      );
    });
    window.metaidwallet.on('networkChanged', (network: string) => {
      console.log('network', network);
      if (network !== 'testnet') {
        onLogout();
        toast.warn(
          'Wallet Network Changed ---- You have been automatically logged out of your current BitProtocol account. Please Switch to Testnet login again...'
        );
      }
    });
    window.addEventListener('beforeunload', (e) => {
      const confirmMessage = 'oos';
      e.returnValue = confirmMessage;
      return confirmMessage;
    });
    //////////////////////////
    const _btcConnector: BtcConnector = await btcConnect(_wallet);

    setBtcConnector(_btcConnector as BtcConnector);

    // const doc_modal = document.getElementById(
    //   'create_metaid_modal'
    // ) as HTMLDialogElement;
    // doc_modal.showModal();
    // console.log("getUser", await _btcConnector.getUser());
    if (!_btcConnector.hasMetaid()) {
      const doc_modal = document.getElementById(
        'create_metaid_modal'
      ) as HTMLDialogElement;
      doc_modal.showModal();
    } else {
      const resUser = await _btcConnector.getUser();
      // console.log("user now", resUser);
      setUserInfo(resUser);
      setConnected(true);
      console.log(
        await _btcConnector.use('metaprotocols'),
        'metaprotocols entity'
      );
      setProtocolEntity(await _btcConnector.use('metaprotocols'));
      console.log('your btc address: ', _btcConnector.address);
    }
  };

  const getProtocolEntity = async () => {
    const _btcConnector: BtcConnector = await btcConnect();
    setBtcConnector(_btcConnector);
    setProtocolEntity(await _btcConnector.use('metaprotocols'));
  };

  useEffect(() => {
    getProtocolEntity();
  }, []);

  // const handleTest = async () => {
  //   console.log('connected', connected);
  //   console.log('userinfo', userInfo);
  //   console.log('protocolEntity', protocolEntity);
  //   console.log('btcConnector', btcConnector);
  //   console.log('protocolentity res', await btcConnector!.use('metaprotocols'));
  // };

  return (
    <div className='relative'>
      <Navbar onWalletConnectStart={onWalletConnectStart} onLogout={onLogout} />

      <div className='container pt-[100px] bg-[rgb(20, 20, 20)] text-white h-screen overflow-auto'>
        {/* <button
          className='btn btn-active btn-accent text-[blue] absolute top-18 left-2'
          onClick={handleTest}
        >
          Test Button
        </button> */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/protocol/:id' element={<Protocol />} />
          <Route path='/protocol/:id/edit' element={<EditProtocol />} />
        </Routes>
      </div>
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />

      <CreateMetaIDModal
        btcConnector={btcConnector!}
        onWalletConnectStart={onWalletConnectStart}
      />
      <EditMetaIDModal btcConnector={btcConnector!} />
    </div>
  );
}

export default App;
