import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import EventCard from './components/EventCard';
import ScheduleScreen from './components/ScheduleScreen';
import ProfileScreen from './components/ProfileScreen';
import LeaderboardScreen from './components/Leaderboard';

const { width } = Dimensions.get('window');
const HORIZONTAL_SWIPE_THRESHOLD = 100;
const MAX_TRANSLATE_X = 150;

const events = [
  {
    title: 'Дворовый футбольный турнир',
    description:
      'Присоединяйтесь к соседям для дружеского матча 5×5 на спортивной площадке нашего ЖК. Приходите в бутсах и с боевым настроем!',
    date: 'Sat, Jun 7 • 5:00 PM',
    location: 'Спортивная площадка ЖК',
    image: require('./assets/images/footbal.png'),
    tags: ['спорт', 'футбол', 'соседи', 'активность'],
  },
  {
    title: 'Мастер-класс уличной кухни',
    description:
      'Научитесь готовить вкусные стрит-фуд лаваши и закуски на нашей общей кухне. Подходит для любого уровня подготовки!',
    date: 'Sun, Jun 8 • 11:00 AM',
    location: 'Общая кухня',
    image: require('./assets/images/cooking.png'),
    tags: ['готовка', 'мастер-класс', 'кулинария'],
  },
  {
    title: 'Рассветная йога на лужайке',
    description:
      'Начните день с лёгкой йоги под открытым небом. Захватите коврик и присоединяйтесь к 30-минутной практике с соседями.',
    date: 'Mon, Jun 9 • 7:00 AM',
    location: 'Центральный газон',
    image: require('./assets/images/yoga.png'),
    tags: ['йога', 'здоровье', 'рассвет'],
  },
  {
    title: 'Ночь настольных игр',
    description:
      'Собираемся в клубной комнате на вечер настольных игр: Uno, «Каркассон», «Диксит» и другие. Победителей ждут призы!',
    date: 'Tue, Jun 10 • 6:00 PM',
    location: 'Клубная комната',
    image: require('./assets/images/quiz.png'),
    tags: ['настольные игры', 'викторина'],
  },
  {
    title: 'Урбан-огород: мастер-класс',
    description:
      'Практический мастер-класс по выращиванию трав и овощей в контейнерах. Уходите домой со своим собственным горшком с базиликом или мятой!',
    date: 'Wed, Jun 11 • 5:00 PM',
    location: 'Сад на крыше',
    image: require('./assets/images/sadovod.png'),
    tags: ['садоводство', 'урбан-огород'],
  },
  {
    title: 'Кинотеатр под открытым небом',
    description:
      'Смотрите семейный фильм на большом экране во дворе. Берите пледы и перекусы!',
    date: 'Fri, Jun 13 • 9:00 PM',
    location: 'Дворовая сцена',
    image: require('./assets/images/cinema.png'),
    tags: ['кино', 'вечер', 'семья'],
  },
];

function EventsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue('0deg');
  const isAnimatingOff = useSharedValue(false);
  const offScreenX = useSharedValue(0);

  const handleLikeDislike = (liked) => {
    console.log(liked ? 'Liked ✅' : 'Disliked ❌');
  };

  const moveToNextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const clamped = Math.max(-MAX_TRANSLATE_X, Math.min(ctx.startX + event.translationX, MAX_TRANSLATE_X));
      translateX.value = clamped;
      rotateZ.value = `${clamped / 20}deg`;
    },
    onEnd: (event) => {
      const swiped = Math.abs(event.translationX) > HORIZONTAL_SWIPE_THRESHOLD;
      const liked = event.translationX > 0;

      if (swiped && !isAnimatingOff.value) {
        isAnimatingOff.value = true;
        runOnJS(handleLikeDislike)(liked);
        offScreenX.value = withTiming(liked ? width : -width, { duration: 300 }, () => {
          runOnJS(moveToNextEvent)();
          translateX.value = 0;
          rotateZ.value = '0deg';
          offScreenX.value = 0;
          isAnimatingOff.value = false;
        });
      } else {
        translateX.value = withSpring(0);
        rotateZ.value = withSpring('0deg');
      }
    },
  });

  const currentCardStyle = useAnimatedStyle(() => {
    const tx = isAnimatingOff.value ? offScreenX.value : translateX.value;
    const opacity = interpolate(tx, [-width, 0, width], [0.6, 1, 0.6], Extrapolate.CLAMP);
    return {
      transform: [{ translateX: tx }, { rotateZ: rotateZ.value }],
      opacity,
    };
  });

  const nextCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateX.value, [-width, 0, width], [0.95, 1, 0.95], Extrapolate.CLAMP);
    const opacity = interpolate(translateX.value, [-width, 0, width], [0.4, 0.6, 0.4], Extrapolate.CLAMP);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const scaleDislike = useSharedValue(1);
  const scaleLike = useSharedValue(1);

  const onPressIn = (scaleRef) => {
    scaleRef.value = withTiming(0.9, { duration: 100 });
  };
  const onPressOut = (scaleRef, liked) => {
    scaleRef.value = withTiming(1, { duration: 100 });
    handleLikeDislike(liked);
    isAnimatingOff.value = true;
    offScreenX.value = withTiming(liked ? width : -width, { duration: 300 }, () => {
      runOnJS(moveToNextEvent)();
      translateX.value = 0;
      rotateZ.value = '0deg';
      offScreenX.value = 0;
      isAnimatingOff.value = false;
    });
  };

  const animatedStyleDislike = useAnimatedStyle(() => ({
    transform: [{ scale: scaleDislike.value }],
  }));
  const animatedStyleLike = useAnimatedStyle(() => ({
    transform: [{ scale: scaleLike.value }],
  }));

  const safeCurrent = events[currentIndex];
  const nextEvent = events[(currentIndex + 1) % events.length];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableWithoutFeedback>
          <Image source={{ uri: 'https://avatars.githubusercontent.com/u/583231?v=4' }} style={styles.avatar} />
        </TouchableWithoutFeedback>
        <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tinder_Logo.svg/2560px-Tinder_Logo.svg.png' }} style={styles.logo} resizeMode="contain" />
        <TouchableWithoutFeedback>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${((currentIndex + 1) / events.length) * 100}%` }]} />
      </View>

      <View style={styles.cardContainer}>
        {nextEvent && (
          <Animated.View style={[styles.cardWrapper, styles.underCard, nextCardStyle]}>
            <EventCard event={nextEvent} />
          </Animated.View>
        )}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.cardWrapper, currentCardStyle]}>
            <EventCard event={safeCurrent} />
          </Animated.View>
        </PanGestureHandler>
      </View>

      <View style={styles.actions}>
        <TouchableWithoutFeedback
          onPressIn={() => onPressIn(scaleDislike)}
          onPressOut={() => onPressOut(scaleDislike, false)}
        >
          <Animated.View style={[styles.actionButton, styles.dislikeButton, animatedStyleDislike]}>
            <Ionicons name="close" size={28} color="#FF3C3C" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={{ width: 40 }} />
        <TouchableWithoutFeedback
          onPressIn={() => onPressIn(scaleLike)}
          onPressOut={() => onPressOut(scaleLike, true)}
        >
          <Animated.View style={[styles.actionButton, styles.likeButton, animatedStyleLike]}>
            <Ionicons name="heart" size={28} color="#4DED30" />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, size }) => {
              const icons = {
               Events: focused ? 'calendar' : 'calendar-outline',
              Schedule: focused ? 'list' : 'list-outline',
               Profile: focused ? 'person' : 'person-outline',
               Leaderboard: focused ? 'trophy' : 'trophy-outline',
};
              return <Ionicons name={icons[route.name]} size={size} />;
            },
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar,
          })}
        >
          <Tab.Screen name="Events" component={EventsScreen} />
          <Tab.Screen name="Schedule" component={ScheduleScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  headerContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6, backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2,
  },
  avatar: { width: 30, height: 30, borderRadius: 15 },
  logo: { width: 100, height: 30 },
  progressBarContainer: {
    height: 3, backgroundColor: '#E0E0E0', marginHorizontal: 20, borderRadius: 1.5,
    overflow: 'hidden', marginBottom: 10,
  },
  progressBarFill: { height: '100%', backgroundColor: '#000' },
  cardContainer: {
    flex: 1, backgroundColor: '#F7F7F7', justifyContent: 'center',
  },
  cardWrapper: {
    width: '90%', alignSelf: 'center',
  },
  underCard: {
    position: 'absolute', top: 0, left: 0, right: 0,
  },
  actions: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 16, backgroundColor: '#fff', borderTopWidth: 0.5,
    borderColor: '#ddd', shadowColor: '#000', shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: -1 }, shadowRadius: 2, elevation: 4,
  },
  actionButton: {
    width: 64, height: 64, borderRadius: 32, alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#fff', shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  dislikeButton: { borderWidth: 2, borderColor: '#FF3C3C' },
  likeButton: { borderWidth: 2, borderColor: '#4DED30' },
  tabBar: {
    backgroundColor: '#fff', borderTopWidth: 0.5, borderColor: '#ddd', height: 56,
  },
});
