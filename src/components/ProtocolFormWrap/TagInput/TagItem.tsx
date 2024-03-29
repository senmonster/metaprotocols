import { CircleX } from 'lucide-react';
import React from 'react';

type IProps = {
  onDeleteTag: (tag: string) => void;
  value: string;
};

function TagItem({ onDeleteTag, value }: IProps) {
  const tag = (
    <div className=' rounded-md relative text-white inline-block '>
      <CircleX
        onClick={() => onDeleteTag(value)}
        className='absolute right-[-8px] top-[-2px] cursor-pointer'
        size={18}
      />
      <div className='badge badge-neutral'> {value}</div>
    </div>
  );
  return <React.Fragment>{tag}</React.Fragment>;
}

export default TagItem;
