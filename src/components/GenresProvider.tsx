import { createContext } from 'react';
type genTypeS = {
  id: number;
  name: string;
};

const { Provider: GenresProvider, Consumer: GenresConsumer } = createContext<genTypeS[]>([]);

export { GenresProvider, GenresConsumer };
