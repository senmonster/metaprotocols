/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createProtocol } from '../api/protocol';
import ProtocolForm, { AttachmentItem, ProtocolFormData } from './ProtocolForm';
// import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
// import dayjs from 'dayjs';
import { protocolEntityAtom } from '../../store/protocol';
import { useAtomValue } from 'jotai';
import { isEmpty, isNil } from 'ramda';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { btcConnectorAtom, globalFeeRateAtom } from '../../store/user';
import { sleep } from '../../utils/time';
import { SubmitHandler, useForm } from 'react-hook-form';
import { image2Attach } from '../../utils/file';
import { ProtocolItem } from '../../types';
import { createBrfcid } from '../../utils/crypto';
// import { temp_protocol } from "../../utils/mockData";
import { fetchFeeRate } from '../../api/fee';
import { CreateOptions } from '@metaid/metaid';
const ProtocolFormWrap = () => {
  const globalFeerate = useAtomValue(globalFeeRateAtom);
  const protocolEntity = useAtomValue(protocolEntityAtom);
  const btcConnector = useAtomValue(btcConnectorAtom);

  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const protocolFormHandle = useForm<ProtocolFormData>();

  const onCreateSubmit: SubmitHandler<ProtocolFormData> = async (data) => {
    if (isEmpty(data.tags)) {
      protocolFormHandle.setError('tags', { type: 'Required' });
      return;
    }
    const protocolAttachments =
      data?.protocolAttachments?.length !== 0 &&
      !isNil(data?.protocolAttachments)
        ? await image2Attach(data.protocolAttachments)
        : [];

    await handleAddProtocol({
      ...data,
      protocolAttachments,
    });
  };

  const handleAddProtocol = async (
    protocol: Omit<ProtocolFormData, 'protocolAttachments'> & {
      protocolAttachments: AttachmentItem[];
    }
  ) => {
    setIsAdding(true);

    const protocolHASHID = createBrfcid({
      title: protocol.protocolTitle,
      author: protocol.protocolAuthor,
      version: protocol.protocolVersion,
    });
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalBody: ProtocolItem = {
        ...protocol,
        protocolHASHID,
        protocolAttachments: [],
      };

      if (!isEmpty(protocol.protocolAttachments)) {
        const fileOptions: CreateOptions[] = [];

        const fileEntity = await btcConnector!.use('file');

        for (const image of protocol.protocolAttachments) {
          // console.log("image.data", Buffer.from(image.data, "hex").toString("base64"));
          fileOptions.push({
            body: Buffer.from(image.data, 'hex').toString('base64'),
            contentType: `${image.fileType};binary`,
            encoding: 'base64',
            flag: 'metaid',
          });
        }
        const imageRes = await fileEntity.create({
          options: fileOptions,
          noBroadcast: 'no',
          feeRate: selectFeeRate?.number,
        });

        console.log('imageRes', imageRes);
        finalBody.protocolAttachments = imageRes.revealTxIds.map(
          (rid) => 'metafile://' + rid + 'i0'
        );
      }
      // await sleep(5000);

      console.log('finalBody', finalBody);
      console.log(
        'protocolEntity',
        protocolEntity,
        'wallet',
        btcConnector?.address
      );

      const createRes = await protocolEntity!.create({
        options: [
          {
            body: JSON.stringify(finalBody),
            contentType: 'text/plain;utf-8',
            flag: 'metaid',
          },
        ],
        noBroadcast: 'no',
        feeRate: selectFeeRate?.number,
      });
      console.log('create res for inscribe', createRes);
      if (!isNil(createRes?.revealTxIds[0])) {
        await sleep(5000);
        queryClient.invalidateQueries({ queryKey: ['metaprotocols'] });
        toast.success('create protocol successfully');
        protocolFormHandle.reset();

        const doc_modal = document.getElementById(
          'new_protocol_modal'
        ) as HTMLDialogElement;
        doc_modal.close();
      }
    } catch (error) {
      console.log('error', error);
      const errorMessage = (error as any)?.message ?? error;
      const toastMessage = errorMessage.includes(
        'Cannot read properties of undefined'
      )
        ? 'User Canceled'
        : errorMessage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(toastMessage, {
        className:
          '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
      });
      setIsAdding(false);
    }
    setIsAdding(false);
  };

  const { data: feeRateData } = useQuery({
    queryKey: ['feeRate'],
    queryFn: () => fetchFeeRate({ netWork: 'mainnet' }),
  });

  const [customFee, setCustomFee] = useState<string>(globalFeerate);

  const feeRateOptions = useMemo(() => {
    return [
      { name: 'Slow', number: feeRateData?.hourFee ?? Number(globalFeerate) },
      {
        name: 'Avg',
        number: feeRateData?.halfHourFee ?? Number(globalFeerate),
      },
      {
        name: 'Fast',
        number: feeRateData?.fastestFee ?? Number(globalFeerate),
      },
      { name: 'Custom', number: Number(customFee) },
    ];
  }, [feeRateData, customFee, globalFeerate]);
  const [selectFeeRate, setSelectFeeRate] = useState<{
    name: string;
    number: number;
  }>({
    name: 'Custom',
    number: Number(customFee),
  });

  return (
    <LoadingOverlay active={isAdding} spinner text='Submiting New Protocol...'>
      <ProtocolForm
        onCreateSubmit={onCreateSubmit}
        protocolFormHandle={protocolFormHandle}
        customFee={customFee}
        setSelectFeeRate={setSelectFeeRate}
        selectFeeRate={selectFeeRate}
        handleCustomFeeChange={setCustomFee}
        feeRateOptions={feeRateOptions}
      />
    </LoadingOverlay>
  );
};

export default ProtocolFormWrap;
