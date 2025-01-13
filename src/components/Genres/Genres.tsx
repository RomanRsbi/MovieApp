import './Genres.css';
import { Typography } from 'antd';

type genType = {
  id: number;
  name: string;
};

interface listGenType {
  genresList: genType[];
  genreIds: number[];
}

const Genres = (props: listGenType) => {
  const genresRes = props.genreIds.map((item, index) => {
    const genresName = props.genresList.find(el => el.id === item)?.name;
    return (
      <Typography.Text keyboard className="text-size" key={index}>
        {genresName}
      </Typography.Text>
    );
  });
  return <div className="genre-flex">{props.genreIds.length !== 0 ? genresRes : 'No genres'}</div>;
};

export default Genres;
