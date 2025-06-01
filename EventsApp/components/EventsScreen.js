import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import CreateEvent from './CreateEvent';
import EventCard from './EventCard';

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const handleCreateEvent = (event) => {
    setEvents((prev) => [event, ...prev]); // добавляем новое событие первым
    setShowCreate(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {showCreate && (
        <CreateEvent
          onSubmit={handleCreateEvent}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <FlatList
        data={events}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <EventCard event={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет мероприятий. Создай первое!</Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#0066CC',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 36,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#999',
  },
});
