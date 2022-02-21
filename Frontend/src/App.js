import logo from './logo.png';
import './App.css';
import SearchBar from './components/searchBar';

const autoCompleteList = [
  {id: 1, suggestion: 'BASIC'},
  {id: 2, suggestion: 'C/C++'},
  {id: 3, suggestion: 'Clojure'},
  {id: 4, suggestion: 'COBOL'},
  {id: 5, suggestion: 'ColdFusion'},
  {id: 6, suggestion: 'Erlang'},
  {id: 7, suggestion: 'Fortran'},
  {id: 8, suggestion: 'Groovy'},
  {id: 9, suggestion: 'Haskell'},
  {id: 10, suggestion: 'Java'},
  {id: 11, suggestion: 'JavaScript'},
  {id: 12, suggestion: 'Lisp'},
  {id: 13, suggestion: 'Perl'},
  {id: 14, suggestion: 'PHP'},
  {id: 15, suggestion: 'Python'},
  {id: 16, suggestion: 'Ruby'},
  {id: 17, suggestion: 'Scala'},
  {id: 18, suggestion: 'Scheme'},
]

function App() {
  return (
    <div className="App">
      <img
          className="logo-image"
          src={logo}
          alt="logo"
        />
      <SearchBar autoCompleteList={autoCompleteList} />
    </div>
  );
}

export default App;
