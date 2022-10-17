import { useRecoilState } from "recoil";
import BlackButton from "../../../commons/button/black";
import SignInput from "../../../commons/input/sign";

import * as s from "./signUp.styles";
import { ISignUpProps } from "./signUp.types";

import CheckBox from "../../../commons/checkBox";
import YupWarningMsg from "../../../commons/div/yupWarningMsg";
import { openValue } from "../../commons/store";
import BasicModal from "../../../commons/modal";

export default function SignUpUI(props: ISignUpProps) {
  const [open, setOpen] = useRecoilState(openValue);
  return (
    <s.Wrapper>
      <s.Title>회원가입</s.Title>

      <form
        onSubmit={props.handleSubmit(props.onClickSignUp)}
        style={{ width: "100%" }}
      >
        <SignInput
          register={props.register}
          placeholder="이메일"
          color="#000000"
          width="100%"
          name="email"
          type="text"
        />
        <YupWarningMsg errormsg={props.formState.errors.email?.message} />
        <SignInput
          register={props.register}
          placeholder="닉네임"
          color="#000000"
          width="100%"
          name="nickname"
          type="text"
        />
        <YupWarningMsg errormsg={props.formState.errors.nickname?.message} />
        <SignInput
          register={props.register}
          placeholder="비밀번호"
          color="#000000"
          width="100%"
          name="password"
          type="password"
        />
        <YupWarningMsg errormsg={props.formState.errors.password?.message} />
        <SignInput
          register={props.register}
          placeholder="비밀번호 확인"
          color="#000000"
          width="100%"
          name="passwordCheck"
          type="password"
        />
        <YupWarningMsg
          errormsg={props.formState.errors.passwordCheck?.message}
        />
        <s.PhoneWrapper>
          <SignInput
            register={props.register}
            placeholder="휴대전화"
            color="#000000"
            width="70%"
            name="phone"
            type="text"
          />
          <s.Margin />

          <BlackButton
            onClick={props.onClickPhoneCertify}
            type="button"
            width="30%"
            fontWeight="700"
            title="인증하기"
          />
          <YupWarningMsg errormsg={props.formState.errors.phone?.message} />
        </s.PhoneWrapper>

        {props.isOpen ? (
          <s.PhoneWrapper>
            <SignInput
              register={props.register}
              placeholder="인증번호"
              color="#000000"
              width="70%"
              name="token"
              type="text"
            />
            <s.Margin />

            <BlackButton
              onClick={props.onClickCheckCertify}
              type="button"
              width="30%"
              fontWeight="700"
              title="확인"
            />
          </s.PhoneWrapper>
        ) : (
          <></>
        )}

        <BlackButton
          onClick={props.onClickSignUp}
          type="submit"
          width="100%"
          fontWeight="700"
          title="회원가입"
          disabled={props.checkCertifyResult ? false : true}
        />
      </form>
    </s.Wrapper>
  );
}
