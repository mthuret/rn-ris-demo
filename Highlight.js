import React from 'react';
import { Text } from 'react-native';
import { connectHighlight } from 'react-instantsearch/connectors';

export default connectHighlight(
  ({ highlight, attributeName, hit, highlightProperty }) => {
    const parsedHit = highlight({ attributeName, hit, highlightProperty: '_highlightResult' });
    const styles = { backgroundColor: '#ffff99' };
    const highligtedHit = parsedHit.map((part, idx) => {
      if (part.isHighlighted)
        return (
          <Text key={idx} style={styles}>
            {part.value}
          </Text>
        );
      return (
        <Text key={idx}>
          {part.value}
        </Text>
      );
    });
    return <Text>{highligtedHit}</Text>;
  }
);
