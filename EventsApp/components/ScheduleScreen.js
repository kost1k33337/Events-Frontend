// components/ScheduleScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Image,
} from 'react-native';

// Пример массива событий с флагами joined/mine и новым полем mapImage
const events = [
  {
    title: 'Дворовый футбольный турнир',
    description:
      'Присоединяйтесь к соседям для дружеского матча 5×5 на спортивной площадке нашего ЖК. Приходите в бутсах и с боевым настроем! Участие бесплатное, приносите воду и хорошее настроение.',
    date: 'Sat, Jun 7 • 5:00 PM',
    location: 'Спортивная площадка ЖК',
    tags: ['спорт', 'футбол', 'активность'],
    joined: true,
    mine: false,
    mapImage: ('../assets/images/map_football.png'),
  },
  {
    title: 'Мастер-класс уличной кухни',
    description:
      'Научитесь готовить вкусные стрит-фуд лаваши и закуски на нашей общей кухне. Преподаёт шеф-повар соседнего кафе. Каждый участник уходит с собственноручно приготовленным блюдом.',
    date: 'Sun, Jun 8 • 11:00 AM',
    location: 'Общая кухня',
    tags: ['кулинария', 'мастер-класс', 'стиль жизни'],
    joined: false,
    mine: false,
    mapImage: require('../assets/images/map_cooking.png'),
  },
  {
    title: 'Рассветная йога на лужайке',
    description:
      'Начните день с лёгкой йоги под открытым небом вместе с инструктором Марией. Захватите коврик, спортивную одежду и воду. Идеально для расслабления и заряда бодрости!',
    date: 'Mon, Jun 9 • 7:00 AM',
    location: 'Центральный газон',
    tags: ['йога', 'здоровье', 'рассвет'],
    joined: false,
    mine: false,
    mapImage: require('../assets/images/map_yoga.png'),
  },
  {
    title: 'Ночь настольных игр',
    description:
      'Собираемся в клубной комнате на вечер настольных игр: Uno, «Каркассон», «Диксит» и другие. Победителей ждут символические призы и, пожалуй, самые сильные аплодисменты соседей.',
    date: 'Tue, Jun 10 • 6:00 PM',
    location: 'Клубная комната',
    tags: ['развлечение', 'настроение', 'викторина'],
    joined: true,
    mine: false,
    mapImage: ('../assets/images/map_quiz.png'),
  },
  {
    title: 'Урбан-огород: мастер-класс',
    description:
      'Практический семинар по выращиванию трав и овощей в городских условиях. Возьмите с собой небольшой горшок (можно любой), землю и семена (базилик, мята, томаты черри). Урок ведёт сосед–садовод.',
    date: 'Wed, Jun 11 • 5:00 PM',
    location: 'Сад на крыше',
    tags: ['садоводство', 'экология', 'DIY'],
    joined: false,
    mine: true,
    mapImage: ('../assets/images/map_sadovod.png'),
  },
  {
    title: 'Кинотеатр под открытым небом',
    description:
      'Приходите вечером во двор, чтобы насладиться семейным фильмом «Большой Канзас» на большом экране. Берите пледы, напитки и закуски — будет комфортно и уютно!',
    date: 'Fri, Jun 13 • 9:00 PM',
    location: 'Дворовая сцена',
    tags: ['кино', 'семья', 'вечер'],
    joined: false,
    mine: false,
    mapImage: ('../assets/images/map_cinema.png'),
  },
];

