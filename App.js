import React from 'react';
import { StyleSheet, Text, View, Alert, SafeAreaView, Button } from 'react-native';
import { I18nProvider, Trans, Plural, withI18n } from '@lingui/react';
import { setupI18n } from '@lingui/core';
import enMessages from './locale/en/messages.js';
import csMessages from './locale/cs/messages.js';

const createI18 = language => {
  return setupI18n({
    language,
    catalogs: {
      en: enMessages,
      cs: csMessages,
    },
  });
};

// you can keep this in a separate module and expose as a singleton
let initialI18n = createI18('en');

export default class App extends React.Component {
  state = {
    i18n: initialI18n,
    activeLanguage: 'en',
    messages: [],
  };
  render() {
    const { i18n, activeLanguage, messages } = this.state;
    return (
      <I18nProvider
        i18n={i18n}
        language={activeLanguage}
        defaultRender={({ translation }) => <Text>{translation}</Text>}
      >
        <SafeAreaView style={styles.container}>
          <Button
            onPress={this.toggleLanguage}
            title={i18n.t`toggle language to ${activeLanguage === 'en' ? 'cs' : 'en'}`}
          />
          <Inbox
            username="John"
            markAsRead={this.showAlert}
            messages={messages}
            addMessage={this.addMessage}
          />
        </SafeAreaView>
      </I18nProvider>
    );
  }

  toggleLanguage = () => {
    const newLanguage = this.state.activeLanguage === 'en' ? 'cs' : 'en';
    const newI18n = createI18(newLanguage);
    this.setState({
      activeLanguage: newLanguage,
      i18n: newI18n,
    });
    i18n = newI18n;
  };

  showAlert = () => {
    Alert.alert('', i18n.t`Do you want to set all your messages as read?`);
  };

  addMessage = () => {
    this.setState({
      messages: this.state.messages.concat(['message']),
    });
  };
}

const Inbox = withI18n()(({ messages, markAsRead, username, addMessage, i18n }) => {
  const messagesCount = messages.length;

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Text style={styles.heading}>
          <Trans>Message Inbox</Trans>
        </Text>

        <Trans>See all unread messages or</Trans>
        <Button onPress={markAsRead} title={i18n.t`mark messages as read`} />
        <Button onPress={addMessage} title={i18n.t`increment number (cs is better for that)`} />

        <Plural
          value={messagesCount}
          _0="You have no unread messages"
          one="There's # message in your inbox"
          few="There're # messages in your inbox"
          other="There're # messages in your inbox"
        />
      </View>

      <Text>
        <Trans>{username}.</Trans>
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  container2: {
    alignItems: 'center',
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
