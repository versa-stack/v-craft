import { ApolloClient, InMemoryCache } from "@apollo/client/core";

export const createApolloClient = (uri: string) => new ApolloClient({
  uri, 
  cache: new InMemoryCache(),
  ssrMode: true,
})
