import './MovieCardList.css';
import { Spin, Alert } from 'antd';

import { MovieCard } from '../MovieCard/MovieCard';

type formatC = {
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  id?: number;
};

interface movListType {
  movieList: formatC[];
  loading: boolean;
  error: boolean;
  errorMessage: string;
}

const MovieCardList = (props: movListType) => {
  const oneCard = props.movieList.map((el: formatC) => {
    return <MovieCard {...el} key={el.id} loading={props.loading} />;
  });

  const hasDate = !(props.error || props.loading);
  const errorMess = props.error ? (
    <Alert message="Error" description={props.errorMessage} type="error" showIcon />
  ) : null;
  const spinner = props.loading ? <Spin className="spin-position" size="large" /> : null;
  const list = hasDate ? oneCard : null;

  return (
    <div className="item-container">
      {spinner}
      {list}
      {errorMess}
    </div>
  );
};

export { MovieCardList };
