// components/CreateEvent.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ModalSelector from 'react-native-modal-selector';

export default function CreateEvent({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const allTags = useMemo(
    () => [
      'спорт',
      'кулинария',
      'йога',
      'кино',
      'садоводство',
      'настольные игры',
      'музыка',
      'технологии',
    ],
    []
  );

  const locations = ['Парк', 'Библиотека', 'Онлайн', 'Коворкинг', 'Кафе'];
  const locationOptions = locations.map((loc, index) => ({
    key: index,
    label: loc,
  }));

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const formatted = date.toLocaleString('ru-RU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setDateTime(formatted);
    hideDatePicker();
  };

  const handleCreate = () => {
    const newEvent = {
      title: title.trim(),
      description: description.trim(),
      date: dateTime.trim(),
      location: location.trim(),
      tags: selectedTags,
    };

    if (
      newEvent.title === '' ||
      newEvent.description === '' ||
      newEvent.date === '' ||
      newEvent.location === ''
    ) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    onSubmit(newEvent);

    setTitle('');
    setDescription('');
    setDateTime('');
    setLocation('');
    setSelectedTags([]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.background} />

      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.heading}>Организовать мероприятие</Text>
        </View>

        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Название */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Название</Text>
            <TextInput
              style={[styles.input, styles.fullWidth]}
              value={title}
              onChangeText={setTitle}
              placeholder="Введи название события"
              placeholderTextColor="#999"
            />
          </View>

          {/* Описание */}
          <View style={[styles.fieldContainer, styles.fieldContainerDescription]}>
            <Text style={styles.label}>Описание</Text>
            <View style={[styles.multilineWrapper, styles.fullWidth]}>
              <TextInput
                style={[styles.multilineInput, styles.fullWidth]}
                value={description}
                onChangeText={setDescription}
                placeholder="Опиши мероприятие"
                placeholderTextColor="#999"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Дата и время */}
          <View style={[styles.fieldContainer, styles.fieldContainerDateTime]}>
            <Text style={styles.label}>Дата и время</Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={[styles.input, styles.fullWidth, { justifyContent: 'center' }]}
            >
              <Text style={{ color: dateTime ? '#222' : '#999' }}>
                {dateTime || 'Выбери дату и время'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              locale="ru-RU"
            />
          </View>

          {/* Место (модальный выбор) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Место</Text>
            <ModalSelector
              data={locationOptions}
              initValue="Выбери локацию"
              onChange={(option) => setLocation(option.label)}
              style={styles.modalSelectorWrapper}
              initValueTextStyle={location ? styles.locationText : styles.placeholderText}
              selectTextStyle={styles.locationText}
              optionTextStyle={{ fontSize: 16 }}
              cancelText="Отмена"
            >
              <TextInput
                style={[styles.input, styles.fullWidth]}
                editable={false}
                placeholder="Выбери локацию"
                placeholderTextColor="#999"
                value={location}
              />
            </ModalSelector>
          </View>

          {/* Теги */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Выбери теги</Text>
            <View style={styles.tagsRow}>
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    style={[
                      styles.tagPill,
                      isSelected && styles.tagPillSelected,
                    ]}
                    activeOpacity={0.8}
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

          {/* Кнопки */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn, styles.fullWidthButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, styles.cancelBtnText]}>Отмена</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.createBtn, styles.fullWidthButton]}
              onPress={handleCreate}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, styles.createBtnText]}>Создать</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldContainerDescription: {
    marginBottom: 32,
  },
  fieldContainerDateTime: {
    marginTop: 12,
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  fullWidth: {
    width: '100%',
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  multilineWrapper: {
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#CCC',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
    minHeight: 140,
  },
  multilineInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tagPill: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 16,
    paddingHorizontal: 12,
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
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  fullWidthButton: {
    flex: 1,
  },
  btn: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  cancelBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  createBtn: {
    backgroundColor: '#0066CC',
  },
  createBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSelectorWrapper: {
    width: '100%',
  },
  locationText: {
    color: '#222',
    fontSize: 16,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
});
