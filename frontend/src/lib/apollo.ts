import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

// export const appUrl = "d1u9709g181qp5.cloudfront.net";
// export const httpUrl = `https://${appUrl}`;
export const appUrl = "localhost:4000";
export const httpUrl = "http://localhost:4000";
// export const appUrl = "3.208.179.96";
  // process.env.NODE_ENV === "development" ? "localhost:4000" : "3.208.179.96"
  // process.env.NODE_ENV === "development" ? "localhost:4000" : "3.208.179.96"

const httpLink = new HttpLink({
  uri: `${httpUrl}/graphql`,
  fetchOptions: {
    mode: 'cors', // no-cors, *cors, same-origin
 }
});

const wsLink = new GraphQLWsLink(createClient({
  url: `ws://${appUrl}/graphql`
}));

export const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("@flingr:token");
  
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      'Apollo-Require-Preflight': 'true'
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
  headers: {
    'Apollo-Require-Preflight': 'true'
  }
})
