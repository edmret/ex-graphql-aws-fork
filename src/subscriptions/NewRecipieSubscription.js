import gql from 'graphql-tag'

export const newRecipieSubscription = gql`
    subscription onCreateRecipe{
        onCreateRecipe{
            id
            name
            ingredients
            directions
        }
    }
`