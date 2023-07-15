import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    marginTop: 24,
  },
  storyListContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  storyListTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 8,
    marginLeft: 5,
  },
  floatingBtBox: {
    width: 48,
    height: 48,
    position: 'absolute',
    backgroundColor: '#FF6200',
    bottom: 95,
    right: 16,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingBtTop: {
    borderRadius: 50,
    color: '#FFFFFF',
  },
  writingButton: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  customDivider: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(246, 246, 246, 1)',
  },
});
