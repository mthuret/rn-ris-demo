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
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Constants } from 'expo';
import {
  connectSearchBox,
  connectInfiniteHits,
  connectHits,
  connectAutoComplete,
  connectStateResults,
} from 'react-instantsearch/connectors';
import { InstantSearch, Configure, Index } from 'react-instantsearch/native';
import Highlight from './Highlight';
import { omit } from 'lodash';
const { width, height } = Dimensions.get('window');


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <InstantSearch
          appId="latency"
          apiKey="6be0576ff61c053d5f9a3225e2a90f76"
          indexName="instant_search"
        >
          <ConnectedSearchBox />
          <ResultsInfiniteHits />
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
          style={styles.algoliaLogo}
        />
        <TextInput
          style={styles.searchBox}
          onChangeText={text => this.props.refine(text)}
          value={this.props.currentRefinement}
          placeholder={'Search a product...'}
          placeholderTextColor={'black'}
          clearButtonMode={'always'}
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize={'none'}
        />
        <View
          style={styles.spinner}
        >
          <ActivityIndicator animating={this.props.isSearchStalled} />
        </View>
      </View >
    );
  }
}

const ConnectedSearchBox = connectSearchBox(SearchBox);

const ResultsInfiniteHits = connectInfiniteHits(
  ({ hits, hasMore, refine, removeSuggestions, query }) => {
    const onEndReached = function () {
      if (hasMore) {
        refine();
      }
    };
    return (
      <FlatList
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{
                uri: `https://res.cloudinary.com/hilnmyskv/image/fetch/h_300,q_100,f_auto/${
                  item.image
                  }`,
              }}
              style={styles.itemImage}
            />
            <Text
              style={styles.itemText}
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
            style={styles.itemSeparator}
          />
        )}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBoxContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'stretch',
  },
  searchBox: {
    color: 'black',
    height: 50,
    width: 300,
    alignSelf: 'center',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: 'lightgrey',
    marginTop: 10,
    marginBottom: 10,
  },
  itemText: {
    alignSelf: 'center',
    paddingLeft: 5,
    flex: 1,
    flexWrap: 'wrap',
  },
  itemImage: { width: 40, height: 40 },
  itemContainer: { flexDirection: 'row', margin: 10 },
  algoliaLogo: { width: 40, height: 40, margin: 10 },
  spinner: {
    position: 'absolute',
    left: width - 70,
    bottom: 20,
  }
});
