import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const leaders = [
  { id: '1', name: 'Алексей Смирнов', organized: 15, attended: 8 },
  { id: '2', name: 'Мария Иванова', organized: 3, attended: 21 },
  { id: '3', name: 'Иван Иванов', organized: 12, attended: 24 },
  { id: '4', name: 'Ольга Попова', organized: 2, attended: 22 },
  { id: '5', name: 'Сергей Соколов', organized: 6, attended: 3 },
  { id: '6', name: 'Екатерина Морозова', organized: 4, attended: 7 },
  { id: '7', name: 'Никита Воробьёв', organized: 1, attended: 11 },
  { id: '8', name: 'Дарья Лебедева', organized: 3, attended: 6 },
  { id: '9', name: 'Михаил Новиков', organized: 2, attended: 5 },
  { id: '10', name: 'Анна Михайлова', organized: 1, attended: 8 },
];

export default function LeaderboardScreen() {
  const sortedLeaders = leaders
    .map((item) => ({
      ...item,
      total: item.organized * 2 + item.attended,
    }))
    .sort((a, b) => b.total - a.total);

  const renderItem = ({ item, index }) => {
    const trophyColor =
      index === 0
        ? '#FFD700'
        : index === 1
        ? '#C0C0C0'
        : index === 2
        ? '#CD7F32'
        : '#888';

    return (
      <View style={[styles.card, index < 3 && styles.highlightedCard]}>
        <View style={styles.rank}>
          <Ionicons name="trophy" size={24} color={trophyColor} />
          <Text style={[styles.rankText, { color: trophyColor }]}>
            #{index + 1}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.line}>Организовал: {item.organized}</Text>
          <Text style={styles.line}>Посетил: {item.attended}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreValue}>{item.total}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>🏆 Таблица лидеров</Text>
      <FlatList
        data={sortedLeaders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 16,
    color: '#222',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  highlightedCard: {
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  rank: {
    width: 50,
    alignItems: 'center',
    marginTop: 4,
  },
  rankText: {
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 14,
  },
  info: {
    flex: 1,
    paddingLeft: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  line: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  scoreBox: {
    width: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 6,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
});
