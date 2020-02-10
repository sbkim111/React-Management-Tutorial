import React, { Component } from 'react';
import Customer from './components/Customer';
import './App.css';

const customers = [
  {
  'id': 1,
  'image': 'https://placeimg.com/64/64/1',
  'name': '홍길동1',
  'birthday': '8101111',
  'gender': '남자',
  'job': '직장인'
  },
  {
    'id': 2,
    'image': 'https://placeimg.com/64/64/2',    
    'name': '홍길동2',
    'birthday': '81012222',
    'gender': '여자',
    'job': '주부'
  },
  {
    'id': 3,
    'image': 'https://placeimg.com/64/64/3',    
    'name': '홍길동3',
    'birthday': '81013333',
    'gender': '남자',
    'job': '건설'
  }  
]

class App extends Component {
  render(){
    return (
      <div>
        {
          customers.map(c => {
            return (
            <Customer
              key={c.id}
              id={c.id}
              image={c.image}
              name={c.name}
              birthday={c.birthday}
              gender={c.gender}
              job={c.job}
            />    
            );
          })
        }
      </div>
    );
  }
}

export default App;
