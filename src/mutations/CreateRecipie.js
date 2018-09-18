import gql from 'graphql-tag';

export const CreateRecipie =
    gql`
        mutation createRecipe(
            $name: String!
            $ingredients: [String]!
            $directions: [String]!
        ){
            createRecipe(input: {
                name: $name
                ingredients: $ingredients
                directions: $directions
            }) {
                id
                name
                ingredients
                directions
            }
        }`