// Включаем LayoutAnimation для Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ScheduleScreen() {
  // Вкладка: 0 — «Расписание», 1 — «Я участвую», 2 — «Мои события»
  const [activeTab, setActiveTab] = useState(0);

  // Состояние для раскрытых элементов (ключи формата "день♡index")
  const [expandedItems, setExpandedItems] = useState({});

  // Состояние выбранных тегов для фильтрации
  const [selectedTags, setSelectedTags] = useState([]);

  // Список всех уникальных тегов
  const allTags = useMemo(() => {
    const tagSet = new Set();
    events.forEach((e) => e.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, []);

  // Переключить фильтрацию по тегу
  const toggleTagFilter = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Отфильтровать события по выбранным тегам и по активной вкладке
  const filteredEvents = useMemo(() => {
    // Сначала по вкладке
    let base = events;
    if (activeTab === 1) {
      // «Я участвую»
      base = events.filter((e) => e.joined);
    } else if (activeTab === 2) {
      // «Мои события»
      base = events.filter((e) => e.mine);
    }
    // Затем по тегам
    if (selectedTags.length === 0) return base;
    return base.filter((e) =>
      e.tags.some((tag) => selectedTags.includes(tag))
    );
  }, [activeTab, selectedTags]);

  // Группируем по «дню» (часть даты до «•»)
  const sections = useMemo(() => {
    const grouping = {};
    filteredEvents.forEach((ev, idx) => {
      const [dayPart] = ev.date.split('•').map((s) => s.trim());
      if (!grouping[dayPart]) grouping[dayPart] = [];
      grouping[dayPart].push({ ...ev, __globalIndex: idx });
    });
    return Object.entries(grouping).map(([day, evts]) => ({
      title: day,
      data: evts,
    }));
  }, [filteredEvents]);

  // Включить/выключить LayoutAnimation и переключить expand
  const toggleExpand = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Рендер одной «строки» (события)
  const renderItem = ({ item, index, section }) => {
    const itemKey = `${section.title}♡${index}`;
    const isExpanded = !!expandedItems[itemKey];

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => toggleExpand(itemKey)}
        style={styles.scheduleItemContainer}
      >
        <View style={styles.scheduleItemRow}>
          <Text style={styles.scheduleTime}>
            {item.date.split('•')[1].trim()}
          </Text>
          <View style={styles.scheduleDetails}>
            <Text style={styles.scheduleTitle}>{item.title}</Text>
            <Text style={styles.scheduleLocation}>{item.location}</Text>
            <View style={styles.tagsRow}>
              {item.tags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        {/* Блок с разворачивающейся информацией */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            <Text style={styles.expandedDescription}>{item.description}</Text>
            {/* Здесь показываем «карту» */}
            <Image
              source={item.mapImage}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <Text style={styles.mapCaption}>Парк внутренний двор</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Рендер заголовка секции (день)
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ===== Вкладки «Расписание», «Я участвую», «Мои события» ===== */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 0 && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab(0)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 0 && styles.tabTextActive,
            ]}
          >
            Расписание
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 1 && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab(1)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 1 && styles.tabTextActive,
            ]}
          >
            Я участвую
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 2 && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab(2)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 2 && styles.tabTextActive,
            ]}
          >
            Мои события
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== Фильтр по тегам ===== */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                onPress={() => toggleTagFilter(tag)}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ===== Список мероприятий ===== */}
      <SectionList
        sections={sections}
        keyExtractor={(item, idx) => item.title + item.location + idx}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingBottom: 24 }}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Нет событий по выбранным тегам / вкладке
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* ===== Вкладки ===== */
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FAFAFA',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderColor: '#0066CC',
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  tabTextActive: {
    color: '#0066CC',
    fontWeight: '600',
  },

  /* ===== Фильтр по тегам ===== */
  filterContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#DDD',
    backgroundColor: '#FAFAFA',
  },
  filterScroll: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterPill: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  filterPillSelected: {
    backgroundColor: '#0066CC',
    borderColor: '#005BB5',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },

  /* ===== Заголовок секции (день) ===== */
  sectionHeader: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#DDD',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  /* ===== Контейнер для каждого элемента ===== */
  scheduleItemContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#EEE',
  },
  scheduleItemRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  scheduleTime: {
    width: 75,
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  scheduleLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 0,
  },
  tagPill: {
    backgroundColor: '#EFEFF4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },

  /* ===== Разворачивающаяся часть с описанием и картой ===== */
  expandedSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  expandedDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  mapImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  mapCaption: {
    marginTop: 6,
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },

  /* ===== Когда нет элементов по фильтру ===== */
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
