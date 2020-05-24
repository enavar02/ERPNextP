import {ApolloClient, createHttpLink, InMemoryCache, DefaultOptions} from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context'

const httpLink = createHttpLink({
    //uri: 'https://fathomless-basin-38658.herokuapp.com/',
    // uri: 'http://localhost:4000/',
    uri: 'https://formkeyla.azurewebsites.net/',
    
    fetch
});
const authLink = setContext((_,{headers}) =>{

    //Leer el storage almacenado
    const token = localStorage.getItem('token');
    return{
        headers:{
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),

    //Quita todo el cache
    // defaultOptions: {
    //     watchQuery: {
    //         fetchPolicy: 'no-cache',
    //         errorPolicy: 'ignore',
    //     },
    //     query: {
    //         fetchPolicy: 'no-cache',
    //         errorPolicy: 'all',
    //       }
    // }
});

export default client;



