import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  screenHTopContainer: {
    height: 90,
    backgroundColor: '#333333',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 5,
  },
  screenLTopContainer: {
    backgroundColor: '#333333',
    borderTopWidth: 0,
  },
  dateInput: {
    position: 'absolute',
    top: 0,
  },
  screenCenterContainer: {
    height: 50,
  },
  screenBottomContainer: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  helpQuestionContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 4,
    backgroundColor: 'white',
  },
  helpQuestionText: {
    fontWeight: 700,
    fontSize: 18,
    marginLeft: 5,
    color: 'white',
  },
  helpQuestionInput: {
    fontWeight: 'bold',
    height: 40,
    width: '100%',
    justifyContent: 'center',
  },
  accordionIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#F6F6F6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    fontWeight: 'bold',
    fontSize: 16,
    height: 40,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
  },
});
