import { Component, createContext, ReactNode } from 'react';

const NetworkContext = createContext({});
type MyChill = { children: ReactNode };

class NetworkProvider extends Component<MyChill> {
  state = {
    isOnline: navigator.onLine
  };

  componentDidMount() {
    window.addEventListener('online', this.updateNetworkStatus);
    window.addEventListener('offline', this.updateNetworkStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateNetworkStatus);
    window.removeEventListener('offline', this.updateNetworkStatus);
  }

  updateNetworkStatus = () => {
    this.setState({ isOnline: navigator.onLine });
  };

  render() {
    return <NetworkContext.Provider value={this.state.isOnline}>{this.props.children}</NetworkContext.Provider>;
  }
}

export { NetworkProvider, NetworkContext };
