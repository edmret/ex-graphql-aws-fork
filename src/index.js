import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import appSyncConf from './AppSync'

import appSyncClient from 'aws-appsync'
import {Rehydrated} from 'aws-appsync-react'
import {ApolloProvider} from 'react-apollo'

const client = new appSyncClient({
    url: appSyncConf.graphqlEndpoint,
    region: appSyncConf.region,
    auth: {
        type: appSyncConf.authenticationType,
        apiKey: appSyncConf.apiKey
    }
})

const WithProvider = () =>(
    <ApolloProvider client={client}>
        <Rehydrated>
            <App />
        </Rehydrated>
    </ApolloProvider>
)

ReactDOM.render(<WithProvider />, document.getElementById('root'));
registerServiceWorker();


//npm install --save uuid react-apollo aws-appsync aws-appsync-react graphql-tag