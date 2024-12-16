import { Component, Fragment } from 'react';
import './App.css';
import { Alert, Tabs } from 'antd';
import { debounce } from 'lodash';

import getResource from './components/NetworkRequestFile';
import { NetworkContext } from './components/NetworkProvider';
import { SearchTab } from './components/SearchTab/SearchTab';
import { RatedTab } from './components/RatedTab/RatedTab';

type formatObj = {
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  id?: number;
};

interface movListT {
  movieList: formatObj[];
  loading: boolean;
  error: boolean;
  errorMessage: string;
  label: string;
  pageOne: number;
  totalPages: number;
}

type formatErr = {
  message: string;
};

class App extends Component {
  state: movListT = {
    movieList: [],
    loading: false,
    error: false,
    errorMessage: '',
    label: '',
    pageOne: 1,
    totalPages: 1
  };

  onError = (err: formatErr) => {
    this.setState({
      error: true,
      loading: false,
      errorMessage: err.message
    });
  };

  getResponse = () => {
    this.setState({
      loading: true,
      error: false
    });
    getResource(this.state.label, this.state.pageOne)
      .then(res => {
        this.setState(() => {
          return {
            pageOne: res.page,
            totalPages: res.total_pages,
            movieList: res.results,
            loading: false
          };
        });
        const result = res.results;
        return result;
      })
      .then(value => {
        if (value.length === 0 && this.state.label !== '') {
          throw new Error('Nothing was found for your request');
        }
      })
      .catch(this.onError);
  };

  searchFn = (text: string) => {
    this.setState({
      label: text
    });
  };

  pageFunc = (page: number) => {
    this.setState({
      pageOne: page
    });
  };

  debounceFn = debounce(this.getResponse, 1200);

  componentDidUpdate(prevProps: unknown, prevState: { label: string; pageOne: number }) {
    if (this.state.label !== prevState.label) {
      this.debounceFn();
    }
    if (this.state.pageOne !== prevState.pageOne) {
      this.debounceFn();
    }
  }

  render(): React.ReactNode {
    return (
      <NetworkContext.Consumer>
        {isOnline => (
          <Fragment>
            {isOnline ? (
              <div className="movie-app">
                <Tabs
                  defaultActiveKey="1"
                  centered
                  items={[
                    {
                      label: 'Search',
                      key: '1',
                      children: (
                        <SearchTab
                          searchFn={this.searchFn}
                          movieList={this.state.movieList}
                          loading={this.state.loading}
                          error={this.state.error}
                          errorMessage={this.state.errorMessage}
                          pageOne={this.state.pageOne}
                          totalPages={this.state.totalPages}
                          pageFunc={this.pageFunc}
                        />
                      )
                    },
                    {
                      label: 'Rated',
                      key: '3',
                      children: <RatedTab />
                    }
                  ]}
                />
              </div>
            ) : (
              <div className="movie-app">
                <Alert message="Error" description="No internet connection" type="error" showIcon />
              </div>
            )}
          </Fragment>
        )}
      </NetworkContext.Consumer>
    );
  }
}

export { App };

{
  /* <NetworkContext.Consumer>
  {isOnline => (
    <Fragment>
      {isOnline ? (
        <div className="movie-app">
          <SearchInput searchFn={this.searchFn} />
          <MovieCardList
            movieList={this.state.movieList}
            loading={this.state.loading}
            error={this.state.error}
            errorMessage={this.state.errorMessage}
          />
          <Pagination
            align="center"
            className={this.state.loading || this.state.movieList.length === 0 ? 'pagination-fix' : undefined}
            defaultCurrent={this.state.pageOne}
            total={this.state.totalPages}
            onChange={page => {
              this.setState({
                pageOne: page
              });
            }}
          />
        </div>
      ) : (
        <div className="movie-app">
          <Alert message="Error" description="No internet connection" type="error" showIcon />
        </div>
      )}
    </Fragment>
  )}
</NetworkContext.Consumer>; */
}
