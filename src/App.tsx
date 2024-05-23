import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Protocol from './pages/Protocol';
import Home from './pages/Home';
import EditProtocol from './pages/EditProtocol';
import { ToastContainer, toast } from 'react-toastify';
import './globals.css';
import './react-toastify.css';
import { MetaletWalletForBtc, btcConnect } from '@metaid/metaid';
import { BtcConnector } from '@metaid/metaid/dist/core/connector/btc';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  btcConnectorAtom,
  connectedAtom,
  networkAtom,
  userInfoAtom,
  walletAtom,
} from './store/user';
import { protocolEntityAtom } from './store/protocol';
import { errors } from './utils/errors';
import { isEmpty, isNil } from 'ramda';
import { checkMetaletInstalled, confirmMetaletMainnet } from './utils/wallet';
import CreateMetaIDModal from './components/MetaIDFormWrap/CreateMetaIDModal';
import EditMetaIDModal from './components/MetaIDFormWrap/EditMetaIDModal';
import { useEffect } from 'react';
import { BtcNetwork } from './api/request';
import InsertMetaletAlertModal from './components/InsertMetaletAlertModal';

function App() {
  const setConnected = useSetAtom(connectedAtom);
  const setWallet = useSetAtom(walletAtom);
  const [btcConnector, setBtcConnector] = useAtom(btcConnectorAtom);
  const setProtocolEntity = useSetAtom(protocolEntityAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const network = useAtomValue(networkAtom);

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
    await confirmMetaletMainnet();

    setWallet(_wallet);
    if (isNil(_wallet?.address)) {
      toast.error(errors.NO_METALET_LOGIN, {
        className:
          '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
      });
      throw new Error(errors.NO_METALET_LOGIN);
    }

    // add event listenr
    window.metaidwallet.on('accountsChanged', () => {
      onLogout();
      toast.error(
        'Wallet Account Changed ---- You have been automatically logged out of your current BitProtocol account. Please login again...',
        {
          className:
            '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
        }
      );
    });

    const _btcConnector: BtcConnector = await btcConnect({
      network,
      wallet: _wallet,
    });
    setBtcConnector(_btcConnector as BtcConnector);

    const resUser = await _btcConnector.getUser({ network });

    if (isNil(resUser?.name) || isEmpty(resUser?.name)) {
      const doc_modal = document.getElementById(
        'create_metaid_modal'
      ) as HTMLDialogElement;
      doc_modal.showModal();
    } else {
      setUserInfo(resUser);
      setConnected(true);
      setProtocolEntity(await _btcConnector.use('metaprotocols'));
      console.log('your btc address: ', _btcConnector.address);
    }
  };

  const getProtocolEntity = async () => {
    const _btcConnector: BtcConnector = await btcConnect({ network });
    setBtcConnector(_btcConnector);
    setProtocolEntity(await _btcConnector.use('metaprotocols'));
  };

  useEffect(() => {
    getProtocolEntity();
  }, []);

  useEffect(() => {
    if (!isNil(window?.metaidwallet)) {
      window.metaidwallet.on('networkChanged', async (network: BtcNetwork) => {
        toast.error('Wallet Network Changed!', {
          className:
            '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
        });
        if (network !== 'mainnet') {
          await window.metaidwallet.switchNetwork({ network: 'mainnet' });
        }
      });
    }
  }, [window?.metaidwallet]);

  // const handleTest = async () => {
  //   console.log('connected', connected);
  //   console.log('userinfo', userInfo);
  //   console.log('protocolEntity', protocolEntity);
  //   console.log('btcConnector', btcConnector);
  //   console.log('protocolentity res', await btcConnector!.use('metaprotocols'));
  // };

  return (
    <div className='relative overflow-auto text-[white] font-mono bg-[black]'>
      <Navbar onWalletConnectStart={onWalletConnectStart} onLogout={onLogout} />

      <div className='container pt-[100px] px-6 h-screen'>
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
        position='top-center'
        toastStyle={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '380px',
        }}
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        closeButton={false}
      />

      <CreateMetaIDModal
        btcConnector={btcConnector!}
        onWalletConnectStart={onWalletConnectStart}
      />
      <EditMetaIDModal btcConnector={btcConnector!} />
      <InsertMetaletAlertModal />
    </div>
  );
}

export default App;
