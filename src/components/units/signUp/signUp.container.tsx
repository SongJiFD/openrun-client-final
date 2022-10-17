import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import {
  IMutation,
  IMutationCheckTokenByPhoneArgs,
  IMutationCreateUserArgs,
  IMutationSendTokenToPhoneArgs,
} from "../../../commons/types/generated/types";
import { schema } from "../../../commons/yup/signUp";
import { openValue } from "../../commons/store";

import SignUpUI from "./signUp.presenter";
import {
  CHECK_TOKEN_BY_PHONE,
  CREATE_USER,
  SEND_TOKEN_TO_PHONE,
} from "./signUp.queries";
import { Modal } from "antd";

export default function SignUp() {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useRecoilState(openValue);
  const [phoneCertifyFail, setPhoneCertifyFail] = useState(false);
  const [checkCertifyResult, setCheckCertifyResult] = useState(false);

  const [createUser] = useMutation<
    Pick<IMutation, "createUser">,
    IMutationCreateUserArgs
  >(CREATE_USER);

  const [sendTokenToPhone] = useMutation<
    Pick<IMutation, "sendTokenToPhone">,
    IMutationSendTokenToPhoneArgs
  >(SEND_TOKEN_TO_PHONE);

  const [checkTokenByPhone] = useMutation<
    Pick<IMutation, "checkTokenByPhone">,
    IMutationCheckTokenByPhoneArgs
  >(CHECK_TOKEN_BY_PHONE);

  const { register, handleSubmit, formState, getValues } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onClickSignUp = async (data: any) => {
    if (!data.email || !data.password || !data.nickname || !data.phone) return;

    try {
      const result = await createUser({
        variables: {
          createUserInput: {
            email: String(data.email),
            password: String(data.password),
            nickName: String(data.nickname),
            phone: String(data.phone),
          },
        },
      });
      Modal.success({
        content: "가입이 완료되었습니다.",
        onOk: () => {
          location.replace(`/signIn`);
        },
      });
    } catch (error) {
      if (error instanceof Error) Modal.error({ content: error.message });
    }
  };
  const onClickPhoneCertify = async () => {
    try {
      const result = await sendTokenToPhone({
        variables: {
          phone: getValues("phone"),
        },
      });
      setIsOpen(true);
      Modal.success({ content: "인증번호가 전송되었습니다." });
    } catch (error) {
      if (error instanceof Error) Modal.error({ content: error.message });
    }
  };

  const onClickCheckCertify = async () => {
    setPhoneCertifyFail(false);
    setCheckCertifyResult(false);
    try {
      const result = await checkTokenByPhone({
        variables: {
          phone: getValues("phone"),
          token: getValues("token"),
        },
      });
      if (!result.data?.checkTokenByPhone) {
        setPhoneCertifyFail(true);
        setOpen(true);
        return;
      }

      setOpen(true);
      setCheckCertifyResult(true);
      Modal.success({ content: "본인인증 되었습니다." });
    } catch (error) {
      if (error instanceof Error) Modal.error({ content: error.message });
    }
  };
  return (
    <SignUpUI
      register={register}
      handleSubmit={handleSubmit}
      formState={formState}
      onClickSignUp={onClickSignUp}
      onClickCheckCertify={onClickCheckCertify}
      onClickPhoneCertify={onClickPhoneCertify}
      isOpen={isOpen}
      phoneCertifyFail={phoneCertifyFail}
      checkCertifyResult={checkCertifyResult}
    />
  );
}
