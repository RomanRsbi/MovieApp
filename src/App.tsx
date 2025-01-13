import { Component, Fragment } from 'react';
import './App.css';
import { Alert, Tabs } from 'antd';
import { debounce } from 'lodash';

import getResource, { createGuestSession } from './components/NetworkRequestFile';
import { NetworkContext } from './components/NetworkProvider';
import { GenresProvider } from './components/GenresProvider';
import { SearchTab } from './components/SearchTab/SearchTab';
import { RatedTab } from './components/RatedTab/RatedTab';

type formatObj = {
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  id: number;
  vote_average: number;
  genre_ids: number[];
};

type genresForm = {
  id: number;
  name: string;
};

interface movListT {
  movieList: formatObj[];
  genresList: genresForm[];
  loading: boolean;
  error: boolean;
  errorMessage: string;
  label: string;
  pageOne: number;
  totalResults: number;
  sessionId: string;
}

type formatErr = {
  message: string;
};

class App extends Component {
  state: movListT = {
    movieList: [],
    genresList: [],
    loading: false,
    error: false,
    errorMessage: '',
    label: '',
    pageOne: 1,
    totalResults: 1,
    sessionId: ''
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
    getResource(
      `https://api.themoviedb.org/3/search/movie?query=${this.state.label}&include_adult=false&language=en-US&page=${this.state.pageOne}`,
      'GET'
    )
      .then(res => {
        this.setState(() => {
          return {
            pageOne: res.page,
            totalResults: res.total_results,
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
      label: text,
      pageOne: 1
    });
  };

  pageFunc = (page: number) => {
    this.setState({
      pageOne: page
    });
  };

  debounceFn = debounce(this.getResponse, 1200);

  componentDidMount(): void {
    createGuestSession('https://api.themoviedb.org/3/authentication/guest_session/new', 'GET')
      .then(res => {
        this.setState(() => {
          return { sessionId: res };
        });
      })
      .catch(this.onError);
    getResource('https://api.themoviedb.org/3/genre/movie/list?language=en', 'GET').then(answer => {
      this.setState(() => {
        return { genresList: answer.genres };
      });
    });
  }

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
      <GenresProvider value={this.state.genresList}>
        <NetworkContext.Consumer>
          {isOnline => (
            <Fragment>
              {isOnline ? (
                <div className="movie-app">
                  <Tabs
                    destroyInactiveTabPane
                    className="tab-style"
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
                            totalResults={this.state.totalResults}
                            pageFunc={this.pageFunc}
                            sessionId={this.state.sessionId}
                          />
                        )
                      },
                      {
                        label: 'Rated',
                        key: '2',
                        children: <RatedTab sessionId={this.state.sessionId} />
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
      </GenresProvider>
    );
  }
}

export { App };
//82520
// id сессии eb3a481edb89070b3a472d367d64e3c2
//'https://api.themoviedb.org/3/guest_session/eb3a481edb89070b3a472d367d64e3c2/rated/movies?language=en-US&page=1&sort_by=created_at.asc'
// delete 'https://api.themoviedb.org/3/movie/82520/rating?guest_session_id=eb3a481edb89070b3a472d367d64e3c2'
