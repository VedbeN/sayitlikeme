const React = require('react');
const ReactDom = require('react-dom');
const axios = require('axios');

import { Router, Route, browserHistory} from 'react-router';


/*

               <div>
                  {console.log('this.state', this.state)}
                  <h1> Say It Like Me!</h1>
                  <Description description="I know how it's pronounced!"/>
                  <Search/>
                  <Login />
                  <Recorder />
               </div>;
*/
/* <Profile userInfo={this.state.userInfo}/> */
const Search = (props) => <div>
                              <h2>Search:</h2>
                              <input type="text"/>
                              <button>Find</button>
                          </div>;
const Login = (props) => <div>
                             <h2>Login With Twitter </h2>
                             <button> Login </button>
                         </div>;
const Recorder = (props) => <div>
                                <h1> Record the name </h1>
                                <div>Record</div>
                            </div>;


const Description = (props) => <div> {props.description} </div>;
const Profile = React.createClass({
    getInitialState() {
        return {
            userInfo : {
                twitterId: '',
                name: '',
                nameClarification: ''
            }
        }
    },
    showUser(response) {
        this.setState({
            userInfo : {
                twitterId: response.twitterId,
                name: response.name,
                nameClarification: response.nameClarification 
            }
        });
    },
    componentDidMount() {
        axios.get('http://localhost:8000/api-/omidfi')
             .then( data => {
                 console.log('response is back', data);
                 this.showUser(data.data[0]);
             });
    },
    render() {
        return ( 
            <div>
              {console.log('state', this.state )}
              <h1>My name is  <b>{this.state.userInfo.name} </b></h1>
              <h2>My twitter handle is  <b> {this.state.userInfo.twitterId}</b></h2>
              <p>Please call me like this: {this.state.userInfo.nameClarification}</p>
              <span>Play</span>
            </div>
            )     
    }
});
const App = React.createClass({
    render() {
        return ( 
            <Router history={browserHistory}>
                    <Route path="/search" component={Search}/>
                    <Route path="/profile" component={Profile}/>
            </Router>
               )     
    }
});
ReactDom.render(<App/>, window.document.getElementById('target'));
