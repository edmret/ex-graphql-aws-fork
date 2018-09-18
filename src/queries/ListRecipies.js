import gql from 'graphql-tag';

export const getAllRecipies = gql`
query getAllRecipies{
    listRecipes{
      nextToken
      items{
        id
        name
      }
    }
  }`