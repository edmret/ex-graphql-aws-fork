import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {compose, graphql} from 'react-apollo'
import {getAllRecipies} from './queries/ListRecipies'
import {CreateRecipie} from './mutations/CreateRecipie'
import {newRecipieSubscription} from './subscriptions/NewRecipieSubscription'

class App extends Component { 

  state = {
    name: '',
    ingredient: '',
    direction: '',
    ingredients: [],
    directions: []
  }

  componentDidMount(){
    this.props.subscribeToNewRecipies();
  }

  onChange(key, value){
    this.setState({[key]: value})
  }

  addIngredient = () => {

    if(!this.state.ingredient) return;

    const {ingredients, ingredient} = this.state;
    ingredients.push(ingredient);
    this.setState({
      ingredient: ''
    })
  }

  addDirection= () =>{

    if(!this.state.direction) return;

    const {directions, direction} = this.state;
    directions.push(direction);
    this.setState({
      direction: ''
    })
  }

  addRecipie= () =>{
    const {name, ingredients, directions} = this.state;
    this.props.onAdd({
      name,
      ingredients,
      directions
    });

    this.setState({
      ingredient: '',
      ingredients: [],
      direction: '',
      directions: [],
      name: ''
    })
  }

  render() {
    console.log('PROPS', this.props);
    return (
      <div className="App" style={styles.container}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {
          this.props.recipies.map( (recipie, index)=> (
            <div key={index}>
              <p>
                {index + 1}.- {recipie.name}
              </p>
            </div>
          ))
        }

        <input
          placeholder="Direction"
          style={styles.input}
          value={this.state.direction}
          onChange={e => this.onChange('direction', e.target.value)}
        />

        <button style={styles.button} onClick={this.addDirection}>Add Direction</button>

        <ul>
          {
            this.state.directions.map(dir=>(<li key={dir}>{dir}</li>))
          }
        </ul>

        <input
          placeholder="ingredient"
          style={styles.input}
          value={this.state.ingredient}
          onChange={e => this.onChange('ingredient', e.target.value)}
        />

        <button style={styles.button} onClick={this.addIngredient}>Add Ingredient</button>

        <ul>
          {
            this.state.ingredients.map(ing=>(<li key={ing}>{ing}</li>))
          }
        </ul>

        <input
          placeholder="Recipe Name"
          style={styles.input}
          value={this.state.name}
          onChange={e => this.onChange('name', e.target.value)}
        />
        <button style={styles.button} onClick={this.addRecipie}>Add Recipie</button>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alingnItems: 'center'
  },
  input: {
    height: 50,
    width: 300,
    borderBottom: '2px solid blue',
    margin: 10,
    fontSize: 22
  },
  button: {
    height: 50,
    width: 450
  }
}

export default compose(
  graphql(getAllRecipies, {
    options: {
      fetchPolicy: 'cache-and-network'
    },
    props: props => ({
      recipies: ( props.data.listRecipes && props.data.listRecipes.items) || [],
      subscribeToNewRecipies: params => {
        props.data.subscribeToMore({
          document: newRecipieSubscription,
          updateQuery: (prev, { subscriptionData: { data: {onCreateRecipe} } }) =>{
            console.log('created',onCreateRecipe );
            return {
              ...prev,
              listRecipes: {
                __typename: 'RecipeConnection',
                items: [
                  onCreateRecipe, 
                  ...prev.listRecipes.items
                    .filter(item=> item.id !== onCreateRecipe.id )
                ]
              }
            }
          }
        })
      }
    })
  }),

  graphql(CreateRecipie, {
    props: props => ({
      onAdd: recipie => {
        console.log(recipie);
        props.mutate({
          variables: recipie,
          optimisticResponse: {
            __typename: 'Mutation',
            createRecipe: {...recipie, __typename: 'Recipe'}
          },
          update: (proxy, {data:{createRecipe} }) => {
            const data = proxy.readQuery({query: getAllRecipies})
            console.log(data);
            data.listRecipes.items.push(createRecipe);
            proxy.writeQuery({ query: getAllRecipies, data })
          }
        })
      }
    }) 
  })
)(App);
