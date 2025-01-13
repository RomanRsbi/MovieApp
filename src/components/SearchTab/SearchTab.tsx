import { Component, ReactNode, Fragment } from 'react';
import { Pagination } from 'antd';

import { SearchInput } from '../SearchInput/SearchInput';
import { MovieCardList } from '../MovieCardList/MovieCardList';

interface searchFormat {
  searchFn: (text: string) => void;
  pageFunc: (page: number) => void;
}

interface formatC {
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  id: number;
  vote_average: number;
  genre_ids: number[];
}

interface movListType extends searchFormat {
  movieList: formatC[];
  loading: boolean;
  error: boolean;
  errorMessage: string;
  pageOne: number;
  totalResults: number;
  sessionId: string;
}

class SearchTab extends Component<movListType> {
  render(): ReactNode {
    return (
      <Fragment>
        <SearchInput searchFn={this.props.searchFn} />
        <MovieCardList
          movieList={this.props.movieList}
          loading={this.props.loading}
          error={this.props.error}
          errorMessage={this.props.errorMessage}
          sessionId={this.props.sessionId}
        />
        {this.props.loading ? null : (
          <Pagination
            align="center"
            showSizeChanger={false}
            hideOnSinglePage={true}
            defaultPageSize={20}
            current={this.props.pageOne}
            defaultCurrent={1}
            total={this.props.totalResults}
            onChange={page => {
              this.props.pageFunc(page);
            }}
          />
        )}
      </Fragment>
    );
  }
}

export { SearchTab };
