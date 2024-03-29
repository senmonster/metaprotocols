import TagItem from './TagItem';

// componente <TagList />

type Iprops = {
  tags: string[];
  onDeleteTag: (tag: string) => void;
};

function TagList({ tags, onDeleteTag }: Iprops) {
  const tagsUI = tags.map((tag) => {
    return (
      <TagItem onDeleteTag={() => onDeleteTag(tag)} key={tag} value={tag} />
    );
  });
  return <div className='flex gap-3'>{tagsUI}</div>;
}

export default TagList;
