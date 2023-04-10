import React, {useEffect} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {useRecommendedQuestion} from '../../service/hooks/question.hook';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  helpQuestionOpenState,
  helpQuestionTextState,
} from '../../recoils/help-question.recoil';
import {helpQuestionState} from '../../recoils/story-writing.recoil';
import {userState} from '../../recoils/user.recoil';
import {HeroType} from '../../types/hero.type';
import {heroState} from '../../recoils/hero.recoil';
import {UserType} from '../../types/user.type';
import {HeroAvatar} from '../../components/avatar/HeroAvatar';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {AdvancedTextInput} from '../../components/input/AdvancedTextInput';
import {useLoginChecking} from '../../service/hooks/login.hook';
import {useFocusAction} from '../../service/hooks/screen.hook';

const PuzzleWritingQuestionPage = (): JSX.Element => {
  const [helpQuestionText, setHelpQuestionText] = useRecoilState(
    helpQuestionTextState,
  );
  const setHelpQuestionOpen = useSetRecoilState(helpQuestionOpenState);
  const [storyQuestion, setStoryQuestion] = useRecoilState(helpQuestionState);
  const user = useRecoilValue<UserType>(userState);
  const hero = useRecoilValue<HeroType>(heroState);

  useLoginChecking({
    alertTitle: '미로그인 시점에 작성한 이야기는 저장되지 않습니다',
  });

  useFocusAction(() => {
    setHelpQuestionOpen(true);
    setHelpQuestionText(storyQuestion?.helpQuestionText || '');
  });

  const [recommendQuestion, fetchNextRecommendQuestion, isLoading] =
    useRecommendedQuestion({
      onRecommendQuestionChanged: recommendQuestion => {
        const {questionText, questionNo} = recommendQuestion;

        setStoryQuestion({
          ...storyQuestion,
          recQuestionNo: questionNo,
          recQuestionModified: false,
          helpQuestionText: questionText,
        });
        setHelpQuestionText(questionText);
      },
    });

  useEffect(() => {
    const recQuestionNo = storyQuestion?.recQuestionNo || -1;
    const recQuestionModified =
      !!recommendQuestion.questionText &&
      helpQuestionText !== recommendQuestion.questionText;

    setStoryQuestion({
      ...storyQuestion,
      recQuestionNo,
      recQuestionModified,
      helpQuestionText,
    });
  }, [helpQuestionText]);

  return (
    <LoadingContainer isLoading={isLoading}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.topheader}>
          <HeroAvatar imageURL={hero.imageURL} size={56} />
          <View style={styles.headerText}>
            <Text style={styles.topText}>
              {user?.userNickName}님, {hero?.heroNickName}에게{' '}
            </Text>
            <Text style={styles.topTextBold}>어떤 질문을 드려 볼까요? </Text>
          </View>
        </View>

        <View style={{alignItems: 'center'}}>
          <AdvancedTextInput
            activeUnderlineColor="none"
            customStyle={styles.input}
            placeholder={
              '도움질문적기... \n도움질문은 더 풍성한 작성을 위한 보조 역할로 사용됩니다.'
            }
            text={helpQuestionText}
            onChangeText={setHelpQuestionText}
            multiline={true}
            returnKeyType="done"
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.questionBtn}
            onPress={fetchNextRecommendQuestion}>
            <Image
              style={styles.btnQuestionMark}
              source={require('../../assets/images/question-styled.png')}
            />
            <Text style={styles.btnText}>질문 추천 받기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LoadingContainer>
  );
};

export default PuzzleWritingQuestionPage;
