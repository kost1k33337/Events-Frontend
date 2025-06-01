// components/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import CreateEvent from './CreateEvent';

export default function ProfileScreen() {
  // Информация пользователя
  const [userName, setUserName] = useState('Иван Иванов');
  const [userEmail, setUserEmail] = useState('ivan.ivanov@example.com');

  // Интересы
  const allInterests = [
    'спорт',
    'кулинария',
    'йога',
    'кино',
    'садоводство',
    'настольные игры',
    'музыка',
    'технологии',
  ];
  const [selectedInterests, setSelectedInterests] = useState([
    'спорт',
    'кино',
  ]);
  const toggleInterest = (tag) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Достижения (бейджи)
  const achievements = [
    { id: 'a1', label: '🎖 Первый ивент' },
    { id: 'a2', label: '🏅 Организатор+' },
    { id: 'a3', label: '🚀 Активный участник' },
  ];

  // Для примера: счётчики посещённых и организованных мероприятий
  // Можно потом привязать к реальным данным
  const [attendedCount, setAttendedCount] = useState(12);
  const [organizedCount, setOrganizedCount] = useState(24);

  const [isCreating, setIsCreating] = useState(false);
  const handleNewEvent = (newEvent) => {
    console.log('Новое событие:', newEvent);
    setIsCreating(false);
    alert('Мероприятие создано!');
    // Можно увеличить organisedCount здесь:
    setOrganizedCount((prev) => prev + 1);
  };

  const handleLogout = () => {
    alert('Вы вышли из профиля');
    // Логика выхода
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Аватар */}
        <Image
          source={{ uri: 'https://avatars.githubusercontent.com/u/583231?v=4' }}
          style={styles.avatar}
        />

        {/* Имя */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Имя:</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Введите имя"
            placeholderTextColor="#999"
          />
        </View>

        {/* Email */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email:</Text>
          <TextInput
            style={styles.input}
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder="Введите email"
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
        </View>

        {/* Интересы */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Выберите интересы:</Text>
          <View style={styles.tagsRow}>
            {allInterests.map((tag) => {
              const isSelected = selectedInterests.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleInterest(tag)}
                  style={[
                    styles.tagPill,
                    isSelected && styles.tagPillSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected && styles.tagTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Достижения */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Достижения</Text>
          <View style={styles.achievementsRow}>
            {achievements.map((ach) => (
              <View key={ach.id} style={styles.achievementPill}>
                <Text style={styles.achievementText}>{ach.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Счетчики посещённых и организованных мероприятий */}
        <View style={styles.countersContainer}>
          <View style={styles.counterBlock}>
            <Text style={styles.counterNumber}>{attendedCount}</Text>
            <Text style={styles.counterLabel}>Я посетил</Text>
          </View>
          <View style={styles.counterBlock}>
            <Text style={styles.counterNumber}>{organizedCount}</Text>
            <Text style={styles.counterLabel}>Я организовал</Text>
          </View>
        </View>

        {/* Кнопка “Организовать мероприятие” */}
        <TouchableOpacity
          style={styles.createEventBtn}
          onPress={() => setIsCreating(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.createEventBtnText}>
            Организовать мероприятие
          </Text>
        </TouchableOpacity>

        {/* Кнопка “Выйти” */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutBtnText}>Выйти</Text>
        </TouchableOpacity>

        {/* Отступ снизу */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Модальное окно CreateEvent */}
      {isCreating && (
        <CreateEvent onSubmit={handleNewEvent} onCancel={() => setIsCreating(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  fieldContainer: {
    width: '90%',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  section: {
    width: '90%',
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#FFF',
  },
  tagPillSelected: {
    backgroundColor: '#0066CC',
    borderColor: '#005BB5',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  tagTextSelected: {
    color: '#FFF',
  },

  /* ===== Достижения ===== */
  achievementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementPill: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 14,
    color: '#333',
  },

  /* ===== Счетчики ===== */
  countersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 24,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  counterBlock: {
    alignItems: 'center',
    flex: 1,
  },
  counterNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  counterLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  /* ===== Кнопка “Организовать мероприятие” ===== */
  createEventBtn: {
    width: '90%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#28A745',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  createEventBtnText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },

  /* ===== Кнопка “Выйти” ===== */
  logoutBtn: {
    width: '90%',
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  logoutBtnText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});
