import './MovieCard.css';
import { Card, Flex, Typography, Spin, Rate } from 'antd';
import { format } from 'date-fns';
import { Component, ReactNode } from 'react';

import getResource from '../NetworkRequestFile';
import { GenresConsumer } from '../GenresProvider';
import Genres from '../Genres/Genres';

interface formatCard {
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  loading: boolean;
  id: number;
  vote_average: number;
  sessionId: string;
  genre_ids: number[];
}

interface forState {
  loadingImg: boolean;
}

class MovieCard extends Component<formatCard> {
  state: forState = {
    loadingImg: true
  };

  posterFn = (text: string) => {
    if (text) {
      return `https://image.tmdb.org/t/p/original${text}`;
    } else {
      return 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Out_Of_Poster.jpg';
    }
  };

  overviewFn = (text: string, title: string) => {
    if (text.length === 0) {
      return 'No description';
    }
    if (text.length < 250 && title.length < 35) {
      return text;
    } else {
      const newText = text.slice(0, 150);
      const indxSpace = newText.lastIndexOf(' ');
      const res = `${newText.slice(0, indxSpace)} ...`;
      return res;
    }
  };

  titleSlice = (text: string) => {
    if (text.length > 40) {
      const newText = text.slice(0, 35);
      const indxSpace = newText.lastIndexOf(' ');
      const res = `${newText.slice(0, indxSpace)} ...`;
      return res;
    } else {
      return text;
    }
  };

  dateFn = (date: string) => {
    if (date) {
      return format(new Date(date), 'MMMM dd, yyyy');
    } else {
      return 'unknown';
    }
  };

  handleLoad = () => {
    this.setState({
      loadingImg: false
    });
  };

  starsCountFn = (num: number) => {
    if (num === 0) {
      getResource(
        `https://api.themoviedb.org/3/movie/${this.props.id}/rating?guest_session_id=${this.props.sessionId}`,
        'DELETE',
        'application/json;charset=utf-8',
        this.props.id
      )
        .then(res => {
          return res;
        })
        .catch(error => {
          alert(error);
        });
    } else {
      getResource(
        `https://api.themoviedb.org/3/movie/${this.props.id}/rating?guest_session_id=${this.props.sessionId}`,
        'POST',
        'application/json;charset=utf-8',
        this.props.id,
        num
      )
        .then(res => {
          return res;
        })
        .catch(error => {
          alert(error);
        });
    }
  };

  render(): ReactNode {
    const rateCount = this.props.vote_average;
    let classSpan = '';

    if (rateCount >= 7) {
      classSpan = 'green-border';
    } else if (rateCount >= 5) {
      classSpan = 'yellow-border';
    } else if (rateCount >= 3) {
      classSpan = 'orange-border';
    } else {
      classSpan = 'red-border';
    }

    return (
      <Card hoverable className="movie-card" styles={{ body: { padding: 0, overflow: 'hidden' } }}>
        <Flex justify="flex-start" className="mobile-style">
          <img className="img-size" alt="avatar" src={this.posterFn(this.props.poster_path)} onLoad={this.handleLoad} />
          {this.state.loadingImg && <Spin className="spin-style" size="large" />}
          <Flex vertical className="flex-style-user" align="start" justify="flex-start">
            <Typography.Title level={3} className="margin-style title-size" style={{ margin: 0 }}>
              {this.titleSlice(this.props.title)}
            </Typography.Title>
            <span className={`span-rate ${classSpan}`}>{this.props.vote_average.toFixed(1)}</span>
            <Typography.Text type="secondary" className="margin-style text-size">
              {this.dateFn(this.props.release_date)}
            </Typography.Text>
            <GenresConsumer>
              {genresList => {
                return <Genres genresList={genresList} genreIds={this.props.genre_ids} />;
              }}
            </GenresConsumer>
            <Typography.Text className="text-size">
              {this.overviewFn(this.props.overview, this.props.title)}
            </Typography.Text>
            <Rate
              className="rate-style"
              allowHalf
              defaultValue={Number(localStorage.getItem(this.props.id.toString()))}
              count={10}
              onChange={this.starsCountFn}
            />
          </Flex>
        </Flex>
      </Card>
    );
  }
}

export { MovieCard };
