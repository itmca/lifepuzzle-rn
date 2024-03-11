import {StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 32,
  },

  heroCardMainContainer: {
    height: '100%',
  },
  heroCardHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    height: 40,
  },
  characterNickName: {
    color: Color.BLACK,
    zIndex: 100,
  },
  settingButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    flex: 1,
  },

  heroCardContainer: {
    height: 395,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  heroInfoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    backgroundColor: Color.BLACK,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  heroInfoTextContainer: {
    flexDirection: 'column',
  },
  heroTitle: {
    marginBottom: 5,
  },
  heroPhotoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    marginRight: 4,
    transform: [{rotate: '29.84deg'}],
  },

  connectedUserContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedUser: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    height: 395,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 60,
    backgroundColor: Color.SECONDARY_LIGHT,
  },
  addButtonText: {
    color: Color.LIGHT_BLACK,
    marginTop: 11,
  },
});
