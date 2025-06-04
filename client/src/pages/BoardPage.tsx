import { useParams } from 'react-router-dom';

const BoardPage = () => {
  const { id } = useParams();
  return <div>Доска проекта с id: {id}</div>;
};

export default BoardPage;
