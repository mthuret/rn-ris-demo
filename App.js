import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SectionList,
  Image,
  TouchableHighlight,
} from 'react-native';
import {
  connectSearchBox,
  connectInfiniteHits,
  connectHits,
  connectAutoComplete,
} from 'react-instantsearch/connectors';
import { InstantSearch, Configure, Index } from 'react-instantsearch/native';
import Highlight from './Highlight';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySuggestions: false,
      query: '',
      searchState: {},
    };
    this.displaySuggestions = this.displaySuggestions.bind(this);
    this.removeSuggestions = this.removeSuggestions.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
  }
  displaySuggestions() {
    this.setState({ displaySuggestions: true });
  }

  removeSuggestions() {
    this.setState({ displaySuggestions: false });
  }

  setQuery(query) {
    this.setState({
      searchState: {
        ...this.state.searchState,
        query,
      },
    });
  }

  onSearchStateChange(searchState) {
    this.setState({ searchState });
  }

  render() {
    const suggestions = this.state.displaySuggestions ? (
      <QuerySuggestionsHits onPressItem={this.setQuery} />
    ) : null;
    return (
      <View style={{ marginTop: 20 }}>
        <InstantSearch
          appId="latency"
          apiKey="6be0576ff61c053d5f9a3225e2a90f76"
          indexName="instant_search"
          onSearchStateChange={this.onSearchStateChange}
          searchState={this.state.searchState}
        >
          <ConnectedSearchBox displaySuggestions={this.displaySuggestions} />
          <Index indexName="instantsearch_query_suggestions">
            <Configure hitsPerPage={5} />
            {suggestions}
          </Index>
          <Index indexName="instant_search">
            <Configure hitsPerPage={5} />
            <View
              style={{
                backgroundColor: 'lightgrey',
                height: 40,
                justifyContent: 'center',
                padding: 10,
              }}
            >
              <Text>Best results</Text>
            </View>
            <ResultsHits removeSuggestions={this.removeSuggestions} />
          </Index>
        </InstantSearch>
      </View>
    );
  }
}

class SearchBox extends Component {
  render() {
    return (
      <View style={styles.searchBoxContainer}>
        <Image
          source={{
            uri:
              'https://d13yacurqjgara.cloudfront.net/users/1090953/avatars/small/3a0f064859092a0e82bedddcee24a4a8.png?148154278',
          }}
          style={{ width: 40, height: 40, margin: 10 }}
        />
        <TextInput
          style={styles.searchBox}
          onChangeText={text => this.props.refine(text)}
          value={this.props.currentRefinement}
          placeholder={'Search a product...'}
          placeholderTextColor={'white'}
          clearButtonMode={'always'}
          underlineColorAndroid={'white'}
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize={'none'}
          onFocus={this.props.displaySuggestions}
        />
      </View>
    );
  }
}

const ConnectedSearchBox = connectSearchBox(SearchBox);

const ResultsHits = connectInfiniteHits(
  ({ hits, hasMore, refine, removeSuggestions }) => {
    /* if there are still results, you can
    call the refine function to load more */
    const onEndReached = function() {
      if (hasMore) {
        refine();
      }
    };
    return (
      <FlatList
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', margin: 10 }}>
            <Image
              source={{
                uri: `https://res.cloudinary.com/hilnmyskv/image/fetch/h_300,q_100,f_auto/${
                  item.image
                }`,
              }}
              style={{ width: 40, height: 40 }}
            />
            <Text
              style={{
                alignSelf: 'center',
                paddingLeft: 5,
                flex: 1,
                flexWrap: 'wrap',
              }}
            >
              <Highlight
                attributeName="name"
                hit={item}
                highlightProperty="_highlightResult"
              />
            </Text>
          </View>
        )}
        data={hits}
        keyExtractor={item => item.objectID}
        onEndReached={onEndReached}
        onScroll={removeSuggestions}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: 'lightgrey',
              marginTop: 10,
              marginBottom: 10,
            }}
          />
        )}
      />
    );
  }
);

const SuggestionsHits = connectHits(({ hits, onPressItem }) => {
  return (
    <FlatList
      renderItem={({ item }) => (
        <TouchableHighlight onPress={() => onPressItem(item.query)}>
          <View style={{ height: 30, padding: 10 }}>
            <Highlight
              attributeName="query"
              hit={item}
              highlightProperty="_highlightResult"
              inverted
            />
          </View>
        </TouchableHighlight>
      )}
      keyExtractor={item => item.objectID}
      data={hits}
    />
  );
});

const QuerySuggestionsHits = connectHits(SuggestionsHits);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBoxContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 23, 36, 1)',
  },
  searchBox: {
    color: 'white',
    height: 50,
    alignSelf: 'center',
  },
});
