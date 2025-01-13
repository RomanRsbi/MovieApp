import { Component, Fragment, ReactNode } from 'react';
import './RatedTab.css';
import { Pagination, Alert, Spin } from 'antd';
import { debounce } from 'lodash';

import { MovieCardList } from '../MovieCardList/MovieCardList';
import getResource from '../NetworkRequestFile';

interface movListType {
  sessionId: string;
}

type formatErr = {
  message: string;
};

type formatRate = {
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  id: number;
  vote_average: number;
  rating: number;
  genre_ids: number[];
};

interface movListTypeRate {
  movieListRate: formatRate[];
  pageOne: number;
  totalResults: number;
  loading: boolean;
  error: boolean;
  errorMessage: string;
}

class RatedTab extends Component<movListType> {
  state: movListTypeRate = {
    movieListRate: [],
    pageOne: 1,
    totalResults: 1,
    loading: false,
    error: false,
    errorMessage: ''
  };

  onError = (err: formatErr) => {
    this.setState({
      error: true,
      loading: false,
      errorMessage: err.message
    });
  };

  getAnswer = () => {
    this.setState({
      loading: true
    });
    getResource(
      `https://api.themoviedb.org/3/guest_session/${this.props.sessionId}/rated/movies?language=en-US&page=${this.state.pageOne}&sort_by=created_at.asc`,
      'GET'
    )
      .then(res => {
        console.log(res);
        this.setState({
          movieListRate: res.results,
          pageOne: res.page,
          totalResults: res.total_results,
          loading: false
        });
        const result = res.results;
        return result;
      })
      .then(value => {
        if (value.length === 0) {
          throw new Error('No films');
        }
      })
      .catch(err => {
        this.onError(err);
        this.setState({ loading: false });
      });
  };

  componentDidMount(): void {
    this.getAnswer();
  }

  pageFuncFn = (page: number) => {
    this.setState({
      pageOne: page
    });
  };

  debounceFn = debounce(this.getAnswer, 1200);

  componentDidUpdate(prevProps: unknown, prevState: { pageOne: number }) {
    if (this.state.pageOne !== prevState.pageOne) {
      this.debounceFn();
    }
  }

  render(): ReactNode {
    const hasDate = !(this.state.error || this.state.loading || this.state.movieListRate.length === 0);
    const spinner = this.state.loading ? <Spin className="spin-position-rate" size="large" /> : null;
    const errorMess =
      (this.state.movieListRate.length === 0 || this.state.error) && !this.state.loading ? (
        <Alert message="Error" description="No movies found" type="warning" showIcon />
      ) : null;
    const rendList = hasDate ? (
      <Fragment>
        <MovieCardList
          movieList={this.state.movieListRate}
          loading={this.state.loading}
          error={this.state.error}
          errorMessage={this.state.errorMessage}
          sessionId={this.props.sessionId}
        />
        <Pagination
          align="center"
          hideOnSinglePage={true}
          showSizeChanger={false}
          defaultPageSize={20}
          current={this.state.pageOne}
          defaultCurrent={1}
          total={this.state.totalResults}
          onChange={this.pageFuncFn}
        />
      </Fragment>
    ) : null;
    return (
      <Fragment>
        {spinner}
        {rendList}
        {errorMess}
      </Fragment>
    );
  }
}

export { RatedTab };
