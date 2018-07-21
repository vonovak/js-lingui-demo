import React from 'react';
import { StyleSheet, Text, View, Alert, SafeAreaView, Button } from 'react-native';
import { I18nProvider, Trans, Plural, withI18n } from '@lingui/react';
import { i18n, changeActiveLanguage } from './i18nInstanceHolder';

export default class App extends React.Component {
  state = {
    i18n: i18n,
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
    const updatedI18nInstance = changeActiveLanguage(newLanguage);
    this.setState({
      activeLanguage: newLanguage,
      i18n: updatedI18nInstance,
    });
  };

  showAlert = () => {
    // NOTE - here we're using the i18n instance that does NOT come from the react context, but from the i18nInstanceHolder module
    // this is because there is nothing that would need to re-render: we're just calling a function and displaying its result in an alert
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
  // NOTE - here we're using the i18n instance that comes from the react context.
  // that makes sure the component always re-renders when active language is changed

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
