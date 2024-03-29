/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import TagList from './TagList';

type IProps = {
  defaultTags: string[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
  placeHolder: string;
};

function TagInput({ defaultTags, onAddTag, onDeleteTag, placeHolder }: IProps) {
  const [tempV, setTempV] = useState('');
  const onAddTagItem = () => {
    onAddTag(tempV);
    setTempV('');
  };

  const _onDeleteTag = (tag: string) => {
    onDeleteTag(tag);
  };

  return (
    <div className='border rounded-xl p-4'>
      <TagList tags={defaultTags} onDeleteTag={_onDeleteTag} />
      <div className='flex gap-2 mt-2'>
        <input
          className='input input-bordered input-sm'
          onChange={(e) => setTempV(e.currentTarget.value)}
          type='text'
          value={tempV}
          placeholder={placeHolder}
        />
        <div className='btn btn-sm text-white' onClick={() => onAddTagItem()}>
          add
        </div>
      </div>
    </div>
  );
}

export default TagInput;
