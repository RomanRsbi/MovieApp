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
  id?: number;
}

interface movListType extends searchFormat {
  movieList: formatC[];
  loading: boolean;
  error: boolean;
  errorMessage: string;
  pageOne: number;
  totalPages: number;
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
        />
        <Pagination
          align="center"
          className={this.props.loading || this.props.movieList.length === 0 ? 'pagination-fix' : undefined}
          defaultCurrent={this.props.pageOne}
          total={this.props.totalPages}
          onChange={page => {
            this.props.pageFunc(page);
          }}
        />
      </Fragment>
    );
  }
}

export { SearchTab };
