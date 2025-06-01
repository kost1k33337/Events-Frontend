// components/EventCard.js
import React, { useMemo } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.65;
const CARD_BORDER_RADIUS = 20;

const EventCard = React.memo(({ event }) => {
  const displayedTags = useMemo(() => event.tags.slice(0, 3), [event.tags]);

  return (
    <View style={styles.container} collapsable={false}>
      <ImageBackground
        source={event.image}
        style={styles.imageBackground}
        resizeMode="cover"
        blurRadius={0.2} // чуть снижает резкость и ускоряет отрисовку
      >
        <View style={styles.gradientOverlay} />
        <View style={styles.textBlock}>
          <Text numberOfLines={1} style={styles.title}>{event.title}</Text>
          <Text numberOfLines={1} style={styles.meta}>
            {event.date} · {event.location}
          </Text>
          <View style={styles.tagsContainer}>
            {displayedTags.map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}, (prev, next) => prev.event.title === next.event.title);

export default EventCard;

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: '#000',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT * 0.3,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textBlock: {
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
  },
});
