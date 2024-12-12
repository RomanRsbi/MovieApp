import './MovieCard.css';
import { Card, Flex, Typography, Spin } from 'antd';
import { format } from 'date-fns';
import { Component, ReactNode } from 'react';

type formatCard = {
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  loading: boolean;
};

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

  overviewFn = (text: string) => {
    if (text.length < 250) {
      return text;
    } else {
      const newText = text.slice(0, 250);
      const indxSpace = newText.lastIndexOf(' ');
      const res = `${newText.slice(0, indxSpace)} ...`;
      return res;
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

  render(): ReactNode {
    return (
      <Card hoverable className="movie-card" styles={{ body: { padding: 0, overflow: 'hidden' } }}>
        <Flex justify="flex-start">
          <img className="img-size" alt="avatar" src={this.posterFn(this.props.poster_path)} onLoad={this.handleLoad} />
          {this.state.loadingImg && <Spin className="spin-style" size="large" />}
          <Flex vertical align="start" justify="flex-start" style={{ padding: 20 }}>
            <Typography.Title level={3} className="margin-style title-size" style={{ margin: 0 }}>
              {this.props.title}
            </Typography.Title>
            <Typography.Text type="secondary" className="margin-style text-size">
              {this.dateFn(this.props.release_date)}
            </Typography.Text>
            <div className="margin-style">
              <Typography.Text className="text-size" keyboard>
                Action
              </Typography.Text>
              <Typography.Text className="text-size" keyboard>
                Drama
              </Typography.Text>
            </div>
            <Typography.Text className="text-size">{this.overviewFn(this.props.overview)}</Typography.Text>
          </Flex>
        </Flex>
      </Card>
    );
  }
}

export { MovieCard };
