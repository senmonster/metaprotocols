import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import BackButton from '../components/Buttons/BackButton';
import { getPinDetailByPid } from '../api/pin';
import { ProtocolItem } from '../types';
import JsonFormatter from 'react-json-formatter';

import './styles.css';
const Protocol = () => {
  const { id: pinId } = useParams();
  const { data: protocolDetailData } = useQuery({
    queryKey: ['protocol', pinId],
    queryFn: () => getPinDetailByPid({ pid: pinId! }),
  });

  const summary = protocolDetailData?.contentSummary;
  const isSummaryJson = summary?.startsWith('{') && summary?.endsWith('}');
  const parseSummary: ProtocolItem = isSummaryJson
    ? JSON.parse(summary ?? `{}`)
    : {};

  const jsonStyle = {
    propertyStyle: { color: 'red', fontSize: '13px' },
    stringStyle: { color: 'green', fontSize: '13px' },
    numberStyle: { color: 'darkorange', fontSize: '13px' },
  };

  console.log('detail', protocolDetailData);
  console.log('summary', parseSummary);
  return (
    <div>
      <BackButton />

      <div className='bg-card  border border-slate-50/10 rounded-lg w-full h-full p-10 flex flex-col gap-4'>
        <div className='text-[24px]'>{parseSummary?.protocolTitle} </div>
        <div className='flex gap-2 text-gray-500'>
          <div>version: {parseSummary?.protocolVersion} </div>
          <div>name: {parseSummary?.protocolName} </div>
          <div>Encoding:{parseSummary?.protocolEncoding} </div>
          <div>BrfcId: {parseSummary?.protocolHASHID}</div>
        </div>
        <div className='flex gap-2 items-center'>
          {(parseSummary?.tags ?? []).map((d: string) => {
            return (
              <div className='hover:bg-slate-600 text-xs font-thin text-slate-50/30 border border-slate-50/10 rounded-full px-2 pt-0.5 pb-1  text-center'>
                {d}
              </div>
            );
          })}
        </div>
        <div>Protocol Content</div>
        <div className='shadow-inner  shadow-gray-600	p-8 rounded-lg'>
          <JsonFormatter
            json={parseSummary?.protocolContent}
            tabWith={4}
            jsonStyle={jsonStyle}
          />
        </div>
        <div>Protocol Description</div>
        <div className='shadow-inner  shadow-gray-600	p-8 rounded-lg'>
          <div>{parseSummary?.protocolDescription}</div>
        </div>
      </div>
    </div>
  );
};

export default Protocol;
